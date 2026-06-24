/**
 * Default ISHINOL content, aligned with the official ISHINOL Japan brand
 * (konsho.co.jp). This is used as a graceful fallback when the database is
 * empty or unavailable (e.g. during a build without DB access), and as the
 * seed source. Everything here is fully editable from the Admin CMS.
 */

export const fallbackHero = {
  eyebrow_id: "Perlindungan Permukaan Premium dari Jepang",
  eyebrow_en: "Japanese Premium Surface Protection",
  headline_id: "Seni Melindungi Batu Alam",
  headline_en: "The Art of Protecting Stone",
  subheadline_id:
    "ISHINOL melindungi marmer, granit, dan batu alam dengan pelapis Jepang yang mewah dan tahan lama — menjaga kilau permukaan untuk generasi mendatang.",
  subheadline_en:
    "ISHINOL safeguards marble, granite and natural stone with a luxurious, durable Japanese coating — preserving brilliance for generations.",
  imageUrl:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=80",
  videoUrl: "",
  ctaLabel_id: "Jelajahi Produk",
  ctaLabel_en: "Explore Products",
  ctaHref: "/products",
  secondaryCtaLabel_id: "Hubungi Sales",
  secondaryCtaLabel_en: "Talk to Sales",
  secondaryCtaHref: "/contact",
};

