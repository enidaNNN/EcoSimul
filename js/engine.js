/* ==========================================================================
   PYTHOMORI: PURE OMORI WHITE SPACE REPLICA ENGINE
   Pixel-accurate matching of Screenshot 3:
   - White floor with black-bordered white mat
   - Top-left Laptop, Top-right Sketchbook, Bottom-right Tissues, Bottom-left Mewo Cat
   - Center Hanging Lightbulb with shadow, Top-left Floating White Door
   - 4-way direction Ponytail Girl rendering
   ========================================================================== */

class PythomoriEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.width = 1280;
    this.height = 720;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.currentRealm = 'white_space';

    // Player Object (Ponytail Girl)
    this.player = {
      x: 625,
      y: 405,
      width: 36,
      height: 48,
      speed: 4.5,
      direction: 'down',
      animFrame: 0,
      animTimer: 0
    };

    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.interactables = [];
    this.initControls();
    this.setupRealm(this.currentRealm);
  }

  initControls() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
      if (['KeyE', 'Space', 'Enter'].includes(e.code)) {
        this.interact();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
    });

    // Mobile D-Pad
    const bindBtn = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys[key] = true; });
        el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[key] = false; });
      }
    };
    bindBtn('mUp', 'up');
    bindBtn('mDown', 'down');
    bindBtn('mLeft', 'left');
    bindBtn('mRight', 'right');

    const mAct = document.getElementById('mAction');
    if (mAct) {
      mAct.addEventListener('touchstart', (e) => { e.preventDefault(); this.interact(); });
    }
  }

  setupRealm(realm) {
    this.currentRealm = realm;
    const badge = document.getElementById('realmBadge');
    if (badge) badge.innerText = (realm === 'white_space') ? 'WHITE SPACE' : 'PY-SPACE: LOGIC REALM';

    if (realm === 'white_space') {
      AudioEngine.playBGM('idle');
      this.player.x = 625;
      this.player.y = 405;

      // Objects positioned exactly as in OMORI Screenshot 3
      this.interactables = [
        {
          id: 'laptop',
          name: 'Laptop (Belajar Python)',
          x: 520,
          y: 345,
          w: 40,
          h: 32,
          promptText: '[E] BUKA TERMINAL'
        },
        {
          id: 'sketchbook',
          name: 'Buku Sketsa',
          x: 735,
          y: 345,
          w: 32,
          h: 36,
          promptText: '[E] BACA SKETSA'
        },
        {
          id: 'tissue_box',
          name: 'Kotak Tisu',
          x: 735,
          y: 475,
          w: 32,
          h: 28,
          promptText: '[E] PERIKSA'
        },
        {
          id: 'mewo',
          name: 'Mewo',
          x: 440,
          y: 550,
          w: 36,
          h: 24,
          promptText: '[E] ELUS MEWO'
        },
        {
          id: 'lightbulb',
          name: 'Lampu Gantung',
          x: 635,
          y: 215,
          w: 16,
          h: 20,
          promptText: '[E] PERIKSA'
        },
        {
          id: 'white_door',
          name: 'Pintu Putih',
          x: 480,
          y: 130,
          w: 40,
          h: 60,
          promptText: '[E] BUKA PINTU'
        }
      ];
    } else {
      AudioEngine.playBGM('pyspace');
      this.player.x = 240;
      this.player.y = 360;

      this.interactables = [
        {
          id: 'ruby_npc',
          name: 'Ruby (str)',
          x: 360,
          y: 320,
          w: 44,
          h: 50,
          promptText: '[E] BICARA'
        },
        {
          id: 'boss_portal',
          name: 'Exception Abyss (Boss Fight)',
          x: 1080,
          y: 320,
          w: 60,
          h: 70,
          type: 'boss',
          promptText: '[E] LAWAN BOSS'
        }
      ];
    }
  }

  interact() {
    if (DialogueSystem.isOpen() || BattleEngine.isActive) {
      DialogueSystem.advance();
      return;
    }

    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;

    for (let obj of this.interactables) {
      const ox = obj.x + obj.w / 2;
      const oy = obj.y + obj.h / 2;
      if (Math.hypot(px - ox, py - oy) < 65) {
        GameStory.handleInteraction(obj);
        return;
      }
    }
  }

  update() {
    if (DialogueSystem.isOpen() || BattleEngine.isActive) return;

    let isMoving = false;

    if (this.keys.up) {
      this.player.y -= this.player.speed;
      this.player.direction = 'up';
      isMoving = true;
    }
    if (this.keys.down) {
      this.player.y += this.player.speed;
      this.player.direction = 'down';
      isMoving = true;
    }
    if (this.keys.left) {
      this.player.x -= this.player.speed;
      this.player.direction = 'left';
      isMoving = true;
    }
    if (this.keys.right) {
      this.player.x += this.player.speed;
      this.player.direction = 'right';
      isMoving = true;
    }

    this.player.x = Math.max(120, Math.min(1140, this.player.x));
    this.player.y = Math.max(100, Math.min(620, this.player.y));

    if (isMoving) {
      this.player.animTimer++;
      if (this.player.animTimer > 7) {
        this.player.animTimer = 0;
        this.player.animFrame = (this.player.animFrame + 1) % 4;
      }
    } else {
      this.player.animFrame = 0;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.currentRealm === 'white_space') {
      this.renderWhiteSpace();
    } else {
      this.renderPySpace();
    }

    // Render Interactable Objects (Pure Pixel Art)
    this.renderInteractables();

    // Render Ponytail Girl Character Sprite in exact facing direction
    PythomoriPixelArt.drawPonytailGirl(
      this.ctx,
      this.player.x,
      this.player.y,
      this.player.direction,
      this.player.animFrame
    );
  }

  renderWhiteSpace() {
    const ctx = this.ctx;

    // 1. Pure White Space Floor
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. White Mat with 2px Black Border (Exact Replica of Screenshot 3)
    PythomoriPixelArt.drawPixelWhiteMat(ctx, 480, 320, 320, 220);

    // 3. Hanging Lightbulb from Top (Wire + Bulb + Shadow)
    PythomoriPixelArt.drawPixelLightbulb(ctx, 640, 220);

    // 4. Floating White Door at Top-Left
    PythomoriPixelArt.drawPixelWhiteDoor(ctx, 480, 130);
  }

  renderPySpace() {
    const ctx = this.ctx;

    ctx.fillStyle = '#181524';
    ctx.fillRect(0, 0, this.width, this.height);

    for (let x = 60; x < 1220; x += 160) {
      PythomoriPixelArt.px(ctx, x, 380, 120, 80, '#2d2442');
      PythomoriPixelArt.px(ctx, x + 10, 390, 100, 60, '#392e54');
    }

    PythomoriPixelArt.px(ctx, 670, 80, 100, 580, '#00e5db');
    PythomoriPixelArt.px(ctx, 660, 320, 120, 54, '#ffd43b');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeRect(660, 320, 120, 54);
  }

  renderInteractables() {
    const ctx = this.ctx;
    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;

    for (let obj of this.interactables) {
      const ox = obj.x + obj.w / 2;
      const oy = obj.y + obj.h / 2;
      const dist = Math.hypot(px - ox, py - oy);

      if (this.currentRealm === 'white_space') {
        if (obj.id === 'laptop') {
          PythomoriPixelArt.drawPixelLaptop(ctx, obj.x, obj.y);
        } else if (obj.id === 'sketchbook') {
          PythomoriPixelArt.drawPixelSketchbook(ctx, obj.x, obj.y);
        } else if (obj.id === 'tissue_box') {
          PythomoriPixelArt.drawPixelTissueBox(ctx, obj.x, obj.y);
        } else if (obj.id === 'mewo') {
          PythomoriPixelArt.drawPixelMewo(ctx, obj.x, obj.y);
        }
      } else {
        if (obj.id === 'ruby_npc') {
          PythomoriPixelArt.px(ctx, obj.x + 8, obj.y + 16, 26, 30, '#f28e9b');
          PythomoriPixelArt.px(ctx, obj.x + 10, obj.y + 6, 22, 14, '#fff0f2');
        }
      }

      // Interaction Prompt
      if (dist < 65) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(ox - 45, obj.y - 28, 90, 20);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ox - 45, obj.y - 28, 90, 20);
        
        ctx.fillStyle = '#ffd43b';
        ctx.font = 'bold 12px VT323, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obj.promptText || '[E] CEK', ox, obj.y - 14);
      }
    }
  }

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }
}
