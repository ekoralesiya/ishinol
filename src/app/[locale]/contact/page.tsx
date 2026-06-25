import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { BRAND } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return buildMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: `/${locale}/contact`,
  });
}

const SOCIALS = [
  { href: BRAND.social.instagram, Icon: Instagram, label: "Instagram" },
  { href: BRAND.social.facebook, Icon: Facebook, label: "Facebook" },
  { href: BRAND.social.linkedin, Icon: Linkedin, label: "LinkedIn" },
  { href: BRAND.social.youtube, Icon: Youtube, label: "YouTube" },
] as const;

const MAPS_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126918.04042!2d106.7271068!3d-6.2295712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJakarta!5e0!3m2!1sen!2sid!4v1700000000000";

export const dynamic = "force-dynamic";

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  const details = [
    { Icon: MapPin, label: t("address"), value: BRAND.address, href: undefined },
    { Icon: Phone, label: t("phone"), value: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g, "")}` },
    { Icon: Mail, label: t("email"), value: BRAND.email, href: `mailto:${BRAND.email}` },
    {
      Icon: MessageCircle,
      label: t("whatsapp"),
      value: BRAND.phone,
      href: `https://wa.me/${BRAND.whatsapp}`,
    },
  ];

  return (
    <main className="pt-32">
      <section className="py-16 lg:py-24">
        <div className="container-prose">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Details */}
            <Reveal>
              <div className="space-y-6">
                <ul className="space-y-5">
                  {details.map((d) => (
                    <li key={d.label} className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-700">
                        <d.Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-muted-foreground">
                          {d.label}
                        </span>
                        {d.href ? (
                          <a href={d.href} className="text-lg text-ink hover:text-gold-700">
                            {d.value}
                          </a>
                        ) : (
                          <span className="text-lg text-ink">{d.value}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <div>
                  <p className="mb-3 text-sm font-medium text-muted-foreground">{t("followUs")}</p>
                  <div className="flex gap-3">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-ink transition-colors hover:border-gold/40 hover:bg-gold hover:text-white"
                      >
                        <s.Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                  <iframe
                    src={MAPS_SRC}
                    title="ISHINOL Indonesia — Jakarta"
                    width="100%"
                    height="320"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="block w-full"
                  />
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
