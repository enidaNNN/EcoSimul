/* ==========================================================================
   PYTHOMORI: AUDIO SYNTHESIZER
   Chiptune & Ambient Piano Synthesizer via Web Audio API (OMORI Soundscapes)
   ========================================================================== */

class PythomoriAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmTimer = null;
    this.currentTrack = 'idle'; // 'idle' | 'pyspace' | 'battle'
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.playBGM(this.currentTrack);
    }
    return this.isMuted;
  }

  // Typewriter Text SFX
  playTypewriter() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 60, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.025);
    
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // Menu Select SFX
  playMenuSelect() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.11);
  }

  // Door Creak / White Space Void Transition
  playDoor() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.35);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.42);
  }

  // Battle Start Heartbeat / Shatter
  playBattleStart() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Heartbeat thump
    const thump = this.ctx.createOscillator();
    const tGain = this.ctx.createGain();
    thump.type = 'triangle';
    thump.frequency.setValueAtTime(120, now);
    thump.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    tGain.gain.setValueAtTime(0.4, now);
    tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    thump.connect(tGain);
    tGain.connect(this.ctx.destination);
    thump.start(now);
    thump.stop(now + 0.35);

    // High Glitch Resonance
    const glitch = this.ctx.createOscillator();
    const gGain = this.ctx.createGain();
    glitch.type = 'sawtooth';
    glitch.frequency.setValueAtTime(1400, now + 0.05);
    glitch.frequency.exponentialRampToValueAtTime(200, now + 0.35);
    gGain.gain.setValueAtTime(0.15, now + 0.05);
    gGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    glitch.connect(gGain);
    gGain.connect(this.ctx.destination);
    glitch.start(now + 0.05);
    glitch.stop(now + 0.4);
  }

  // Attack Hit
  playHit() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Try-Except Shield Chime
  playTryExcept() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.12, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  }

  // Background Music Controller
  playBGM(track = 'idle') {
    this.currentTrack = track;
    if (this.isMuted) return;
    this.stopBGM();
    this.init();

    let step = 0;

    if (track === 'idle') {
      // Eerie, serene melancholic piano arpeggios (Am9 chord progression: A3, C4, E4, B4, G4)
      const pianoNotes = [220.00, 261.63, 329.63, 493.88, 392.00, 329.63, 261.63, 196.00];
      
      this.bgmTimer = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const freq = pianoNotes[step % pianoNotes.length];
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 1.25);

        step++;
      }, 550);
    } else if (track === 'pyspace') {
      // Whimsical pastel chiptune Headspace melody (C Major Pentatonic: C, D, E, G, A)
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      
      this.bgmTimer = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        
        // Melodic sparkle
        if (Math.random() > 0.25) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(scale[Math.floor(Math.random() * scale.length)], now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.26);
        }

        step++;
      }, 200);
    } else if (track === 'battle') {
      // Driving 8-bit battle synth bassline + pulse
      const bassNotes = [110, 110, 130.81, 146.83, 110, 110, 98, 123.47];
      
      this.bgmTimer = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        
        // Bass synth
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassNotes[step % bassNotes.length], now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

        // Snare / noise pulse
        if (step % 2 === 1) {
          const noise = this.ctx.createOscillator();
          const nGain = this.ctx.createGain();
          noise.type = 'square';
          noise.frequency.setValueAtTime(800 + Math.random() * 200, now);
          nGain.gain.setValueAtTime(0.02, now);
          nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          noise.connect(nGain);
          nGain.connect(this.ctx.destination);
          noise.start(now);
          noise.stop(now + 0.055);
        }

        step++;
      }, 160);
    }
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// Global instance
const AudioEngine = new PythomoriAudio();
