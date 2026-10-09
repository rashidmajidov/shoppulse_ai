/**
 * ShopPulse AI - Trend Database & Product Store
 * Analyzed trends from TikTok, Instagram, X (Twitter), Reddit
 * Bilingual: Azerbaijani (az) & English (en)
 */

const TREND_DATA = [
  {
    id: "tt-01",
    platform: "tiktok",
    platformName: "TikTok",
    platformIcon: "🎵",
    badgeColor: "#00f2fe",
    title: "POV: Sən nəhayət həyatını asanlaşdıran həlli tapdın",
    title_en: "POV: You finally found the life-changing solution",
    viralScore: 99,
    views: "14.8M",
    growth: "+410%",
    soundName: "Phonk Drive - Viral Drift Beat",
    soundGenre: "phonk",
    trendCategory: "Problem-Həll",
    trendCategory_en: "Problem-Solver",
    bestFor: ["Texnologiya", "Aksessuar", "Gündəlik Həyat"],
    bestFor_en: ["Technology", "Accessories", "Daily Life"],
    hookText: "Bunu bilmədən yaşamağa necə davam edirdim axı?! 🤯",
    hookText_en: "How was I surviving without knowing this existed?! 🤯",
    description: "İzləyicinin diqqətini dərhal çəkən, gündəlik əsəbiləşdirən bir problemi göstərib 3-cü saniyədə məhsulu xilaskar kimi təqdim edən viral format.",
    description_en: "A high-retention format highlighting a universal daily frustration before revealing the product as the hero solution at second 3.",
    scriptTemplate: {
      hook: "Bütün dostlarım bu sirri gizlədirdi, amma mən axır ki tapdım!",
      body: "{product_name} sayəsində artıq günlərlə vaxt itirmirəm. Ən sevdiyim cəhəti isə {feature_1} olmasıdır.",
      cta: "İndi 40% endirimlə sifariş ver, link profilin bio hissəsindədir!"
    },
    scriptTemplate_en: {
      hook: "Everyone kept gatekeeping this, but I finally found the exact source!",
      body: "Thanks to {product_name}, I save hours every single day. The best part is {feature_1}.",
      cta: "Grab yours now with 40% off — link in bio before it sells out!"
    }
  },
  {
    id: "ig-01",
    platform: "instagram",
    platformName: "Instagram Reels",
    platformIcon: "📸",
    badgeColor: "#e1306c",
    title: "Estetik Sabah Rutini & Minimalist Həyat Tərzi",
    title_en: "Aesthetic Morning Routine & Minimalist Living",
    viralScore: 97,
    views: "9.2M",
    growth: "+290%",
    soundName: "Sunday Coffee - Smooth Lo-Fi Chill",
    soundGenre: "lofi",
    trendCategory: "Aesthetic ASMR",
    trendCategory_en: "Aesthetic ASMR",
    bestFor: ["Kosmetika", "Dəri Qulluğu", "Ev & Dizayn", "Sağlamlıq"],
    bestFor_en: ["Beauty", "Skincare", "Home Design", "Wellness"],
    hookText: "Hər səhər günümə belə başlayıram... Sadəcə bax və zövq al ✨",
    hookText_en: "My calm morning routine that completely changed my glow ✨",
    description: "Sakitləşdirici rənglər, zərif işıqlandırma və premium hissi verən unboxing/istifadə kadrları. Brendə yüksək etibar qazandırır.",
    description_en: "Soothing color grade, soft natural light, and clean ASMR pacing that builds immediate brand trust and premium perception.",
    scriptTemplate: {
      hook: "Səhərlərinizi dəyişdirəcək tək bir vərdiş var desəm?",
      body: "{product_name} ilə gündəlik rutinim tamam fərqli səviyyəyə qalxdı. Xüsusilə {feature_1} və {feature_2} möhtəşəmdir.",
      cta: "Sən də özünə dəyər ver. Sifariş üçün direct-ə yaz və ya linkə keçid et!"
    },
    scriptTemplate_en: {
      hook: "If you only add one thing to your routine this year, make it this.",
      body: "{product_name} transformed my daily regimen. Especially with {feature_1} and {feature_2}.",
      cta: "Treat yourself today — tap the link in bio for the official drop!"
    }
  },
  {
    id: "tt-02",
    platform: "tiktok",
    platformName: "TikTok",
    platformIcon: "🎵",
    badgeColor: "#00f2fe",
    title: "TikTok Made Me Buy It: 7 Günlük Dürüst Test",
    title_en: "TikTok Made Me Buy It: 7-Day Unfiltered Test",
    viralScore: 96,
    views: "16.4M",
    growth: "+520%",
    soundName: "Upbeat Bounce Funk - Viral Rhythm",
    soundGenre: "upbeat",
    trendCategory: "Sosial Sübut",
    trendCategory_en: "Social Proof",
    bestFor: ["Texnologiya", "Mətbəx", "Qadcetlər", "Fitnes"],
    bestFor_en: ["Gadgets", "Kitchen", "Tech", "Fitness"],
    hookText: "Hər kəs bu məhsulu tərifləyirdi, mən də yoxladım və şoka düşdüm! 😱",
    hookText_en: "I bought this to prove everyone was exaggerating... I was wrong. 😱",
    description: "Filtrsiz, səmimi və real alıcı təəssüratı yaradan format. Satış konversiyası ən yüksək olan trendlərdən biridir.",
    description_en: "Unfiltered, honest user-review format with skepticism turning into total astonishment. Top-converting e-commerce ad style.",
    scriptTemplate: {
      hook: "Bunu TikTok-da gördüm və dedim ki, bu mümkün deyil...",
      body: "Amma {product_name}-i 7 gün yoxladıqdan sonra fikrim 180 dərəcə dəyişdi! {feature_1} sayəsində hər qəpiyinə dəyir.",
      cta: "Hazırda pulsuz çatdırılma aksiyası var, fürsəti qaçırma!"
    },
    scriptTemplate_en: {
      hook: "I saw this blowing up on TikTok and called total cap...",
      body: "After 7 days using {product_name}, I get the hype. {feature_1} alone makes it worth every cent.",
      cta: "Free express shipping ends tonight — tap below to order!"
    }
  },
  {
    id: "reddit-01",
    platform: "reddit",
    platformName: "Reddit",
    platformIcon: "👽",
    badgeColor: "#ff4500",
    title: "r/mildlyinteresting: 'Bunu niyə daha əvvəl bilmirdim?'",
    title_en: "r/mildlyinteresting: 'Why did no one tell me about this?'",
    viralScore: 94,
    views: "6.7M",
    growth: "+190%",
    soundName: "Minimal Synthwave Pulse",
    soundGenre: "synth",
    trendCategory: "Dürüst Rəy",
    trendCategory_en: "Honest Review",
    bestFor: ["Texnologiya", "Ev Əşyaları", "Faydalı Alətlər"],
    bestFor_en: ["Tools", "Home", "Smart Gadgets"],
    hookText: "Reddit-də minlərlə insanın tövsiyə etdiyi o sirli məhsul... 🔍",
    hookText_en: "Found this deep on Reddit and it solved a problem I had for years. 🔍",
    description: "Reddit stilində intriqa və dərin inam yaradan format. Həqiqi kəşf hissi aşılayır.",
    description_en: "Authentic text screenshot opening hook that taps into deep community curiosity and un-sponsored credibility.",
    scriptTemplate: {
      hook: "Reddit icması yenə yanılmadı. Bu tapıntı inanılmazdır!",
      body: "{product_name} haqqında yazılanların hamısı doğru çıxdı. {feature_1} olması həqiqətən böyük fərq yaradır.",
      cta: "Şərhlərdə ən yaxşı qiymət linkini qoyuram, daxil olub baxın!"
    },
    scriptTemplate_en: {
      hook: "The Reddit thread was 100% right on this discovery.",
      body: "{product_name} lives up to the reputation. The built-in {feature_1} makes a massive difference.",
      cta: "Dropping the direct verified store link in comments — check it out!"
    }
  },
  {
    id: "x-01",
    platform: "x",
    platformName: "X (Twitter)",
    platformIcon: "🐦",
    badgeColor: "#1d9bf0",
    title: "Viral Tweet Fırtınası: 'Günün ən yaxşı sərmayəsi'",
    title_en: "Viral Tweet Thread: 'The best $50 I spent all year'",
    viralScore: 92,
    views: "5.4M",
    growth: "+240%",
    soundName: "Modern Punchy Electro Pop",
    soundGenre: "upbeat",
    trendCategory: "Kəskin & Qısa",
    trendCategory_en: "Punchy & Direct",
    bestFor: ["Aksessuarlar", "Gənclər", "Texnologiya", "İş & Həyat"],
    bestFor_en: ["Accessories", "Productivity", "Tech", "Workplace"],
    hookText: "X-də dünən gecədən bəri hamı bu yeniliyi paylaşır! 🚀",
    hookText_en: "Everyone on my timeline has been raving about this all week! 🚀",
    description: "Qısa, lakonik, zərbəli ifadələr və dinamik keçidlərlə izləyicini saniyələr içində qərara sövq edir.",
    description_en: "Fast-paced, high-contrast one-liner statements driving lightning-fast buyer intent without fluff.",
    scriptTemplate: {
      hook: "Əgər həyatını asanlaşdırmaq istəyirsənsə, bu videonu ötürmə!",
      body: "{product_name} ilə tanış olun. Nə üçün hamı bunu sevir? Çünki {feature_1} və {feature_2} ilə rəqibsizdir.",
      cta: "Kupon kodumuzla 25% əlavə endirim əldə etmək üçün tıkla!"
    },
    scriptTemplate_en: {
      hook: "Stop scrolling if you want to optimize your daily routine.",
      body: "Meet {product_name}. Why is it everywhere? Because {feature_1} and {feature_2} crush any alternative.",
      cta: "Use code TREND25 for an instant discount — link below!"
    }
  },
  {
    id: "ig-02",
    platform: "instagram",
    platformName: "Instagram Reels",
    platformIcon: "📸",
    badgeColor: "#e1306c",
    title: "Before & After: Möhtəşəm Dəyişim",
    title_en: "Before & After: Instant Visible Transformation",
    viralScore: 95,
    views: "11.1M",
    growth: "+380%",
    soundName: "Cinematic Bass Drop & Transition",
    soundGenre: "synth",
    trendCategory: "Dəyişim",
    trendCategory_en: "Transformation",
    bestFor: ["Kosmetika", "Fitnes", "Gözəllik", "Təmizlik"],
    bestFor_en: ["Beauty", "Fitness", "Clean Living", "Restoration"],
    hookText: "Əvvəlki vəziyyətimə baxın... İndi isə buna baxın! ⚡",
    hookText_en: "Look at the before... now look at this after! ⚡",
    description: "Göz qabağında olan nəzərəçarpacaq dəyişiklik. İnsan beyni ani transformasiya videolarını sonacan izləyir.",
    description_en: "Instant visual contrast hook that keeps watch-time locked until the final reveal and product credit.",
    scriptTemplate: {
      hook: "Heç vaxt inanmazdım ki, belə bir fərq alına bilər!",
      body: "Bütün proses {product_name} ilə cəmi bir neçə dəqiqə çəkdi. {feature_1} həqiqətən möcüzədir.",
      cta: "Sən də bu dəyişimi yaşamaq istəyirsənsə, link səhifədədir!"
    },
    scriptTemplate_en: {
      hook: "I honestly didn't think anything could fix this so fast.",
      body: "The difference {product_name} made in under 3 minutes is wild. {feature_1} delivers real results.",
      cta: "Experience the transformation yourself — link in bio!"
    }
  }
];

