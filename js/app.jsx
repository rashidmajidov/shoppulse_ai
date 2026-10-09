/**
 * ShopPulse AI - Ultra-Minimalist, High-Utility Bento Dashboard
 * Light/Dark Mode, Pure Functionality, Zero Fluff/AI Slop, Bilingual (AZ / EN)
 */

const { useState, useEffect, useRef, useMemo } = React;

// --- BILINGUAL DICTIONARY (AZERBAIJANI & ENGLISH) ---
const I18N = {
  az: {
    brandSubtitle: "Viral Trend Reklam",
    dashboard: "İcmal",
    dailyTrends: "Gündəlik Trendlər",
    products: "Məhsullar",
    adStudio: "Reklam Studio",
    savedCampaigns: "Yadda Saxlananlar",
    settings: "Tənzimləmələr",
    searchPlaceholder: "Trend və ya məhsul axtar...",
    trendsActive: (n) => `${n} Trend Aktiv`,
    createAd: "Reklam Yarat",
    quickStats: "Göstəricilər",
    totalTrends: "CƏMİ TRENDLƏR",
    totalViews: "TOPLAM BAXIŞ",
    avgCtr: "ORTA CTR",
    adsGenerated: "HAZIR REKLAMLAR",
    thanYesterday: "dünənə nisbətən",
    viralVelocity: "viral sürət",
    vsIndustry: "bazar ortalaması (1.2%)",
    readyToPost: "paylaşıma hazır",
    velocityTitle: "Viral Baxış və Keçid Nisbəti",
    velocitySubtitle: "4 platforma üzrə gündəlik izləyici dinamikası",
    platformShare: "Platforma Üzrə Paylanma",
    platformShareSub: "Aktiv video formatlarının mənbəyi",
    featuredIntegration: "Tövsiyə Olunan Trend & Məhsul",
    featuredSub: "Günün ən yüksək saxlayıcı qarmağı ilə birbaşa əlaqələndirmə",
    launchStudio: "Studio-da Aç",
    exploreAll: (n) => `Bütün ${n} Trendə Bax ↗`,
    trendsTitle: "Gündəlik Viral Trendlər",
    trendsSubtitle: "TikTok, Reels, X və Reddit üzrə analiz olunmuş ən yüksək saxlayıcı qarmaqlar",
    allPlatforms: "Bütün Platformalar",
    viralScore: "Virallıq Balı",
    views: "Baxış",
    growth: "Artım",
    format: "Format",
    hookLabel: "3s Qarmaq (Hook):",
    createAdTrend: "Bu Trendlə Reklam Yarat",
    productsTitle: "Məhsul Kataloqu",
    productsSubtitle: "Trend videolarla inteqrasiya üçün məhsul seçin və ya əlavə edin",
    addProduct: "+ Məhsul Əlavə Et",
    selectedForAd: "Seçilib ⚡",
    createAdProduct: "Reklamını Yarat",
    activePair: "Aktiv Trend və Məhsul Cütlüyü",
    adFormat: "Reklam Formatı",
    videoMode: "9:16 Video",
    imageMode: "Şəkil Reklamı",
    storyLayout: "9:16 Story",
    feedLayout: "1:1 Feed Post",
    nativeLayout: "X / Reddit Post",
    aiScriptTitle: "Reklam Ssenarisi və Qarmaq",
    copyScript: "Ssenarini Kopyala",
    hook3s: "0-3s Qarmaq (Hook)",
    revealBody: "3-12s Problem və Məhsul Təqdimatı",
    ctaText: "12-15s Hərəkətə Çağırış (CTA)",
    predictedCtr: "Gözlənilən CTR",
    viralityIndex: "Virallıq İndeksi",
    retention3s: "3s Saxlama",
    downloadVideo: "Videonu Yüklə (WebM)",
    downloadImage: "Şəkli Yüklə (PNG)",
    saveCampaign: "Kampaniyanı Saxla",
    play: "Başlat",
    pause: "Dayandır",
    restart: "Yenidən",
    sound: "Səs",
    modalTitle: "Yeni Məhsul Əlavə Et",
    productName: "Məhsulun Adı *",
    price: "Qiymət (AZN) *",
    oldPrice: "Köhnə Qiymət (istəyə görə)",
    category: "Kateqoriya",
    sellingPoints: "Əsas Üstünlüklər (hər sətirə bir üstünlük)",
    saveProductBtn: "Məhsulu Yadda Saxla",
    campaignsTitle: "Yadda Saxlanılan Reklamlar",
    campaignsSubtitle: "Əvvəl hazırladığınız reklam kombinasiyaları",
    noCampaigns: "Hələ heç bir reklam saxlanılmayıb.",
    noCampaignsSub: "Reklam Studio bölməsində 'Kampaniyanı Saxla' düyməsinə klikləyərək burada toplaya bilərsiniz.",
    openInStudio: "Studio-da Aç",
    delete: "Sil",
    copiedToast: "Ssenari panoya kopyalandı! 📋",
    savedToast: "Kampaniya uğurla saxlanıldı! 💾",
    productAddedToast: "Yeni məhsul uğurla əlavə edildi! 🎉",
    videoExportToast: "Viral 9:16 video uğurla yükləndi! 🎥",
    imageExportToast: "Reklam şəkli (PNG) uğurla yükləndi! 📸"
  },
  en: {
    brandSubtitle: "Trend-to-Ad Engine",
    dashboard: "Dashboard",
    dailyTrends: "Daily Trends",
    products: "Products",
    adStudio: "Ad Studio",
    savedCampaigns: "Saved",
    settings: "Settings",
    searchPlaceholder: "Search trends, products...",
    trendsActive: (n) => `${n} Trends Active`,
    createAd: "Create Ad",
    quickStats: "Metrics",
    totalTrends: "TOTAL TRENDS",
    totalViews: "TOTAL VIEWS",
    avgCtr: "AVG. CTR",
    adsGenerated: "ADS GENERATED",
    thanYesterday: "than yesterday",
    viralVelocity: "viral velocity",
    vsIndustry: "vs industry (1.2%)",
    readyToPost: "ready to post",
    velocityTitle: "Viral Velocity & Conversion",
    velocitySubtitle: "Daily audience engagement dynamics across 4 networks",
    platformShare: "Platform Share",
    platformShareSub: "Distribution of viral video formats",
    featuredIntegration: "Featured Trend & Product Match",
    featuredSub: "Direct pairing of high-retention hooks with your inventory",
    launchStudio: "Launch in Studio",
    exploreAll: (n) => `Explore All ${n} Trends ↗`,
    trendsTitle: "Daily Viral Trends Radar",
    trendsSubtitle: "Clustered from high-retention video formats across social platforms",
    allPlatforms: "All Platforms",
    viralScore: "Virality Score",
    views: "Views",
    growth: "Growth",
    format: "Format",
    hookLabel: "3s Viral Hook:",
    createAdTrend: "Create Ad with Trend",
    productsTitle: "Product Catalog",
    productsSubtitle: "Select or add an item to integrate with daily viral trends",
    addProduct: "+ Add Product",
    selectedForAd: "Selected ⚡",
    createAdProduct: "Create Ad for Product",
    activePair: "Active Trend & Product Match",
    adFormat: "Ad Format",
    videoMode: "9:16 Video",
    imageMode: "Image Ad",
    storyLayout: "9:16 Story",
    feedLayout: "1:1 Feed Post",
    nativeLayout: "X / Reddit Post",
    aiScriptTitle: "Viral Script & Hooks",
    copyScript: "Copy Script",
    hook3s: "0-3s Hook",
    revealBody: "3-12s Problem & Product Reveal",
    ctaText: "12-15s Call-To-Action (CTA)",
    predictedCtr: "Predicted CTR",
    viralityIndex: "Virality Index",
    retention3s: "3s Retention",
    downloadVideo: "Download Video (WebM)",
    downloadImage: "Download Image (PNG)",
    saveCampaign: "Save Campaign",
    play: "Play",
    pause: "Pause",
    restart: "Restart",
    sound: "Sound",
    modalTitle: "Add New Product",
    productName: "Product Name *",
    price: "Price (AZN) *",
    oldPrice: "Old Price (optional)",
    category: "Category",
    sellingPoints: "Key Selling Points (1 per line)",
    saveProductBtn: "Save Product",
    campaignsTitle: "Saved Campaigns",
    campaignsSubtitle: "Revisit and re-export previous ad combinations",
    noCampaigns: "No saved campaigns yet.",
    noCampaignsSub: "Go to Ad Studio and click 'Save Campaign' to archive your favorites here.",
    openInStudio: "Open in Studio",
    delete: "Delete",
    copiedToast: "Script copied to clipboard! 📋",
    savedToast: "Campaign saved successfully! 💾",
    productAddedToast: "New product added! 🎉",
    videoExportToast: "Viral 9:16 video downloaded! 🎥",
    imageExportToast: "Ad image (PNG) downloaded! 📸"
  }
};

