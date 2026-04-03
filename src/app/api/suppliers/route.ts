import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupplierSchema } from "@/lib/validations"

function isZodError(err: unknown): err is Error & { issues: unknown[] } {
  return err instanceof Error && Array.isArray((err as any).issues)
}

export async function GET() {
  try {
    const suppliers = await prisma.company.findMany({
      where: { type: "supplier" },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    })

    return Response.json(suppliers)
  } catch (err) {
    console.error("GET /api/suppliers error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Force type to supplier
    body.type = "supplier"

    const validated = createSupplierSchema.parse(body)

    const supplier = await prisma.company.create({
      data: validated,
      include: {
        _count: { select: { products: true } },
      },
    })

    return Response.json(supplier, { status: 201 })
  } catch (err) {
    console.error("POST /api/suppliers error:", err)

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
