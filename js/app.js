/**
 * ShopPulse AI - Main Application Controller
 * Handles UI tabs, state, trend selection, custom product creation,
 * video/image studio coordination, and campaign storage.
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  const state = {
    activeTab: "trends", // 'trends' | 'products' | 'studio' | 'campaigns'
    selectedPlatform: "all",
    selectedTrendId: "tt-01",
    selectedProductId: "prod-01",
    mediaMode: "video", // 'video' | 'image'
    imageFormat: "story", // 'story' | 'feed' | 'native'
    customProducts: [],
    savedCampaigns: [],
    isMuted: false,
    adTone: "viral" // 'viral' | 'aesthetic' | 'problem' | 'fomo'
  };

  // Load localStorage data
  try {
    const savedCustom = localStorage.getItem("shoppulse_products");
    if (savedCustom) state.customProducts = JSON.parse(savedCustom);
    const savedCamps = localStorage.getItem("shoppulse_campaigns");
    if (savedCamps) state.savedCampaigns = JSON.parse(savedCamps);
  } catch (e) {
    console.error("Storage error:", e);
  }

  // Combine default & custom products
  function getAllProducts() {
    return [...PRESET_PRODUCTS, ...state.customProducts];
  }

  function getSelectedTrend() {
    return TREND_DATA.find(t => t.id === state.selectedTrendId) || TREND_DATA[0];
  }

  function getSelectedProduct() {
    const all = getAllProducts();
    return all.find(p => p.id === state.selectedProductId) || all[0];
  }

  // Initialize Engines
  const videoEngine = new VideoAdEngine("adVideoCanvas");
  const imageEngine = new ImageAdEngine("adImageCanvas");

  // DOM Elements
  const tabs = document.querySelectorAll(".nav-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const trendGrid = document.getElementById("trendGrid");
  const productGrid = document.getElementById("productGrid");
  const platformPills = document.querySelectorAll(".platform-pill");
  const toastEl = document.getElementById("toast");

  // Studio Elements
  const studioTrendTitle = document.getElementById("studioTrendTitle");
  const studioTrendPlatform = document.getElementById("studioTrendPlatform");
  const studioProductName = document.getElementById("studioProductName");
  const studioProductImg = document.getElementById("studioProductImg");
  const studioScriptHook = document.getElementById("studioScriptHook");
  const studioScriptBody = document.getElementById("studioScriptBody");
  const studioScriptCta = document.getElementById("studioScriptCta");
  const playBtn = document.getElementById("playBtn");
  const restartBtn = document.getElementById("restartBtn");
  const muteBtn = document.getElementById("muteBtn");
  const timeDisplay = document.getElementById("timeDisplay");
  const progressBar = document.getElementById("progressBar");
  const videoPlayerContainer = document.getElementById("videoPlayerContainer");
  const imagePlayerContainer = document.getElementById("imagePlayerContainer");
  const exportVideoBtn = document.getElementById("exportVideoBtn");
  const exportImageBtn = document.getElementById("exportImageBtn");
  const saveCampaignBtn = document.getElementById("saveCampaignBtn");
  const copyScriptBtn = document.getElementById("copyScriptBtn");
  const campaignsList = document.getElementById("campaignsList");
  const campaignsEmpty = document.getElementById("campaignsEmpty");

  // Media Toggle Buttons
  const modeVideoBtn = document.getElementById("modeVideoBtn");
  const modeImageBtn = document.getElementById("modeImageBtn");
  const imgFormatPills = document.querySelectorAll(".img-format-pill");
  const imgFormatSelector = document.getElementById("imgFormatSelector");
  const playerControlsBar = document.getElementById("playerControlsBar");

  // Modals
  const newProductModal = document.getElementById("newProductModal");
  const openNewProductBtn = document.getElementById("openNewProductBtn");
  const closeNewProductBtn = document.getElementById("closeNewProductBtn");
  const productForm = document.getElementById("productForm");
  const productImgInput = document.getElementById("productImgInput");
  const imgUploadPreview = document.getElementById("imgUploadPreview");
  let uploadedImgDataUrl = "";

  const exportModal = document.getElementById("exportModal");
  const exportProgressFill = document.getElementById("exportProgressFill");
  const exportProgressPct = document.getElementById("exportProgressPct");

  // Toast Function
  function showToast(message, type = "success") {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = `toast show ${type}`;
    setTimeout(() => {
      toastEl.className = "toast";
    }, 3200);
  }

  // Tab Switching
  function switchTab(tabId) {
    state.activeTab = tabId;
    tabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === tabId);
    });
    tabPanes.forEach(pane => {
      pane.classList.toggle("active", pane.id === `${tabId}Pane`);
    });

    if (tabId === "studio") {
      updateStudio();
    } else {
      videoEngine.pause();
      if (playBtn) playBtn.innerHTML = "▶ Başlat";
    }

    if (tabId === "campaigns") {
      renderCampaigns();
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // Platform Filter
  platformPills.forEach(pill => {
    pill.addEventListener("click", () => {
      platformPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.selectedPlatform = pill.dataset.platform;
      renderTrends();
    });
  });

  // Render Trends
  function renderTrends() {
    if (!trendGrid) return;
    trendGrid.innerHTML = "";

    const filtered = state.selectedPlatform === "all" 
      ? TREND_DATA 
      : TREND_DATA.filter(t => t.platform === state.selectedPlatform);

    filtered.forEach(trend => {
      const isSelected = trend.id === state.selectedTrendId;
      const card = document.createElement("div");
      card.className = `trend-card ${isSelected ? "selected" : ""}`;
      card.innerHTML = `
        <div class="trend-card-header">
          <span class="platform-badge platform-${trend.platform}">
            ${trend.platformIcon} ${trend.platformName}
          </span>
          <span class="viral-score-badge">
            ⚡ Virallıq: <strong>${trend.viralScore}/100</strong>
          </span>
        </div>
        <h3 class="trend-title">${trend.title}</h3>
        <p class="trend-hook-preview">"${trend.hookText}"</p>
        <p class="trend-desc">${trend.description}</p>
        
        <div class="trend-meta-row">
          <div class="trend-stat">
            <span class="stat-label">Baxış sayı</span>
            <span class="stat-val">${trend.views}</span>
          </div>
          <div class="trend-stat">
            <span class="stat-label">Həftəlik Artım</span>
            <span class="stat-val highlight">${trend.growth}</span>
          </div>
          <div class="trend-stat">
            <span class="stat-label">Format</span>
            <span class="stat-val">${trend.trendCategory}</span>
          </div>
        </div>

        <div class="trend-tags">
          ${trend.bestFor.map(cat => `<span class="cat-tag">${cat}</span>`).join("")}
        </div>

        <div class="trend-card-actions">
          <button class="btn btn-primary select-trend-btn" data-id="${trend.id}">
            Bu Trend ilə Reklam Yarat ⚡
          </button>
        </div>
      `;

      card.querySelector(".select-trend-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        state.selectedTrendId = trend.id;
        renderTrends();
        switchTab("studio");
        showToast(`"${trend.title.substring(0, 30)}..." trendi seçildi!`);
      });

      card.addEventListener("click", () => {
        state.selectedTrendId = trend.id;
        renderTrends();
      });

      trendGrid.appendChild(card);
    });
  }

  // Render Products
  function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = "";

    const all = getAllProducts();
    all.forEach(prod => {
      const isSelected = prod.id === state.selectedProductId;
      const card = document.createElement("div");
      card.className = `product-card ${isSelected ? "selected" : ""}`;
      card.innerHTML = `
        <div class="product-img-box">
          <img src="${prod.image}" alt="${prod.name}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'"/>
          <span class="product-category-tag">${prod.category}</span>
          ${prod.discount ? `<span class="product-discount-tag">-%${prod.discount}</span>` : ""}
        </div>
        <div class="product-body">
          <h3 class="product-name">${prod.name}</h3>
          <div class="product-pricing">
            <span class="price-current">${prod.price}</span>
            ${prod.oldPrice ? `<span class="price-old">${prod.oldPrice}</span>` : ""}
          </div>
          <ul class="product-features-list">
            ${prod.features.slice(0, 3).map(f => `<li>✓ ${f}</li>`).join("")}
          </ul>
          <button class="btn btn-secondary select-prod-btn" data-id="${prod.id}">
            ${isSelected ? "✓ Seçilmiş Məhsul" : "Bu Məhsulla Reklam Yarat"}
          </button>
        </div>
      `;

      card.querySelector(".select-prod-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        state.selectedProductId = prod.id;
        renderProducts();
        switchTab("studio");
        showToast(`"${prod.name}" məhsulu seçildi!`);
      });

      card.addEventListener("click", () => {
        state.selectedProductId = prod.id;
        renderProducts();
      });

      productGrid.appendChild(card);
    });
  }

  // Update Studio
  function updateStudio() {
    const trend = getSelectedTrend();
    const product = getSelectedProduct();

    if (studioTrendTitle) studioTrendTitle.textContent = trend.title;
    if (studioTrendPlatform) {
      studioTrendPlatform.textContent = `${trend.platformIcon} ${trend.platformName}`;
      studioTrendPlatform.className = `platform-badge platform-${trend.platform}`;
    }
    if (studioProductName) studioProductName.textContent = product.name;
    if (studioProductImg) studioProductImg.src = product.image;

    // Adapt script template with product variables
    const f1 = product.features[0] || "yüksək keyfiyyətli";
    const f2 = product.features[1] || "rahat istifadəli";
    const adaptedHook = trend.scriptTemplate.hook;
    const adaptedBody = trend.scriptTemplate.body
      .replace("{product_name}", product.name)
      .replace("{feature_1}", f1)
      .replace("{feature_2}", f2);
    const adaptedCta = trend.scriptTemplate.cta;

    if (studioScriptHook) studioScriptHook.textContent = `"${adaptedHook}"`;
    if (studioScriptBody) studioScriptBody.textContent = adaptedBody;
    if (studioScriptCta) studioScriptCta.textContent = adaptedCta;

    // Load into video and image engines
    videoEngine.loadData(product, trend);
    imageEngine.loadData(product, trend, state.imageFormat);

    // Update sound genre
    if (window.trendAudio) {
      window.trendAudio.setGenre(trend.soundGenre);
    }

    // Reset progress
    if (progressBar) progressBar.value = 0;
    if (timeDisplay) timeDisplay.textContent = "00:00 / 00:15";
    if (playBtn) playBtn.innerHTML = "▶ Başlat";
  }

  // Media Mode Toggles
  if (modeVideoBtn && modeImageBtn) {
    modeVideoBtn.addEventListener("click", () => {
      state.mediaMode = "video";
      modeVideoBtn.classList.add("active");
      modeImageBtn.classList.remove("active");
      videoPlayerContainer.style.display = "block";
      imagePlayerContainer.style.display = "none";
      exportVideoBtn.style.display = "inline-flex";
      exportImageBtn.style.display = "none";
      if (imgFormatSelector) imgFormatSelector.style.display = "none";
      if (playerControlsBar) playerControlsBar.style.display = "flex";
    });

    modeImageBtn.addEventListener("click", () => {
      state.mediaMode = "image";
      modeImageBtn.classList.add("active");
      modeVideoBtn.classList.remove("active");
      videoPlayerContainer.style.display = "none";
      imagePlayerContainer.style.display = "block";
      exportVideoBtn.style.display = "none";
      exportImageBtn.style.display = "inline-flex";
      if (imgFormatSelector) imgFormatSelector.style.display = "flex";
      if (playerControlsBar) playerControlsBar.style.display = "none";
      videoEngine.pause();
      if (playBtn) playBtn.innerHTML = "▶ Başlat";
      imageEngine.render();
    });
  }

  // Image Format Pills
  imgFormatPills.forEach(pill => {
    pill.addEventListener("click", () => {
      imgFormatPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.imageFormat = pill.dataset.format;
      imageEngine.setFormat(state.imageFormat);
    });
  });

  // Video Controls
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (videoEngine.isPlaying) {
        videoEngine.pause();
        playBtn.innerHTML = "▶ Başlat";
      } else {
        videoEngine.play();
        playBtn.innerHTML = "⏸ Dayandır";
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      videoEngine.restart();
      if (playBtn) playBtn.innerHTML = "⏸ Dayandır";
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      const isMuted = window.trendAudio.toggleMute();
      muteBtn.innerHTML = isMuted ? "🔇 Səssiz" : "🔊 Səsli";
      muteBtn.classList.toggle("muted", isMuted);
    });
  }

  if (progressBar) {
    progressBar.addEventListener("input", (e) => {
      const targetSec = (e.target.value / 100) * videoEngine.duration;
      videoEngine.seek(targetSec);
    });
  }

  videoEngine.onProgressUpdate = (current, duration) => {
    const pct = (current / duration) * 100;
    if (progressBar) progressBar.value = pct;
    const curSec = Math.floor(current).toString().padStart(2, "0");
    const durSec = Math.floor(duration).toString().padStart(2, "0");
    if (timeDisplay) timeDisplay.textContent = `00:${curSec} / 00:${durSec}`;
  };

  videoEngine.onEnded = () => {
    if (playBtn) playBtn.innerHTML = "▶ Yenidən";
  };

  // Video Export WebM
  if (exportVideoBtn) {
    exportVideoBtn.addEventListener("click", () => {
      if (!exportModal) return;
      exportModal.classList.add("show");
      exportProgressFill.style.width = "0%";
      exportProgressPct.textContent = "0%";

      videoEngine.exportVideo(
        (pct) => {
          exportProgressFill.style.width = `${pct}%`;
          exportProgressPct.textContent = `${pct}%`;
        },
        () => {
          setTimeout(() => {
            exportModal.classList.remove("show");
            showToast("Viral video uğurla kompüterinizə yükləndi! 🎥", "success");
          }, 600);
        },
        (err) => {
          exportModal.classList.remove("show");
          showToast(`Export xətası: ${err}`, "error");
        }
      );
    });
  }

  // Image Export PNG
  if (exportImageBtn) {
    exportImageBtn.addEventListener("click", () => {
      imageEngine.downloadImage();
      showToast("Reklam şəkli (PNG) uğurla yükləndi! 📸", "success");
    });
  }

  // Copy Script
  if (copyScriptBtn) {
    copyScriptBtn.addEventListener("click", () => {
      const hook = studioScriptHook ? studioScriptHook.textContent : "";
      const body = studioScriptBody ? studioScriptBody.textContent : "";
      const cta = studioScriptCta ? studioScriptCta.textContent : "";
      const fullText = `[VİRAL REKLAM SSENARİSİ]\n\n🎯 Qarmaq (Hook):\n${hook}\n\n🎬 Əsas Mətn:\n${body}\n\n⚡ Hərəkətə Çağırış (CTA):\n${cta}\n\n#ShopPulse #ViralAd #Trend`;
      
      navigator.clipboard.writeText(fullText).then(() => {
        showToast("Ssenari panoya kopyalandı! 📋", "success");
      }).catch(() => {
        showToast("Kopyalama uğursuz oldu", "error");
      });
    });
  }

  // Save Campaign to LocalStorage
  if (saveCampaignBtn) {
    saveCampaignBtn.addEventListener("click", () => {
      const trend = getSelectedTrend();
      const product = getSelectedProduct();
      const newCamp = {
        id: "camp-" + Date.now(),
        date: new Date().toLocaleDateString("az-AZ", { hour: "2-digit", minute: "2-digit" }),
        trendId: trend.id,
        trendTitle: trend.title,
        platformName: trend.platformName,
        platformIcon: trend.platformIcon,
        productId: product.id,
        productName: product.name,
        productImg: product.image,
        productPrice: product.price,
        mediaType: state.mediaMode,
        viralScore: trend.viralScore
      };

      state.savedCampaigns.unshift(newCamp);
      localStorage.setItem("shoppulse_campaigns", JSON.stringify(state.savedCampaigns));
      showToast("Reklam kampaniyası yadda saxlanıldı! 💾", "success");
    });
  }

  // Render Saved Campaigns
  function renderCampaigns() {
    if (!campaignsList || !campaignsEmpty) return;
    if (state.savedCampaigns.length === 0) {
      campaignsList.innerHTML = "";
      campaignsEmpty.style.display = "block";
      return;
    }

    campaignsEmpty.style.display = "none";
    campaignsList.innerHTML = "";

    state.savedCampaigns.forEach((camp, index) => {
      const item = document.createElement("div");
      item.className = "campaign-card";
      item.innerHTML = `
        <div class="campaign-img-box">
          <img src="${camp.productImg}" alt="${camp.productName}" />
        </div>
        <div class="campaign-content">
          <div class="campaign-meta">
            <span class="campaign-platform">${camp.platformIcon} ${camp.platformName}</span>
            <span class="campaign-date">${camp.date}</span>
            <span class="campaign-score">⚡ Virallıq: %${camp.viralScore}</span>
          </div>
          <h4 class="campaign-title">${camp.productName}</h4>
          <p class="campaign-trend">Trend: "${camp.trendTitle}"</p>
        </div>
        <div class="campaign-actions">
          <button class="btn btn-secondary load-camp-btn" data-trend="${camp.trendId}" data-prod="${camp.productId}">
            Studio-da Aç 🚀
          </button>
          <button class="btn btn-danger-icon delete-camp-btn" data-index="${index}" title="Sil">
            ✕
          </button>
        </div>
      `;

      item.querySelector(".load-camp-btn").addEventListener("click", () => {
        state.selectedTrendId = camp.trendId;
        state.selectedProductId = camp.productId;
        switchTab("studio");
        showToast("Kampaniya studio-da açıldı!");
      });

      item.querySelector(".delete-camp-btn").addEventListener("click", () => {
        state.savedCampaigns.splice(index, 1);
        localStorage.setItem("shoppulse_campaigns", JSON.stringify(state.savedCampaigns));
        renderCampaigns();
        showToast("Kampaniya silindi.");
      });

      campaignsList.appendChild(item);
    });
  }

  // Custom Product Creation Modal
  if (openNewProductBtn && newProductModal) {
    openNewProductBtn.addEventListener("click", () => {
      newProductModal.classList.add("show");
    });
  }

  if (closeNewProductBtn && newProductModal) {
    closeNewProductBtn.addEventListener("click", () => {
      newProductModal.classList.remove("show");
    });
  }

  // Handle Image Upload
  if (productImgInput) {
    productImgInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedImgDataUrl = event.target.result;
          if (imgUploadPreview) {
            imgUploadPreview.src = uploadedImgDataUrl;
            imgUploadPreview.style.display = "block";
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Submit New Product Form
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("prodNameInput").value.trim();
      const category = document.getElementById("prodCatInput").value.trim();
      const price = document.getElementById("prodPriceInput").value.trim();
      const oldPrice = document.getElementById("prodOldPriceInput").value.trim();
      const featText = document.getElementById("prodFeatsInput").value.trim();

      if (!name || !price) {
        showToast("Zəhmət olmasa məhsul adı və qiymətini daxil edin", "error");
        return;
      }

      const features = featText.split("\n").map(f => f.trim()).filter(f => f.length > 0);
      if (features.length === 0) {
        features.push("Yüksək keyfiyyət", "Sürətli çatdırılma", "100% zəmanət");
      }

      const defaultPlaceholder = "assets/images/smartwatch.jpg";
      const newProd = {
        id: "prod-custom-" + Date.now(),
        name,
        category: category || "Ümumi Mallar",
        price: price.includes("AZN") ? price : `${price} AZN`,
        oldPrice: oldPrice ? (oldPrice.includes("AZN") ? oldPrice : `${oldPrice} AZN`) : "",
        discount: "30%",
        image: uploadedImgDataUrl || defaultPlaceholder,
        features,
        targetAudience: "Onlayn alış-veriş edənlər",
        colorTone: "cyber-blue"
      };

      state.customProducts.unshift(newProd);
      localStorage.setItem("shoppulse_products", JSON.stringify(state.customProducts));

      state.selectedProductId = newProd.id;
      renderProducts();
      newProductModal.classList.remove("show");
      productForm.reset();
      if (imgUploadPreview) imgUploadPreview.style.display = "none";
      uploadedImgDataUrl = "";

      showToast("Yeni məhsul uğurla əlavə edildi! 🎉", "success");
      switchTab("products");
    });
  }

  // Initial Render
  renderTrends();
  renderProducts();
  updateStudio();
});
