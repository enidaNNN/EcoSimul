/**
 * ============================================================================
 * ECO-VALLEY: Game Lifecycle & Interaction Controller
 * Handles active hotbar tools (Universal Inspection, Plant, Missions),
 * collapsible/expandable slider dock, canvas click interactions, and character creation.
 * ============================================================================
 */

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ecoCanvas');
  if (!canvas) return;

  canvas.width = 1200;
  canvas.height = 800;

  // 1. Systems Initialization
  const sim = new window.EcosystemSimulation(canvas.width, canvas.height);
  const player = new window.PlayerEntity(600, 420, 'Robin', 'straw', 'Lembah Greenwood');
  const renderer = new window.EcoRenderer(canvas);
  const hud = new window.HudManager(sim);

  window.sim = sim;
  window.player = player;
  window.renderer = renderer;
  window.hud = hud;

  // 2. Character Creation Modal & Hat Selection
  const charModal = document.getElementById('characterModal');
  const btnStartGame = document.getElementById('btnStartGame');
  const inputPlayerName = document.getElementById('inputPlayerName');
  const inputValleyName = document.getElementById('inputValleyName');
  const valleyBadgeText = document.getElementById('valleyBadgeText');
  const previewCanvas = document.getElementById('avatarPreviewCanvas');

  let selectedHat = 'straw';

  const updatePreviewAvatar = () => {
    if (!previewCanvas) return;
    previewCanvas.width = 64;
    previewCanvas.height = 64;
    const pCtx = previewCanvas.getContext('2d');
    pCtx.clearRect(0, 0, 64, 64);

    window.PixelSpriteEngine.drawPlayer(
      pCtx,
      32, 40,
      'down',
      false,
      0,
      selectedHat,
      inputPlayerName && inputPlayerName.value.trim() ? inputPlayerName.value.trim() : 'Ranger'
    );
  };

  updatePreviewAvatar();

  if (inputPlayerName) inputPlayerName.addEventListener('input', updatePreviewAvatar);

  document.querySelectorAll('.hat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hat-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedHat = btn.dataset.hat;
      updatePreviewAvatar();
      if (window.AudioEngine) window.AudioEngine.playDialogueBlip(440);
    });
  });

  if (btnStartGame) {
    btnStartGame.addEventListener('click', () => {
      const pName = inputPlayerName && inputPlayerName.value.trim() ? inputPlayerName.value.trim() : 'Ranger';
      const vName = inputValleyName && inputValleyName.value.trim() ? inputValleyName.value.trim() : 'Lembah Greenwood';

      player.setName(pName);
      player.setValleyName(vName);
      player.setHat(selectedHat);

      if (valleyBadgeText) valleyBadgeText.textContent = vName;
      if (charModal) charModal.style.display = 'none';

      if (window.AudioEngine) {
        window.AudioEngine.ensureContext();
        window.AudioEngine.startBgm();
        window.AudioEngine.playJunimoChime();
      }

      // Open Demetrius mission journal for Mission 1 Briefing
      setTimeout(() => {
        if (window.DialogueSystem) {
          window.DialogueSystem.openMissionModal();
        }
      }, 600);
    });
  }

  // 3. Hotbar Active Tool Switching & Execution
  const hotbarSlots = document.querySelectorAll('.hotbar-slot');

  const updateCursorMode = () => {
    if (player.selectedTool === 'inspect') {
      canvas.style.cursor = 'zoom-in';
    } else if (player.selectedTool === 'plant') {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = 'pointer';
    }
  };

  hotbarSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      const tool = slot.dataset.tool;
      player.selectTool(tool);
      updateCursorMode();

      if (window.AudioEngine) window.AudioEngine.playDialogueBlip(520);

      if (tool === 'talk') {
        window.DialogueSystem.openMissionModal();
      } else if (tool === 'inspect') {
        player.inspectNearestObject();
      } else if (tool === 'plant') {
        const planted = sim.plantGrassAt(player.x, player.y, 2);
        if (window.AudioEngine) window.AudioEngine.playPlantSeed();
        window.DialogueSystem.showTemporaryNotice(`🌱 Menanam ${planted} petak benih rumput di sekelilingmu!`);
      }
    });
  });

  updateCursorMode();

  // 4. Canvas Click Interactions (Universal Inspection & Planting)
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // A. Tool 1: UNIVERSAL INSPECTION of anything clicked!
    if (player.selectedTool === 'inspect') {
      player.inspectAt(clickX, clickY, sim);
      return;
    }

    // B. Tool 2: Plant Seed at clicked coordinate
    if (player.selectedTool === 'plant') {
      const planted = sim.plantGrassAt(clickX, clickY, 2);
      if (window.AudioEngine) window.AudioEngine.playPlantSeed();
      window.DialogueSystem.showTemporaryNotice(`🌱 Menanam benih di koordinat terpilih!`);
      return;
    }

    // C. Check if clicked near Junimo shrine (x: 240, y: 130)
    if (Math.hypot(clickX - 240, clickY - 130) < 55) {
      window.DialogueSystem.startJunimoDialogue();
      return;
    }

    // D. Check if clicked near Demetrius desk (x: 130, y: 110)
    if (Math.hypot(clickX - 130, clickY - 110) < 55) {
      window.DialogueSystem.openMissionModal();
      return;
    }

    // Default Walk command (with collision safety)
    player.moveTo(clickX, clickY);
  });

  // 5. Collapsible / Expandable Slider Dock (For Unobstructed Observation)
  const btnCollapseDock = document.getElementById('btnCollapseDock');
  const ecoDock = document.getElementById('ecosystemDock');
  const dockCollapsedTab = document.getElementById('dockCollapsedTab');

  if (btnCollapseDock && ecoDock && dockCollapsedTab) {
    btnCollapseDock.addEventListener('click', (e) => {
      e.stopPropagation();
      ecoDock.style.display = 'none';
      dockCollapsedTab.style.display = 'flex';
      if (window.AudioEngine) window.AudioEngine.playDialogueBlip(400);
    });

    dockCollapsedTab.addEventListener('click', () => {
      dockCollapsedTab.style.display = 'none';
      ecoDock.style.display = 'flex';
      if (window.AudioEngine) window.AudioEngine.playDialogueBlip(520);
    });
  }

  // 6. Demetrius Mission Button (Top-Left)
  const btnOpenMissions = document.getElementById('btnOpenMissions');
  if (btnOpenMissions) {
    btnOpenMissions.addEventListener('click', () => {
      window.DialogueSystem.openMissionModal();
    });
  }

  // Quick notice badge click to open mission modal if clicked
  const quickNotice = document.getElementById('quickNoticeBadge');
  if (quickNotice) {
    quickNotice.style.cursor = 'pointer';
    quickNotice.style.pointerEvents = 'auto';
    quickNotice.addEventListener('click', () => {
      window.DialogueSystem.openMissionModal();
    });
  }

  // 7. Touch Controls
  const bindTouch = (id, key) => {
    const elem = document.getElementById(id);
    if (!elem) return;
    elem.addEventListener('touchstart', (e) => { e.preventDefault(); player.keys[key] = true; });
    elem.addEventListener('touchend', (e) => { e.preventDefault(); player.keys[key] = false; });
  };
  bindTouch('dpadUp', 'up');
  bindTouch('dpadDown', 'down');
  bindTouch('dpadLeft', 'left');
  bindTouch('dpadRight', 'right');

  const touchActionBtn = document.getElementById('touchActionBtn');
  if (touchActionBtn) {
    touchActionBtn.addEventListener('click', () => {
      player.executeCurrentAction();
    });
  }

  // 8. Main Animation Loop
  let lastTime = performance.now();

  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 1000 * 60, 2.5);
    lastTime = now;

    sim.update(dt);
    player.update(dt, sim);
    hud.update();

    // Check if the current mission's simulation experiment was just completed!
    if (window.MissionManager) {
      const unlocked = window.MissionManager.checkSimulationExperiment(sim);
      if (unlocked) {
        if (window.AudioEngine) window.AudioEngine.playJunimoChime();
        if (window.DialogueSystem) {
          window.DialogueSystem.showTemporaryNotice(
            `🎉 Target Eksperimen Misi ${window.MissionManager.currentMissionIndex + 1} Berhasil! Klik di sini untuk mengerjakan kuis Demetrius.`
          );
        }
      }
    }

    renderer.render(sim, player);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
});
