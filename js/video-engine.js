/**
 * ShopPulse Dynamic 9:16 Video Ad Canvas Engine
 * Generates viral 60fps vertical animated video creatives
 * Supports real-time playback, audio sync, and MediaRecorder WebM export
 */

class VideoAdEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.duration = 15; // 15 seconds viral ad
    this.currentTime = 0;
    this.isPlaying = false;
    this.animationFrameId = null;
    this.lastTimestamp = 0;
    this.product = null;
    this.trend = null;
    this.productImg = new Image();
    this.isImgLoaded = false;
    this.onProgressUpdate = null;
    this.onEnded = null;

    // Particles for visual flair
    this.particles = [];
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * 720,
        y: Math.random() * 1280,
        size: Math.random() * 4 + 1,
        speedY: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.2,
        color: i % 2 === 0 ? "rgba(0, 242, 254, " : "rgba(254, 9, 121, "
      });
    }
  }

  loadData(product, trend) {
    this.product = product;
    this.trend = trend;
    this.isImgLoaded = false;
    if (product && product.image) {
      this.productImg.onload = () => {
        this.isImgLoaded = true;
        this.renderFrame(this.currentTime);
      };
      this.productImg.onerror = () => {
        this.isImgLoaded = false;
        this.renderFrame(this.currentTime);
      };
      this.productImg.src = product.image;
    } else {
      this.renderFrame(this.currentTime);
    }
  }

  play() {
    if (!this.canvas) return;
    this.isPlaying = true;
    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
    }
    this.lastTimestamp = performance.now();
    if (window.trendAudio && this.trend) {
      window.trendAudio.setGenre(this.trend.soundGenre || "phonk");
      window.trendAudio.play();
    }
    this.loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (window.trendAudio) {
      window.trendAudio.stop();
    }
  }

  restart() {
    this.currentTime = 0;
    this.play();
  }

  seek(t) {
    this.currentTime = Math.max(0, Math.min(this.duration, t));
    this.renderFrame(this.currentTime);
    if (this.onProgressUpdate) {
      this.onProgressUpdate(this.currentTime, this.duration);
    }
  }

  loop() {
    if (!this.isPlaying) return;
    const now = performance.now();
    const dt = (now - this.lastTimestamp) / 1000;
    this.lastTimestamp = now;

    this.currentTime += dt;
    if (this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      this.renderFrame(this.currentTime);
      this.pause();
      if (this.onEnded) this.onEnded();
      return;
    }

    this.renderFrame(this.currentTime);
    if (this.onProgressUpdate) {
      this.onProgressUpdate(this.currentTime, this.duration);
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  renderFrame(t) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Clear background
    ctx.clearRect(0, 0, W, H);

    // Dynamic gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#080b14");
    bgGrad.addColorStop(0.5, "#0f172a");
    bgGrad.addColorStop(1, "#030712");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle animated grid / beams
    this.drawBackgroundEffects(ctx, W, H, t);

    // Scene determination
    // 0 - 3.5s: Viral Hook Scene
    // 3.5 - 7.5s: Problem & Solution Intro
    // 7.5 - 12.0s: Product Spotlight & Features
    // 12.0 - 15.0s: Call to Action & Offer
    if (t < 3.5) {
      this.renderSceneHook(ctx, W, H, t);
    } else if (t < 7.5) {
      this.renderSceneProblem(ctx, W, H, t - 3.5);
    } else if (t < 12.0) {
      this.renderSceneProduct(ctx, W, H, t - 7.5);
    } else {
      this.renderSceneCta(ctx, W, H, t - 12.0);
    }

    // Always render TikTok/Reels UI overlay (Engagement buttons, creator badge, sound ticker)
    this.renderSocialOverlay(ctx, W, H, t);
  }

  drawBackgroundEffects(ctx, W, H, t) {
    // Clean, minimalist studio vignette
    const spotlight = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 520);
    spotlight.addColorStop(0, "rgba(255, 255, 255, 0.06)");
    spotlight.addColorStop(1, "rgba(0, 0, 0, 0.45)");
    ctx.fillStyle = spotlight;
    ctx.fillRect(0, 0, W, H);
  }

  // SCENE 1: VIRAL HOOK
  renderSceneHook(ctx, W, H, t) {
    const scale = Math.min(1, 0.8 + t * 0.1);
    ctx.save();
    ctx.translate(W / 2, H / 2 - 80);
    ctx.scale(scale, scale);

    // Alert / Trend Pill Tag
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.roundRect(-220, -220, 440, 60, 30);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 242, 254, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#00f2fe";
    ctx.font = "bold 26px 'Outfit', 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const platformName = this.trend ? this.trend.platformName : "TikTok Trend";
    ctx.fillText(`🔥 GÜNÜN ƏN ÇOX BAXILAN TRENDİ (${platformName})`, 0, -190);

    // Giant Dynamic Hook Text with Yellow/White Contrast
    const hook = this.trend ? this.trend.hookText : "Bunu bilmədən yaşamağa necə davam edirdim?!";
    ctx.font = "900 48px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 242, 254, 0.8)";
    ctx.shadowBlur = 24;

    this.wrapText(ctx, hook, 0, -70, 560, 64);
    ctx.shadowBlur = 0;

    // Warning / Shock Emoji Card with animated bounce
    const bounce = Math.sin(t * 8) * 12;
    ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
    ctx.beginPath();
    ctx.roundRect(-180, 130 + bounce, 360, 70, 20);
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "bold 28px 'Inter', sans-serif";
    ctx.fillStyle = "#fecaca";
    ctx.fillText("⚠️ VİDEONU DAYANDIRMA!", 0, 165 + bounce);

    ctx.restore();

    // Waveform audio bars at bottom
    this.renderWaveform(ctx, W, H, t);
  }

  // SCENE 2: PROBLEM INTRO
  renderSceneProblem(ctx, W, H, t) {
    ctx.save();
    ctx.translate(W / 2, H / 2 - 60);

    // Badge
    ctx.fillStyle = "rgba(254, 9, 121, 0.2)";
    ctx.beginPath();
    ctx.roundRect(-160, -230, 320, 50, 25);
    ctx.fill();
    ctx.strokeStyle = "#fe0979";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "bold 22px 'Inter', sans-serif";
    ctx.fillStyle = "#fe0979";
    ctx.textAlign = "center";
    ctx.fillText("⚡ PROBLEM VƏ REALLIQ", 0, -205);

    // Problem Statement
    ctx.font = "800 42px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Köhnə üsullar artıq", 0, -110);
    ctx.fillStyle = "#ef4444";
    ctx.fillText("işə yaramır və vaxt itirir!", 0, -55);

    // Product Preview Preview Box
    if (this.isImgLoaded) {
      const imgScale = Math.min(1, 0.6 + t * 0.15);
      ctx.save();
      ctx.scale(imgScale, imgScale);
      this.drawRoundedImage(ctx, this.productImg, -140, 20, 280, 280, 24);
      ctx.restore();
    }

    // Floating Solution tag
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.roundRect(-170, 330, 340, 56, 16);
    ctx.fill();

    ctx.font = "bold 26px 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("HƏLLİ BURADADIR 👇", 0, 358);

    ctx.restore();
  }

  // SCENE 3: PRODUCT SPOTLIGHT & KEY FEATURES
  renderSceneProduct(ctx, W, H, t) {
    const pName = this.product ? this.product.name : "Premium Məhsul";
    const pPrice = this.product ? this.product.price : "59 AZN";
    const pOldPrice = this.product ? this.product.oldPrice : "89 AZN";
    const features = this.product ? this.product.features : ["Keyfiyyətli", "Zəmanətli", "Sürətli Çatdırılma"];

    ctx.save();
    ctx.translate(W / 2, 260);

    // Product Name Header
    ctx.font = "900 38px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(pName, 0, 0);

    // Price Pill
    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
    ctx.beginPath();
    ctx.roundRect(-160, 30, 320, 48, 24);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.stroke();

    ctx.font = "bold 24px 'Inter', sans-serif";
    ctx.fillStyle = "#34d399";
    ctx.fillText(`${pPrice} `, -30, 54);
    ctx.font = "20px 'Inter', sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`(${pOldPrice})`, 60, 54);

    ctx.restore();

    // Floating 3D-like Product Photo with breathing motion
    const floatY = Math.sin(t * 3.5) * 14;
    if (this.isImgLoaded) {
      ctx.save();
      ctx.translate(W / 2, 540 + floatY);

      // Backglow
      const aura = ctx.createRadialGradient(0, 0, 50, 0, 0, 240);
      aura.addColorStop(0, "rgba(0, 242, 254, 0.5)");
      aura.addColorStop(1, "rgba(0, 242, 254, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(-240, -240, 480, 480);

      this.drawRoundedImage(ctx, this.productImg, -170, -170, 340, 340, 28);

      // Border glow
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-170, -170, 340, 340, 28);
      ctx.stroke();

      // Verified / Viral badge
      ctx.fillStyle = "#00f2fe";
      ctx.beginPath();
      ctx.roundRect(80, 120, 110, 42, 21);
      ctx.fill();
      ctx.fillStyle = "#030712";
      ctx.font = "bold 18px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("★ TREND", 135, 142);

      ctx.restore();
    }

    // Feature Badges popping in one by one based on time
    const featStartY = 770;
    features.slice(0, 3).forEach((f, idx) => {
      const featTime = idx * 0.9;
      if (t >= featTime) {
        const animProgress = Math.min(1, (t - featTime) * 3);
        const cardX = (W / 2 - 250) + (1 - animProgress) * 50;
        const cardY = featStartY + idx * 72;

        ctx.fillStyle = "rgba(17, 24, 39, 0.85)";
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, 500, 56, 16);
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 24px 'Inter', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("✓", cardX + 24, cardY + 36);

        ctx.fillStyle = "#f3f4f6";
        ctx.font = "600 22px 'Inter', sans-serif";
        ctx.fillText(f, cardX + 60, cardY + 35);
      }
    });
  }

  // SCENE 4: CALL TO ACTION (CTA)
  renderSceneCta(ctx, W, H, t) {
    ctx.save();
    ctx.translate(W / 2, H / 2 - 40);

    // Pulsing CTA Box
    const pulse = 1 + Math.sin(t * 7) * 0.04;
    ctx.scale(pulse, pulse);

    // Promo Tag
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.roundRect(-150, -210, 300, 44, 22);
    ctx.fill();

    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("🔥 MƏHDUD SAYDA ENDİRİM", 0, -188);

    // Big Headline
    ctx.font = "900 48px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("İndi Sifariş Verin!", 0, -90);

    // Big Gradient CTA Button
    const btnGrad = ctx.createLinearGradient(-240, 0, 240, 0);
    btnGrad.addColorStop(0, "#fe0979");
    btnGrad.addColorStop(1, "#00f2fe");

    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.roundRect(-240, -10, 480, 84, 42);
    ctx.fill();

    ctx.font = "900 32px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("BİO-DAKI LİNKƏ KEÇİD ET 🔗", 0, 34);

    // Free delivery & Warranty tags
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.roundRect(-220, 120, 440, 60, 16);
    ctx.fill();

    ctx.font = "600 22px 'Inter', sans-serif";
    ctx.fillStyle = "#e5e7eb";
    ctx.fillText("🚚 Sürətli Çatdırılma | 🛡️ 100% Zəmanət", 0, 150);

    ctx.restore();
  }

  // SOCIAL OVERLAY (TikTok/Reels UI)
  renderSocialOverlay(ctx, W, H, t) {
    // Right action buttons (Heart, Comment, Share, Sound disc)
    const rightX = W - 60;
    const actions = [
      { icon: "❤️", count: "148.2K" },
      { icon: "💬", count: "3.4K" },
      { icon: "↗️", count: "21.9K" },
      { icon: "🔖", count: "18.5K" }
    ];

    actions.forEach((a, idx) => {
      const y = H - 520 + idx * 80;
      ctx.font = "32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(a.icon, rightX, y);

      ctx.font = "bold 16px 'Inter', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(a.count, rightX, y + 25);
    });

    // Spinning sound record disc at bottom right
    const discY = H - 140;
    ctx.save();
    ctx.translate(rightX, discY);
    ctx.rotate(t * 3);
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = "#fe0979";
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bottom author profile & sound ticker
    ctx.save();
    ctx.textAlign = "left";

    // Username
    ctx.font = "bold 24px 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("@shoppulse.official", 40, H - 120);

    // Audio name
    const soundTitle = this.trend ? this.trend.soundName : "Trending Audio";
    ctx.font = "18px 'Inter', sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(`🎵 ${soundTitle}`, 40, H - 85);

    // Progress bar at very bottom
    const progress = Math.min(1, t / this.duration);
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(0, H - 8, W, 8);
    ctx.fillStyle = "#00f2fe";
    ctx.fillRect(0, H - 8, W * progress, 8);

    ctx.restore();
  }

  renderWaveform(ctx, W, H, t) {
    const bars = 24;
    const startX = 140;
    const barW = 12;
    const gap = 8;
    const baseY = H - 240;

    ctx.fillStyle = "rgba(0, 242, 254, 0.75)";
    for (let i = 0; i < bars; i++) {
      const h = Math.abs(Math.sin(t * 6 + i * 0.4)) * 50 + 10;
      ctx.fillRect(startX + i * (barW + gap), baseY - h / 2, barW, h);
    }
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

  // EXPORT TO WEBM VIDEO USING MEDIARECORDER
  exportVideo(onProgress, onComplete, onError) {
    if (!this.canvas) {
      if (onError) onError("Canvas tapılmadı");
      return;
    }

    try {
      const stream = this.canvas.captureStream(30);
      let options = { mimeType: "video/webm;codecs=vp9" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm" };
      }

      const recorder = new MediaRecorder(stream, options);
      const chunks = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const pName = this.product ? this.product.name.replace(/\s+/g, "_") : "Product";
        a.download = `ShopPulse_Viral_Reklam_${pName}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        if (onComplete) onComplete();
      };

      // Stop current playback, seek to 0 and record
      this.pause();
      this.currentTime = 0;
      recorder.start();

      let exportTime = 0;
      const exportFps = 30;
      const step = 1 / exportFps;
      const totalSteps = this.duration * exportFps;
      let currentStep = 0;

      const exportInterval = setInterval(() => {
        exportTime += step;
        currentStep++;
        this.renderFrame(exportTime);

        const pct = Math.round((currentStep / totalSteps) * 100);
        if (onProgress) onProgress(pct);

        if (exportTime >= this.duration) {
          clearInterval(exportInterval);
          setTimeout(() => {
            recorder.stop();
          }, 300);
        }
      }, 1000 / exportFps);

    } catch (err) {
      console.error("Video export xətası:", err);
      if (onError) onError(err.message);
    }
  }
}

window.VideoAdEngine = VideoAdEngine;
