/**
 * ============================================================================
 * ECO-VALLEY: Advanced Multi-Species Simulation with Physical Collisions,
 * Dying Animations, Water Obstacles, and Environmental State.
 * ============================================================================
 */

class EcosystemSimulation {
  constructor(width = 1200, height = 800) {
    this.width = width;
    this.height = height;

    this.cols = 40;
    this.rows = 26;
    this.cellW = this.width / this.cols;
    this.cellH = this.height / this.rows;
    this.grid = [];

    // Berry Bushes
    this.bushes = [];

    // Animal Agents
    this.rabbits = [];
    this.deers = [];
    this.foxes = [];
    this.wolves = [];
    this.eagles = [];
    this.junimos = [];

    // Fading / Dying Spirit Entities (Death animations)
    this.fadingEntities = [];

    // Organic Pond & Dock Geometry
    this.pond = { x: 580, y: 520, rx: 155, ry: 90 };
    this.dock = { x: 455, y: 495, w: 85, h: 34 };

    // Obstacles Collision Footprints
    this.obstacles = [
      { id: 'barn', x: 940, y: 85, w: 140, h: 48 },
      { id: 'silo', x: 870, y: 65, w: 52, h: 75 },
      { id: 'well', x: 820, y: 192, w: 34, h: 14 },
      { id: 'shrine', x: 240, y: 145, w: 48, h: 25 },
      { id: 'desk', x: 130, y: 120, w: 42, h: 20 },
      // Tree Trunk Bases (footprint on ground)
      { id: 'tree1', x: 105, y: 265, r: 14 },
      { id: 'tree2', x: 115, y: 485, r: 14 },
      { id: 'tree3', x: 1125, y: 405, r: 14 },
      { id: 'tree4', x: 1105, y: 635, r: 14 },
      { id: 'tree5', x: 425, y: 115, r: 14 }
    ];

    // Climate & Season
    this.season = 'spring';
    this.weather = 'sunny';
    this.timeOfDay = 6 * 60;
    this.day = 1;
    this.speedMultiplier = 1;

    // History
    this.history = [];
    this.maxHistoryPoints = 60;
    this.historyTimer = 0;

    // Health
    this.ecoScore = 100;
    this.grassBiomass = 80;

    this.initGrid();
    this.initBerryBushes();
    this.initDefaultPopulations();
  }

  // --- Physical Collision Check ---
  isBlocked(x, y, radius = 6) {
    // 1. World Bounds
    if (x < 35 || x > this.width - 35 || y < 35 || y > this.height - 35) {
      return true;
    }

    // 2. Pond Water Check (Cannot walk in deep water unless on the wooden dock!)
    const p = this.pond;
    const dx = (x - p.x) / p.rx;
    const dy = (y - p.y) / p.ry;
    const distSq = dx * dx + dy * dy;

    if (distSq < 0.96) {
      // Inside water! Is it on the wooden dock?
      const d = this.dock;
      const onDock = (x >= d.x && x <= d.x + d.w && y >= d.y && y <= d.y + d.h);
      if (!onDock) {
        return true; // Blocked by water!
      }
    }

    // 3. Obstacle Collision Footprints
    for (const obs of this.obstacles) {
      if (obs.r) {
        // Circle trunk
        if (Math.hypot(x - obs.x, y - obs.y) < obs.r + radius) return true;
      } else {
        // Box obstacle
        if (x + radius > obs.x && x - radius < obs.x + obs.w &&
            y + radius > obs.y && y - radius < obs.y + obs.h) {
          return true;
        }
      }
    }

    return false;
  }