// --- MINIMAL LUCIDE SVG ICONS ---
const IconDashboard = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const IconTrending = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
  </svg>
);

const IconProducts = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconVideo = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" />
  </svg>
);

const IconBookmark = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const IconSearch = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const IconSun = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const IconMoon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const IconPlay = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconPause = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const IconRotate = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
  </svg>
);

const IconVolume2 = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const IconVolumeX = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" />
  </svg>
);

const IconDownload = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const IconCopy = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const IconX = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

// --- MAIN APPLICATION ---
function App() {
  // Language State: 'az' | 'en'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("shoppulse_lang") || "az";
  });

  const t = useMemo(() => I18N[lang] || I18N.az, [lang]);

  const toggleLang = (target) => {
    setLang(target);
    localStorage.setItem("shoppulse_lang", target);
  };

  // Theme State: 'light' | 'dark' (Default to crisp light mode)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("shoppulse_theme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("shoppulse_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Trend & Product State
  const [selectedTrendId, setSelectedTrendId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("prod-01");

  // Media Mode
  const [mediaMode, setMediaMode] = useState("video");
  const [imageFormat, setImageFormat] = useState("story");

  // Custom Products & Saved Campaigns
  const [customProducts, setCustomProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("shoppulse_products");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [savedCampaigns, setSavedCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem("shoppulse_campaigns");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Modal & Toast States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportPct, setExportPct] = useState(0);
  const [toast, setToast] = useState(null);

  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00 / 00:15");

  // --- BACKEND API STATE ---
  // Auto-detect & normalize: window.SHOPPULSE_API_URL or localhost/origin fallback
  const API_BASE = useMemo(() => {
    let base = window.SHOPPULSE_API_URL;
    if (!base) {
      base = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api'
        : `${window.location.origin}/api`;
    }
    base = base.trim().replace(/\/+$/, '');
    if (!base.endsWith('/api')) {
      base += '/api';
    }
    return base;
  }, []);

  const [apiTrends, setApiTrends] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineSummary, setPipelineSummary] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // showToast must be defined BEFORE any async handlers that call it
  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 4000);
  };

  // Map backend trend record -> frontend trend shape
  const mapApiTrend = (r) => {
    const platformIconMap = { tiktok: '🎵', instagram: '📸', x: '🐦', reddit: '👽' };
    const platformNameMap = { tiktok: 'TikTok', instagram: 'Instagram Reels', x: 'X (Twitter)', reddit: 'Reddit' };
    return {
      id: r.post_id,
      platform: r.platform,
      platformName: platformNameMap[r.platform] || r.platform,
      platformIcon: platformIconMap[r.platform] || '📱',
      title: r.trend_title,
      title_en: r.trend_title,
      trendCategory: r.target_category,
      trendCategory_en: r.target_category,
      viralScore: r.virality_score,
      views: r.views >= 1000000 ? (r.views / 1000000).toFixed(1) + 'M' : (r.views / 1000).toFixed(0) + 'K',
      viewsRaw: r.views,
      growth: r.growth_rate,
      hookText: r.script_hook,
      hookText_en: r.script_hook,
      description: r.script_body,
      description_en: r.script_body,
      hashtags: r.hashtags || [],
      soundName: r.sound_name || 'Trending Sound',
      soundGenre: 'phonk',
      caption: r.caption,
      transcript: r.raw_transcript,
      scriptTemplate: {
        hook: r.script_hook,
        body: r.script_body,
        cta: r.script_cta,
        whyItWorks: r.why_it_works,
      },
      scriptTemplate_en: {
        hook: r.script_hook,
        body: r.script_body,
        cta: r.script_cta,
        whyItWorks: r.why_it_works,
      },
      postTimestamp: r.post_timestamp,
      // Keep format field for video engine
      format: r.platform === 'tiktok' ? 'Before/After Reveal' :
              r.platform === 'instagram' ? 'GRWM Routine' :
              r.platform === 'x' ? 'Thread Hook' : 'Long-form Review',
      likeCount: r.likes,
      shareCount: r.shares,
      isFromApi: true,
    };
  };

  // Fetch trends from the backend API
  const fetchApiTrends = async (showLoading = true) => {
    if (showLoading) setApiLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}/trends?limit=50&sortBy=virality_score&sortOrder=desc`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        setApiTrends(json.data.map(mapApiTrend));
        setBackendOnline(true);
        if (json.data.length > 0 && !selectedTrendId) {
          setSelectedTrendId(json.data[0].post_id);
        }
      }
    } catch (err) {
      setApiError(err.message);
      setBackendOnline(false);
      // Fallback: auto-select first static trend
      if (!selectedTrendId) setSelectedTrendId(TREND_DATA[0].id);
    } finally {
      setApiLoading(false);
    }
  };

  // Run the full Apify → Whisper → GPT-4o pipeline
  const handleRunPipeline = async () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setPipelineSummary(null);
    showToast('🚀 Pipeline started — this may take a few minutes...');
    try {
      const res = await fetch(`${API_BASE}/pipeline/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxPosts: 10, minViews: 10000 }),
      });
      const json = await res.json();
      if (json.success) {
        setPipelineSummary(json.summary);
        showToast(`✅ Pipeline complete — ${json.summary.recordsSaved} new trends saved!`);
        fetchApiTrends(false);
      } else {
        showToast(`❌ Pipeline failed: ${json.message}`);
      }
    } catch (err) {
      showToast(`❌ Pipeline error: ${err.message}`);
    } finally {
      setPipelineRunning(false);
    }
  };

  // Seed demo data
  const handleSeedDemo = async () => {
    showToast('🌱 Seeding demo trends...');
    try {
      const res = await fetch(`${API_BASE}/trends/seed`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast(`✅ ${json.message}`);
        fetchApiTrends(false);
      }
    } catch (err) {
      showToast(`❌ Seed error: ${err.message}`);
    }
  };

  // Load API trends on mount
  useEffect(() => {
    fetchApiTrends();
  }, []);

  // References
  const videoEngineRef = useRef(null);
  const imageEngineRef = useRef(null);
  const videoCanvasRef = useRef(null);
  const imageCanvasRef = useRef(null);


  // Product List
  const allProducts = useMemo(() => {
    return [...PRESET_PRODUCTS, ...customProducts];
  }, [customProducts]);

  // Combined trend data: API trends take priority, fallback to static
  const allTrends = useMemo(() => {
    return apiTrends.length > 0 ? apiTrends : TREND_DATA;
  }, [apiTrends]);

  const selectedTrend = useMemo(() => {
    return allTrends.find(t => t.id === selectedTrendId) || allTrends[0];
  }, [allTrends, selectedTrendId]);

  const selectedProduct = useMemo(() => {
    return allProducts.find(p => p.id === selectedProductId) || allProducts[0];
  }, [allProducts, selectedProductId]);

  // Canvas Engines Init
  useEffect(() => {
    if (videoCanvasRef.current && !videoEngineRef.current) {
      videoEngineRef.current = new window.VideoAdEngine("adVideoCanvas");
      videoEngineRef.current.onProgressUpdate = (cur, dur) => {
        setVideoProgress((cur / dur) * 100);
        const curSec = Math.floor(cur).toString().padStart(2, "0");
        const durSec = Math.floor(dur).toString().padStart(2, "0");
        setCurrentTimeStr(`00:${curSec} / 00:${durSec}`);
      };
      videoEngineRef.current.onEnded = () => setIsPlaying(false);
    }
    if (imageCanvasRef.current && !imageEngineRef.current) {
      imageEngineRef.current = new window.ImageAdEngine("adImageCanvas");
    }
  }, [activeTab]);

  useEffect(() => {
    if (videoEngineRef.current && selectedProduct && selectedTrend) {
      videoEngineRef.current.loadData(selectedProduct, selectedTrend);
    }
    if (imageEngineRef.current && selectedProduct && selectedTrend) {
      imageEngineRef.current.loadData(selectedProduct, selectedTrend, imageFormat);
    }
    if (window.trendAudio && selectedTrend) {
      window.trendAudio.setGenre(selectedTrend.soundGenre || "phonk");
    }
  }, [selectedProduct, selectedTrend, imageFormat, activeTab]);

  // Video Controls
  const togglePlay = () => {
    if (!videoEngineRef.current) return;
    if (isPlaying) {
      videoEngineRef.current.pause();
      setIsPlaying(false);
    } else {
      videoEngineRef.current.play();
      setIsPlaying(true);
    }
  };

  const restartVideo = () => {
    if (!videoEngineRef.current) return;
    videoEngineRef.current.restart();
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (window.trendAudio) {
      const muted = window.trendAudio.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setVideoProgress(val);
    if (videoEngineRef.current) {
      videoEngineRef.current.seek((val / 100) * videoEngineRef.current.duration);
    }
  };

  // WebM Video Export
  const handleExportVideo = () => {
    if (!videoEngineRef.current) return;
    setIsExporting(true);
    setExportPct(0);
    videoEngineRef.current.exportVideo(
      (pct) => setExportPct(pct),
      () => {
        setIsExporting(false);
        showToast(t.videoExportToast);
      },
      () => setIsExporting(false)
    );
  };

  // Image Export
  const handleExportImage = () => {
    if (!imageEngineRef.current) return;
    imageEngineRef.current.downloadImage();
    showToast(t.imageExportToast);
  };

  // Copy Script
  const handleCopyScript = () => {
    const pName = lang === "en" ? (selectedProduct.name_en || selectedProduct.name) : selectedProduct.name;
    const f1 = lang === "en" ? (selectedProduct.features_en?.[0] || "premium build") : (selectedProduct.features[0] || "keyfiyyətli");
    const tmpl = lang === "en" ? (selectedTrend.scriptTemplate_en || selectedTrend.scriptTemplate) : selectedTrend.scriptTemplate;
    const body = tmpl.body.replace("{product_name}", pName).replace("{feature_1}", f1);
    const full = `[${t.aiScriptTitle.toUpperCase()}]\n\n🎯 ${t.hook3s}:\n"${tmpl.hook}"\n\n🎬 ${t.revealBody}:\n${body}\n\n⚡ ${t.ctaText}:\n${tmpl.cta}\n\n#ShopPulse #${selectedTrend.platformName}`;
    navigator.clipboard.writeText(full).then(() => showToast(t.copiedToast));
  };

  // Save Campaign
  const handleSaveCampaign = () => {
    const item = {
      id: "camp-" + Date.now(),
      date: new Date().toLocaleDateString(lang === "az" ? "az-AZ" : "en-US"),
      trendId: selectedTrend.id,
      trendTitle: lang === "en" ? (selectedTrend.title_en || selectedTrend.title) : selectedTrend.title,
      platformName: selectedTrend.platformName,
      platformIcon: selectedTrend.platformIcon,
      productId: selectedProduct.id,
      productName: lang === "en" ? (selectedProduct.name_en || selectedProduct.name) : selectedProduct.name,
      productImg: selectedProduct.image,
      productPrice: selectedProduct.price,
      mediaType: mediaMode,
      viralScore: selectedTrend.viralScore
    };
    const updated = [item, ...savedCampaigns];
    setSavedCampaigns(updated);
    localStorage.setItem("shoppulse_campaigns", JSON.stringify(updated));
    showToast(t.savedToast);
  };

  // Filtered Trends — uses live API data when available, falls back to static
  const filteredTrends = useMemo(() => {
    return allTrends.filter(tr => {
      const matchP = selectedPlatform === "all" || tr.platform === selectedPlatform;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchP;
      const title = (lang === "en" ? tr.title_en : tr.title) || tr.title || "";
      const hook = (lang === "en" ? tr.hookText_en : tr.hookText) || tr.hookText || "";
      return matchP && (title.toLowerCase().includes(q) || hook.toLowerCase().includes(q));
    });
  }, [allTrends, selectedPlatform, searchQuery, lang]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex font-sans antialiased">
      
      {/* ======================================================================
          FIXED LEFT SIDEBAR (Ultra-Minimalist, Pure Utility, No Banners)
          ====================================================================== */}
      <aside className="w-60 border-r border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col justify-between p-4 shrink-0 select-none">
        <div>
          {/* Clean Brand Mark */}
          <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#84CC16] text-slate-900 flex items-center justify-center font-black text-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-[#0F172A] dark:text-white leading-none">
                ShopPulse
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                {t.brandSubtitle}
              </span>
            </div>
          </div>

          {/* Navigation Links with Clean Lime Pill Active State */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: t.dashboard, icon: <IconDashboard /> },
              { id: "trends", label: t.dailyTrends, icon: <IconTrending />, badge: allTrends.length },
              { id: "products", label: t.products, icon: <IconProducts /> },
              { id: "studio", label: t.adStudio, icon: <IconVideo /> },
              { id: "campaigns", label: t.savedCampaigns, icon: <IconBookmark /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item.id
                    ? "bg-[#84CC16] text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                    activeTab === item.id ? "bg-slate-900/10 text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Utility: Language Switcher, Theme & Settings (NO UPGRADE BANNERS) */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-800 space-y-3">
          
          {/* Language Switcher Pill */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dil / Lang</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => toggleLang("az")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  lang === "az" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                AZ
              </button>
              <button
                onClick={() => toggleLang("en")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  lang === "en" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Theme & Settings Row */}
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {theme === "light" ? "Light Mode" : "Dark Mode"}
            </span>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              title="Toggle Theme"
            >
              {theme === "light" ? <IconMoon className="w-3.5 h-3.5" /> : <IconSun className="w-3.5 h-3.5 text-[#84CC16]" />}
            </button>
          </div>

        </div>
      </aside>

      {/* ======================================================================
          MAIN CONTAINER AREA
          ====================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md px-8 py-3.5 border-b border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between gap-4">
          
          {/* Integrated Search Input with ⌘K */}
          <div className="relative w-80">
            <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#FAFAFA] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700 rounded-lg pl-9 pr-10 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#84CC16]"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 px-1 py-0.2 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </span>
          </div>

          {/* Right Header Status & Action */}
          <div className="flex items-center gap-3">
            
            {/* Live Backend Status Indicator */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 border rounded-lg text-xs font-semibold transition ${
              backendOnline
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : "bg-[#FAFAFA] dark:bg-slate-800 border-[#E5E7EB] dark:border-slate-700 text-slate-500 dark:text-slate-400"
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{backendOnline ? t.trendsActive(apiTrends.length) : apiLoading ? 'Connecting...' : t.trendsActive(allTrends.length)}</span>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setActiveTab("studio")}
              className="bg-[#84CC16] text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg hover:brightness-105 transition"
            >
              {t.createAd}
            </button>

            {/* Profile Avatar */}
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              R
            </div>

          </div>
        </header>

        {/* ======================================================================
            TAB 1: DASHBOARD (Overview - Clean Bento Grid)
            ====================================================================== */}
        {activeTab === "dashboard" && (
          <main className="p-8 space-y-6 max-w-6xl mx-auto w-full">
            
            {/* Top 4 Metric Cards - Dynamic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: t.totalTrends,
                  val: apiTrends.length > 0 ? apiTrends.length.toString() : "8",
                  note: backendOnline ? `Live from backend` : `Demo data`,
                  dot: "bg-[#84CC16]"
                },
                {
                  label: t.totalViews,
                  val: apiTrends.length > 0
                    ? (apiTrends.reduce((s, tr) => s + (tr.viewsRaw || 0), 0) / 1000000).toFixed(1) + 'M'
                    : "64.8M",
                  note: `+410% ${t.viralVelocity}`,
                  dot: "bg-cyan-500"
                },
                { label: t.avgCtr, val: "4.8%", note: `+2.5% ${t.vsIndustry}`, dot: "bg-pink-500" },
                { label: t.adsGenerated, val: "142", note: `15s ${t.readyToPost}`, dot: "bg-purple-500" }
              ].map((m, i) => (
                <div key={i} className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`}></span>
                    {m.label}
                  </div>
                  <div className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">{m.val}</div>
                  <div className="text-[11px] font-semibold text-emerald-600 mt-1">{m.note}</div>
                </div>
              ))}
            </div>

            {/* Middle Row: Bento Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Bar Chart (7 cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-6 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white">{t.velocityTitle}</h3>
                    <p className="text-xs text-slate-400">{t.velocitySubtitle}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#84CC16]"></span>
                      <span className="text-slate-600 dark:text-slate-300">Peak</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 dark:bg-slate-200"></span>
                      <span className="text-slate-600 dark:text-slate-300">Conversion</span>
                    </div>
                  </div>
                </div>

                {/* SVG Bar Chart */}
                <div className="h-48 w-full flex items-end justify-between px-2 pt-6 border-b border-slate-100 dark:border-slate-800 relative">
                  {/* Tooltip on Sep */}
                  <div className="absolute top-1 left-[58%] -translate-x-1/2 bg-slate-900 text-white px-2.5 py-1 rounded text-[10px] font-bold shadow">
                    14.8M Views • 4.8% CTR
                  </div>

                  {[
                    { m: "Jun", h1: 45, h2: 30, active: false },
                    { m: "Jul", h1: 65, h2: 40, active: false },
                    { m: "Aug", h1: 80, h2: 50, active: false },
                    { m: "Sep", h1: 96, h2: 78, active: true },
                    { m: "Oct", h1: 58, h2: 35, active: false },
                    { m: "Nov", h1: 72, h2: 48, active: false },
                    { m: "Dec", h1: 88, h2: 60, active: false }
                  ].map((b, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                      <div className="flex items-end gap-1.5 h-full">
                        <div style={{ height: `${b.h1}%` }} className={`w-3.5 sm:w-4 rounded-t-sm ${b.active ? "bg-[#84CC16]" : "bg-slate-200 dark:bg-slate-700"}`}></div>
                        <div style={{ height: `${b.h2}%` }} className={`w-3.5 sm:w-4 rounded-t-sm ${b.active ? "bg-slate-900 dark:bg-white" : "bg-slate-300 dark:bg-slate-600"}`}></div>
                      </div>
                      <span className={`text-[10px] font-semibold ${b.active ? "font-bold text-[#0F172A] dark:text-white" : "text-slate-400"}`}>
                        {b.m}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Donut Chart (5 cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                <div className="mb-2">
                  <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white">{t.platformShare}</h3>
                  <p className="text-xs text-slate-400">{t.platformShareSub}</p>
                </div>

                <div className="flex items-center justify-between gap-4 my-auto">
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                      <circle cx="50" cy="50" r="38" stroke="#84CC16" strokeWidth="14" fill="transparent" strokeDasharray="238.7" strokeDashoffset="138" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="38" stroke="#0F172A" strokeWidth="14" fill="transparent" strokeDasharray="238.7" strokeDashoffset="165" strokeLinecap="round" className="dark:stroke-white" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-black text-[#0F172A] dark:text-white">42%</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">TikTok</span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 text-xs font-semibold">
                    {[
                      { name: "TikTok", pct: "42%", dot: "bg-[#84CC16]" },
                      { name: "Instagram Reels", pct: "31%", dot: "bg-slate-900 dark:bg-white" },
                      { name: "X (Twitter)", pct: "18%", dot: "bg-sky-400" },
                      { name: "Reddit", pct: "9%", dot: "bg-orange-500" }
                    ].map(item => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-xs ${item.dot}`}></span>
                          <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className="font-bold text-[#0F172A] dark:text-white">{item.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("trends")}
                  className="w-full text-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition mt-3"
                >
                  {t.exploreAll(allTrends.length)}
                </button>
              </div>

            </div>

            {/* Bottom Row: Featured Integration */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-6 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white">{t.featuredIntegration}</h3>
                  <p className="text-xs text-slate-400">{t.featuredSub}</p>
                </div>
                <button
                  onClick={() => setActiveTab("studio")}
                  className="bg-[#84CC16] text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg hover:brightness-105 transition"
                >
                  {t.launchStudio}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="text-xl p-2 bg-white dark:bg-slate-800 rounded-lg">{selectedTrend.platformIcon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white">{selectedTrend.platformName}</span>
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-[#84CC16] text-slate-900">
                        ⚡ {selectedTrend.viralScore}/100
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                      {lang === "en" ? (selectedTrend.title_en || selectedTrend.title) : selectedTrend.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                      "{lang === "en" ? (selectedTrend.hookText_en || selectedTrend.hookText) : selectedTrend.hookText}"
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {lang === "en" ? (selectedProduct.category_en || selectedProduct.category) : selectedProduct.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                      {lang === "en" ? (selectedProduct.name_en || selectedProduct.name) : selectedProduct.name}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-[#84CC16]">
                      {selectedProduct.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </main>
        )}

        {/* ======================================================================
            TAB 2: DAILY TRENDS
            ====================================================================== */}
        {activeTab === "trends" && (
          <main className="p-8 space-y-6 max-w-6xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white">{t.trendsTitle}</h2>
                <p className="text-xs text-slate-400">
                  {backendOnline
                    ? `${apiTrends.length} live trends from backend API · ${t.trendsSubtitle}`
                    : t.trendsSubtitle
                  }
                </p>
              </div>

              {/* Platform Filter Buttons */}
              <div className="flex items-center gap-1 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-1 rounded-xl shadow-xs">
                {[
                  { id: "all", label: t.allPlatforms },
                  { id: "tiktok", label: "🎵 TikTok" },
                  { id: "instagram", label: "📸 Reels" },
                  { id: "x", label: "🐦 X" },
                  { id: "reddit", label: "👽 Reddit" }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(p.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedPlatform === p.id
                        ? "bg-[#84CC16] text-slate-900"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline Controls Bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-xl">
              {/* Status */}
              <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                backendOnline
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
                {backendOnline ? `Backend Online · ${apiTrends.length} trends cached` : apiLoading ? 'Connecting to backend...' : 'Backend Offline (using demo data)'}
              </div>

              <div className="flex-1"></div>

              {/* Seed Demo Button */}
              {backendOnline && apiTrends.length === 0 && (
                <button
                  onClick={handleSeedDemo}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  🌱 Load Demo Data
                </button>
              )}

              {/* Refresh Button */}
              <button
                onClick={() => fetchApiTrends()}
                disabled={apiLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 transition disabled:opacity-50"
              >
                {apiLoading ? (
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                ) : (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                  </svg>
                )}
                Refresh
              </button>

              {/* Run Full Pipeline Button */}
              <button
                onClick={handleRunPipeline}
                disabled={pipelineRunning || !backendOnline}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                  pipelineRunning
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-[#0F172A] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                }`}
                title={!backendOnline ? 'Backend must be online to run pipeline' : 'Requires Apify + OpenAI API keys'}
              >
                {pipelineRunning ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Running Pipeline...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Run AI Pipeline
                  </>
                )}
              </button>
            </div>

            {/* Pipeline Summary (shown after pipeline run) */}
            {pipelineSummary && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex flex-wrap gap-4">
                <span>✅ Pipeline Complete</span>
                <span>📥 Fetched: {pipelineSummary.rawPostsFetched}</span>
                <span>🎙️ Transcribed: {pipelineSummary.postsTranscribed}</span>
                <span>🧠 Analyzed: {pipelineSummary.trendsAnalyzed}</span>
                <span>💾 Saved: {pipelineSummary.recordsSaved}</span>
                {pipelineSummary.errorsCount > 0 && <span>⚠️ Errors: {pipelineSummary.errorsCount}</span>}
              </div>
            )}


            {/* Flat Bento Trend Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrends.map(tr => {
                const isSelected = tr.id === selectedTrendId;
                const title = lang === "en" ? (tr.title_en || tr.title) : tr.title;
                const hook = lang === "en" ? (tr.hookText_en || tr.hookText) : tr.hookText;
                const desc = lang === "en" ? (tr.description_en || tr.description) : tr.description;
                const category = lang === "en" ? (tr.trendCategory_en || tr.trendCategory) : tr.trendCategory;

                return (
                  <div
                    key={tr.id}
                    onClick={() => setSelectedTrendId(tr.id)}
                    className={`bg-white dark:bg-[#111827] border rounded-2xl p-5 shadow-xs transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-[#84CC16] ring-1 ring-[#84CC16]"
                        : "border-[#E5E7EB] dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {tr.platformIcon} {tr.platformName}
                          </span>
                          {tr.isFromApi && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                              Live
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-[#84CC16] text-slate-900">
                          ⚡ {tr.viralScore}/100
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white leading-snug mb-2">
                        {title}
                      </h3>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-2.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">{t.hookLabel}</span>
                        <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 italic">
                          "{hook}"
                        </p>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {desc}
                      </p>

                      <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-center text-[10px] mb-4">
                        <div>
                          <span className="text-slate-400 block">{t.views}</span>
                          <span className="font-bold text-slate-800 dark:text-white">{tr.views}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">{t.growth}</span>
                          <span className="font-bold text-emerald-600">{tr.growth}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">{t.format}</span>
                          <span className="font-bold text-slate-800 dark:text-white">{category}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrendId(tr.id);
                        setActiveTab("studio");
                      }}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs py-2 rounded-lg hover:bg-[#84CC16] hover:text-slate-900 transition"
                    >
                      {t.createAdTrend}
                    </button>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* ======================================================================
            TAB 3: PRODUCTS
            ====================================================================== */}
        {activeTab === "products" && (
          <main className="p-8 space-y-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white">{t.productsTitle}</h2>
                <p className="text-xs text-slate-400">{t.productsSubtitle}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#84CC16] text-slate-900 font-bold text-xs px-3.5 py-2 rounded-lg hover:brightness-105 transition"
              >
                {t.addProduct}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {allProducts.map(p => {
                const isSelected = p.id === selectedProductId;
                const name = lang === "en" ? (p.name_en || p.name) : p.name;
                const cat = lang === "en" ? (p.category_en || p.category) : p.category;
                const feats = lang === "en" ? (p.features_en || p.features) : p.features;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`bg-white dark:bg-[#111827] border rounded-2xl overflow-hidden shadow-xs transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-[#84CC16] ring-1 ring-[#84CC16]"
                        : "border-[#E5E7EB] dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <img src={p.image} alt={name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white px-2 py-0.5 rounded">
                          {cat}
                        </span>
                        {p.discount && (
                          <span className="absolute top-2 right-2 text-[10px] font-black bg-[#84CC16] text-slate-900 px-1.5 py-0.2 rounded">
                            -%{p.discount}
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-extrabold text-xs text-[#0F172A] dark:text-white mb-1 leading-snug">
                          {name}
                        </h3>

                        <div className="flex items-baseline gap-1.5 mb-2.5">
                          <span className="text-sm font-extrabold text-emerald-600 dark:text-[#84CC16]">{p.price}</span>
                          {p.oldPrice && <span className="text-xs text-slate-400 line-through">{p.oldPrice}</span>}
                        </div>

                        <ul className="space-y-1 mb-3">
                          {feats.slice(0, 3).map((f, i) => (
                            <li key={i} className="text-[10px] text-slate-500 flex items-center gap-1.5">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductId(p.id);
                          setActiveTab("studio");
                        }}
                        className={`w-full font-bold text-xs py-2 rounded-lg transition ${
                          isSelected
                            ? "bg-[#84CC16] text-slate-900"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#84CC16] hover:text-slate-900"
                        }`}
                      >
                        {isSelected ? t.selectedForAd : t.createAdProduct}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* ======================================================================
            TAB 4: AD STUDIO (Split-Screen Modern Bento Layout)
            ====================================================================== */}
        {activeTab === "studio" && (
          <main className="p-8 space-y-6 max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Controls & AI Copywriter (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Active Match Bar */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">{t.activePair}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                      <span className="text-lg">{selectedTrend.platformIcon}</span>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 block">{selectedTrend.platformName}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white truncate block">
                          {lang === "en" ? (selectedTrend.title_en || selectedTrend.title) : selectedTrend.title}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-7 h-7 rounded object-cover" />
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 block">{selectedProduct.category}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white truncate block">
                          {lang === "en" ? (selectedProduct.name_en || selectedProduct.name) : selectedProduct.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mode Selector & Format */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.adFormat}</span>
                    <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <button
                        onClick={() => setMediaMode("video")}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                          mediaMode === "video" ? "bg-[#84CC16] text-slate-900" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {t.videoMode}
                      </button>
                      <button
                        onClick={() => {
                          setMediaMode("image");
                          if (imageEngineRef.current) imageEngineRef.current.render();
                        }}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                          mediaMode === "image" ? "bg-[#84CC16] text-slate-900" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {t.imageMode}
                      </button>
                    </div>
                  </div>

                  {mediaMode === "image" && (
                    <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl mb-3">
                      {[
                        { id: "story", label: t.storyLayout },
                        { id: "feed", label: t.feedLayout },
                        { id: "native", label: t.nativeLayout }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setImageFormat(f.id);
                            if (imageEngineRef.current) imageEngineRef.current.setFormat(f.id);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                            imageFormat === f.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-500"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* AI Script Box */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.aiScriptTitle}</span>
                      <button
                        onClick={handleCopyScript}
                        className="text-xs font-bold text-emerald-600 dark:text-[#84CC16] hover:underline flex items-center gap-1"
                      >
                        <IconCopy className="w-3.5 h-3.5" />
                        <span>{t.copyScript}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
                      <div>
                        <span className="text-[9px] font-bold text-cyan-600 uppercase block mb-0.5">{t.hook3s}</span>
                        <p className="font-bold text-slate-800 dark:text-slate-100">
                          "{lang === "en" ? (selectedTrend.scriptTemplate_en?.hook || selectedTrend.scriptTemplate.hook) : selectedTrend.scriptTemplate.hook}"
                        </p>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">{t.revealBody}</span>
                        <p className="text-slate-600 dark:text-slate-300">
                          {(() => {
                            const pName = lang === "en" ? (selectedProduct.name_en || selectedProduct.name) : selectedProduct.name;
                            const f1 = lang === "en" ? (selectedProduct.features_en?.[0] || "premium build") : (selectedProduct.features[0] || "keyfiyyətli");
                            const tmpl = lang === "en" ? (selectedTrend.scriptTemplate_en || selectedTrend.scriptTemplate) : selectedTrend.scriptTemplate;
                            return tmpl.body.replace("{product_name}", pName).replace("{feature_1}", f1);
                          })()}
                        </p>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase block mb-0.5">{t.ctaText}</span>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          {lang === "en" ? (selectedTrend.scriptTemplate_en?.cta || selectedTrend.scriptTemplate.cta) : selectedTrend.scriptTemplate.cta}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Performance Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-3 rounded-xl">
                    <div className="text-base font-black text-emerald-600 dark:text-[#84CC16]">4.8%</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{t.predictedCtr}</div>
                  </div>
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-3 rounded-xl">
                    <div className="text-base font-black text-cyan-500">{selectedTrend.viralScore}/100</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{t.viralityIndex}</div>
                  </div>
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-3 rounded-xl">
                    <div className="text-base font-black text-purple-500">84%</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{t.retention3s}</div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2.5 pt-1">
                  {mediaMode === "video" ? (
                    <button
                      onClick={handleExportVideo}
                      className="bg-[#84CC16] text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl hover:brightness-105 transition flex items-center gap-1.5"
                    >
                      <IconDownload className="w-3.5 h-3.5" />
                      <span>{t.downloadVideo}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleExportImage}
                      className="bg-[#84CC16] text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl hover:brightness-105 transition flex items-center gap-1.5"
                    >
                      <IconDownload className="w-3.5 h-3.5" />
                      <span>{t.downloadImage}</span>
                    </button>
                  )}

                  <button
                    onClick={handleSaveCampaign}
                    className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    {t.saveCampaign}
                  </button>
                </div>
              </div>

              {/* Right Column: Phone Mockup & Canvas Player (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                
                {/* Clean Matte Phone Frame (No gaudy glows) */}
                <div className="w-[300px] h-[540px] bg-black rounded-[38px] border-[6px] border-slate-800 shadow-xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-20"></div>

                  <div className={`w-full h-full ${mediaMode === "video" ? "block" : "hidden"}`}>
                    <canvas id="adVideoCanvas" ref={videoCanvasRef} width="720" height="1280" className="w-full h-full object-cover block"></canvas>
                  </div>

                  <div className={`w-full h-full ${mediaMode === "image" ? "block" : "hidden"}`}>
                    <canvas id="adImageCanvas" ref={imageCanvasRef} width="1080" height="1920" className="w-full h-full object-cover block"></canvas>
                  </div>
                </div>

                {/* Functional Player Controls */}
                {mediaMode === "video" && (
                  <div className="w-[300px] mt-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={videoProgress}
                        onChange={handleSeek}
                        className="w-full accent-[#84CC16] cursor-pointer h-1 bg-slate-200 dark:bg-slate-700 rounded-lg"
                      />
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{currentTimeStr}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={togglePlay}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition"
                      >
                        {isPlaying ? <IconPause className="w-3 h-3" /> : <IconPlay className="w-3 h-3" />}
                        <span>{isPlaying ? t.pause : t.play}</span>
                      </button>

                      <button onClick={restartVideo} className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition" title={t.restart}>
                        <IconRotate className="w-3.5 h-3.5" />
                      </button>

                      <button onClick={toggleMute} className={`p-1.5 transition ${isMuted ? "text-red-500" : "text-slate-500"}`} title={t.sound}>
                        {isMuted ? <IconVolumeX className="w-3.5 h-3.5" /> : <IconVolume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </main>
        )}

        {/* ======================================================================
            TAB 5: SAVED CAMPAIGNS
            ====================================================================== */}
        {activeTab === "campaigns" && (
          <main className="p-8 space-y-6 max-w-6xl mx-auto w-full">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white">{t.campaignsTitle}</h2>
              <p className="text-xs text-slate-400">{t.campaignsSubtitle}</p>
            </div>

            {savedCampaigns.length === 0 ? (
              <div className="bg-white dark:bg-[#111827] border border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-10 text-center max-w-md mx-auto">
                <div className="text-3xl mb-2">📁</div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{t.noCampaigns}</h3>
                <p className="text-xs text-slate-400 mb-3">{t.noCampaignsSub}</p>
                <button
                  onClick={() => setActiveTab("studio")}
                  className="bg-[#84CC16] text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg"
                >
                  {t.adStudio}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCampaigns.map((camp, idx) => (
                  <div key={camp.id} className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="font-bold">{camp.platformIcon} {camp.platformName}</span>
                        <span>{camp.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <img src={camp.productImg} alt={camp.productName} className="w-10 h-10 rounded-lg object-cover border" />
                        <div>
                          <h4 className="font-bold text-xs text-[#0F172A] dark:text-white">{camp.productName}</h4>
                          <span className="text-xs font-bold text-emerald-600">{camp.productPrice}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic mb-3">"{camp.trendTitle}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTrendId(camp.trendId);
                          setSelectedProductId(camp.productId);
                          setActiveTab("studio");
                        }}
                        className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs py-1.5 rounded-lg text-center"
                      >
                        {t.openInStudio}
                      </button>
                      <button
                        onClick={() => {
                          const updated = savedCampaigns.filter((_, i) => i !== idx);
                          setSavedCampaigns(updated);
                          localStorage.setItem("shoppulse_campaigns", JSON.stringify(updated));
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                        title={t.delete}
                      >
                        <IconX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

      </div>

      {/* ======================================================================
          MODAL: ADD PRODUCT
          ====================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 w-full max-w-sm rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white">{t.modalTitle}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const name = form.prodName.value.trim();
                const price = form.prodPrice.value.trim();
                const oldPrice = form.prodOldPrice.value.trim();
                const category = form.prodCat.value.trim();
                const feats = form.prodFeats.value.split("\n").map(f => f.trim()).filter(Boolean);

                const newP = {
                  id: "prod-custom-" + Date.now(),
                  name,
                  category: category || "General",
                  price: price.includes("AZN") ? price : `${price} AZN`,
                  oldPrice: oldPrice ? (oldPrice.includes("AZN") ? oldPrice : `${oldPrice} AZN`) : "",
                  discount: "30%",
                  image: "assets/images/smartwatch.jpg",
                  features: feats.length > 0 ? feats : ["Premium material", "Zəmanətli", "Sürətli çatdırılma"]
                };

                const updated = [newP, ...customProducts];
                setCustomProducts(updated);
                localStorage.setItem("shoppulse_products", JSON.stringify(updated));
                setSelectedProductId(newP.id);
                setIsModalOpen(false);
                showToast(t.productAddedToast);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">{t.productName}</label>
                <input name="prodName" required placeholder="Nova Smartwatch" className="w-full bg-[#FAFAFA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#84CC16]" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">{t.price}</label>
                  <input name="prodPrice" required placeholder="49 AZN" className="w-full bg-[#FAFAFA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#84CC16]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">{t.oldPrice}</label>
                  <input name="prodOldPrice" placeholder="79 AZN" className="w-full bg-[#FAFAFA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#84CC16]" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">{t.category}</label>
                <input name="prodCat" placeholder="Texnologiya / Accessories" className="w-full bg-[#FAFAFA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#84CC16]" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">{t.sellingPoints}</label>
                <textarea name="prodFeats" rows="3" placeholder="Su keçirməz&#10;14 gün batareya" className="w-full bg-[#FAFAFA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#84CC16] resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#84CC16] text-slate-900 font-bold text-xs py-2 rounded-lg hover:brightness-105 transition mt-2">
                {t.saveProductBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          EXPORT PROGRESS MODAL
          ====================================================================== */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 w-full max-w-xs rounded-2xl p-5 text-center shadow-lg">
            <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white mb-1">Rendering 9:16 Video...</h3>
            <p className="text-xs text-slate-400 mb-3">60FPS WebM export in progress.</p>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
              <div style={{ width: `${exportPct}%` }} className="h-full bg-[#84CC16] transition-all"></div>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-white">{exportPct}%</span>
          </div>
        </div>
      )}

      {/* ======================================================================
          TOAST NOTIFICATION
          ====================================================================== */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}

// Render Root
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
