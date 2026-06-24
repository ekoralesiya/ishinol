"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StaticPath =
  | "/"
  | "/about-us"
  | "/products"
  | "/portfolio"
  | "/news"
  | "/videos"
  | "/downloads"
  | "/contact";

const NAV: { href: StaticPath; key: string }[] = [
  { href: "/about-us", key: "about" },
  { href: "/products", key: "products" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/news", key: "news" },
  { href: "/videos", key: "videos" },
  { href: "/downloads", key: "downloads" },
  { href: "/contact", key: "contact" },
];

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-white/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container-prose flex h-16 items-center justify-between lg:h-20">
        <Link href="/" className="flex items-center gap-2" aria-label="ISHINOL">
          <span className="font-display text-2xl font-bold tracking-tight text-ink">
            ISHINOL
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-gold-600 sm:inline">
            Indonesia
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="link-underline text-sm font-medium text-ink/80 transition-colors hover:text-ink"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Button asChild variant="gold" size="sm">
            <Link href="/contact">{t("getQuote")}</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("menu")}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-white/95 backdrop-blur-xl transition-all duration-300 lg:hidden",
          open ? "max-h-[80vh]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="container-prose flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-muted"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between px-3">
            <LanguageSwitcher />
            <Button asChild variant="gold" size="sm">
              <Link href="/contact">{t("getQuote")}</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
