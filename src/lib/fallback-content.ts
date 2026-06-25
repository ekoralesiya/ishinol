/**
 * Default content for PT INDOCOAT ISHINOL UTAMA — official Indonesian agent of
 * ISHINOL (made by Konsho, Japan), specialising in marble care & protection.
 * Sourced from the official company profile. Used as a graceful fallback when
 * the database is empty/unavailable and as the seed source. Everything here is
 * fully editable from the Admin CMS.
 */

export const fallbackHero = {
  eyebrow_id: "Agen Utama ISHINOL Jepang di Indonesia",
  eyebrow_en: "Official ISHINOL Japan Agent in Indonesia",
  headline_id: "Teknologi Perawatan Marmer dari Jepang",
  headline_en: "Japanese Marble Care Technology",
  subheadline_id:
    "ISHINOL meresap ke dalam batu alam — bukan sekadar melapisi permukaan — menurunkan kadar air lebih dari 75% dan melindungi marmer dari noda, pelapukan, serta cuaca. Lebih dari 25 tahun dipercaya pabrik dan gudang marmer di Indonesia.",
  subheadline_en:
    "ISHINOL penetrates deep into natural stone — not just coating the surface — cutting water absorption by over 75% and protecting marble from stains, weathering and the elements. Trusted by marble factories and warehouses across Indonesia for over 25 years.",
  imageUrl:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=80",
  videoUrl: "",
  ctaLabel_id: "Lihat Produk",
  ctaLabel_en: "Explore Products",
  ctaHref: "/products",
  secondaryCtaLabel_id: "Hubungi Kami",
  secondaryCtaLabel_en: "Contact Us",
  secondaryCtaHref: "/contact",
};

