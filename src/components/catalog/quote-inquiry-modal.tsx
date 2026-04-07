"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  buildQuoteInquiryMessage,
  formatWhatsAppUrl,
} from "@/lib/utils";

interface QuoteInquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  productSlug?: string;
  productId?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^[+]?[\d\s\-()]{8,}$/;

/**
 * Quote-request modal. Replaces the legacy "open WhatsApp directly" flow.
 *
 * Behavior:
 *   1. User fills in name / email / phone / company / message.
 *   2. On submit we validate locally, fire-and-forget a POST to
 *      /api/inquiries to log the lead, and immediately open WhatsApp with
 *      the formatted message — the user never waits for the database write.
 *   3. If opened from a product page, productName + productSlug are baked
 *      into the WhatsApp message as Product / SKU lines.
 */
export function QuoteInquiryModal({
  open,
  onOpenChange,
  productName,
  productSlug,
  productId,
}: QuoteInquiryModalProps) {
  const t = useTranslations("quoteForm");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = t("errorRequired");
    if (!EMAIL_RX.test(email.trim())) next.email = t("errorEmail");
    if (!PHONE_RX.test(phone.trim())) next.phone = t("errorPhone");
    if (message.trim().length < 10) next.message = t("errorMessage");
    return next;
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setMessage("");
    setErrors({});
    setSubmitting(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const trimmed = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim() || undefined,
      message: message.trim(),
      productName,
      productSlug,
    };

    // Build the WhatsApp message and URL up front so the open() call is
    // synchronous and counts as a user gesture (avoids popup blockers).
    const text = buildQuoteInquiryMessage(trimmed, locale);
    const url = formatWhatsAppUrl(WHATSAPP_NUMBER, text);

    // Fire-and-forget the inquiry log. We deliberately do NOT await this:
    // the WhatsApp tab should open instantly and never block on a network
    // request. Failures are silently swallowed — the WhatsApp message is
    // the primary record we care about today.
    void fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmed.name,
        email: trimmed.email,
        phone: trimmed.phone,
        company: trimmed.company,
        message: trimmed.message,
        productId: productId,
        productName: trimmed.productName,
        productSlug: trimmed.productSlug,
        locale,
        source: "website_form",
      }),
    }).catch(() => {
      /* swallow — see comment above */
    });

    // Open WhatsApp in a new tab.
    window.open(url, "_blank", "noopener,noreferrer");

    // Close the modal and reset for the next inquiry.
    onOpenChange(false);
    resetForm();
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      resetForm();
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product context (if any) */}
          {productName && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs">
              <p className="font-mono uppercase tracking-wide text-amber-700 mb-0.5">
                {t("product")}
              </p>
              <p className="font-body text-gray-900">{productName}</p>
              {productSlug && (
                <p className="font-mono text-[11px] text-gray-500 mt-1">
                  {t("sku")}: {productSlug}
                </p>
              )}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-name">
              {t("name")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              aria-invalid={!!errors.name}
              autoComplete="name"
              required
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-email">
              {t("email")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qf-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              aria-invalid={!!errors.email}
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-phone">
              {t("phone")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qf-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
              aria-invalid={!!errors.phone}
              autoComplete="tel"
              required
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Company (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-company">
              {t("company")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {t("companyOptional")}
              </span>
            </Label>
            <Input
              id="qf-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t("companyPlaceholder")}
              autoComplete="organization"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-message">
              {t("message")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="qf-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              aria-invalid={!!errors.message}
              rows={4}
              required
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              {t("cancel")}
            </DialogClose>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-amber-500 text-[#0a0f1a] hover:bg-amber-400"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MessageCircle className="size-4" />
              )}
              {submitting ? t("sending") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
