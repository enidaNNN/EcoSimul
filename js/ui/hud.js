/**
 * ============================================================================
 * ECO-VALLEY: Advanced HUD, Stardew Clock & Climate Controls
 * Manages Stardew Valley clock dial, seasonal climate selector, weather changes,
 * real-time population sliders, and dynamic population chart.
 * ============================================================================
 */

class HudManager {
  constructor(sim) {
    this.sim = sim;
    this.chartCanvas = document.getElementById('chartCanvas');
    this.chartCtx = this.chartCanvas ? this.chartCanvas.getContext('2d') : null;

    // Clock Elements
    this.clockHand = document.getElementById('clockHand');
    this.clockSky = document.getElementById('clockSky');
    this.clockTimeText = document.getElementById('clockTimeText');
    this.clockDayText = document.getElementById('clockDayText');
    this.weatherIcon = document.getElementById('weatherIcon');
    this.seasonIcon = document.getElementById('seasonIcon');
    this.goldScoreNumber = document.getElementById('goldScoreNumber');

    // Sliders
    this.sliderGrass = document.getElementById('sliderGrass');
    this.sliderHerbivores = document.getElementById('sliderHerbivores');
    this.sliderCarnivores = document.getElementById('sliderCarnivores');
    this.sliderApex = document.getElementById('sliderApex');

    // Counts
    this.countGrass = document.getElementById('countGrass');
    this.countHerbivores = document.getElementById('countHerbivores');
    this.countCarnivores = document.getElementById('countCarnivores');
    this.countApex = document.getElementById('countApex');

    this.isDraggingSlider = false;
    this.initSliderListeners();
    this.initClimateListeners();
  }

  initSliderListeners() {
    if (this.sliderGrass) {
      this.sliderGrass.addEventListener('input', (e) => {
        this.isDraggingSlider = true;
        this.sim.setGrassCoverage(parseInt(e.target.value, 10));
      });
      this.sliderGrass.addEventListener('change', () => { this.isDraggingSlider = false; });
    }

    if (this.sliderHerbivores) {
      this.sliderHerbivores.addEventListener('input', (e) => {
        this.isDraggingSlider = true;
        this.sim.setHerbivorePopulation(parseInt(e.target.value, 10));
      });
      this.sliderHerbivores.addEventListener('change', () => { this.isDraggingSlider = false; });
    }

    if (this.sliderCarnivores) {
      this.sliderCarnivores.addEventListener('input', (e) => {
        this.isDraggingSlider = true;
        this.sim.setCarnivorePopulation(parseInt(e.target.value, 10));
      });
      this.sliderCarnivores.addEventListener('change', () => { this.isDraggingSlider = false; });
    }

    if (this.sliderApex) {
      this.sliderApex.addEventListener('input', (e) => {
        this.isDraggingSlider = true;
        this.sim.setApexPopulation(parseInt(e.target.value, 10));
      });
      this.sliderApex.addEventListener('change', () => { this.isDraggingSlider = false; });
    }
  }