export const fallbackProducts = [
  // ── COATING ──────────────────────────────────────────────
  {
    slug: "clear-coat-g",
    name_id: "Clear Coat G",
    name_en: "Clear Coat G",
    tagline_id: "Waterproofing penetrasi untuk semua jenis batu, khususnya marmer putih",
    tagline_en: "Penetrating waterproofing for all stone, especially white marble",
    description_id:
      "Coating solvent base yang tidak merubah warna dan sangat baik digunakan untuk semua jenis batu, khususnya marmer putih. Memberikan waterproofing dengan hasil warna yang natural, meresap ke dalam batu tanpa membentuk lapisan film di permukaan.",
    description_en:
      "A solvent-based coating that does not alter color and works excellently on all stone types, especially white marble. It provides waterproofing with a natural color result, penetrating into the stone without forming a surface film.",
    features_id: [
      "Solvent base, tidak merubah warna batu",
      "Cocok untuk semua jenis batu, khususnya marmer putih",
      "Waterproofing dengan hasil warna natural",
      "Meresap ke dalam batu, bukan melapisi permukaan",
    ],
    features_en: [
      "Solvent-based, does not change stone color",
      "Suitable for all stone, especially white marble",
      "Waterproofing with a natural color finish",
      "Penetrates into the stone instead of coating the surface",
    ],
    benefits_id: [
      "Kedap air jangka panjang",
      "Mencegah noda pada batu",
      "Noda lebih mudah dihilangkan",
      "Tahan oksidasi & mempertahankan kilau",
      "Melindungi dari keretakan dan kondisi cuaca",
    ],
    benefits_en: [
      "Long-term water resistance",
      "Prevents stains on stone",
      "Stains are easier to remove",
      "Oxidation-resistant & keeps the shine",
      "Protects against cracking and weather",
    ],
    specifications: [
      { label_id: "Kategori", label_en: "Category", value_id: "Coating", value_en: "Coating" },
      { label_id: "Basis", label_en: "Base", value_id: "Solvent", value_en: "Solvent" },
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang (Konsho)", value_en: "Japan (Konsho)" },
      { label_id: "Aplikasi", label_en: "Best for", value_id: "Marmer putih & batu alam", value_en: "White marble & natural stone" },
    ],
    coverImage: "/products/clear-coat-g.jpg",
    isFeatured: true,
    category: "coating",
  },
  {
    slug: "stone-power",
    name_id: "Stone Power",
    name_en: "Stone Power",
    tagline_id: "Penguat tekstur & pelindung pelapukan untuk limestone dan marmer krem",
    tagline_en: "Texture strengthener & weathering shield for limestone and cream marble",
    description_id:
      "Memperkuat tekstur batu jenis limestone dan marmer krem serta melindunginya dari pelapukan. Membentuk lapisan penetrasi yang dalam untuk melindungi batu dari pelapukan dan kerusakan.",
    description_en:
      "Strengthens the texture of limestone and cream marble while protecting it from weathering. It forms a deep penetrating layer that shields the stone from decay and damage.",
    features_id: [
      "Memperkuat tekstur batu",
      "Lapisan penetrasi yang dalam",
      "Khusus limestone & marmer krem",
    ],
    features_en: [
      "Strengthens stone texture",
      "Deep penetrating layer",
      "Specialised for limestone & cream marble",
    ],
    benefits_id: [
      "Melindungi batu dari pelapukan",
      "Mencegah kerusakan batu",
      "Memperkuat permukaan dari dalam",
    ],
    benefits_en: [
      "Protects stone from weathering",
      "Prevents stone damage",
      "Strengthens the surface from within",
    ],
    specifications: [
      { label_id: "Kategori", label_en: "Category", value_id: "Coating", value_en: "Coating" },
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang (Konsho)", value_en: "Japan (Konsho)" },
      { label_id: "Aplikasi", label_en: "Best for", value_id: "Limestone & marmer krem", value_en: "Limestone & cream marble" },
    ],
    coverImage: "/products/stone-power.jpg",
    isFeatured: true,
    category: "coating",
  },
  // ── CLEANING AGENT ───────────────────────────────────────
  {
    slug: "ishi-clean-super-sp",
    name_id: "Ishi-Clean Super SP",
    name_en: "Ishi-Clean Super SP",
    tagline_id: "Pembersih serba guna PH netral untuk marmer",
    tagline_en: "All-purpose pH-neutral cleaner for marble",
    description_id:
      "Obat pembersih serba guna dengan PH netral yang sangat baik digunakan pada marmer. Meningkatkan penetrasi ke permukaan dan menghilangkan noda pada batu.",
    description_en:
      "An all-purpose, pH-neutral cleaning agent that works excellently on marble. It improves penetration into the surface and removes stains from stone.",
    features_id: ["PH netral", "Serba guna", "Aman untuk marmer"],
    features_en: ["pH neutral", "All-purpose", "Safe for marble"],
    benefits_id: ["Meningkatkan penetrasi ke permukaan", "Menghilangkan noda pada batu"],
    benefits_en: ["Improves surface penetration", "Removes stains from stone"],
    specifications: [
      { label_id: "Kategori", label_en: "Category", value_id: "Cleaning Agent", value_en: "Cleaning Agent" },
      { label_id: "PH", label_en: "pH", value_id: "Netral", value_en: "Neutral" },
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang (Konsho)", value_en: "Japan (Konsho)" },
    ],
    coverImage: "/products/ishi-clean-super-sp.jpg",
    isFeatured: true,
    category: "cleaning",
  },
  {
    slug: "sabi-clean",
    name_id: "Sabi Clean",
    name_en: "Sabi Clean",
    tagline_id: "Penghilang karat besi pada marmer",
    tagline_en: "Iron-rust remover for marble",
    description_id:
      "PH netral yang dapat memecah karat besi pada marmer sehingga mudah dibersihkan menggunakan obat pembersih Ishi-Clean Super SP.",
    description_en:
      "A pH-neutral agent that breaks down iron rust on marble so it can be easily cleaned using Ishi-Clean Super SP.",
    features_id: ["PH netral", "Memecah karat besi", "Bekerja optimal dengan Ishi-Clean Super SP"],
    features_en: ["pH neutral", "Breaks down iron rust", "Works best with Ishi-Clean Super SP"],
    benefits_id: ["Menghilangkan karat yang tertinggal pada panel", "Menghilangkan bekas karat besi"],
    benefits_en: ["Removes rust left on panels", "Removes iron-rust marks"],
    specifications: [
      { label_id: "Kategori", label_en: "Category", value_id: "Cleaning Agent", value_en: "Cleaning Agent" },
      { label_id: "PH", label_en: "pH", value_id: "Netral", value_en: "Neutral" },
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang (Konsho)", value_en: "Japan (Konsho)" },
    ],
    coverImage: "/products/sabi-clean.jpg",
    isFeatured: false,
    category: "cleaning",
  },
  {
    slug: "ishinol-hakuri",
    name_id: "Ishinol Hakuri",
    name_en: "Ishinol Hakuri",
    tagline_id: "Pencabut coating & pembersih sisa chemical",
    tagline_en: "Coating stripper & chemical-residue cleaner",
    description_id:
      "Obat untuk mencabut coating dan membersihkan efek dari chemical yang digunakan sebelumnya. Dapat dipadukan dengan Nendol untuk hasil maksimal.",
    description_en:
      "An agent to strip coating and clean the effects of previously used chemicals. Can be combined with Nendol for maximum results.",
    features_id: ["Mencabut coating lama", "Membersihkan sisa chemical", "Bisa dipadukan dengan Nendol"],
    features_en: ["Strips old coating", "Cleans chemical residue", "Combines with Nendol"],
    benefits_id: ["Mempersiapkan ulang permukaan batu", "Permukaan bersih sebelum coating baru"],
    benefits_en: ["Re-prepares the stone surface", "Clean surface before re-coating"],
    specifications: [
      { label_id: "Kategori", label_en: "Category", value_id: "Cleaning Agent", value_en: "Cleaning Agent" },
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang (Konsho)", value_en: "Japan (Konsho)" },
    ],
    coverImage: "/products/ishinol-hakuri.jpg",
    isFeatured: false,
    category: "cleaning",
  },
  {
    slug: "abura-remover",
    name_id: "Abura Remover",
    name_en: "Abura Remover",
    tagline_id: "Penghilang noda minyak pada batu",
    tagline_en: "Oil-stain remover for stone",
    description_id:
      "Diformulasikan khusus untuk membersihkan noda minyak pada permukaan batu dan marmer.",
    description_en:
      "Specially formulated to clean oil stains from stone and marble surfaces.",
    features_id: ["Khusus noda minyak", "Aman untuk batu & marmer"],
    features_en: ["Targets oil stains", "Safe for stone & marble"],
    benefits_id: ["Menghilangkan noda minyak membandel"],
    benefits_en: ["Removes stubborn oil stains"],
    specifications: [
      { label_id: "Kategori", label_en: "Category", value_id: "Cleaning Agent", value_en: "Cleaning Agent" },
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang (Konsho)", value_en: "Japan (Konsho)" },
    ],
    coverImage: "/products/abura-remover.jpg",
    isFeatured: false,
    category: "cleaning",
  },
  {
    slug: "nendol",
    name_id: "Nendol",
    name_en: "Nendol",
    tagline_id: "Tepung pasta pembersih dinding berdaya serap tinggi",
    tagline_en: "High-absorption cleaning paste powder for walls",
    description_id:
      "Tepung pencampur cairan pembersih menjadi pasta, biasa digunakan untuk cleaning dinding. Bubuk dioleskan langsung pada permukaan yang terkena noda dan dapat dicampur dengan cairan ISHINOL lainnya.",
    description_en:
      "A powder that mixes cleaning liquid into a paste, commonly used for wall cleaning. The powder is applied directly onto stained surfaces and can be combined with other ISHINOL liquids.",
    features_id: ["Daya serap tinggi", "Bisa dicampur cairan ISHINOL lain", "Dioleskan langsung pada noda"],
    features_en: ["High absorption", "Mixes with other ISHINOL liquids", "Applied directly onto stains"],
    benefits_id: ["Menghilangkan noda pada dinding batu", "Mudah diaplikasikan sebagai pasta"],
    benefits_en: ["Removes stains on stone walls", "Easy to apply as a paste"],
    specifications: [
      { label_id: "Kategori", label_en: "Category", value_id: "Cleaning Agent", value_en: "Cleaning Agent" },
      { label_id: "Bentuk", label_en: "Form", value_id: "Bubuk/Pasta", value_en: "Powder/Paste" },
      { label_id: "Asal", label_en: "Origin", value_id: "Jepang (Konsho)", value_en: "Japan (Konsho)" },
    ],
    coverImage: "/products/nendol.jpg",
    isFeatured: false,
    category: "cleaning",
  },
];

