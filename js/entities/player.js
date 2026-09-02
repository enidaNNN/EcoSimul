/**
 * ============================================================================
 * ECO-VALLEY: Player Entity with Obstacle & Water Collision Detection
 * and Universal Environmental Inspection (Soil, Water, Trees, Animals, Buildings)
 * ============================================================================
 */

class PlayerEntity {
  constructor(x = 600, y = 420, name = 'Robin', hat = 'straw', valleyName = 'Lembah Greenwood') {
    this.x = x;
    this.y = y;
    this.name = name;
    this.hat = hat;
    this.valleyName = valleyName;

    this.speed = 3.2;
    this.facing = 'down';
    this.isMoving = false;
    this.animTimer = 0;

    this.targetX = null;
    this.targetY = null;

    this.selectedTool = 'inspect'; // 'inspect', 'plant', 'talk'
    this.keys = { up: false, down: false, left: false, right: false };

    this.initKeyboard();
  }

  setName(name) { this.name = name; }
  setValleyName(name) { this.valleyName = name; }
  setHat(hat) { this.hat = hat; }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') this.keys.up = true;
      if (k === 's' || e.key === 'ArrowDown') this.keys.down = true;
      if (k === 'a' || e.key === 'ArrowLeft') this.keys.left = true;
      if (k === 'd' || e.key === 'ArrowRight') this.keys.right = true;

      if (e.key === '1') this.selectTool('inspect');
      if (e.key === '2') this.selectTool('plant');
      if (e.key === '3') this.selectTool('talk');

