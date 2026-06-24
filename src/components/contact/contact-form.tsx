"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("Contact");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      source: "contact",
      locale,
      website: String(data.get("website") ?? ""),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <CheckCircle2 className="h-12 w-12 text-gold-600" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{t("successTitle")}</h3>
        <p className="mt-2 text-muted-foreground">{t("successBody")}</p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          {tc("back")}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("formName")}</Label>
          <Input id="name" name="name" required minLength={2} maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("formEmail")}</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("formPhone")}</Label>
          <Input id="phone" name="phone" type="tel" maxLength={40} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">{t("formCompany")}</Label>
          <Input id="company" name="company" maxLength={160} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="subject">{t("formSubject")}</Label>
          <Input id="subject" name="subject" maxLength={200} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="message">{t("formMessage")}</Label>
          <Textarea id="message" name="message" required minLength={5} maxLength={4000} rows={5} />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-destructive">{t("errorBody")}</p>
      )}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="mt-6 w-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? tc("sending") : t("formSubmit")}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
