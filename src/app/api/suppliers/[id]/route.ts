import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupplierSchema } from "@/lib/validations"

function isZodError(err: unknown): err is Error & { issues: unknown[] } {
  return err instanceof Error && Array.isArray((err as any).issues)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supplier = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    })

    if (!supplier) {
      return Response.json({ error: "Supplier not found" }, { status: 404 })
    }

    return Response.json(supplier)
  } catch (err) {
    console.error("GET /api/suppliers/[id] error:", err)
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

    const existing = await prisma.company.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: "Supplier not found" }, { status: 404 })
    }

    // Force type to remain supplier
    body.type = "supplier"

    const validated = createSupplierSchema.partial().parse(body)

    const supplier = await prisma.company.update({
      where: { id },
      data: validated,
      include: {
        _count: { select: { products: true } },
      },
    })

    return Response.json(supplier)
  } catch (err) {
    console.error("PUT /api/suppliers/[id] error:", err)

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

    const existing = await prisma.company.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: "Supplier not found" }, { status: 404 })
    }

    // Check if supplier has products
    const productCount = await prisma.product.count({
      where: { supplierId: id },
    })

    if (productCount > 0) {
      return Response.json(
        {
          error: `Cannot delete supplier: ${productCount} product(s) are still linked. Remove or reassign them first.`,
        },
        { status: 400 }
      )
    }

    await prisma.company.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/suppliers/[id] error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
