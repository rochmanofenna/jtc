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
}

interface FormErrors {
  companyName?: string;
  address?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^[+]?[\d\s\-()]{8,}$/;

export function QuoteInquiryModal({
  open,
  onOpenChange,
  productName,
  productSlug,
}: QuoteInquiryModalProps) {
  const t = useTranslations("quoteForm");
  const locale = useLocale();

  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [npwp, setNpwp] = useState("");
  const [ktpSim, setKtpSim] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (companyName.trim().length < 2) next.companyName = t("errorRequired");
    if (address.trim().length < 10) next.address = t("errorAddress");
    if (!EMAIL_RX.test(email.trim())) next.email = t("errorEmail");
    if (!PHONE_RX.test(phone.trim())) next.phone = t("errorPhone");
    if (message.trim().length < 10) next.message = t("errorMessage");
    return next;
  }

  function resetForm() {
    setCompanyName("");
    setAddress("");
    setEmail("");
    setPhone("");
    setNpwp("");
    setKtpSim("");
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
      companyName: companyName.trim(),
      address: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
      npwp: npwp.trim() || undefined,
      ktpSim: ktpSim.trim() || undefined,
      message: message.trim(),
      productName,
      productSlug,
    };

    const text = buildQuoteInquiryMessage(trimmed, locale);
    const url = formatWhatsAppUrl(WHATSAPP_NUMBER, text);

    void fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: trimmed.companyName,
        address: trimmed.address,
        email: trimmed.email,
        phone: trimmed.phone,
        npwp: trimmed.npwp,
        ktpSim: trimmed.ktpSim,
        message: trimmed.message,
        productSlug: trimmed.productSlug,
        source: "website_form",
      }),
    }).catch(() => {});

    window.open(url, "_blank", "noopener,noreferrer");
    onOpenChange(false);
    resetForm();
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product context */}
          {productName && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs">
              <p className="font-mono uppercase tracking-wide text-amber-700 mb-0.5">
                {t("product")}
              </p>
              <p className="font-body text-gray-900">{productName}</p>
              {productSlug && (
                <p className="font-mono text-[11px] text-gray-500 mt-1">
                  {t("productCode")}: {productSlug}
                </p>
              )}
            </div>
          )}

          {/* 1. Company Name (required) */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-company">
              {t("companyName")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qf-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={t("companyNamePlaceholder")}
              aria-invalid={!!errors.companyName}
              autoComplete="organization"
              required
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">{errors.companyName}</p>
            )}
          </div>

          {/* 2. Address (required, textarea 2 rows) */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-address">
              {t("address")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="qf-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("addressPlaceholder")}
              aria-invalid={!!errors.address}
              rows={2}
              autoComplete="street-address"
              required
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address}</p>
            )}
          </div>

          {/* 3. Email (required) */}
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

          {/* 4. Phone (required) */}
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

          {/* 5. NPWP (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-npwp">
              {t("npwp")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                ({t("optional")})
              </span>
            </Label>
            <Input
              id="qf-npwp"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
              placeholder={t("npwpPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("npwpHelper")}</p>
          </div>

          {/* 6. KTP/SIM (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="qf-ktpsim">
              {t("ktpSim")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                ({t("optional")})
              </span>
            </Label>
            <Input
              id="qf-ktpsim"
              value={ktpSim}
              onChange={(e) => setKtpSim(e.target.value)}
              placeholder={t("ktpSimPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("ktpSimHelper")}</p>
          </div>

          {/* 7. Message (required, textarea 4 rows) */}
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