  initClimateListeners() {
    // Season Select
    const selectSeason = document.getElementById('selectSeason');
    if (selectSeason) {
      selectSeason.addEventListener('change', (e) => {
        this.sim.season = e.target.value;
        this.updateSeasonVisuals();
        if (window.DialogueSystem) {
          const names = { spring: 'Musim Semi', summer: 'Musim Panas', fall: 'Musim Gugur', winter: 'Musim Dingin' };
          window.DialogueSystem.showTemporaryNotice(`Musim berganti menjadi ${names[this.sim.season]}.`);
        }
      });
    }

    // Weather Select
    const selectWeather = document.getElementById('selectWeather');
    if (selectWeather) {
      selectWeather.addEventListener('change', (e) => {
        this.sim.weather = e.target.value;
        this.updateWeatherVisuals();
        if (window.DialogueSystem) {
          const names = { sunny: 'Cerah Berawan', rainy: 'Hujan Subur', storm: 'Badai Petir', drought: 'Kemarau Kering' };
          window.DialogueSystem.showTemporaryNotice(`Cuaca berubah menjadi ${names[this.sim.weather]}.`);
        }
      });
    }

    // Speed toggle button
    const btnSpeed = document.getElementById('btnSpeed');
    if (btnSpeed) {
      btnSpeed.addEventListener('click', () => {
        if (this.sim.speedMultiplier === 1) {
          this.sim.speedMultiplier = 2;
          btnSpeed.textContent = '2x Cepat';
        } else if (this.sim.speedMultiplier === 2) {
          this.sim.speedMultiplier = 4;
          btnSpeed.textContent = '4x Turbo';
        } else {
          this.sim.speedMultiplier = 1;
          btnSpeed.textContent = '1x Normal';
        }
      });
    }

    // Sound toggle
    const btnSound = document.getElementById('btnSound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isMuted = !window.AudioEngine.toggleMute();
        btnSound.textContent = isMuted ? 'Suara: OFF' : 'Suara: ON';
      });
    }
  }

  updateSeasonVisuals() {
    const s = this.sim.season;
    if (this.seasonIcon) {
      if (s === 'spring') this.seasonIcon.textContent = '🌸';
      else if (s === 'summer') this.seasonIcon.textContent = '🌻';
      else if (s === 'fall') this.seasonIcon.textContent = '🍁';
      else if (s === 'winter') this.seasonIcon.textContent = '❄️';
    }
  }

  updateWeatherVisuals() {
    const w = this.sim.weather;
    if (this.weatherIcon) {
      if (w === 'sunny') this.weatherIcon.textContent = '☀️';
      else if (w === 'rainy') this.weatherIcon.textContent = '🌧️';
      else if (w === 'storm') this.weatherIcon.textContent = '⛈️';
      else if (w === 'drought') this.weatherIcon.textContent = '🔥';
    }
  }

  update() {
    const sim = this.sim;

    // 1. Clock Dial & Time Format (Stardew Style)
    const totalMinutes = sim.timeOfDay;
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.floor(totalMinutes % 60);
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const ampm = hours >= 12 ? 'pm' : 'am';
    const minPadded = mins < 10 ? '0' + mins : mins;

    if (this.clockTimeText) {
      this.clockTimeText.textContent = `${displayHour}:${minPadded} ${ampm}`;
    }

    const days = ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'];
    const currentDayName = days[(sim.day - 1) % 7];
    if (this.clockDayText) {
      this.clockDayText.textContent = `${currentDayName} ${sim.day}`;
    }

    // Sky wheel rotation (06:00 to 22:00 -> 0 to 360 deg)
    const sunAngle = ((totalMinutes - 360) / 960) * 360;
    if (this.clockSky) {
      this.clockSky.style.transform = `rotate(${sunAngle}deg)`;
    }
    if (this.clockHand) {
      this.clockHand.style.transform = `translate(-50%, -100%) rotate(${sunAngle}deg)`;
    }

    // 2. Eco Gold Score
    if (this.goldScoreNumber) {
      const displayScore = sim.ecoScore * 10;
      this.goldScoreNumber.textContent = displayScore.toString().padStart(4, '0');
    }

    // 3. Update Sliders & Counts
    const grassPct = Math.round(sim.grassBiomass);
    if (this.countGrass) this.countGrass.textContent = grassPct + '%';
    if (!this.isDraggingSlider && this.sliderGrass) {
      this.sliderGrass.value = grassPct;
    }

    const herbCount = sim.rabbits.length + sim.deers.length;
    if (this.countHerbivores) this.countHerbivores.textContent = `${herbCount} (${sim.rabbits.length}🐇 + ${sim.deers.length}🦌)`;
    if (!this.isDraggingSlider && this.sliderHerbivores) {
      this.sliderHerbivores.value = herbCount;
    }

    const carnCount = sim.foxes.length;
    if (this.countCarnivores) this.countCarnivores.textContent = `${carnCount} (🦊)`;
    if (!this.isDraggingSlider && this.sliderCarnivores) {
      this.sliderCarnivores.value = carnCount;
    }

    const apexCount = sim.wolves.length + sim.eagles.length;
    if (this.countApex) this.countApex.textContent = `${apexCount} (${sim.eagles.length}🦅 + ${sim.wolves.length}🐺)`;
    if (!this.isDraggingSlider && this.sliderApex) {
      this.sliderApex.value = apexCount;
    }

    // 4. Render Dynamic Population Chart
    this.renderChart();
  }

  renderChart() {
    if (!this.chartCtx || !this.sim.history || this.sim.history.length === 0) return;
    const ctx = this.chartCtx;
    const w = this.chartCanvas.width;
    const h = this.chartCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#e6d8ba';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    const hist = this.sim.history;
    const stepX = w / (this.sim.maxHistoryPoints - 1);

    // Green (Produsen), Orange (Konsumen 1), Red (Konsumen 2), Blue (Konsumen Puncak)
    this.drawSeries(ctx, hist.map(p => p.grass), stepX, h, 100, '#4caf50', 2);
    this.drawSeries(ctx, hist.map(p => p.herbivores), stepX, h, 50, '#f59f00', 2);
    this.drawSeries(ctx, hist.map(p => p.carnivores / 3), stepX, h, 15, '#e03131', 2);
    this.drawSeries(ctx, hist.map(p => p.apex / 6), stepX, h, 8, '#1971c2', 2);
  }

  drawSeries(ctx, values, stepX, height, maxVal, color, lineWidth = 1.5) {
    if (values.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    for (let i = 0; i < values.length; i++) {
      const x = i * stepX;
      const normalized = Math.max(0, Math.min(1, values[i] / maxVal));
      const y = height - normalized * (height - 6) - 3;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

window.HudManager = HudManager;