const PRESET_PRODUCTS = [
  {
    id: "prod-01",
    name: "Nova Aura Smartwatch Ultra",
    name_en: "Nova Aura Smartwatch Ultra",
    category: "Texnologiya & Qadcet",
    category_en: "Tech & Wearables",
    price: "79 AZN",
    oldPrice: "129 AZN",
    discount: "39%",
    image: "assets/images/smartwatch.jpg",
    features: [
      "Amoled HD Ekran",
      "14 Günlük Güclü Batareya",
      "Ürək və Yuxu Monitorinqi",
      "Titan Gövdə & Suya Dözümlü"
    ],
    features_en: [
      "AMOLED HD Always-On Display",
      "14-Day Extended Battery Life",
      "Biometric Sleep & Heart Monitor",
      "Titanium Water-Resistant Casing"
    ],
    targetAudience: "Aktiv gənclər və texnologiya həvəskarları"
  },
  {
    id: "prod-02",
    name: "Lumina Gold Botanik Parlaqlıq Serumu",
    name_en: "Lumina Gold Botanical Glow Serum",
    category: "Dəri Qulluğu & Kosmetika",
    category_en: "Skincare & Beauty",
    price: "39 AZN",
    oldPrice: "65 AZN",
    discount: "40%",
    image: "assets/images/serum.jpg",
    features: [
      "100% Təbii Botanik Tərkib",
      "7 Gündə Təbii Şüşə Parıltısı",
      "Dərin Nəmləndirmə & Vitamin C",
      "Həssas Dərilər Üçün Təhlükəsiz"
    ],
    features_en: [
      "100% Cold-Pressed Botanicals",
      "Glass-Skin Glow in 7 Days",
      "Triple Hyaluronic & Vitamin C",
      "Dermatologist Tested for Sensitivity"
    ],
    targetAudience: "Xanımlar, estetik və dəri qulluğu sevərlər"
  },
  {
    id: "prod-03",
    name: "Nexus Ultra ANC Simsiz Qulaqlıq",
    name_en: "Nexus Ultra ANC Wireless Earbuds",
    category: "Audio & Aksessuar",
    category_en: "Audio & Accessories",
    price: "59 AZN",
    oldPrice: "99 AZN",
    discount: "40%",
    image: "assets/images/earbuds.jpg",
    features: [
      "Ultra Güclü Küy Ləğvetmə (ANC)",
      "48 Saat Fasiləsiz Enerji",
      "Kristal Təmiz Zəng Səsi",
      "Ultra Yüngül & Düşməyən Dizayn"
    ],
    features_en: [
      "Active Hybrid Noise Cancellation",
      "48-Hour Combined Playtime",
      "Studio Mic Clarity for Calls",
      "Ergonomic Non-Slip Comfort Fit"
    ],
    targetAudience: "Musiqi həvəskarları, tələbələr, ofis işçiləri"
  },
  {
    id: "prod-04",
    name: "GlowBlend Portativ Şirəçəkən Blender",
    name_en: "GlowBlend Portable Smoothie Blender",
    category: "Mətbəx & Fitnes",
    category_en: "Kitchen & Fitness",
    price: "49 AZN",
    oldPrice: "79 AZN",
    discount: "38%",
    image: "assets/images/blender.jpg",
    features: [
      "30 Saniyədə Təzə Smuzi",
      "USB-C Sürətli Şarj",
      "Buz Doğrayan 6 Polad Bıçaq",
      "Çantada Asanlıqla Daşınır"
    ],
    features_en: [
      "Fresh Smoothie in 30 Seconds",
      "USB-C Fast Charging Battery",
      "6 Stainless Steel Ice Blades",
      "Compact Leak-Proof On-the-Go Cap"
    ],
    targetAudience: "Fitnes həvəskarları, sağlam qidalananlar"
  }
];

const PLATFORM_STATS = {
  tiktok: { activeTrends: 24, viralVelocity: "+42%", topFormat: "POV Hook" },
  instagram: { activeTrends: 18, viralVelocity: "+31%", topFormat: "Aesthetic ASMR" },
  x: { activeTrends: 12, viralVelocity: "+25%", topFormat: "Viral Thread / Tweet" },
  reddit: { activeTrends: 9, viralVelocity: "+19%", topFormat: "Unfiltered Review" }
};
