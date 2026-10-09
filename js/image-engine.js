/**
 * ShopPulse Social Ad Image Creative Engine
 * Renders high-converting social media ad images (9:16 Story, 1:1 Feed Post, Native X/Reddit Ad)
 * Exports high-resolution PNGs
 */

class ImageAdEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.product = null;
    this.trend = null;
    this.format = "story"; // 'story' (9:16), 'feed' (1:1), 'native' (1.91:1)
    this.productImg = new Image();
    this.isImgLoaded = false;
  }

  loadData(product, trend, format = "story") {
    this.product = product;
    this.trend = trend;
    this.format = format;

    this.updateCanvasDimensions();

    this.isImgLoaded = false;
    if (product && product.image) {
      this.productImg.onload = () => {
        this.isImgLoaded = true;
        this.render();
      };
      this.productImg.onerror = () => {
        this.isImgLoaded = false;
        this.render();
      };
      this.productImg.src = product.image;
    } else {
      this.render();
    }
  }

  setFormat(format) {
    this.format = format;
    this.updateCanvasDimensions();
    this.render();
  }

  updateCanvasDimensions() {
    if (!this.canvas) return;
    if (this.format === "story") {
      this.canvas.width = 1080;
      this.canvas.height = 1920;
    } else if (this.format === "feed") {
      this.canvas.width = 1080;
      this.canvas.height = 1080;
    } else {
      // Native social post (1200 x 675 / 16:9)
      this.canvas.width = 1200;
      this.canvas.height = 675;
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    ctx.clearRect(0, 0, W, H);

    if (this.format === "story") {
      this.renderStoryFormat(ctx, W, H);
    } else if (this.format === "feed") {
      this.renderFeedFormat(ctx, W, H);
    } else {
      this.renderNativeFormat(ctx, W, H);
    }
  }

  renderStoryFormat(ctx, W, H) {
    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#080c16");
    bg.addColorStop(0.3, "#0e172a");
    bg.addColorStop(0.7, "#111827");
    bg.addColorStop(1, "#020617");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle neon aura rings
    const aura = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 600);
    aura.addColorStop(0, "rgba(0, 242, 254, 0.25)");
    aura.addColorStop(0.5, "rgba(254, 9, 121, 0.15)");
    aura.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, W, H);

    // Top Platform Pill
    const platform = this.trend ? this.trend.platformName : "TikTok";
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 260, 90, 520, 64, 32);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 242, 254, 0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "bold 26px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#00f2fe";
    ctx.textAlign = "center";
    ctx.fillText(`🔥 GÜNÜN VİRAL TRENDİ • ${platform.toUpperCase()}`, W / 2, 132);

    // Viral Hook Headline
    const hook = this.trend ? this.trend.hookText : "Bunu bilmədən alış-veriş etməyə davam etməyin!";
    ctx.font = "900 52px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 20;
    this.wrapText(ctx, hook, W / 2, 240, 920, 68);
    ctx.shadowBlur = 0;

    // Center Product Showcase Card
    const cardY = 520;
    const cardH = 740;
    const cardW = 920;
    const cardX = (W - cardW) / 2;

    ctx.fillStyle = "rgba(17, 24, 39, 0.75)";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 40);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (this.isImgLoaded) {
      this.drawRoundedImage(ctx, this.productImg, cardX + 40, cardY + 40, cardW - 80, 480, 28);
    }

    // Product Title inside card
    const pName = this.product ? this.product.name : "Premium Məhsul";
    ctx.font = "900 42px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(pName, cardX + 50, cardY + 580);

    // Price & Discount Tag
    const pPrice = this.product ? this.product.price : "49 AZN";
    const pOld = this.product ? this.product.oldPrice : "89 AZN";
    const pDisc = this.product ? this.product.discount : "40%";

    ctx.fillStyle = "#10b981";
    ctx.font = "900 46px 'Inter', sans-serif";
    ctx.fillText(pPrice, cardX + 50, cardY + 660);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "32px 'Inter', sans-serif";
    ctx.fillText(`(${pOld})`, cardX + 240, cardY + 660);

    // Discount badge
    ctx.fillStyle = "#fe0979";
    ctx.beginPath();
    ctx.roundRect(cardX + cardW - 220, cardY + 610, 170, 60, 30);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`-${pDisc} ENDİRİM`, cardX + cardW - 135, cardY + 648);

    // Benefits section below card
    const feats = this.product ? this.product.features : ["Orijinal Məhsul", "Sürətli Çatdırılma", "14 Gün Zəmanət"];
    const featStartY = 1320;
    feats.slice(0, 3).forEach((f, idx) => {
      const y = featStartY + idx * 80;
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.roundRect(cardX, y, cardW, 64, 18);
      ctx.fill();

      ctx.fillStyle = "#00f2fe";
      ctx.font = "bold 32px 'Inter', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("✓", cardX + 30, y + 44);

      ctx.fillStyle = "#f3f4f6";
      ctx.font = "600 28px 'Inter', sans-serif";
      ctx.fillText(f, cardX + 80, y + 43);
    });

    // Big Bottom CTA Bar
    const ctaGrad = ctx.createLinearGradient(cardX, 0, cardX + cardW, 0);
    ctaGrad.addColorStop(0, "#fe0979");
    ctaGrad.addColorStop(1, "#00f2fe");

    ctx.fillStyle = ctaGrad;
    ctx.beginPath();
    ctx.roundRect(cardX, H - 240, cardW, 110, 55);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 38px 'Outfit', 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("İNDİ SİFARİŞ VERİN ⚡", W / 2, H - 170);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px 'Inter', sans-serif";
    ctx.fillText("🔗 Sifariş linki üçün bio və ya direct-ə yazın", W / 2, H - 90);
  }

  renderFeedFormat(ctx, W, H) {
    // 1:1 Square Feed Ad (1080x1080)
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0b0f19");
    bg.addColorStop(1, "#171d2d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Top Header
    ctx.fillStyle = "#00f2fe";
    ctx.font = "bold 24px 'Inter', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("★ TREND SEÇİMİ 2026", 60, 80);

    const hook = this.trend ? this.trend.hookText : "İlin ən çox axtarılan məhsulu artıq satışda!";
    ctx.font = "900 38px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    this.wrapText(ctx, hook, 60, 140, W - 120, 50);

    // Image spotlight center
    if (this.isImgLoaded) {
      this.drawRoundedImage(ctx, this.productImg, 60, 240, 520, 520, 32);
      ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(60, 240, 520, 520, 32);
      ctx.stroke();
    }

    // Right Side Features & Pricing
    const rx = 620;
    const pName = this.product ? this.product.name : "Məhsul Adı";
    ctx.font = "900 32px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    this.wrapText(ctx, pName, rx, 280, 400, 42);

    const feats = this.product ? this.product.features : ["Amoled Ekran", "Batareya", "Zəmanət"];
    feats.slice(0, 3).forEach((f, i) => {
      const fy = 410 + i * 55;
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 24px 'Inter', sans-serif";
      ctx.fillText("✓", rx, fy);

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "600 22px 'Inter', sans-serif";
      ctx.fillText(f, rx + 30, fy - 2);
    });

    // Price
    const pPrice = this.product ? this.product.price : "59 AZN";
    const pOld = this.product ? this.product.oldPrice : "89 AZN";
    ctx.fillStyle = "#34d399";
    ctx.font = "900 48px 'Inter', sans-serif";
    ctx.fillText(pPrice, rx, 630);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "28px 'Inter', sans-serif";
    ctx.fillText(`(${pOld})`, rx + 190, 630);

    // Discount Pill
    const pDisc = this.product ? this.product.discount : "40%";
    ctx.fillStyle = "#fe0979";
    ctx.beginPath();
    ctx.roundRect(rx, 660, 220, 50, 25);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`QƏNAƏT ET: %${pDisc}`, rx + 110, 693);

    // Bottom Banner
    const bar = ctx.createLinearGradient(60, 0, W - 60, 0);
    bar.addColorStop(0, "#fe0979");
    bar.addColorStop(1, "#00f2fe");

    ctx.fillStyle = bar;
    ctx.beginPath();
    ctx.roundRect(60, 830, W - 120, 170, 30);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px 'Outfit', 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("İndi Al - Şərhlərdə 'QİYMƏT' Yaz 💬", W / 2, 905);

    ctx.font = "600 24px 'Inter', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText("🚀 Azərbaycan daxili 24 saatda sürətli çatdırılma", W / 2, 955);
  }

  renderNativeFormat(ctx, W, H) {
    // Native X/Reddit style Post Creative (1200x675)
    ctx.fillStyle = "#0f141c";
    ctx.fillRect(0, 0, W, H);

    // Top Author header (Looks authentic)
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(80, 80, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚡", 80, 90);

    ctx.textAlign = "left";
    ctx.font = "bold 26px 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Viral Kəşflər Bloqu", 140, 72);

    ctx.font = "20px 'Inter', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("@viralkesf • İndi • 1.4M Baxış", 140, 102);

    // Tweet/Post text
    const hook = this.trend ? this.trend.hookText : "Bu məhsul həyatımı dəyişdirdi.";
    ctx.font = "600 28px 'Inter', sans-serif";
    ctx.fillStyle = "#f1f5f9";
    this.wrapText(ctx, `${hook} Mən də inanmırdım amma nəticə ortadadır:`, 60, 160, W - 120, 40);

    // Card with Image
    const boxX = 60;
    const boxY = 240;
    const boxW = W - 120;
    const boxH = 380;

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 20);
    ctx.fill();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (this.isImgLoaded) {
      this.drawRoundedImage(ctx, this.productImg, boxX + 20, boxY + 20, 340, 340, 16);
    }

    const infoX = boxX + 390;
    const pName = this.product ? this.product.name : "Məhsul";
    ctx.font = "900 32px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pName, infoX, boxY + 70);

    const pPrice = this.product ? this.product.price : "49 AZN";
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 36px 'Inter', sans-serif";
    ctx.fillText(`${pPrice} (Endirimli Qiymət)`, infoX, boxY + 130);

    const feats = this.product ? this.product.features : ["Zəmanətli", "Keyfiyyətli"];
    ctx.fillStyle = "#94a3b8";
    ctx.font = "22px 'Inter', sans-serif";
    ctx.fillText(`Əsas üstünlüklər: ${feats.slice(0, 2).join(" • ")}`, infoX, boxY + 185);

    // CTA button inside card
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.roundRect(infoX, boxY + 240, 280, 56, 28);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Məhsula Bax ↗", infoX + 140, boxY + 275);
  }

  drawRoundedImage(ctx, img, x, y, width, height, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.clip();
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    for (let k = 0; k < lines.length; k++) {
      ctx.fillText(lines[k].trim(), x, y + k * lineHeight);
    }
  }

  downloadImage() {
    if (!this.canvas) return;
    const link = document.createElement("a");
    const pName = this.product ? this.product.name.replace(/\s+/g, "_") : "Product";
    link.download = `ShopPulse_${this.format.toUpperCase()}_Reklam_${pName}.png`;
    link.href = this.canvas.toDataURL("image/png");
    link.click();
  }
}

window.ImageAdEngine = ImageAdEngine;
