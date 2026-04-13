import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createQuoteInquirySchema } from "@/lib/validations";

function isZodError(err: unknown): err is Error & { issues: unknown[] } {
  return err instanceof Error && Array.isArray((err as any).issues);
}

/**
 * Quote inquiry intake. The QuoteInquiryModal POSTs here fire-and-forget
 * before opening WhatsApp, so this endpoint exists to:
 *
 *   1. Persist a record of every inquiry in the QuoteInquiry table for
 *      sales follow-up + audit trail.
 *   2. Validate inputs server-side (the client also validates but server
 *      validation is the source of truth).
 *
 * The client never blocks on this — even if it 500s, the user still ends
 * up in WhatsApp. Failures are logged here so we can monitor in Vercel.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createQuoteInquirySchema.parse(body);

    const inquiry = await prisma.quoteInquiry.create({
      data: {
        companyName: validated.companyName,
        address: validated.address,
        email: validated.email,
        phone: validated.phone,
        npwp: validated.npwp || null,
        ktpSim: validated.ktpSim || null,
        message: validated.message,
        productSlug: validated.productSlug || null,
        source: validated.source,
      },
    });

    return Response.json({ id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/inquiries error:", err);

    if (isZodError(err)) {
      return Response.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
