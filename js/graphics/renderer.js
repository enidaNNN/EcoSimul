/**
 * ============================================================================
 * ECO-VALLEY: Realistic Organic Stardew Valley Canvas Renderer
 * Depth-sorted 2.5D objects (pass behind trees, bushes, and buildings),
 * dying spirits, organic curved pond, wooden pier, and dynamic lighting.
 * ============================================================================
 */

class EcoRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animTimer = 0;

    // Organic Pond & Dock Geometry
    this.pondCenter = { x: 580, y: 520, rx: 155, ry: 90 };
    this.dock = { x: 455, y: 495, w: 85, h: 34 };

    this.initWeatherParticles();
  }

  initWeatherParticles() {
    this.petals = [];
    for (let i = 0; i < 25; i++) {
      this.petals.push({
        x: Math.random() * 1300, y: Math.random() * 850,
        size: 3 + Math.random() * 3,
        speedX: 0.8 + Math.random() * 1.0, speedY: 0.5 + Math.random() * 0.7,
        rot: Math.random() * Math.PI * 2, rotSpeed: 0.03
      });
    }

    this.leaves = [];
    for (let i = 0; i < 25; i++) {
      this.leaves.push({
        x: Math.random() * 1300, y: Math.random() * 850,
        size: 4 + Math.random() * 3,
        color: Math.random() < 0.5 ? '#d9480f' : '#f59f00',
        speedX: 1.0 + Math.random() * 1.2, speedY: 0.7 + Math.random() * 1.0,
        rot: Math.random() * Math.PI * 2, rotSpeed: 0.04
      });
    }

    this.raindrops = [];
    for (let i = 0; i < 80; i++) {
      this.raindrops.push({
        x: Math.random() * 1300, y: Math.random() * 850,
        len: 12 + Math.random() * 10, speedY: 14 + Math.random() * 6
      });
    }

    this.snowflakes = [];
    for (let i = 0; i < 45; i++) {
      this.snowflakes.push({
        x: Math.random() * 1300, y: Math.random() * 850,
        radius: 1.5 + Math.random() * 2, speedY: 0.8 + Math.random() * 1.0,
        speedX: (Math.random() - 0.5) * 0.5
      });
    }
  }

  render(sim, player) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.animTimer += 0.03;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Organic Meadow Terrain (Grass, Paths)
    this.drawTerrain(sim);

    // 2. Draw Realistic Curved Pond & River
    this.drawCurvedPond(sim);

    // 3. Draw Entity Shadows
    this.drawEntityShadows(sim, player);

    // 4. Collect & Depth-Sort ALL World Objects (2.5D Y-Sorting)
    const objects = [];

    // Farm Buildings & Structures (Sorted by their base footprint Y on ground)
    objects.push({ type: 'barn', y: 133, draw: () => this.drawBarn(940, 45) });
    objects.push({ type: 'silo', y: 140, draw: () => this.drawSilo(870, 35) });
    objects.push({ type: 'well', y: 204, draw: () => this.drawStoneWell(820, 180) });
    objects.push({ type: 'shrine', y: 168, draw: () => this.drawShrine(240, 130) });
    objects.push({ type: 'desk', y: 134, draw: () => this.drawDesk(130, 110) });

    // Trees (Base footprint is y + 74 where trunk roots touch soil)
    const trees = [
      { x: 80, y: 200 },
      { x: 90, y: 420 },
      { x: 1100, y: 340 },
      { x: 1080, y: 570 },
      { x: 400, y: 50 }
    ];
    for (const tr of trees) {
      objects.push({
        type: 'tree',
        y: tr.y + 74, // Base footprint! Entities with Y < tr.y + 74 render BEHIND the tree!
        draw: () => this.drawLushTree(tr.x, tr.y, sim.season)
      });
    }

    // Berry Bushes (Base footprint is y + 14)
    for (const b of sim.bushes) {
      objects.push({
        type: 'bush',
        y: b.y + 14, // Base footprint!
        draw: () => this.drawBerryBush(b.x, b.y, b.berries)
      });
    }

    // Animals & Player (Sorted by feet Y)
    const pe = window.PixelSpriteEngine;

    for (const r of sim.rabbits) {
      objects.push({ type: 'rabbit', y: r.y + 6, draw: () => pe.drawRabbit(ctx, r) });
    }
    for (const d of sim.deers) {
      objects.push({ type: 'deer', y: d.y + 18, draw: () => pe.drawDeer(ctx, d) });
    }
    for (const f of sim.foxes) {
      objects.push({ type: 'fox', y: f.y + 10, draw: () => pe.drawFox(ctx, f) });
    }
    for (const w of sim.wolves) {
      objects.push({ type: 'wolf', y: w.y + 14, draw: () => pe.drawWolf(ctx, w) });
    }
    for (const j of sim.junimos) {
      objects.push({ type: 'junimo', y: j.y + 8, draw: () => this.drawJunimo(j) });
    }

    // Fading / Dying Spirits
    for (const f of sim.fadingEntities) {
      objects.push({
        type: 'spirit',
        y: f.y + 6,
        draw: () => pe.drawFadingSpirit(ctx, f)
      });
    }

    // Player (Feet Y is player.y + 18)
    objects.push({
      type: 'player',
      y: player.y + 18,
      draw: () => pe.drawPlayer(ctx, player.x, player.y, player.facing, player.isMoving, this.animTimer, player.hat, player.name)
    });

    // Precise Y-Sorting: Lower Y draws first (behind), Higher Y draws later (in front)!
    objects.sort((a, b) => a.y - b.y);

    for (const obj of objects) {
      obj.draw();
    }

    // 5. Draw Eagles in Sky (Above everything on ground)
    for (const eagle of sim.eagles) {
      pe.drawEagle(ctx, eagle);
    }

    // 6. Draw Rare Event Emotes
    this.drawEmotes(sim);

    // 7. Atmospheric Weather & Season Lighting
    this.drawAtmosphere(sim);
  }

  // --- Terrain: Organic Grass, Paths, and Wildflowers ---

  drawTerrain(sim) {
    const ctx = this.ctx;
    const season = sim.season;

    let cGrassDark = '#3a6620';
    let cGrassMid = '#4a8229';
    let cGrassLight = '#5d9e34';
    let cDirt = '#8a6237';

    if (season === 'summer') {
      cGrassDark = '#2c6b24'; cGrassMid = '#388e3c'; cGrassLight = '#4caf50';
    } else if (season === 'fall') {
      cGrassDark = '#6e541e'; cGrassMid = '#8d702a'; cGrassLight = '#b08f37'; cDirt = '#754b20';
    } else if (season === 'winter') {
      cGrassDark = '#60796b'; cGrassMid = '#7e9a8b'; cGrassLight = '#a6bea9'; cDirt = '#61524b';
    }

    for (let r = 0; r < sim.rows; r++) {
      for (let c = 0; c < sim.cols; c++) {
        const cell = sim.grid[r][c];
        if (cell.isPond) continue;

        const x = cell.x;
        const y = cell.y;

        if (cell.isPath) {
          ctx.fillStyle = cDirt;
          ctx.fillRect(x, y, sim.cellW, sim.cellH);
          ctx.fillStyle = '#5c3917';
          ctx.fillRect(x + 4, y + 4, 6, 4);
          ctx.fillRect(x + 16, y + 14, 8, 4);
        } else {
          const g = cell.growth;
          if (g < 0.25) ctx.fillStyle = cDirt;
          else if (g < 0.6) ctx.fillStyle = cGrassDark;
          else if (g < 0.85) ctx.fillStyle = cGrassMid;
          else ctx.fillStyle = cGrassLight;
          ctx.fillRect(x, y, sim.cellW, sim.cellH);

          if (g > 0.45) {
            ctx.fillStyle = season === 'fall' ? '#c7a346' : '#73c23e';
            ctx.fillRect(x + 5, y + 6, 2, 6);
            ctx.fillRect(x + 8, y + 4, 2, 8);
          }

          if (cell.flower && g > 0.65 && season !== 'winter') {
            const fx = x + sim.cellW / 2;
            const fy = y + sim.cellH / 2;
            ctx.fillStyle = '#2d5718';
            ctx.fillRect(fx, fy, 2, 4);

            if (cell.flowerType === 0) ctx.fillStyle = '#f43f5e';
            else if (cell.flowerType === 1) ctx.fillStyle = '#fbbf24';
            else ctx.fillStyle = '#a855f7';

            ctx.fillRect(fx - 2, fy - 3, 5, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(fx - 1, fy - 2, 2, 2);
          }
        }
      }
    }
  }

  // --- Realistic Curved Organic Pond & Wooden Fishing Dock ---

  drawCurvedPond(sim) {
    const ctx = this.ctx;
    const { x, y, rx, ry } = this.pondCenter;

    // 1. Organic Curved Shoreline Beach (Sandy Pebble Rim)
    ctx.fillStyle = '#9e7a3e';
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 14, ry + 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#c49a60';
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 8, ry + 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scattered Shoreline River Pebbles
    ctx.fillStyle = '#7a5a3a';
    ctx.fillRect(x - rx + 10, y - 10, 6, 4);
    ctx.fillRect(x + rx - 20, y + 20, 8, 5);
    ctx.fillRect(x - 40, y + ry + 4, 7, 4);
    ctx.fillRect(x + 50, y - ry - 4, 8, 4);

    // 2. Shallow Crystal Turquoise Water
    ctx.fillStyle = '#38a3c2';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Deep Ocean-Teal Water Core
    ctx.fillStyle = '#1c5a77';
    ctx.beginPath();
    ctx.ellipse(x, y + 6, rx - 28, ry - 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Animated Water Waves & Caustics
    const wave = Math.sin(this.animTimer * 2) * 5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x - 50 + wave, y - 20, 35, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(x + 40 - wave, y + 25, 45, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Floating Rounded Lily Pads & Lotus Flowers
    const lilyPads = [
      { lx: x - 70, ly: y + 20, r: 10 },
      { lx: x - 85, ly: y + 10, r: 8 },
      { lx: x + 60, ly: y - 30, r: 11 },
      { lx: x + 80, ly: y - 20, r: 9 },
      { lx: x - 10, ly: y + 45, r: 12 }
    ];

    for (const lp of lilyPads) {
      ctx.fillStyle = '#2d7a3e';
      ctx.beginPath();
      ctx.arc(lp.lx, lp.ly, lp.r, 0.2, Math.PI * 1.9);
      ctx.lineTo(lp.lx, lp.ly);
      ctx.fill();

      if (lp.r >= 11) {
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(lp.lx - 3, lp.ly - 4, 6, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(lp.lx - 1, lp.ly - 2, 2, 2);
      }
    }

    // 6. Rustic Wooden Fishing Pier / Dock
    const d = this.dock;
    // Wooden Support Pilings in water
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(d.x + 25, d.y + d.h, 8, 18);
    ctx.fillRect(d.x + d.w - 12, d.y + d.h, 8, 18);

    // Dock Wooden Planks
    ctx.fillStyle = '#8d5b32';
    ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.fillStyle = '#5c3514';
    for (let px = d.x; px < d.x + d.w; px += 10) {
      ctx.fillRect(px, d.y, 2, d.h);
    }
    // Top highlight & bottom shadow
    ctx.fillStyle = '#b37c46';
    ctx.fillRect(d.x, d.y, d.w, 2);
    ctx.fillStyle = '#4a2810';
    ctx.fillRect(d.x, d.y + d.h - 2, d.w, 2);

    // Mooring Bollard Posts
    ctx.fillStyle = '#4a2810';
    ctx.fillRect(d.x + d.w - 6, d.y - 4, 6, 8);
    ctx.fillRect(d.x + d.w - 6, d.y + d.h - 4, 6, 8);
  }

  // --- Farm Buildings & Props ---

  drawBarn(x, y) {
    const ctx = this.ctx;
    ctx.fillStyle = '#7d2020';
    ctx.fillRect(x, y + 42, 140, 88);
    ctx.fillStyle = '#5c1414';
    for (let i = 0; i < 140; i += 12) ctx.fillRect(x + i, y + 42, 2, 88);

    ctx.fillStyle = '#a83232';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 42);
    ctx.lineTo(x + 70, y);
    ctx.lineTo(x + 148, y + 42);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3d0d0d';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#4a2810';
    ctx.fillRect(x + 45, y + 68, 50, 62);
    ctx.fillStyle = '#784119';
    ctx.fillRect(x + 48, y + 71, 44, 56);
    ctx.fillStyle = '#4a2810';
    ctx.fillRect(x + 68, y + 71, 4, 56);
    ctx.fillRect(x + 48, y + 97, 44, 4);

    ctx.fillStyle = '#fff3b0';
    ctx.fillRect(x + 58, y + 22, 24, 18);
    ctx.fillStyle = '#3d0d0d';
    ctx.strokeRect(x + 58, y + 22, 24, 18);

    // Hay Bales beside Barn
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x - 22, y + 100, 18, 14);
    ctx.fillStyle = '#ca8a04';
    ctx.strokeRect(x - 22, y + 100, 18, 14);
    ctx.fillRect(x - 18, y + 100, 2, 14);
    ctx.fillRect(x - 10, y + 100, 2, 14);
  }

  drawSilo(x, y) {
    const ctx = this.ctx;
    ctx.fillStyle = '#9e472a';
    ctx.fillRect(x, y + 30, 52, 110);
    ctx.fillStyle = '#6e2b14';
    for (let by = y + 36; by < y + 136; by += 10) ctx.fillRect(x, by, 52, 2);

    ctx.fillStyle = '#ba3c1c';
    ctx.beginPath();
    ctx.arc(x + 26, y + 30, 26, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#421406';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  drawStoneWell(x, y) {
    const ctx = this.ctx;
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x, y + 12, 34, 20);
    ctx.fillStyle = '#334155';
    for (let row = y + 14; row < y + 32; row += 6) ctx.fillRect(x, row, 34, 2);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 4, y + 14, 26, 8);

    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 2, y - 6, 4, 18);
    ctx.fillRect(x + 28, y - 6, 4, 18);

    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 4);
    ctx.lineTo(x + 17, y - 18);
    ctx.lineTo(x + 38, y - 4);
    ctx.closePath();
    ctx.fill();
  }

  drawShrine(x, y) {
    const ctx = this.ctx;
    ctx.fillStyle = '#5c6b5b';
    ctx.fillRect(x, y, 48, 38);
    ctx.fillStyle = '#404d3f';
    ctx.fillRect(x + 4, y + 4, 40, 30);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(x + 20, y + 12, 8, 8);
    ctx.fillStyle = '#76ff03';
    ctx.fillRect(x + 22, y + 14, 4, 4);
  }

  drawDesk(x, y) {
    const ctx = this.ctx;
    ctx.fillStyle = '#784119';
    ctx.fillRect(x, y, 42, 24);
    ctx.fillStyle = '#4a2810';
    ctx.fillRect(x + 4, y + 24, 6, 12);
    ctx.fillRect(x + 32, y + 24, 6, 12);
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(x + 6, y - 8, 8, 12);
    ctx.fillStyle = '#c62828';
    ctx.fillRect(x + 20, y - 3, 14, 6);
  }

  // --- Multi-Layered Natural Trees ---

  drawLushTree(x, y, season) {
    const ctx = this.ctx;
    // Gnarled Trunk with roots
    ctx.fillStyle = '#5c3514';
    ctx.fillRect(x + 18, y + 46, 14, 28);
    ctx.fillStyle = '#3d1d07';
    ctx.fillRect(x + 26, y + 46, 6, 28);
    // Roots
    ctx.fillStyle = '#5c3514';
    ctx.fillRect(x + 14, y + 70, 6, 4);
    ctx.fillRect(x + 30, y + 70, 6, 4);

    let cDark = '#166534';
    let cMid = '#15803d';
    let cLight = '#22c55e';

    if (season === 'fall') {
      cDark = '#9a3412'; cMid = '#ea580c'; cLight = '#f97316';
    } else if (season === 'winter') {
      cDark = '#334155'; cMid = '#64748b'; cLight = '#e2e8f0';
    }

    const lobes = [
      { dx: 25, dy: 25, r: 36 },
      { dx: 14, dy: 18, r: 24 },
      { dx: 36, dy: 20, r: 24 },
      { dx: 25, dy: 8,  r: 22 }
    ];

    ctx.fillStyle = cDark;
    for (const lb of lobes) {
      ctx.beginPath();
      ctx.arc(x + lb.dx, y + lb.dy, lb.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = cMid;
    for (const lb of lobes) {
      ctx.beginPath();
      ctx.arc(x + lb.dx - 2, y + lb.dy - 3, lb.r - 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = cLight;
    for (const lb of lobes) {
      ctx.beginPath();
      ctx.arc(x + lb.dx - 5, y + lb.dy - 7, lb.r - 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBerryBush(x, y, berries = 4) {
    const ctx = this.ctx;
    ctx.fillStyle = '#583113';
    ctx.fillRect(x - 3, y + 8, 6, 8);

    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x - 2, y - 3, 12, 0, Math.PI * 2);
    ctx.fill();

    const berryPos = [
      { x: x - 6, y: y - 4 }, { x: x + 5, y: y - 6 }, { x: x - 2, y: y + 2 },
      { x: x + 6, y: y + 3 }, { x: x - 8, y: y + 3 }
    ];
    for (let i = 0; i < Math.min(berries, berryPos.length); i++) {
      const b = berryPos[i];
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(b.x, b.y, 4, 4);
      ctx.fillStyle = '#f87171';
      ctx.fillRect(b.x + 1, b.y + 1, 2, 2);
    }
  }

  drawJunimo(j) {
    const ctx = this.ctx;
    const x = Math.round(j.x);
    const y = Math.round(j.y + j.jumpOffset);

    ctx.fillStyle = j.color || '#76ff03';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b2ff59';
    ctx.beginPath();
    ctx.arc(x - 2, y - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1c1b18';
    ctx.fillRect(x - 4, y - 1, 2, 2);
    ctx.fillRect(x + 2, y - 1, 2, 2);
    ctx.fillStyle = '#ff80ab';
    ctx.fillRect(x - 5, y + 2, 2, 1);
    ctx.fillRect(x + 3, y + 2, 2, 1);

    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(x - 1, y - 14, 2, 6);
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.ellipse(x + 1, y - 16, 4, 3, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    if (j.holdingStar) {
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(x - 4, y - 24, 8, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 2, y - 22, 4, 4);
    }
  }

  // --- Entity Shadows ---

  drawEntityShadows(sim, player) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';

    ctx.beginPath();
    ctx.ellipse(player.x, player.y + 18, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    for (const r of sim.rabbits) {
      ctx.beginPath();
      ctx.ellipse(r.x, r.y + 7, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const d of sim.deers) {
      ctx.beginPath();
      ctx.ellipse(d.x, d.y + 18, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const f of sim.foxes) {
      ctx.beginPath();
      ctx.ellipse(f.x, f.y + 10, 11, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const w of sim.wolves) {
      ctx.beginPath();
      ctx.ellipse(w.x, w.y + 16, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const e of sim.eagles) {
      const scale = Math.max(0.4, (100 - e.altitude) / 70);
      ctx.beginPath();
      ctx.ellipse(e.x, e.y + 35, 20 * scale, 9 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Rare Event Emotes ---

  drawEmotes(sim) {
    const list = [
      ...sim.rabbits, ...sim.deers, ...sim.foxes,
      ...sim.wolves, ...sim.eagles, ...sim.junimos
    ];
    for (const ent of list) {
      if (ent.emote && ent.emote.icon && ent.emote.timer > 0) {
        this.drawSingleBubble(ent.x, ent.y - (ent.altitude || 16), ent.emote.icon);
      }
    }
  }

  drawSingleBubble(x, y, icon) {
    const ctx = this.ctx;
    const bx = Math.round(x);
    const by = Math.round(y - 20);

    ctx.fillStyle = '#2b1405';
    ctx.fillRect(bx - 12, by - 12, 24, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx - 10, by - 10, 20, 16);
    ctx.fillStyle = '#2b1405';
    ctx.fillRect(bx - 2, by + 8, 4, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx - 1, by + 6, 2, 3);

    ctx.font = '13px "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, bx, by - 2);
  }

  // --- Weather & Seasonal Atmosphere ---

  drawAtmosphere(sim) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    const hour = sim.timeOfDay / 60;
    if (hour >= 17 && hour < 20) {
      ctx.fillStyle = 'rgba(255, 110, 40, 0.16)';
      ctx.fillRect(0, 0, w, h);
    } else if (hour >= 20 || hour < 6) {
      ctx.fillStyle = 'rgba(15, 25, 60, 0.42)';
      ctx.fillRect(0, 0, w, h);
    }

    if (sim.weather === 'rainy' || sim.weather === 'storm') {
      ctx.strokeStyle = sim.weather === 'storm' ? 'rgba(170, 210, 255, 0.7)' : 'rgba(180, 220, 255, 0.5)';
      ctx.lineWidth = sim.weather === 'storm' ? 2 : 1.5;
      for (const drop of this.raindrops) {
        drop.y += drop.speedY;
        if (drop.y > h) { drop.y = -10; drop.x = Math.random() * w; }
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.len);
        ctx.stroke();
      }
    } else if (sim.season === 'spring') {
      ctx.fillStyle = 'rgba(255, 182, 193, 0.85)';
      for (const p of this.petals) {
        p.x += p.speedX; p.y += p.speedY; p.rot += p.rotSpeed;
        if (p.x > w + 20) p.x = -20;
        if (p.y > h + 20) p.y = -20;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      }
    } else if (sim.season === 'fall') {
      for (const l of this.leaves) {
        l.x += l.speedX; l.y += l.speedY; l.rot += l.rotSpeed;
        if (l.x > w + 20) l.x = -20;
        if (l.y > h + 20) l.y = -20;
        ctx.fillStyle = l.color;
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rot);
        ctx.fillRect(-l.size / 2, -l.size / 2, l.size, l.size);
        ctx.restore();
      }
    } else if (sim.season === 'winter') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (const s of this.snowflakes) {
        s.y += s.speedY; s.x += s.speedX;
        if (s.y > h) { s.y = -10; s.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

window.EcoRenderer = EcoRenderer;