export const fallbackProducts = [
  {
    slug: "ishinol-stone-coating",
    name_id: "ISHINOL Stone Coating",
    name_en: "ISHINOL Stone Coating",
    tagline_id: "Pelapis pelindung utama untuk batu alam",
    tagline_en: "The flagship protective coating for natural stone",
    description_id:
      "Pelapis penetrasi tak terlihat yang meresap ke dalam pori batu alam, membentuk perlindungan permanen terhadap noda, air, dan minyak tanpa mengubah tampilan alami permukaan.",
    description_en:
      "An invisible penetrating coating that absorbs deep into the pores of natural stone, forming a permanent shield against stains, water and oil without altering the surface's natural appearance.",
    features_id: [
      "Teknologi penetrasi dalam dari Jepang",
      "Tidak mengubah warna atau tekstur alami",
      "Perlindungan permanen sekali aplikasi",
      "Ramah lingkungan dan aman untuk interior",
    ],
    features_en: [
      "Deep-penetration Japanese technology",
      "Does not alter natural color or texture",
      "Permanent protection in a single application",
      "Eco-friendly and safe for interiors",
    ],
    benefits_id: [
      "Mencegah noda membandel secara permanen",
      "Memudahkan perawatan harian",
      "Memperpanjang usia permukaan batu",
    ],
    benefits_en: [
      "Permanently prevents stubborn stains",
      "Simplifies daily maintenance",
      "Extends the lifespan of stone surfaces",
    ],
    specifications: [
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang", value_en: "Japan" },
      { label_id: "Jenis", label_en: "Type", value_id: "Penetrasi", value_en: "Penetrating" },
      { label_id: "Daya tahan", label_en: "Durability", value_id: "Permanen", value_en: "Permanent" },
      { label_id: "Coverage", label_en: "Coverage", value_id: "8–12 m²/L", value_en: "8–12 m²/L" },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    category: "coating",
  },
  {
    slug: "ishinol-marble-polish",
    name_id: "ISHINOL Marble Polish",
    name_en: "ISHINOL Marble Polish",
    tagline_id: "Memulihkan kilau cermin marmer",
    tagline_en: "Restores marble's mirror-like brilliance",
    description_id:
      "Sistem pemolesan presisi yang mengembalikan kilau cermin pada marmer yang kusam, menghilangkan goresan halus dan noda etsa sambil memperkuat permukaan.",
    description_en:
      "A precision polishing system that restores a mirror finish to dull marble, removing fine scratches and etch marks while strengthening the surface.",
    features_id: [
      "Memulihkan kilau cermin",
      "Menghilangkan goresan dan etsa",
      "Memperkuat lapisan permukaan",
    ],
    features_en: [
      "Restores a mirror finish",
      "Removes scratches and etching",
      "Strengthens the surface layer",
    ],
    benefits_id: ["Tampilan baru tanpa penggantian", "Hemat biaya restorasi"],
    benefits_en: ["Like-new appearance without replacement", "Cost-effective restoration"],
    specifications: [
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang", value_en: "Japan" },
      { label_id: "Aplikasi", label_en: "Application", value_id: "Profesional", value_en: "Professional" },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    category: "restoration",
  },
  {
    slug: "ishinol-anti-slip",
    name_id: "ISHINOL Anti-Slip",
    name_en: "ISHINOL Anti-Slip",
    tagline_id: "Keamanan tanpa mengorbankan keindahan",
    tagline_en: "Safety without compromising beauty",
    description_id:
      "Perlakuan tak terlihat yang meningkatkan daya cengkeram permukaan batu dan ubin saat basah, ideal untuk area kolam, kamar mandi, dan lobi hotel.",
    description_en:
      "An invisible treatment that increases the grip of stone and tile surfaces when wet — ideal for pool areas, bathrooms and hotel lobbies.",
    features_id: ["Tidak terlihat", "Efektif saat basah", "Tahan lama"],
    features_en: ["Invisible", "Effective when wet", "Long lasting"],
    benefits_id: ["Mengurangi risiko terpeleset", "Aman untuk area publik"],
    benefits_en: ["Reduces slip risk", "Safe for public areas"],
    specifications: [
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang", value_en: "Japan" },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    category: "safety",
  },
];

export const fallbackProjects = [
  {
    slug: "grand-luxury-residence-jakarta",
    title_id: "Hunian Mewah Grand — Jakarta",
    title_en: "Grand Luxury Residence — Jakarta",
    location: "Jakarta",
    year: 2024,
    category: "residence",
    description_id:
      "Perlindungan menyeluruh untuk lantai marmer Carrara dan dinding batu alam pada hunian premium seluas 1.200 m².",
    description_en:
      "Complete protection of Carrara marble flooring and natural stone walls across a 1,200 m² premium residence.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "five-star-hotel-bali",
    title_id: "Hotel Bintang Lima — Bali",
    title_en: "Five-Star Hotel — Bali",
    location: "Bali",
    year: 2023,
    category: "hotel",
    description_id:
      "Pelapisan anti-slip dan perlindungan noda untuk lobi, spa, dan area kolam renang resor mewah tepi pantai.",
    description_en:
      "Anti-slip and stain protection for the lobby, spa and pool areas of a beachfront luxury resort.",
    coverImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "corporate-headquarters",
    title_id: "Kantor Pusat Korporat",
    title_en: "Corporate Headquarters",
    location: "Surabaya",
    year: 2023,
    category: "office",
    description_id:
      "Restorasi dan perlindungan fasad granit serta lantai marmer lobi gedung perkantoran 40 lantai.",
    description_en:
      "Restoration and protection of the granite façade and marble lobby flooring of a 40-storey office tower.",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  },
];

export const fallbackTestimonials = [
  {
    author: "Andreas Wijaya",
    role_id: "Arsitek Utama",
    role_en: "Principal Architect",
    company: "Wijaya Studio",
    quote_id:
      "ISHINOL menjaga marmer proyek kami tetap sempurna setelah bertahun-tahun. Kualitas Jepang yang benar-benar terasa.",
    quote_en:
      "ISHINOL has kept the marble in our projects flawless for years. Truly Japanese quality you can feel.",
    rating: 5,
  },
  {
    author: "Sarah Tanuwijaya",
    role_id: "Manajer Proyek",
    role_en: "Project Manager",
    company: "Luxe Developments",
    quote_id:
      "Hasil before-after-nya luar biasa. Tim ISHINOL Indonesia sangat profesional dari awal hingga akhir.",
    quote_en:
      "The before-and-after results were remarkable. The ISHINOL Indonesia team was professional from start to finish.",
    rating: 5,
  },
  {
    author: "David Kusuma",
    role_id: "General Manager",
    role_en: "General Manager",
    company: "Grand Hotel Group",
    quote_id:
      "Perlindungan anti-slip mereka memberi kami ketenangan untuk keselamatan tamu tanpa mengorbankan estetika.",
    quote_en:
      "Their anti-slip protection gives us peace of mind for guest safety without sacrificing aesthetics.",
    rating: 5,
  },
];

export const fallbackWhy = [
  {
    icon: "ShieldCheck",
    title_id: "Teknologi Jepang",
    title_en: "Japanese Technology",
    body_id: "Formulasi presisi yang dikembangkan dan disempurnakan di Jepang.",
    body_en: "Precision formulations developed and perfected in Japan.",
  },
  {
    icon: "Sparkles",
    title_id: "Hasil Tak Terlihat",
    title_en: "Invisible Results",
    body_id: "Melindungi tanpa mengubah keindahan alami batu Anda.",
    body_en: "Protects without altering your stone's natural beauty.",
  },
  {
    icon: "Clock",
    title_id: "Tahan Seumur Hidup",
    title_en: "Lifetime Durability",
    body_id: "Perlindungan permanen yang bertahan bertahun-tahun.",
    body_en: "Permanent protection that lasts for years.",
  },
  {
    icon: "Award",
    title_id: "Distributor Resmi",
    title_en: "Official Distributor",
    body_id: "Pemegang merek dagang resmi ISHINOL di Indonesia.",
    body_en: "Official ISHINOL trademark holder in Indonesia.",
  },
];

export const fallbackArticles = [
  {
    slug: "merawat-marmer-mewah",
    title_id: "5 Cara Merawat Marmer Mewah Agar Tetap Berkilau",
    title_en: "5 Ways to Keep Luxury Marble Brilliantly Shining",
    excerpt_id:
      "Panduan praktis menjaga keindahan marmer di hunian dan bangunan komersial Anda.",
    excerpt_en:
      "A practical guide to preserving the beauty of marble in your home and commercial spaces.",
    coverImage:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1600&q=80",
    category: "tips",
  },
  {
    slug: "teknologi-coating-jepang",
    title_id: "Mengapa Teknologi Coating Jepang Berbeda",
    title_en: "Why Japanese Coating Technology Is Different",
    excerpt_id:
      "Mengupas ilmu di balik pelapis penetrasi ISHINOL yang melindungi dari dalam.",
    excerpt_en:
      "Exploring the science behind ISHINOL's penetrating coatings that protect from within.",
    coverImage:
      "https://images.unsplash.com/photo-1635424710928-0544e8b6f88e?auto=format&fit=crop&w=1600&q=80",
    category: "technology",
  },
  {
    slug: "before-after-restorasi",
    title_id: "Transformasi Before & After: Restorasi Lobi Hotel",
    title_en: "Before & After: A Hotel Lobby Restoration",
    excerpt_id: "Studi kasus restorasi lantai marmer lobi hotel bintang lima.",
    excerpt_en: "A case study restoring the marble lobby floor of a five-star hotel.",
    coverImage:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
    category: "case-study",
  },
];

export const fallbackVideos = [
  {
    title_id: "Profil ISHINOL Indonesia",
    title_en: "ISHINOL Indonesia Profile",
    source: "youtube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "marketing",
    isFeatured: true,
  },
  {
    title_id: "Demonstrasi Perlindungan Noda",
    title_en: "Stain Protection Demonstration",
    source: "youtube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "product",
    isFeatured: true,
  },
];

export const fallbackDownloads = [
  {
    title_id: "Brosur Produk ISHINOL",
    title_en: "ISHINOL Product Brochure",
    category: "brochure",
    fileUrl: "/downloads/ishinol-brochure.pdf",
    fileSize: 2400000,
  },
  {
    title_id: "Katalog Lengkap 2026",
    title_en: "Complete Catalog 2026",
    category: "catalog",
    fileUrl: "/downloads/ishinol-catalog-2026.pdf",
    fileSize: 8200000,
  },
  {
    title_id: "Sertifikat Distributor Resmi",
    title_en: "Official Distributor Certificate",
    category: "certificate",
    fileUrl: "/downloads/distributor-certificate.pdf",
    fileSize: 540000,
  },
];

export const fallbackAbout = {
  distributor_id:
    "Perusahaan kami adalah distributor resmi dan pemegang merek dagang ISHINOL di Indonesia. Setiap produk yang kami hadirkan diimpor langsung dan dijamin keasliannya dari ISHINOL Jepang.",
  distributor_en:
    "Our company is the official distributor and trademark holder of ISHINOL in Indonesia. Every product we offer is imported directly and guaranteed authentic from ISHINOL Japan.",
  vision_id:
    "Menjadi solusi perlindungan permukaan premium terdepan dan paling tepercaya di Indonesia.",
  vision_en:
    "To be the leading and most trusted premium surface protection solution in Indonesia.",
  mission_id:
    "Menghadirkan teknologi perlindungan batu alam terbaik dari Jepang dengan layanan profesional kelas dunia.",
  mission_en:
    "To bring the finest Japanese stone protection technology to Indonesia with world-class professional service.",
  history_id:
    "Didirikan dengan visi menghadirkan keunggulan Jepang ke arsitektur Indonesia, kami telah melindungi ratusan proyek bergengsi di seluruh nusantara.",
  history_en:
    "Founded with a vision to bring Japanese excellence to Indonesian architecture, we have protected hundreds of prestigious projects across the archipelago.",
};