export const fallbackProjects = [
  {
    slug: "restorasi-marmer-monas",
    title_id: "Restorasi Marmer Monumen Nasional (Monas)",
    title_en: "Marble Restoration — National Monument (Monas)",
    location: "Jakarta",
    year: 2023,
    category: "landmark",
    description_id:
      "Perawatan dan perlindungan marmer pada kawasan Monumen Nasional (Monas). Permukaan marmer yang kusam dan ternoda dikembalikan kilaunya serta dilindungi dengan ISHINOL agar tahan terhadap cuaca dan pelapukan.",
    description_en:
      "Care and protection of marble at the National Monument (Monas) complex. Dull, stained marble surfaces were restored to their shine and protected with ISHINOL to withstand weather and weathering.",
    coverImage: "/portfolio/monas-1.jpg",
  },
  {
    slug: "monas-pelataran-marmer",
    title_id: "Pelataran Marmer Monas",
    title_en: "Monas Marble Plaza",
    location: "Jakarta",
    year: 2023,
    category: "landmark",
    description_id:
      "Pembersihan dan coating ISHINOL pada pelataran marmer Monas — menghilangkan noda membandel dan melindungi dari serapan air.",
    description_en:
      "ISHINOL cleaning and coating on the Monas marble plaza — removing stubborn stains and protecting against water absorption.",
    coverImage: "/portfolio/monas-2.jpg",
  },
  {
    slug: "monas-dinding-marmer",
    title_id: "Dinding Marmer Monas",
    title_en: "Monas Marble Walls",
    location: "Jakarta",
    year: 2023,
    category: "landmark",
    description_id:
      "Restorasi dinding marmer dengan rangkaian cleaning agent ISHINOL dan perlindungan akhir coating untuk menjaga keindahan jangka panjang.",
    description_en:
      "Marble wall restoration using the ISHINOL cleaning-agent range and a final protective coating to preserve long-term beauty.",
    coverImage: "/portfolio/monas-3.jpg",
  },
];

