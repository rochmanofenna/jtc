import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createCategorySchema } from "@/lib/validations"
import { slugify } from "@/lib/utils"

function isZodError(err: unknown): err is Error & { issues: unknown[] } {
  return err instanceof Error && Array.isArray((err as any).issues)
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
          orderBy: { sortOrder: "asc" },
        },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    })

    return Response.json(categories)
  } catch (err) {
    console.error("GET /api/categories error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = slugify(body.name)
    }

    const validated = createCategorySchema.parse(body)

    // Remove undefined parentId so Prisma doesn't error
    const data: Record<string, unknown> = { ...validated }
    if (!data.parentId) {
      delete data.parentId
    }

    const category = await prisma.category.create({
      data: data as any,
      include: {
        children: true,
        _count: { select: { products: true } },
      },
    })

    return Response.json(category, { status: 201 })
  } catch (err) {
    console.error("POST /api/categories error:", err)

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
