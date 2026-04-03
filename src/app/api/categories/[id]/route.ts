import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateCategorySchema } from "@/lib/validations"

function isZodError(err: unknown): err is Error & { issues: unknown[] } {
  return err instanceof Error && Array.isArray((err as any).issues)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const category = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
          orderBy: { sortOrder: "asc" },
        },
        _count: { select: { products: true } },
      },
    })

    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 })
    }

    return Response.json(category)
  } catch (err) {
    console.error("GET /api/categories/[id] error:", err)
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

    const validated = updateCategorySchema.parse(body)

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: "Category not found" }, { status: 404 })
    }

    // Handle parentId: if explicitly set to null or empty, unset parent
    const data: Record<string, unknown> = { ...validated }
    if (data.parentId === null || data.parentId === undefined || data.parentId === "") {
      data.parentId = null
    }

    const category = await prisma.category.update({
      where: { id },
      data: data as any,
      include: {
        children: true,
        _count: { select: { products: true } },
      },
    })

    return Response.json(category)
  } catch (err) {
    console.error("PUT /api/categories/[id] error:", err)

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

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    })

    if (productCount > 0) {
      return Response.json(
        {
          error: `Cannot delete category: ${productCount} product(s) are still assigned to it. Reassign or remove them first.`,
        },
        { status: 400 }
      )
    }

    // Also check for child categories
    const childCount = await prisma.category.count({
      where: { parentId: id },
    })

    if (childCount > 0) {
      return Response.json(
        {
          error: `Cannot delete category: ${childCount} child category/categories exist. Remove or reassign them first.`,
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/categories/[id] error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
