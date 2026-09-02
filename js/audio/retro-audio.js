/**
 * ============================================================================
 * ECO-VALLEY: Retro Synthesizer Audio Engine (Web Audio API)
 * Generates cozy Stardew Valley acoustic/chiptune tones and ambient nature SFX.
 * ============================================================================
 */

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.masterGain = null;
    this.isPlayingBgm = false;
    this.isMuted = false;
    this.bgmTimer = null;
    this.currentStep = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.bgmGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  // --- Sound Effects ---

  // Cute retro typewriter blip for dialogue
  playDialogueBlip(pitch = 380) {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch + (Math.random() * 40 - 20), this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Soft grass rustle / walking sound
  playFootstep() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Rabbit crunching grass
  playMunch() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260 + Math.random() * 80, this.ctx.currentTime);
    osc.frequency.setValueAtTime(420, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Cute rabbit hop
  playRabbitHop() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(560, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  // Fox pounce / yip
  playFoxBark() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.19);
  }

  // Eagle high cry / wing flap
  playEagleScreech() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.32);
  }

  // Junimo magical chime / star drop
  playJunimoChime() {
    if (this.isMuted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);
      }, idx * 70);
    });
  }

  // Planting seeds
  playPlantSeed() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  // --- Stardew Valley Cozy Spring Theme BGM Sequencer ---
  startBgm() {
    this.ensureContext();
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;

    // Melody notes (Pentatonic cozy pastoral: C, D, E, G, A)
    const melody = [
      { note: 261.63, dur: 0.3 }, // C4
      { note: 329.63, dur: 0.3 }, // E4
      { note: 392.00, dur: 0.4 }, // G4
      { note: 523.25, dur: 0.5 }, // C5
      { note: 440.00, dur: 0.3 }, // A4
      { note: 392.00, dur: 0.4 }, // G4
      { note: 329.63, dur: 0.5 }, // E4
      { note: 293.66, dur: 0.3 }, // D4
      { note: 261.63, dur: 0.6 }, // C4
      { note: 392.00, dur: 0.3 }, // G4
      { note: 440.00, dur: 0.3 }, // A4
      { note: 523.25, dur: 0.5 }, // C5
      { note: 587.33, dur: 0.4 }, // D5
      { note: 523.25, dur: 0.6 }  // C5
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isPlayingBgm || !this.ctx) return;
      const current = melody[noteIdx];
      noteIdx = (noteIdx + 1) % melody.length;

      // Play soft warm tone (like acoustic guitar / marimba)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(current.note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + current.dur + 0.3);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start();
      osc.stop(this.ctx.currentTime + current.dur + 0.35);

      this.bgmTimer = setTimeout(playNext, (current.dur + 0.25) * 1000);
    };

    playNext();
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// Global audio singleton
window.AudioEngine = new RetroAudioEngine();
