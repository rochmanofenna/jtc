import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateProductSchema } from "@/lib/validations"

function isZodError(err: unknown): err is Error & { issues: unknown[] } {
  return err instanceof Error && Array.isArray((err as any).issues)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        category: true,
        supplier: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    })

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    return Response.json(product)
  } catch (err) {
    console.error("GET /api/products/[id] error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Separate images from main product data
    const { images, ...productData } = body

    const validated = updateProductSchema.parse(productData)

    // Check product exists
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    // Update product and handle images in a transaction
    const product = await prisma.$transaction(async (tx: any) => {
      // If images array is provided, replace all images
      if (images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } })
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((url: string, index: number) => ({
              productId: id,
              url,
              sortOrder: index,
            })),
          })
        }
      }

      return tx.product.update({
        where: { id },
        data: validated,
        include: {
          category: true,
          supplier: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      })
    })

    return Response.json(product)
  } catch (err) {
    console.error("PUT /api/products/[id] error:", err)

    if (isZodError(err)) {
      return Response.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      )
    }

    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    await prisma.product.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/products/[id] error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