  initGrid() {
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        const x = c * this.cellW;
        const y = r * this.cellH;

        // Check if inside pond
        const pdx = (x - this.pond.x) / this.pond.rx;
        const pdy = (y - this.pond.y) / this.pond.ry;
        const isPond = (pdx * pdx + pdy * pdy < 1.0);
        const isPath = (r === 12 || c === 10);

        row.push({
          c, r, x, y,
          growth: (isPond || isPath) ? 0 : 0.65 + Math.random() * 0.35,
          isPond,
          isPath,
          moisture: isPond ? 1.0 : 0.8,
          flower: Math.random() < 0.25 && !isPond && !isPath,
          flowerType: Math.floor(Math.random() * 3)
        });
      }
      this.grid.push(row);
    }
  }

  initBerryBushes() {
    this.bushes = [
      { id: 'bush1', x: 380, y: 280, berries: 5, maxBerries: 5, regenTimer: 0 },
      { id: 'bush2', x: 440, y: 310, berries: 4, maxBerries: 5, regenTimer: 0 },
      { id: 'bush3', x: 740, y: 380, berries: 5, maxBerries: 5, regenTimer: 0 },
      { id: 'bush4', x: 790, y: 420, berries: 3, maxBerries: 5, regenTimer: 0 },
      { id: 'bush5', x: 500, y: 640, berries: 5, maxBerries: 5, regenTimer: 0 },
      { id: 'bush6', x: 560, y: 660, berries: 4, maxBerries: 5, regenTimer: 0 }
    ];
  }

  initDefaultPopulations() {
    this.rabbits = [];
    this.deers = [];
    this.foxes = [];
    this.wolves = [];
    this.eagles = [];
    this.junimos = [];
    this.fadingEntities = [];

    for (let i = 0; i < 14; i++) this.spawnRabbit();
    for (let i = 0; i < 4; i++) this.spawnDeer();
    for (let i = 0; i < 4; i++) this.spawnFox();
    for (let i = 0; i < 2; i++) this.spawnWolf();
    for (let i = 0; i < 2; i++) this.spawnEagle();

    this.junimos.push({
      x: 250, y: 150,
      color: '#76ff03',
      holdingStar: true,
      danceTimer: 0,
      jumpOffset: 0,
      emote: null
    });
  }

  // --- Spawning with Collision Safety ---
  findValidSpawnPos(minX, maxX, minY, maxY) {
    for (let attempt = 0; attempt < 30; attempt++) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      if (!this.isBlocked(x, y, 10)) {
        return { x, y };
      }
    }
    return { x: 300, y: 300 }; // Safe fallback
  }

  spawnRabbit(x = null, y = null) {
    let pos = { x, y };
    if (x === null || y === null || this.isBlocked(x, y, 6)) {
      pos = this.findValidSpawnPos(80, this.width - 80, 80, this.height - 80);
    }
    this.rabbits.push({
      id: Math.random().toString(36).substr(2, 7),
      name: 'Kelinci #' + Math.floor(Math.random() * 899 + 100),
      x: pos.x, y: pos.y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      energy: 70 + Math.random() * 20,
      age: Math.floor(Math.random() * 60),
      state: 'wander',
      jumpY: 0, jumpPhase: Math.random() * Math.PI,
      emote: null
    });
  }

  spawnDeer(x = null, y = null) {
    let pos = { x, y };
    if (x === null || y === null || this.isBlocked(x, y, 12)) {
      pos = this.findValidSpawnPos(120, this.width - 120, 150, this.height - 150);
    }
    this.deers.push({
      id: Math.random().toString(36).substr(2, 7),
      name: 'Rusa Hutan #' + Math.floor(Math.random() * 89 + 10),
      x: pos.x, y: pos.y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      energy: 75 + Math.random() * 20,
      age: Math.floor(Math.random() * 80),
      hasAntlers: Math.random() < 0.5,
      state: 'browse',
      walkCycle: Math.random() * Math.PI,
      emote: null
    });
  }

  spawnFox(x = null, y = null) {
    let pos = { x, y };
    if (x === null || y === null || this.isBlocked(x, y, 8)) {
      pos = this.findValidSpawnPos(120, this.width - 120, 120, this.height - 120);
    }
    this.foxes.push({
      id: Math.random().toString(36).substr(2, 7),
      name: 'Rubah #' + Math.floor(Math.random() * 899 + 100),
      x: pos.x, y: pos.y,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      energy: 70 + Math.random() * 20,
      age: Math.floor(Math.random() * 60),
      state: 'stalk',
      emote: null
    });
  }

  spawnWolf(x = null, y = null) {
    let pos = { x, y };
    if (x === null || y === null || this.isBlocked(x, y, 12)) {
      pos = this.findValidSpawnPos(150, this.width - 150, 150, this.height - 150);
    }
    this.wolves.push({
      id: Math.random().toString(36).substr(2, 7),
      name: 'Serigala #' + Math.floor(Math.random() * 89 + 10),
      x: pos.x, y: pos.y,
      vx: (Math.random() - 0.5) * 2.0,
      vy: (Math.random() - 0.5) * 2.0,
      energy: 80,
      age: Math.floor(Math.random() * 80),
      state: 'prowl',
      emote: null
    });
  }

  spawnEagle(x = null, y = null) {
    const ex = x !== null ? x : 200 + Math.random() * (this.width - 400);
    const ey = y !== null ? y : 200 + Math.random() * (this.height - 400);
    this.eagles.push({
      id: Math.random().toString(36).substr(2, 7),
      name: 'Elang Emas #' + Math.floor(Math.random() * 89 + 10),
      x: ex, y: ey,
      vx: 1.8, vy: 0.8,
      altitude: 60,
      wingAngle: 0,
      energy: 80,
      state: 'soar',
      targetPrey: null,
      emote: null
    });
  }

  // --- Trigger Fainting / Death Animation ---
  triggerDeath(entity, type, reason = 'starvation') {
    this.fadingEntities.push({
      type,
      x: entity.x,
      y: entity.y - (entity.altitude || 0),
      alpha: 1.0,
      floatY: 0,
      rot: 0,
      name: entity.name,
      reason,
      timer: 80
    });
  }

  // --- Population Sliders Setters ---
  setHerbivorePopulation(targetCount) {
    targetCount = Math.max(0, Math.min(50, targetCount));
    const targetRabbits = Math.round(targetCount * 0.75);
    const targetDeers = Math.round(targetCount * 0.25);

    while (this.rabbits.length < targetRabbits) this.spawnRabbit();
    while (this.rabbits.length > targetRabbits) {
      const r = this.rabbits.pop();
      this.triggerDeath(r, 'rabbit', 'relocated');
    }

    while (this.deers.length < targetDeers) this.spawnDeer();
    while (this.deers.length > targetDeers) {
      const d = this.deers.pop();
      this.triggerDeath(d, 'deer', 'relocated');
    }
  }

  setCarnivorePopulation(targetCount) {
    targetCount = Math.max(0, Math.min(18, targetCount));
    while (this.foxes.length < targetCount) this.spawnFox();
    while (this.foxes.length > targetCount) {
      const f = this.foxes.pop();
      this.triggerDeath(f, 'fox', 'relocated');
    }
  }

  setApexPopulation(targetCount) {
    targetCount = Math.max(0, Math.min(8, targetCount));
    const targetEagles = Math.ceil(targetCount * 0.5);
    const targetWolves = Math.floor(targetCount * 0.5);

    while (this.eagles.length < targetEagles) this.spawnEagle();
    while (this.eagles.length > targetEagles) {
      const e = this.eagles.pop();
      this.triggerDeath(e, 'eagle', 'relocated');
    }

    while (this.wolves.length < targetWolves) this.spawnWolf();
    while (this.wolves.length > targetWolves) {
      const w = this.wolves.pop();
      this.triggerDeath(w, 'wolf', 'relocated');
    }
  }

  setGrassCoverage(percentage) {
    const ratio = Math.max(0.05, Math.min(1.0, percentage / 100));
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.isPond && !cell.isPath) {
          cell.growth = Math.min(1.0, ratio * (0.65 + Math.random() * 0.35));
        }
      }
    }
  }

  // --- Main Simulation Loop ---
  update(dt = 1) {
    const step = dt * this.speedMultiplier;

    this.timeOfDay += 0.08 * step;
    if (this.timeOfDay >= 22 * 60) {
      this.timeOfDay = 6 * 60;
      this.day++;
    }

    this.updatePlants(step);
    this.updateRabbits(step);
    this.updateDeers(step);
    this.updateFoxes(step);
    this.updateWolves(step);
    this.updateEagles(step);
    this.updateJunimo(step);
    this.updateFadingEntities(step);
    this.updateMetrics(step);
  }

  updatePlants(step) {
    let rateMult = 1.0;
    if (this.season === 'summer') rateMult = 1.4;
    if (this.season === 'fall') rateMult = 0.7;
    if (this.season === 'winter') rateMult = 0.2;

    if (this.weather === 'rainy') rateMult *= 2.5;
    if (this.weather === 'storm') rateMult *= 3.0;
    if (this.weather === 'drought') rateMult *= 0.15;

    const growthStep = 0.0006 * rateMult * step;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.isPond || cell.isPath) continue;

        if (cell.growth < 1.0) {
          cell.growth = Math.min(1.0, cell.growth + growthStep * cell.moisture);
        }
        if (cell.growth > 0.85 && !cell.flower && Math.random() < 0.0003 && this.season !== 'winter') {
          cell.flower = true;
          cell.flowerType = Math.floor(Math.random() * 3);
        } else if (cell.growth < 0.4 || this.season === 'winter') {
          cell.flower = false;
        }
      }
    }

    for (const b of this.bushes) {
      if (b.berries < b.maxBerries) {
        b.regenTimer += step * rateMult;
        if (b.regenTimer > 320) {
          b.regenTimer = 0;
          b.berries++;
        }
      }
    }
  }

  updateRabbits(step) {
    const newRabbits = [];

    for (let i = this.rabbits.length - 1; i >= 0; i--) {
      const r = this.rabbits[i];
      r.age += 0.02 * step;
      r.energy -= 0.042 * step;

      if (r.emote) {
        r.emote.timer -= step;
        if (r.emote.timer <= 0) r.emote = null;
      }

      // Threats
      let threat = null;
      let minPredDist = 110;

      for (const fox of this.foxes) {
        const d = Math.hypot(fox.x - r.x, fox.y - r.y);
        if (d < minPredDist) { minPredDist = d; threat = fox; }
      }
      for (const wolf of this.wolves) {
        const d = Math.hypot(wolf.x - r.x, wolf.y - r.y);
        if (d < minPredDist) { minPredDist = d; threat = wolf; }
      }

      if (threat) {
        r.state = 'flee';
        const angle = Math.atan2(r.y - threat.y, r.x - threat.x);
        r.vx = Math.cos(angle) * 2.4;
        r.vy = Math.sin(angle) * 2.4;
        if (minPredDist < 45 && !r.emote) r.emote = { icon: '❗', timer: 25 };
      } else {
        const gridC = Math.max(0, Math.min(this.cols - 1, Math.floor(r.x / this.cellW)));
        const gridR = Math.max(0, Math.min(this.rows - 1, Math.floor(r.y / this.cellH)));
        const cell = this.grid[gridR][gridC];

        if (cell && cell.growth > 0.45 && !cell.isPond) {
          r.state = 'graze';
          r.vx *= 0.3;
          r.vy *= 0.3;
          cell.growth = Math.max(0.1, cell.growth - 0.007 * step);
          r.energy = Math.min(100, r.energy + 0.2 * step);
        } else {
          r.state = 'wander';
          if (Math.random() < 0.03) {
            r.vx = (Math.random() - 0.5) * 1.5;
            r.vy = (Math.random() - 0.5) * 1.5;
            r.jumpPhase = 0;
          }
        }
      }

      r.jumpPhase = (r.jumpPhase || 0) + 0.12 * step;
      r.jumpY = Math.abs(Math.sin(r.jumpPhase)) * -6;

      // Physical Obstacle & Water Collision Check
      const nextX = r.x + r.vx * step;
      const nextY = r.y + r.vy * step;

      if (!this.isBlocked(nextX, r.y, 6)) r.x = nextX;
      else r.vx = -r.vx * 0.8;

      if (!this.isBlocked(r.x, nextY, 6)) r.y = nextY;
      else r.vy = -r.vy * 0.8;

      // Reproduction (Energy > 82)
      if (r.energy > 82 && this.rabbits.length < 40 && Math.random() < 0.003 * step) {
        r.energy -= 30;
        r.emote = { icon: '❤️', timer: 45 };
        newRabbits.push({
          id: Math.random().toString(36).substr(2, 7),
          name: 'Anak Kelinci #' + Math.floor(Math.random() * 899 + 100),
          x: r.x + (Math.random() * 12 - 6),
          y: r.y + (Math.random() * 12 - 6),
          vx: (Math.random() - 0.5), vy: (Math.random() - 0.5),
          energy: 50, age: 0,
          state: 'wander', jumpY: 0, jumpPhase: 0,
          emote: { icon: '❤️', timer: 45 }
        });
      }

      // Starvation death with animation
      if (r.energy <= 0) {
        this.triggerDeath(r, 'rabbit', 'starvation');
        this.rabbits.splice(i, 1);
      }
    }

    if (newRabbits.length > 0) this.rabbits.push(...newRabbits);
  }

  updateDeers(step) {
    for (let i = this.deers.length - 1; i >= 0; i--) {
      const d = this.deers[i];
      d.age += 0.015 * step;
      d.energy -= 0.038 * step;

      // Smooth leg walk cycle
      const spd = Math.hypot(d.vx, d.vy);
      if (spd > 0.1) {
        d.walkCycle = (d.walkCycle || 0) + 0.12 * step;
      }

      if (d.emote) {
        d.emote.timer -= step;
        if (d.emote.timer <= 0) d.emote = null;
      }

      let wolfThreat = null;
      for (const w of this.wolves) {
        if (Math.hypot(w.x - d.x, w.y - d.y) < 150) { wolfThreat = w; break; }
      }

      if (wolfThreat) {
        d.state = 'flee';
        const angle = Math.atan2(d.y - wolfThreat.y, d.x - wolfThreat.x);
        d.vx = Math.cos(angle) * 2.6;
        d.vy = Math.sin(angle) * 2.6;
        if (!d.emote) d.emote = { icon: '❗', timer: 30 };
      } else {
        let nearestBush = null;
        let minBushDist = 120;
        for (const b of this.bushes) {
          if (b.berries > 0) {
            const dist = Math.hypot(b.x - d.x, b.y - d.y);
            if (dist < minBushDist) { minBushDist = dist; nearestBush = b; }
          }
        }

        if (nearestBush && minBushDist < 25) {
          nearestBush.berries--;
          d.energy = Math.min(100, d.energy + 20);
        } else if (nearestBush) {
          const angle = Math.atan2(nearestBush.y - d.y, nearestBush.x - d.x);
          d.vx = Math.cos(angle) * 1.2;
          d.vy = Math.sin(angle) * 1.2;
        } else {
          if (Math.random() < 0.02) {
            d.vx = (Math.random() - 0.5) * 1.1;
            d.vy = (Math.random() - 0.5) * 1.1;
          }
        }
      }

      // Obstacle & Water Collision
      const nextX = d.x + d.vx * step;
      const nextY = d.y + d.vy * step;

      if (!this.isBlocked(nextX, d.y, 10)) d.x = nextX;
      else d.vx = -d.vx * 0.8;

      if (!this.isBlocked(d.x, nextY, 10)) d.y = nextY;
      else d.vy = -d.vy * 0.8;

      if (d.energy > 85 && this.deers.length < 10 && Math.random() < 0.002 * step) {
        d.energy -= 35;
        d.emote = { icon: '❤️', timer: 45 };
        this.spawnDeer(d.x + 10, d.y + 10);
      }

      if (d.energy <= 0) {
        this.triggerDeath(d, 'deer', 'starvation');
        this.deers.splice(i, 1);
      }
    }
  }

  updateFoxes(step) {
    for (let i = this.foxes.length - 1; i >= 0; i--) {
      const f = this.foxes[i];
      f.age += 0.02 * step;
      f.energy -= 0.048 * step;

      if (f.emote) {
        f.emote.timer -= step;
        if (f.emote.timer <= 0) f.emote = null;
      }

      let threat = null;
      for (const w of this.wolves) {
        if (Math.hypot(w.x - f.x, w.y - f.y) < 110) { threat = w; break; }
      }
      for (const e of this.eagles) {
        if (e.targetPrey === f && e.state === 'dive') { threat = e; break; }
      }

      if (threat) {
        f.state = 'flee';
        f.vx = (Math.random() - 0.5) * 2.8;
        f.vy = (Math.random() - 0.5) * 2.8;
      } else {
        let closestRabbit = null;
        let minDist = 190;
        for (const r of this.rabbits) {
          const d = Math.hypot(r.x - f.x, r.y - f.y);
          if (d < minDist) { minDist = d; closestRabbit = r; }
        }

        if (closestRabbit) {
          const angle = Math.atan2(closestRabbit.y - f.y, closestRabbit.x - f.x);
          if (minDist < 18) {
            f.energy = Math.min(100, f.energy + 45);
            f.emote = { icon: '🍖', timer: 30 };
            this.triggerDeath(closestRabbit, 'rabbit', 'caught');
            const rIdx = this.rabbits.indexOf(closestRabbit);
            if (rIdx !== -1) this.rabbits.splice(rIdx, 1);
            if (window.AudioEngine) window.AudioEngine.playFoxBark();
          } else {
            f.vx = Math.cos(angle) * 2.2;
            f.vy = Math.sin(angle) * 2.2;
          }
        } else {
          if (Math.random() < 0.02) {
            f.vx = (Math.random() - 0.5) * 1.3;
            f.vy = (Math.random() - 0.5) * 1.3;
          }
        }
      }

      const nextX = f.x + f.vx * step;
      const nextY = f.y + f.vy * step;

      if (!this.isBlocked(nextX, f.y, 8)) f.x = nextX;
      else f.vx = -f.vx * 0.8;

      if (!this.isBlocked(f.x, nextY, 8)) f.y = nextY;
      else f.vy = -f.vy * 0.8;

      if (f.energy > 85 && this.foxes.length < 14 && Math.random() < 0.002 * step) {
        f.energy -= 35;
        f.emote = { icon: '❤️', timer: 45 };
        this.spawnFox(f.x + 10, f.y + 10);
      }

      if (f.energy <= 0) {
        this.triggerDeath(f, 'fox', 'starvation');
        this.foxes.splice(i, 1);
      }
    }
  }

  updateWolves(step) {
    for (let i = this.wolves.length - 1; i >= 0; i--) {
      const w = this.wolves[i];
      w.age += 0.015 * step;
      w.energy -= 0.04 * step;

      if (w.emote) {
        w.emote.timer -= step;
        if (w.emote.timer <= 0) w.emote = null;
      }

      let target = null;
      let minDist = 230;

      for (const d of this.deers) {
        const dist = Math.hypot(d.x - w.x, d.y - w.y);
        if (dist < minDist) { minDist = dist; target = d; }
      }
      if (!target) {
        for (const f of this.foxes) {
          const dist = Math.hypot(f.x - w.x, f.y - w.y);
          if (dist < minDist) { minDist = dist; target = f; }
        }
      }

      if (target) {
        const angle = Math.atan2(target.y - w.y, target.x - w.x);
        if (minDist < 22) {
          w.energy = Math.min(100, w.energy + 50);
          w.emote = { icon: '🍖', timer: 35 };

          const dIdx = this.deers.indexOf(target);
          if (dIdx !== -1) {
            this.triggerDeath(target, 'deer', 'caught');
            this.deers.splice(dIdx, 1);
          }
          const fIdx = this.foxes.indexOf(target);
          if (fIdx !== -1) {
            this.triggerDeath(target, 'fox', 'caught');
            this.foxes.splice(fIdx, 1);
          }
        } else {
          w.vx = Math.cos(angle) * 2.3;
          w.vy = Math.sin(angle) * 2.3;
        }
      } else {
        if (Math.random() < 0.02) {
          w.vx = (Math.random() - 0.5) * 1.4;
          w.vy = (Math.random() - 0.5) * 1.4;
        }
      }

      const nextX = w.x + w.vx * step;
      const nextY = w.y + w.vy * step;

      if (!this.isBlocked(nextX, w.y, 10)) w.x = nextX;
      else w.vx = -w.vx * 0.8;

      if (!this.isBlocked(w.x, nextY, 10)) w.y = nextY;
      else w.vy = -w.vy * 0.8;

      if (w.energy <= 0) {
        this.triggerDeath(w, 'wolf', 'starvation');
        this.wolves.splice(i, 1);
      }
    }
  }

  updateEagles(step) {
    for (let i = this.eagles.length - 1; i >= 0; i--) {
      const e = this.eagles[i];
      e.age += 0.01 * step;
      e.energy -= 0.035 * step;
      e.wingAngle = (e.wingAngle || 0) + 0.12 * step;

      if (e.emote) {
        e.emote.timer -= step;
        if (e.emote.timer <= 0) e.emote = null;
      }

      if (e.state === 'soar') {
        e.altitude = 60 + Math.sin(e.wingAngle * 0.3) * 6;
        
        // Circular graceful soaring trajectory
        const cX = e.x - this.width / 2;
        const cY = e.y - this.height / 2;
        e.vx += (-cY * 0.0005) * step;
        e.vy += (cX * 0.0005) * step;

        const spd = Math.hypot(e.vx, e.vy);
        if (spd > 0) { e.vx = (e.vx / spd) * 2.0; e.vy = (e.vy / spd) * 2.0; }

        if (e.energy < 70) {
          let target = null;
          if (this.foxes.length > 2) {
            target = this.foxes[Math.floor(Math.random() * this.foxes.length)];
          } else if (this.rabbits.length > 8) {
            target = this.rabbits[Math.floor(Math.random() * this.rabbits.length)];
          }

          if (target) {
            e.targetPrey = target;
            e.state = 'dive';
            if (window.AudioEngine) window.AudioEngine.playEagleScreech();
          }
        }
      } else if (e.state === 'dive') {
        if (e.targetPrey) {
          const dx = e.targetPrey.x - e.x;
          const dy = e.targetPrey.y - e.y;
          const dist = Math.hypot(dx, dy);

          e.altitude = Math.max(5, e.altitude - 1.8 * step);
          e.vx = (dx / (dist || 1)) * 3.8;
          e.vy = (dy / (dist || 1)) * 3.8;

          if (dist < 24 && e.altitude <= 15) {
            e.energy = Math.min(100, e.energy + 55);
            e.emote = { icon: '✨', timer: 35 };

            const foxIdx = this.foxes.indexOf(e.targetPrey);
            if (foxIdx !== -1) {
              this.triggerDeath(e.targetPrey, 'fox', 'caught');
              this.foxes.splice(foxIdx, 1);
            }
            const rabIdx = this.rabbits.indexOf(e.targetPrey);
            if (rabIdx !== -1) {
              this.triggerDeath(e.targetPrey, 'rabbit', 'caught');
              this.rabbits.splice(rabIdx, 1);
            }

            e.state = 'climb';
            e.targetPrey = null;
          } else if (dist > 360 || e.altitude <= 5) {
            e.state = 'climb';
            e.targetPrey = null;
          }
        } else {
          e.state = 'climb';
        }
      } else if (e.state === 'climb') {
        e.altitude += 1.2 * step;
        if (e.altitude >= 60) e.state = 'soar';
      }

      e.x += e.vx * step;
      e.y += e.vy * step;

      // Soft world bounce
      if (e.x < 50) e.vx = Math.abs(e.vx);
      if (e.x > this.width - 50) e.vx = -Math.abs(e.vx);
      if (e.y < 50) e.vy = Math.abs(e.vy);
      if (e.y > this.height - 50) e.vy = -Math.abs(e.vy);

      if (e.energy <= 0) {
        this.triggerDeath(e, 'eagle', 'starvation');
        this.eagles.splice(i, 1);
      }
    }
  }

  updateJunimo(step) {
    for (const j of this.junimos) {
      j.danceTimer += 0.08 * step;
      j.jumpOffset = Math.abs(Math.sin(j.danceTimer)) * -8;
    }
  }

  // --- Dying Spirit Animation Progress ---
  updateFadingEntities(step) {
    for (let i = this.fadingEntities.length - 1; i >= 0; i--) {
      const f = this.fadingEntities[i];
      f.timer -= step;
      f.floatY -= 0.6 * step;
      f.alpha = Math.max(0, f.timer / 80);
      f.rot += 0.02 * step;

      if (f.timer <= 0) {
        this.fadingEntities.splice(i, 1);
      }
    }
  }

  getEcosystemDiagnostics() {
    const herbivores = this.rabbits.length + this.deers.length;
    const carnivores = this.foxes.length;
    const apex = this.wolves.length + this.eagles.length;
    const grass = this.grassBiomass;

    if (this.weather === 'drought' && grass < 30) {
      return {
        status: 'drought_crisis',
        isBalanced: false,
        score: this.ecoScore,
        clue: 'Lembah ini mengalami krisis kekeringan. Produsen primer (rumput) mengering drastis sehingga kapasitas dukung tanah anjlok. Cobalah ubah cuaca menjadi hujan atau bantu siram tanaman agar rumput kembali bertunas.'
      };
    }

    if (herbivores > 30 && grass < 35) {
      return {
        status: 'herbivore_overpop',
        isBalanced: false,
        score: this.ecoScore,
        clue: 'Jumlah kelinci dan rusa terlalu padat sehingga rumput di padang habis dimakan. Jika produsen habis, herbivora akan mati kelaparan massal. Cobalah masukkan pemangsa (rubah atau serigala) untuk mengontrol populasi mereka.'
      };
    }

    if (herbivores <= 2) {
      return {
        status: 'herbivores_extinct',
        isBalanced: false,
        score: this.ecoScore,
        clue: 'Populasi kelinci dan rusa hampir punah. Tanpa herbivora, rubah dan serigala tidak memiliki mangsa dan akan segera kelaparan. Tambahkan kembali herbivora di panel slider.'
      };
    }

    if (carnivores === 0 && apex === 0) {
      return {
        status: 'no_predators',
        isBalanced: false,
        score: this.ecoScore,
        clue: 'Tidak ada pemangsa sama sekali di lembah. Tanpa adanya kontrol dari atas, populasi pemakan tumbuhan akan meledak dan menguras seluruh sumber daya hijau.'
      };
    }

    if (this.ecoScore >= 75 && grass > 55 && herbivores >= 8 && herbivores <= 30 && (carnivores + apex) >= 3) {
      return {
        status: 'harmonic_balance',
        isBalanced: true,
        score: this.ecoScore,
        clue: 'Luar biasa! Piramida makanan berada dalam harmoni yang sempurna. Produsen melimpah, herbivora terkontrol dengan baik, dan predator menjaga kestabilan alam.'
      };
    }

    return {
      status: 'adjusting',
      isBalanced: false,
      score: this.ecoScore,
      clue: 'Ekosistem sedang beradaptasi. Perhatikan apakah jumlah produsen rumput mencukupi untuk memberi makan seluruh herbivora di lembah.'
    };
  }

  updateMetrics(step) {
    let totalGrass = 0;
    let validCells = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.isPond && !cell.isPath) {
          totalGrass += cell.growth;
          validCells++;
        }
      }
    }
    this.grassBiomass = validCells > 0 ? (totalGrass / validCells) * 100 : 0;

    const herbivores = this.rabbits.length + this.deers.length;
    const carnivores = this.foxes.length;
    const apex = this.wolves.length + this.eagles.length;

    let score = 100;
    if (this.grassBiomass < 30) score -= (30 - this.grassBiomass) * 1.5;
    if (herbivores > 35) score -= (herbivores - 35) * 2;
    if (herbivores === 0) score -= 40;
    if (carnivores === 0 && apex === 0) score -= 30;
    if (apex > 6) score -= (apex - 6) * 6;

    this.ecoScore = Math.max(10, Math.min(100, Math.round(score)));

    this.historyTimer += step;
    if (this.historyTimer >= 30) {
      this.historyTimer = 0;
      this.history.push({
        grass: Math.round(this.grassBiomass),
        herbivores: herbivores,
        carnivores: carnivores * 3,
        apex: apex * 6
      });
      if (this.history.length > this.maxHistoryPoints) {
        this.history.shift();
      }
    }
  }

  plantGrassAt(worldX, worldY, radius = 2) {
    const centerC = Math.floor(worldX / this.cellW);
    const centerR = Math.floor(worldY / this.cellH);
    let planted = 0;

    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const r = centerR + dr;
        const c = centerC + dc;
        if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
          const cell = this.grid[r][c];
          if (!cell.isPond && !cell.isPath) {
            cell.growth = 1.0;
            cell.flower = Math.random() < 0.4;
            planted++;
          }
        }
      }
    }
    return planted;
  }
}

window.EcosystemSimulation = EcosystemSimulation;
