/**
 * ShopPulse Audio Synthesizer Engine
 * Generates viral trend background beats (Phonk, Lo-Fi, Upbeat, Synthwave)
 * Uses Web Audio API - 100% offline, zero external dependencies.
 */

class TrendAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentGenre = "phonk";
    this.timerId = null;
    this.step = 0;
    this.bpm = 128;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setGenre(genre) {
    this.currentGenre = genre || "phonk";
    switch (this.currentGenre) {
      case "phonk":
        this.bpm = 135;
        break;
      case "lofi":
        this.bpm = 82;
        break;
      case "upbeat":
        this.bpm = 124;
        break;
      case "synth":
        this.bpm = 118;
        break;
      default:
        this.bpm = 128;
    }
  }

  play() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;
    const intervalMs = (60 / this.bpm / 4) * 1000; // 16th notes
    this.timerId = setInterval(() => {
      this.tick();
      this.step = (this.step + 1) % 16;
    }, intervalMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  tick() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const s = this.step;

    if (this.currentGenre === "phonk") {
      // Hard kick on 0, 4, 8, 12 + Cowbell melody
      if (s % 4 === 0) this.triggerKick(now, 130, 40, 0.2);
      if (s === 4 || s === 12) this.triggerSnare(now);
      if (s % 2 === 0) this.triggerHiHat(now, 0.04);
      // Cowbell melody
      const melody = [587, 0, 523, 0, 659, 587, 0, 523, 784, 0, 659, 0, 587, 523, 0, 440];
      if (melody[s] > 0) this.triggerCowbell(now, melody[s]);
    } else if (this.currentGenre === "lofi") {
      // Soft boom-bap lofi
      if (s === 0 || s === 6 || s === 10) this.triggerKick(now, 90, 45, 0.3);
      if (s === 4 || s === 12) this.triggerSnare(now, 0.15, true);
      if (s % 2 === 0) this.triggerHiHat(now, 0.08, 0.05);
      // Soft Rhodes chord
      if (s === 0 || s === 8) this.triggerChord(now, [261.63, 329.63, 392.00, 493.88]);
    } else if (this.currentGenre === "upbeat") {
      // 4-on-the-floor dance pop
      if (s % 4 === 0) this.triggerKick(now, 150, 50, 0.18);
      if (s === 4 || s === 12) this.triggerSnare(now, 0.25);
      if (s % 2 === 1) this.triggerHiHat(now, 0.08); // Offbeat hi-hat
      if (s % 4 === 2) this.triggerSynthPluck(now, 440);
    } else {
      // Synthwave
      if (s % 4 === 0) this.triggerKick(now, 120, 45, 0.25);
      if (s === 4 || s === 12) this.triggerSnare(now, 0.3);
      this.triggerHiHat(now, 0.05, 0.03);
      if (s % 2 === 0) this.triggerBass(now, 110);
    }
  }

  triggerKick(time, startFreq = 140, endFreq = 45, dur = 0.2) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + dur);
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + dur);
  }

  triggerSnare(time, dur = 0.2, soft = false) {
    // Noise buffer + tone
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(soft ? 600 : 1000, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(soft ? 0.3 : 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
  }

  triggerHiHat(time, dur = 0.05, vol = 0.15) {
    const osc = this.ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(8000, time);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(7000, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + dur);
  }

  triggerCowbell(time, freq) {
    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, time);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq * 1.5, time);
    filter.Q.value = 4;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  triggerChord(time, freqs) {
    freqs.forEach(f => {
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, time);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.8);
    });
  }

  triggerSynthPluck(time, freq) {
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.18);
  }

  triggerBass(time, freq) {
    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, time);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(350, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.2);
  }
}

window.trendAudio = new TrendAudioEngine();
