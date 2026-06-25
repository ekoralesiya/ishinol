/** Static brand defaults. All of these can be overridden from CMS Site Settings. */
export const BRAND = {
  /** Legal company name (the official ISHINOL distributor in Indonesia). */
  name: "PT Indocoat Ishinol Utama",
  /** Product brand shown as the logo wordmark. */
  product: "ISHINOL",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6285697777292",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@ishinol.co.id",
  phone: "+62 856-9777-7292",
  address: "Jakarta, Indonesia",
  social: {
    instagram: "https://instagram.com/ishinol.indonesia",
    facebook: "https://facebook.com/ishinol.indonesia",
    linkedin: "https://linkedin.com/company/ishinol-indonesia",
    youtube: "https://youtube.com/@ishinol",
  },
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SEO_KEYWORDS = [
  "ISHINOL",
  "ISHINOL Indonesia",
  "PT Indocoat Ishinol Utama",
  "coating marmer",
  "pelapis marmer",
  "pelindung marmer",
  "Marble coating Indonesia",
  "Premium marble coating",
  "Marble protection solution",
  "Japanese marble coating",
  "perawatan marmer",
];
