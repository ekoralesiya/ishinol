import { useTranslations } from "next-intl";
import { Instagram, Facebook, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BRAND } from "@/lib/constants";

type StaticPath =
  | "/"
  | "/about-us"
  | "/products"
  | "/portfolio"
  | "/news"
  | "/videos"
  | "/downloads"
  | "/contact";

const QUICK: { href: StaticPath; key: string }[] = [
  { href: "/products", key: "products" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/news", key: "news" },
  { href: "/videos", key: "videos" },
];

const COMPANY: { href: StaticPath; key: string }[] = [
  { href: "/about-us", key: "about" },
  { href: "/downloads", key: "downloads" },
  { href: "/contact", key: "contact" },
];

export function Footer() {
  const t = useTranslations("Nav");
  const tf = useTranslations("Footer");

  return (
    <footer className="border-t border-border bg-marble-100">
      <div className="container-prose grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="font-display text-2xl font-bold text-ink">ISHINOL</div>
          <p className="max-w-xs text-sm text-muted-foreground">{tf("tagline")}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-gold-700">
            {tf("distributor")}
          </p>
          <div className="flex gap-3 pt-2">
            <a href={BRAND.social.instagram} aria-label="Instagram" className="text-ink/60 hover:text-gold-700" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={BRAND.social.facebook} aria-label="Facebook" className="text-ink/60 hover:text-gold-700" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={BRAND.social.linkedin} aria-label="LinkedIn" className="text-ink/60 hover:text-gold-700" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href={BRAND.social.youtube} aria-label="YouTube" className="text-ink/60 hover:text-gold-700" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-ink">{tf("quickLinks")}</h3>
          <ul className="space-y-2.5">
            {QUICK.map((l) => (
              <li key={l.key}>
                <Link href={l.href} className="text-sm text-muted-foreground hover:text-gold-700">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-ink">{tf("company")}</h3>
          <ul className="space-y-2.5">
            {COMPANY.map((l) => (
              <li key={l.key}>
                <Link href={l.href} className="text-sm text-muted-foreground hover:text-gold-700">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-ink">{tf("contact")}</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              {BRAND.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-gold-600" />
              <a href={`https://wa.me/${BRAND.whatsapp}`} className="hover:text-gold-700">
                {BRAND.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-gold-600" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-gold-700">
                {BRAND.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-prose flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. {tf("rights")}
          </p>
          <p>ISHINOL® is a registered trademark of KONSHO Co., Ltd., Japan.</p>
        </div>
      </div>
    </footer>
  );
}
