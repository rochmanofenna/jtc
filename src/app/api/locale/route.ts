import { type NextRequest } from "next/server"
import { cookies } from "next/headers"

const VALID_LOCALES = ["id", "en", "cn"] as const
type ValidLocale = (typeof VALID_LOCALES)[number]

function isValidLocale(value: unknown): value is ValidLocale {
  return typeof value === "string" && (VALID_LOCALES as readonly string[]).includes(value)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locale } = body

    if (!isValidLocale(locale)) {
      return Response.json(
        {
          error: `Invalid locale: "${locale}". Must be one of: ${VALID_LOCALES.join(", ")}`,
        },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
      httpOnly: false,
    })

    return Response.json({ locale })
  } catch (err) {
    console.error("POST /api/locale error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