      if (e.code === 'Space' || k === 'e') {
        e.preventDefault();
        this.executeCurrentAction();
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') this.keys.up = false;
      if (k === 's' || e.key === 'ArrowDown') this.keys.down = false;
      if (k === 'a' || e.key === 'ArrowLeft') this.keys.left = false;
      if (k === 'd' || e.key === 'ArrowRight') this.keys.right = false;
    });
  }

  selectTool(tool) {
    this.selectedTool = tool;
    document.querySelectorAll('.hotbar-slot').forEach(slot => {
      slot.classList.toggle('selected', slot.dataset.tool === tool);
    });
  }

  moveTo(tx, ty) {
    this.targetX = tx;
    this.targetY = ty;
  }

  update(dt = 1, sim) {
    let dx = 0;
    let dy = 0;

    if (this.keys.up) dy -= 1;
    if (this.keys.down) dy += 1;
    if (this.keys.left) dx -= 1;
    if (this.keys.right) dx += 1;

    // Mouse click pathfinding / moveTo
    if (this.targetX !== null && this.targetY !== null && dx === 0 && dy === 0) {
      const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
      if (dist > 5) {
        dx = (this.targetX - this.x) / dist;
        dy = (this.targetY - this.y) / dist;
      } else {
        this.targetX = null;
        this.targetY = null;
      }
    } else if (dx !== 0 || dy !== 0) {
      this.targetX = null;
      this.targetY = null;
    }

    if (dx !== 0 || dy !== 0) {
      this.isMoving = true;
      this.animTimer += 0.05 * dt;

      // Update facing
      if (Math.abs(dx) > Math.abs(dy)) {
        this.facing = dx > 0 ? 'right' : 'left';
      } else {
        this.facing = dy > 0 ? 'down' : 'up';
      }

      const moveDist = this.speed * dt;
      const mag = Math.hypot(dx, dy) || 1;
      const stepX = (dx / mag) * moveDist;
      const stepY = (dy / mag) * moveDist;

      // Physical Collision Check with Water and Buildings!
      const nextX = this.x + stepX;
      const nextY = this.y + stepY;

      if (sim && !sim.isBlocked(nextX, this.y, 8)) {
        this.x = nextX;
      }
      if (sim && !sim.isBlocked(this.x, nextY, 8)) {
        this.y = nextY;
      }
    } else {
      this.isMoving = false;
      this.animTimer = 0;
    }
  }

  executeCurrentAction() {
    if (!window.sim) return;

    if (this.selectedTool === 'plant') {
      const planted = window.sim.plantGrassAt(this.x, this.y, 2);
      if (window.AudioEngine) window.AudioEngine.playPlantSeed();
      if (window.DialogueSystem) {
        window.DialogueSystem.showTemporaryNotice(`🌱 Menanam ${planted} petak rumput subur di sekelilingmu!`);
      }
    } else if (this.selectedTool === 'inspect') {
      this.inspectNearestObject();
    } else if (this.selectedTool === 'talk') {
      if (window.DialogueSystem) {
        window.DialogueSystem.openMissionModal();
      }
    }
  }

  inspectNearestObject() {
    this.inspectAt(this.x, this.y, window.sim);
  }

  // --- Universal Inspection of Soil, Water, Trees, Animals, and Buildings ---
  inspectAt(clickX, clickY, sim) {
    const tooltip = document.getElementById('inspectTooltip');
    if (!tooltip || !sim) return;

    // 1. Check Pond Water
    const p = sim.pond;
    const pdx = (clickX - p.x) / p.rx;
    const pdy = (clickY - p.y) / p.ry;
    if (pdx * pdx + pdy * pdy < 1.0) {
      // Is it on the dock?
      const d = sim.dock;
      if (clickX >= d.x && clickX <= d.x + d.w && clickY >= d.y && clickY <= d.y + d.h) {
        this.renderInspectCard({
          title: 'Dermaga Kayu Pinus (Fishing Dock)',
          badge: 'Fasilitas Observasi',
          tagClass: 'tag-producer',
          stats: [
            { label: 'Bahan Konstruksi', val: 'Kayu Pinus Kedap Air' },
            { label: 'Fungsi Ekologis', val: 'Titik Uji Kualitas Perairan' },
            { label: 'Aksesibilitas', val: 'Aman untuk Dilewati' }
          ],
          role: 'Dermaga yang dibangun oleh warga desa untuk mengamati kehidupan teratai dan mengambil sampel air danau.'
        }, clickX, clickY);
        return;
      }

      // Pond Water Itself
      const purity = sim.weather === 'storm' ? '82% (Keruh Sedang)' : '98% (Sangat Jernih & Murni)';
      const doVal = sim.weather === 'rainy' ? '9.2 mg/L' : '8.4 mg/L';
      const temp = sim.season === 'winter' ? '8°C (Dingin Bersalju)' : sim.season === 'summer' ? '24°C (Hangat)' : '19°C (Sejuk Alami)';

      this.renderInspectCard({
        title: 'Danau Alami Lembah (Freshwater Lake)',
        badge: 'Akuatik Alami',
        tagClass: 'tag-apex',
        stats: [
          { label: 'Kemurnian Air', val: purity },
          { label: 'Kadar Oksigen (DO)', val: doVal },
          { label: 'Suhu Permukaan', val: temp },
          { label: 'Flora Air', val: 'Teratai Hijau & Bunga Lotus' },
          { label: 'Peran Ekologis', val: 'Sumber Hidrasi Seluruh Satwa' }
        ],
        role: 'Ekosistem air tawar yang menopang cadangan air tanah lembah. Air murni ini menjadi sumber minum wajib bagi kelinci, rusa, rubah, dan serigala.'
      }, clickX, clickY);
      return;
    }

    // 2. Check Trees
    const trees = [
      { x: 105, y: 265, name: 'Pohon Ek Kuno (Ancient Oak)', species: 'Quercus robur' },
      { x: 115, y: 485, name: 'Pohon Sakura Merona (Cherry Blossom)', species: 'Prunus serrulata' },
      { x: 1125, y: 405, name: 'Pohon Pinus Gunung (Alpine Pine)', species: 'Pinus sylvestris' },
      { x: 1105, y: 635, name: 'Pohon Birch Lembah (Silver Birch)', species: 'Betula pendula' },
      { x: 425, y: 115, name: 'Pohon Maple Rindang (Sugar Maple)', species: 'Acer saccharum' }
    ];
    for (const tr of trees) {
      if (Math.hypot(clickX - tr.x, clickY - tr.y) < 48) {
        this.renderInspectCard({
          title: tr.name,
          badge: 'Produsen Berkayu',
          tagClass: 'tag-producer',
          stats: [
            { label: 'Nama Ilmiah', val: tr.species },
            { label: 'Kesehatan Kanopi', val: '100% Rimbun Berdaun' },
            { label: 'Produksi Oksigen', val: '+450 Liter / Hari' },
            { label: 'Serapan Karbon', val: '22 kg CO2 / Tahun' },
            { label: 'Kondisi Musim', val: sim.season.toUpperCase() }
          ],
          role: 'Pohon dewasa berakar dalam yang menahan erosi tanah, menyediakan kanopi peneduh, serta menjadi habitat bertengger dan sarang burung elang.'
        }, clickX, clickY);
        return;
      }
    }

    // 3. Check Berry Bushes
    for (const b of sim.bushes) {
      if (Math.hypot(clickX - b.x, clickY - b.y) < 26) {
        this.renderInspectCard({
          title: 'Semak Berry Liar (Wild Berry Bush)',
          badge: 'Produsen Buah',
          tagClass: 'tag-producer',
          stats: [
            { label: 'Ketersediaan Buah', val: `${b.berries} / ${b.maxBerries} Butir Masak` },
            { label: 'Kandungan Gizi', val: 'Glukosa Alami & Vitamin C' },
            { label: 'Konsumen Utama', val: 'Rusa Hutan & Kelinci' }
          ],
          role: 'Produsen penyedia energi tinggi bagi herbivora besar, sangat vital sebagai cadangan pangan bertahan hidup saat musim dingin.'
        }, clickX, clickY);
        return;
      }
    }

    // 4. Check Farm Buildings
    if (clickX >= 940 && clickX <= 1080 && clickY >= 45 && clickY <= 135) {
      this.renderInspectCard({
        title: 'Lumbung Merah Pedesaan (Big Barn)',
        badge: 'Fasilitas Pertanian',
        tagClass: 'tag-herbivore',
        stats: [
          { label: 'Kapasitas Jerami', val: 'Penuh (120 Bal)' },
          { label: 'Kondisi Struktur', val: 'Kayu Mahoni Terawat' },
          { label: 'Peran', val: 'Pusat Perlindungan Hewan Ternak' }
        ],
        role: 'Lumbung tempat penyimpanan pakan jerami kering untuk mengantisipasi musim kemarau dan badai dingin.'
      }, clickX, clickY);
      return;
    }

    if (clickX >= 870 && clickX <= 922 && clickY >= 35 && clickY <= 145) {
      this.renderInspectCard({
        title: 'Silo Bata Merah (Feed Silo)',
        badge: 'Penyimpanan Pakan',
        tagClass: 'tag-herbivore',
        stats: [
          { label: 'Kapasitas Cadangan', val: '240 Pon Biji-bijian' },
          { label: 'Kelembapan Internal', val: '12% (Kering Terjaga)' }
        ],
        role: 'Menyimpan biji-bijian cadangan dari hasil panen padang rumput.'
      }, clickX, clickY);
      return;
    }

    if (clickX >= 820 && clickX <= 856 && clickY >= 180 && clickY <= 204) {
      this.renderInspectCard({
        title: 'Sumur Batu Gunung (Stone Well)',
        badge: 'Mata Air Alami',
        tagClass: 'tag-apex',
        stats: [
          { label: 'Kedalaman Mata Air', val: '18 Meter di Bawah Tanah' },
          { label: 'Kualitas Akuifer', val: 'Mata Air Mineral Segar' }
        ],
        role: 'Menyediakan air tanah murni yang mengalir merata untuk menyuburkan akar padang rumput di sekeliling lembah.'
      }, clickX, clickY);
      return;
    }

    // 5. Check Animals
    let closestEnt = null;
    let minDist = 32;
    let entType = '';

    for (const r of sim.rabbits) {
      const d = Math.hypot(r.x - clickX, r.y - clickY);
      if (d < minDist) { minDist = d; closestEnt = r; entType = 'rabbit'; }
    }
    for (const deer of sim.deers) {
      const d = Math.hypot(deer.x - clickX, deer.y - clickY);
      if (d < minDist) { minDist = d; closestEnt = deer; entType = 'deer'; }
    }
    for (const f of sim.foxes) {
      const d = Math.hypot(f.x - clickX, f.y - clickY);
      if (d < minDist) { minDist = d; closestEnt = f; entType = 'fox'; }
    }
    for (const w of sim.wolves) {
      const d = Math.hypot(w.x - clickX, w.y - clickY);
      if (d < minDist) { minDist = d; closestEnt = w; entType = 'wolf'; }
    }
    for (const e of sim.eagles) {
      const d = Math.hypot(e.x - clickX, e.y - clickY);
      if (d < minDist) { minDist = d; closestEnt = e; entType = 'eagle'; }
    }

    if (closestEnt) {
      this.showInspectTooltip(closestEnt, entType, clickX, clickY);
      return;
    }

    // 6. Check Soil & Grass Tile
    const gridC = Math.max(0, Math.min(sim.cols - 1, Math.floor(clickX / sim.cellW)));
    const gridR = Math.max(0, Math.min(sim.rows - 1, Math.floor(clickY / sim.cellH)));
    const cell = sim.grid[gridR][gridC];

    if (cell) {
      const moistPct = sim.weather === 'rainy' ? '92%' : sim.weather === 'drought' ? '28%' : '74%';
      const bioPct = Math.round(cell.growth * 100);

      this.renderInspectCard({
        title: cell.isPath ? 'Jalur Tanah Padat Lembah' : 'Tanah Padang Rumput (Soil & Grass)',
        badge: 'Produsen Primer',
        tagClass: 'tag-producer',
        stats: [
          { label: 'Kelembapan Tanah', val: moistPct },
          { label: 'Kerapatan Biomassa', val: `${bioPct}%` },
          { label: 'Tipe Tanah', val: 'Humus Subur Kaya Nitrogen' },
          { label: 'Bunga Padang', val: cell.flower ? 'Mekar Semerbak' : 'Kuncup Tunas' },
          { label: 'Peran Ekologis', val: 'Penyerap Karbon & Penahan Erosi' }
        ],
        role: 'Lapisan tanah subur yang menjadi media fotosintesis rumput. Menjadi tumpuan utama seluruh piramida makanan herbivora.'
      }, clickX, clickY);
    }
  }

  showInspectTooltip(ent, type, clickX = null, clickY = null) {
    const data = {
      rabbit: {
        title: ent.name || 'Kelinci Lembah',
        badge: 'Konsumen I (Herbivora)',
        tagClass: 'tag-herbivore',
        stats: [
          { label: 'Tingkat Energi', val: `${Math.round(ent.energy)}%` },
          { label: 'Makanan Utama', val: 'Rumput Segar & Tunas Daun' },
          { label: 'Pemangsa Alami', val: 'Rubah & Elang Emas' },
          { label: 'Peran Ekologis', val: 'Penyalur Energi Produsen ke Karnivora' }
        ],
        role: 'Mengontrol kepadatan rumput padang dan menjadi sumber mangsa utama bagi pemangsa tingkat menengah.'
      },
      deer: {
        title: ent.name || 'Rusa Hutan',
        badge: 'Konsumen I (Herbivora Besar)',
        tagClass: 'tag-herbivore',
        stats: [
          { label: 'Tingkat Energi', val: `${Math.round(ent.energy)}%` },
          { label: 'Makanan Utama', val: 'Semak Berry & Dedaunan Tinggi' },
          { label: 'Pemangsa Alami', val: 'Serigala Hutan' },
          { label: 'Tanduk Rusa', val: ent.hasAntlers ? 'Tanduk Bercabang Utuh' : 'Betina Anggun' }
        ],
        role: 'Menjelajah kawasan semak dan hutan, membantu persebaran biji buah liar di seluruh lembah.'
      },
      fox: {
        title: ent.name || 'Rubah Merah',
        badge: 'Konsumen II (Mesopredator)',
        tagClass: 'tag-carnivore',
        stats: [
          { label: 'Tingkat Energi', val: `${Math.round(ent.energy)}%` },
          { label: 'Makanan Utama', val: 'Kelinci Lembah' },
          { label: 'Pemangsa Atas', val: 'Serigala & Elang Emas' },
          { label: 'Peran Ekologis', val: 'Pengontrol Ledakan Populasi Herbivora' }
        ],
        role: 'Mencegah kelinci menggunduli seluruh vegetasi rumput hijau melalui perburuan alami (Trophic Cascade).'
      },
      wolf: {
        title: ent.name || 'Serigala Hutan',
        badge: 'Konsumen Puncak (Apex Predator Darat)',
        tagClass: 'tag-apex',
        stats: [
          { label: 'Tingkat Energi', val: `${Math.round(ent.energy)}%` },
          { label: 'Makanan Utama', val: 'Rusa Hutan & Rubah' },
          { label: 'Pemangsa Alami', val: 'Tidak Ada (Apex)' },
          { label: 'Karakter Berburu', val: 'Pemangsa Darat Teratas' }
        ],
        role: 'Menjaga ketahanan genetik populasi rusa dan mencegah kerusakan semak tepian danau.'
      },
      eagle: {
        title: ent.name || 'Elang Emas',
        badge: 'Konsumen Puncak (Apex Predator Angkasa)',
        tagClass: 'tag-apex',
        stats: [
          { label: 'Tingkat Energi', val: `${Math.round(ent.energy)}%` },
          { label: 'Ketinggian Terbang', val: `${Math.round(ent.altitude)} Meter` },
          { label: 'Makanan Utama', val: 'Rubah & Kelinci' },
          { label: 'Teknik Berburu', val: 'Menukik Cepat dari Angkasa' }
        ],
        role: 'Menjaga keseimbangan ekosistem dari ketinggian dengan menyambar mangsa yang sakit atau lengah.'
      }
    };

    const info = data[type];
    if (info) {
      this.renderInspectCard(info, clickX || ent.x, clickY || ent.y);
    }
  }

  renderInspectCard(info, posX, posY) {
    const tooltip = document.getElementById('inspectTooltip');
    if (!tooltip) return;

    let rowsHtml = '';
    for (const st of info.stats) {
      rowsHtml += `
        <div class="inspect-stat-row">
          <span style="color:#6d3e16;">${st.label}:</span>
          <span style="font-weight:bold; color:#1c1917;">${st.val}</span>
        </div>
      `;
    }

    tooltip.innerHTML = `
      <div class="inspect-title" style="display:flex; justify-content:space-between; align-items:center;">
        <span>${info.title}</span>
        <span class="species-tag ${info.tagClass}" style="font-size:9px;">${info.badge}</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:3px; margin-bottom:6px;">
        ${rowsHtml}
      </div>
      <div style="font-size:15px; line-height:16px; color:#5c3514; border-top:1px solid #d4b889; padding-top:4px;">
        <b>Analisis Ekologi:</b> ${info.role}
      </div>
    `;

    // Position tooltip on screen
    const container = document.getElementById('viewportContainer');
    const cRect = container ? container.getBoundingClientRect() : { width: 1200, height: 800 };
    const left = Math.min(cRect.width - 240, Math.max(20, (posX / 1200) * cRect.width + 10));
    const top = Math.min(cRect.height - 200, Math.max(20, (posY / 800) * cRect.height - 100));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.display = 'block';

    if (window.AudioEngine) window.AudioEngine.playDialogueBlip(600);

    clearTimeout(this.inspectTimer);
    this.inspectTimer = setTimeout(() => {
      tooltip.style.display = 'none';
    }, 7000);
  }
}

window.PlayerEntity = PlayerEntity;