export const fallbackTestimonials = [
  {
    author: "Andreas Wijaya",
    role_id: "Pemilik Gudang Marmer",
    role_en: "Marble Warehouse Owner",
    company: "Wijaya Marble",
    quote_id:
      "Sejak memakai ISHINOL dari PT Indocoat Ishinol Utama, marmer kami jauh lebih tahan noda dan air. Dukungan teknisnya juga sangat membantu.",
    quote_en:
      "Since using ISHINOL from PT Indocoat Ishinol Utama, our marble is far more resistant to stains and water. Their technical support is excellent too.",
    rating: 5,
  },
  {
    author: "Sarah Tanuwijaya",
    role_id: "Manajer Proyek",
    role_en: "Project Manager",
    company: "Luxe Developments",
    quote_id:
      "Hasil before-after-nya luar biasa. Tim PT Indocoat Ishinol Utama sangat profesional dari awal hingga akhir.",
    quote_en:
      "The before-and-after results were remarkable. The PT Indocoat Ishinol Utama team was professional from start to finish.",
    rating: 5,
  },
  {
    author: "David Kusuma",
    role_id: "Pabrik Marmer",
    role_en: "Marble Factory",
    company: "Kusuma Stone",
    quote_id:
      "Coating yang meresap ke dalam batu, bukan sekadar melapisi. Kadar air turun drastis dan marmer tetap natural.",
    quote_en:
      "A coating that penetrates the stone rather than just covering it. Water absorption dropped drastically and the marble stays natural.",
    rating: 5,
  },
];

export const fallbackWhy = [
  {
    icon: "Award",
    title_id: "Agen Utama ISHINOL",
    title_en: "Official ISHINOL Agent",
    body_id: "Agen utama ISHINOL (Konsho, Jepang) di Indonesia dengan pengalaman lebih dari 25 tahun.",
    body_en: "Official Indonesian agent of ISHINOL (Konsho, Japan) with over 25 years of experience.",
  },
  {
    icon: "ShieldCheck",
    title_id: "Penetrasi, Bukan Melapisi",
    title_en: "Penetrates, Not Just Coats",
    body_id: "ISHINOL meresap ke dalam batu alam dan tidak membentuk lapisan film di permukaan.",
    body_en: "ISHINOL absorbs into natural stone and does not form a film on the surface.",
  },
  {
    icon: "Sparkles",
    title_id: "Kadar Air Turun >75%",
    title_en: "Water Absorption Cut >75%",
    body_id: "Dibanding batu tanpa coating, ISHINOL menurunkan kadar air lebih dari 75%.",
    body_en: "Compared with uncoated stone, ISHINOL reduces water absorption by over 75%.",
  },
  {
    icon: "Clock",
    title_id: "Perlindungan Tahan Lama",
    title_en: "Long-Lasting Protection",
    body_id: "Melindungi marmer dari noda, pelapukan, keretakan, dan kondisi cuaca.",
    body_en: "Protects marble from stains, weathering, cracking and the elements.",
  },
];

export const fallbackArticles = [
  {
    slug: "merawat-marmer-mewah",
    title_id: "5 Cara Merawat Marmer Agar Tetap Berkilau",
    title_en: "5 Ways to Keep Marble Brilliantly Shining",
    excerpt_id: "Panduan praktis menjaga keindahan marmer di hunian dan bangunan komersial Anda.",
    excerpt_en: "A practical guide to preserving the beauty of marble in homes and commercial spaces.",
    coverImage: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1600&q=80",
    category: "tips",
  },
  {
    slug: "teknologi-penetrasi-ishinol",
    title_id: "Mengapa Coating Penetrasi ISHINOL Berbeda",
    title_en: "Why ISHINOL's Penetrating Coating Is Different",
    excerpt_id: "Ilmu di balik ISHINOL yang meresap ke dalam batu dan menurunkan kadar air >75%.",
    excerpt_en: "The science behind ISHINOL penetrating the stone and cutting water absorption by >75%.",
    coverImage: "https://images.unsplash.com/photo-1635424710928-0544e8b6f88e?auto=format&fit=crop&w=1600&q=80",
    category: "technology",
  },
  {
    slug: "before-after-monas",
    title_id: "Before & After: Restorasi Marmer Monas",
    title_en: "Before & After: Monas Marble Restoration",
    excerpt_id: "Studi kasus perawatan dan perlindungan marmer di kawasan Monumen Nasional.",
    excerpt_en: "A case study of marble care and protection at the National Monument complex.",
    coverImage: "/portfolio/monas-1.jpg",
    category: "case-study",
  },
];

// Videos are managed from the Admin CMS (Videos module). No placeholder
// videos are shipped — add your own ISHINOL/marble videos from /admin.
export const fallbackVideos: Array<{
  title_id: string;
  title_en: string;
  source: string;
  url: string;
  category: string;
  isFeatured: boolean;
}> = [];

export const fallbackDownloads = [
  {
    title_id: "E-Katalog LKPP — Produk Lantai",
    title_en: "LKPP E-Catalog — Floor Products",
    category: "catalog",
    fileUrl: "https://e-katalog.lkpp.go.id/katalog/produk/detail/81789493?type=province",
    fileSize: null as number | null,
  },
  {
    title_id: "E-Katalog LKPP — Produk Dinding",
    title_en: "LKPP E-Catalog — Wall Products",
    category: "catalog",
    fileUrl: "https://e-katalog.lkpp.go.id/katalog/produk/detail/81471866?type=province",
    fileSize: null,
  },
  {
    title_id: "E-Katalog LKPP — Lantai Gedung Kantor & Hunian",
    title_en: "LKPP E-Catalog — Office & Residential Floors",
    category: "catalog",
    fileUrl: "https://e-katalog.lkpp.go.id/katalog/produk/detail/82498151?type=province",
    fileSize: null,
  },
];

export const fallbackAbout = {
  distributor_id:
    "PT Indocoat Ishinol Utama adalah agen utama coating ISHINOL buatan Konsho, Jepang, di Indonesia. Telah memasarkan ISHINOL di Indonesia lebih dari 25 tahun, kami banyak bekerja sama dengan pabrik dan gudang marmer di seluruh Indonesia.",
  distributor_en:
    "PT Indocoat Ishinol Utama is the official Indonesian agent for ISHINOL coating, made by Konsho, Japan. Having marketed ISHINOL in Indonesia for over 25 years, we work closely with marble factories and warehouses across the country.",
  vision_id:
    "Menjadi pemimpin pasar solusi perawatan marmer berkualitas tinggi di Indonesia dengan menghadirkan teknologi unggul ISHINOL dari Jepang yang terpercaya dan berkelanjutan.",
  vision_en:
    "To become the market leader in high-quality marble care solutions in Indonesia by delivering ISHINOL's superior Japanese technology — trusted and sustainable.",
  mission_id:
    "1. Menjalin kemitraan jangka panjang dengan pabrik dan gudang marmer melalui layanan teknis dan dukungan purna jual yang andal. 2. Mengembangkan jaringan distribusi nasional yang efisien untuk menjangkau lebih banyak pelanggan dengan cepat dan tepat.",
  mission_en:
    "1. Build long-term partnerships with marble factories and warehouses through reliable technical service and after-sales support. 2. Develop an efficient national distribution network to reach more customers quickly and accurately.",
  history_id:
    "Selama lebih dari 25 tahun, PT Indocoat Ishinol Utama menghadirkan teknologi perawatan marmer ISHINOL dari Jepang ke Indonesia — dipercaya oleh pabrik, gudang marmer, dan proyek bergengsi termasuk kawasan Monumen Nasional (Monas).",
  history_en:
    "For over 25 years, PT Indocoat Ishinol Utama has brought ISHINOL's Japanese marble-care technology to Indonesia — trusted by factories, marble warehouses and prestigious projects including the National Monument (Monas) complex.",
};
