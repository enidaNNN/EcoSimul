/**
 * ============================================================================
 * ECO-VALLEY: Advanced Pixel Art & Sprite Engine (Organic 16-Bit Aesthetic)
 * Features smooth 360-degree soaring eagle, 4-legged walking deer,
 * dying spirits, rounded Stardew animals, and Demetrius realistic 96x96 portrait.
 * ============================================================================
 */

class PixelSpriteEngine {
  constructor() {}

  px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // --- 1. SMOOTH ORGANIC SOARING EAGLE (360-Degree Heading) ---
  drawEagle(ctx, e) {
    ctx.save();
    ctx.translate(Math.round(e.x), Math.round(e.y - e.altitude));

    // Calculate heading angle so head ALWAYS faces the exact direction of flight!
    const heading = Math.atan2(e.vy, e.vx);
    // Since sprite local head points "up" (-Y), we rotate by heading + PI/2
    ctx.rotate(heading + Math.PI / 2);

    const flap = Math.sin(e.wingAngle) * 0.38; // smooth sinusoidal flapping

    const cFeather = '#44301f';
    const cFeatherDark = '#25180e';
    const cGoldMantle = '#c68b59';
    const cHeadWhite = '#fafafa';
    const cBeak = '#f59e0b';
    const cEye = '#1c1917';

    // Left Wing (Curved Flight Feathers with Tiered Primaries)
    ctx.save();
    ctx.rotate(-flap);
    this.px(ctx, -28, -8, 22, 9, cFeather);
    this.px(ctx, -24, -4, 18, 5, cGoldMantle);
    this.px(ctx, -44, -6, 18, 7, cFeatherDark);
    this.px(ctx, -48, -2, 6, 6, cFeatherDark);
    this.px(ctx, -50, 2, 4, 5, cFeatherDark);
    this.px(ctx, -46, 5, 6, 4, cFeatherDark);
    this.px(ctx, -38, 1, 18, 4, cFeatherDark);
    ctx.restore();

    // Right Wing (Curved Flight Feathers with Tiered Primaries)
    ctx.save();
    ctx.rotate(flap);
    this.px(ctx, 6, -8, 22, 9, cFeather);
    this.px(ctx, 6, -4, 18, 5, cGoldMantle);
    this.px(ctx, 26, -6, 18, 7, cFeatherDark);
    this.px(ctx, 42, -2, 6, 6, cFeatherDark);
    this.px(ctx, 46, 2, 4, 5, cFeatherDark);
    this.px(ctx, 40, 5, 6, 4, cFeatherDark);
    this.px(ctx, 20, 1, 18, 4, cFeatherDark);
    ctx.restore();

    // Torso Body (Muscular Oval)
    this.px(ctx, -8, -10, 16, 20, cFeather);
    this.px(ctx, -6, -6, 12, 14, cGoldMantle);

    // Fan Tail Feathers (Spread white tail with dark tips)
    this.px(ctx, -8, 8, 16, 9, cHeadWhite);
    this.px(ctx, -7, 15, 14, 3, cFeatherDark);

    // Regal White Head
    this.px(ctx, -6, -19, 12, 11, cHeadWhite);
    // Dark Alert Eyes
    this.px(ctx, -4, -15, 2, 2, cEye);
    this.px(ctx, 2, -15, 2, 2, cEye);
    // Hooked Golden Beak
    this.px(ctx, -3, -24, 6, 6, cBeak);
    this.px(ctx, -2, -26, 4, 3, '#d97706'); // Sharp tip

    // Tucked Golden Talons
    this.px(ctx, -5, 6, 3, 3, cBeak);
    this.px(ctx, 2, 6, 3, 3, cBeak);

    ctx.restore();
  }

  // --- 2. SMOOTH 4-LEGGED WALKING DEER ---
  drawDeer(ctx, d) {
    ctx.save();
    const cycle = d.walkCycle || 0;
    const isMoving = Math.hypot(d.vx, d.vy) > 0.1;
    const bob = isMoving ? Math.abs(Math.sin(cycle * 2)) * 2 : 0;

    ctx.translate(Math.round(d.x), Math.round(d.y - bob));
    const faceRight = d.vx >= 0;
    if (!faceRight) ctx.scale(-1, 1);

    const cCoat = '#b45309';
    const cCoatDark = '#78350f';
    const cBelly = '#fef3c7';
    const cAntler = '#78350f';
    const cHoof = '#1c1917';

    // 4 Distinct Animated Legs with Hooves (Smooth Walk Cycle)
    const legFL = isMoving ? Math.sin(cycle) * 5 : 0;
    const legFR = isMoving ? Math.sin(cycle + Math.PI) * 5 : 0;
    const legRL = isMoving ? Math.cos(cycle) * 5 : 0;
    const legRR = isMoving ? Math.cos(cycle + Math.PI) * 5 : 0;

    // Back legs (shaded behind body)
    this.px(ctx, -11 + legRL, 8, 3, 11, cCoatDark);
    this.px(ctx, -11 + legRL, 18, 3, 2, cHoof);
    this.px(ctx, 8 + legFR, 8, 3, 11, cCoatDark);
    this.px(ctx, 8 + legFR, 18, 3, 2, cHoof);

    // Front legs (illuminated in front)
    this.px(ctx, -8 + legRR, 8, 3, 11, cCoat);
    this.px(ctx, -8 + legRR, 18, 3, 2, cHoof);
    this.px(ctx, 5 + legFL, 8, 3, 11, cCoat);
    this.px(ctx, 5 + legFL, 18, 3, 2, cHoof);

    // Muscular Rounded Body
    this.px(ctx, -14, -2, 24, 11, cCoat);
    this.px(ctx, -9, 4, 15, 5, cBelly);

    // Dapple Spots
    this.px(ctx, -7, 0, 2, 2, '#ffffff');
    this.px(ctx, 0, 1, 2, 2, '#ffffff');
    this.px(ctx, -2, -1, 2, 2, '#ffffff');

    // Tail
    this.px(ctx, -16, -1, 3, 4, '#ffffff');

    // Graceful Neck & Head
    this.px(ctx, 6, -10, 5, 9, cCoat);
    this.px(ctx, 8, -15, 10, 8, cCoat);
    this.px(ctx, 15, -13, 4, 4, cBelly);
    this.px(ctx, 17, -14, 2, 2, cHoof); // Nose

    // Eye
    this.px(ctx, 12, -13, 2, 3, cHoof);
    this.px(ctx, 12, -13, 1, 1, '#ffffff');

    // Soft alert ears
    this.px(ctx, 6, -18, 3, 4, cCoat);
    this.px(ctx, 7, -17, 1, 3, '#fca5a5');

    // Antlers
    if (d.hasAntlers) {
      this.px(ctx, 7, -23, 2, 8, cAntler);
      this.px(ctx, 4, -22, 4, 2, cAntler);
      this.px(ctx, 6, -25, 5, 2, cAntler);
    }

    ctx.restore();
  }

  // --- 3. CUTE STARDEW VALLEY BUNNY ---
  drawRabbit(ctx, r) {
    ctx.save();
    ctx.translate(Math.round(r.x), Math.round(r.y + r.jumpY));
    const faceRight = r.vx >= 0;
    if (!faceRight) ctx.scale(-1, 1);

    const cWhite = '#fffdf7';
    const cCream = '#f5e9d3';
    const cPink = '#fca5a5';
    const cDark = '#29180d';

    // Round Fluffy Tail
    this.px(ctx, -9, 1, 4, 4, cWhite);
    this.px(ctx, -8, 3, 3, 2, cCream);

    // Rounded Body
    this.px(ctx, -7, -3, 13, 9, cWhite);
    this.px(ctx, -6, 4, 11, 2, cCream);

    // Folded Paws
    this.px(ctx, -5, 6, 4, 2, cWhite);
    this.px(ctx, 2, 6, 4, 2, cWhite);

    // Chubby Head
    this.px(ctx, 1, -7, 9, 8, cWhite);
    this.px(ctx, 3, 0, 6, 2, cCream);

    // Long Floppy Ears with Pink Center
    this.px(ctx, 2, -15, 3, 8, cWhite);
    this.px(ctx, 3, -14, 1, 6, cPink);
    this.px(ctx, 6, -15, 3, 8, cWhite);
    this.px(ctx, 7, -14, 1, 6, cPink);

    // Eye
    this.px(ctx, 6, -5, 2, 2, cDark);
    this.px(ctx, 6, -5, 1, 1, '#ffffff');

    // Nose & Blush
    this.px(ctx, 9, -4, 2, 1, cPink);
    this.px(ctx, 8, -2, 2, 1, cPink);

    ctx.restore();
  }

  // --- 4. AUBURN RED FOX ---
  drawFox(ctx, f) {
    ctx.save();
    ctx.translate(Math.round(f.x), Math.round(f.y));
    const faceRight = f.vx >= 0;
    if (!faceRight) ctx.scale(-1, 1);

    const cFur = '#ea580c';
    const cFurDark = '#9a3412';
    const cWhite = '#fffbeb';
    const cBlack = '#1c1917';

    // Bushy Tail
    this.px(ctx, -20, -5, 10, 8, cFur);
    this.px(ctx, -25, -3, 6, 6, cWhite);

    // Paws
    this.px(ctx, -9, 6, 3, 7, cBlack);
    this.px(ctx, 5, 6, 3, 7, cBlack);

    // Body
    this.px(ctx, -13, -4, 21, 11, cFur);
    this.px(ctx, -7, 4, 12, 3, cFurDark);
    this.px(ctx, 2, 0, 6, 7, cWhite);

    // Head
    this.px(ctx, 6, -9, 9, 9, cFur);
    this.px(ctx, 12, -5, 6, 4, cWhite);
    this.px(ctx, 17, -6, 2, 2, cBlack);

    // Ears
    this.px(ctx, 7, -15, 3, 6, cBlack);
    this.px(ctx, 8, -14, 1, 4, cWhite);
    this.px(ctx, 11, -15, 3, 6, cBlack);
    this.px(ctx, 12, -14, 1, 4, cWhite);

    // Eyes
    this.px(ctx, 10, -7, 2, 2, '#f59e0b');
    this.px(ctx, 11, -7, 1, 2, cBlack);

    ctx.restore();
  }

  // --- 5. TIMBER WOLF ---
  drawWolf(ctx, w) {
    ctx.save();
    ctx.translate(Math.round(w.x), Math.round(w.y));
    const faceRight = w.vx >= 0;
    if (!faceRight) ctx.scale(-1, 1);

    const cFur = '#4b5563';
    const cFurLight = '#9ca3af';
    const cFurDark = '#1f2937';

    this.px(ctx, -11, 8, 4, 9, cFurDark);
    this.px(ctx, 7, 8, 4, 9, cFurDark);

    this.px(ctx, -15, -4, 25, 13, cFur);
    this.px(ctx, -10, 5, 17, 4, cFurDark);
    this.px(ctx, 4, -3, 8, 10, cFurLight);

    this.px(ctx, -22, -2, 8, 5, cFurDark);
    this.px(ctx, -25, 1, 4, 4, cFur);

    this.px(ctx, 7, -10, 12, 10, cFur);
    this.px(ctx, 15, -6, 6, 5, cFurLight);
    this.px(ctx, 20, -7, 3, 3, '#111827');

    this.px(ctx, 8, -16, 4, 6, cFurDark);
    this.px(ctx, 9, -15, 2, 4, cFurLight);
    this.px(ctx, 14, -16, 4, 6, cFurDark);

    this.px(ctx, 12, -8, 3, 2, '#fbbf24');
    this.px(ctx, 13, -8, 1, 2, '#000000');

    ctx.restore();
  }

  // --- 6. FAINTING / DYING SPIRIT ANIMATION ---
  drawFadingSpirit(ctx, f) {
    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.translate(Math.round(f.x), Math.round(f.y + f.floatY));

    // Little Glowing Nature Soul Orb with tiny angel wings
    ctx.fillStyle = '#fffdf0';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.stroke();

    // Little Angel / Nature Wings
    const wingFlap = Math.sin(f.timer * 0.2) * 4;
    ctx.fillStyle = '#ffffff';
    // Left wing
    ctx.fillRect(-12, -4 + wingFlap, 5, 6);
    // Right wing
    ctx.fillRect(7, -4 - wingFlap, 5, 6);

    // Sparkles
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-2, -16, 4, 4);
    ctx.fillRect(6, 12, 3, 3);

    ctx.restore();
  }

  // --- 7. PLAYER RANGER (16-Bit Proportions) ---
  drawPlayer(ctx, x, y, facing = 'down', isMoving = false, animTimer = 0, hat = 'straw', name = 'Ranger') {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    const bob = isMoving ? Math.sin(animTimer * 10) * 2 : 0;
    const legSwing = isMoving ? Math.sin(animTimer * 10) * 3 : 0;

    const cSkin = '#fed7aa';
    const cSkinShadow = '#ea580c';
    const cHair = '#451a03';
    const cShirt = '#dc2626';
    const cShirtPlaid = '#f59e0b';
    const cOveralls = '#1d4ed8';
    const cOverallsDark = '#1e3a8a';
    const cBoots = '#451a03';

    // Boots
    this.px(ctx, -6, 12 + legSwing, 5, 4, cOverallsDark);
    this.px(ctx, -7, 16 + legSwing, 6, 5, cBoots);
    this.px(ctx, 1, 12 - legSwing, 5, 4, cOverallsDark);
    this.px(ctx, 1, 16 - legSwing, 6, 5, cBoots);

    // Overalls Body
    this.px(ctx, -7, 2 + bob, 14, 11, cOveralls);
    this.px(ctx, -6, 2 + bob, 12, 1, '#60a5fa');
    this.px(ctx, -7, 11 + bob, 14, 2, cOverallsDark);
    this.px(ctx, -5, -1 + bob, 2, 2, '#fbbf24');
    this.px(ctx, 3, -1 + bob, 2, 2, '#fbbf24');

    // Plaid Shirt & Straps
    this.px(ctx, -7, -4 + bob, 14, 6, cShirt);
    this.px(ctx, -3, -4 + bob, 6, 6, cShirtPlaid);
    this.px(ctx, -5, -4 + bob, 2, 6, cOverallsDark);
    this.px(ctx, 3, -4 + bob, 2, 6, cOverallsDark);

    // Arms
    if (facing === 'left') {
      this.px(ctx, -8, -2 + bob - legSwing, 4, 7, cShirt);
      this.px(ctx, -8, 5 + bob - legSwing, 3, 4, cSkin);
    } else if (facing === 'right') {
      this.px(ctx, 4, -2 + bob + legSwing, 4, 7, cShirt);
      this.px(ctx, 5, 5 + bob + legSwing, 3, 4, cSkin);
    } else {
      this.px(ctx, -10, -3 + bob + legSwing, 3, 7, cShirt);
      this.px(ctx, -10, 4 + bob + legSwing, 3, 3, cSkin);
      this.px(ctx, 7, -3 + bob - legSwing, 3, 7, cShirt);
      this.px(ctx, 7, 4 + bob - legSwing, 3, 3, cSkin);
    }

    // Head
    this.px(ctx, -6, -14 + bob, 12, 11, cSkin);
    this.px(ctx, -6, -4 + bob, 12, 2, cSkinShadow);

    // Eyes
    if (facing === 'down') {
      this.px(ctx, -4, -10 + bob, 2, 3, '#1e293b');
      this.px(ctx, 2, -10 + bob, 2, 3, '#1e293b');
      this.px(ctx, -4, -10 + bob, 1, 1, '#ffffff');
      this.px(ctx, 2, -10 + bob, 1, 1, '#ffffff');
      this.px(ctx, -2, -6 + bob, 4, 1, '#b45309');
    } else if (facing === 'left') {
      this.px(ctx, -5, -10 + bob, 2, 3, '#1e293b');
      this.px(ctx, -5, -10 + bob, 1, 1, '#ffffff');
    } else if (facing === 'right') {
      this.px(ctx, 3, -10 + bob, 2, 3, '#1e293b');
      this.px(ctx, 4, -10 + bob, 1, 1, '#ffffff');
    }

    // Hair
    this.px(ctx, -7, -13 + bob, 2, 7, cHair);
    this.px(ctx, 5, -13 + bob, 2, 7, cHair);

    // Hats
    if (hat === 'straw') {
      this.px(ctx, -13, -16 + bob, 26, 3, '#fde047');
      this.px(ctx, -12, -15 + bob, 24, 2, '#ca8a04');
      this.px(ctx, -8, -23 + bob, 16, 7, '#fde047');
      this.px(ctx, -7, -24 + bob, 14, 2, '#fef08a');
      this.px(ctx, -8, -17 + bob, 16, 2, '#b91c1c');
    } else if (hat === 'ranger') {
      this.px(ctx, -11, -16 + bob, 22, 3, '#78350f');
      this.px(ctx, -7, -23 + bob, 14, 7, '#92400e');
      this.px(ctx, -6, -24 + bob, 12, 2, '#b45309');
      this.px(ctx, -7, -17 + bob, 14, 2, '#451a03');
      this.px(ctx, -1, -18 + bob, 2, 3, '#fbbf24');
    } else if (hat === 'flower') {
      this.px(ctx, -7, -16 + bob, 14, 2, '#ec4899');
      this.px(ctx, 4, -19 + bob, 5, 5, '#f472b6');
      this.px(ctx, 5, -18 + bob, 3, 3, '#ffffff');
      this.px(ctx, 6, -17 + bob, 1, 1, '#fbbf24');
    }

    // Name Tag
    ctx.font = 'bold 12px "VT323", monospace';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(name).width;
    this.px(ctx, -textW / 2 - 4, -36 + bob, textW + 8, 13, 'rgba(28, 25, 23, 0.75)');
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(name, 0, -26 + bob);

    ctx.restore();
  }

  // --- 8. DEMETRIUS REALISTIC 96x96 PORTRAIT ---
  drawDemetriusPortrait(ctx, mood = 'normal') {
    ctx.clearRect(0, 0, 96, 96);

    ctx.fillStyle = '#bda27e';
    ctx.fillRect(0, 0, 96, 96);
    ctx.fillStyle = '#aa8f6b';
    for (let i = 0; i < 96; i += 16) ctx.fillRect(i, 0, 1, 96);

    this.px(ctx, 14, 68, 68, 28, '#d99726');
    this.px(ctx, 16, 70, 64, 26, '#b87c17');
    this.px(ctx, 42, 68, 12, 28, '#f5f3e9');
    this.px(ctx, 46, 72, 4, 24, '#c94a29');

    this.px(ctx, 36, 58, 24, 12, '#825232');
    this.px(ctx, 36, 66, 24, 4, '#5e381e');

    this.px(ctx, 24, 22, 48, 40, '#9c6644');
    this.px(ctx, 22, 26, 52, 32, '#9c6644');
    this.px(ctx, 28, 56, 40, 8, '#825232');

    this.px(ctx, 20, 10, 56, 18, '#1f1a17');
    this.px(ctx, 16, 16, 64, 14, '#1f1a17');
    this.px(ctx, 18, 26, 8, 22, '#1f1a17');
    this.px(ctx, 70, 26, 8, 22, '#1f1a17');

    this.px(ctx, 38, 54, 20, 10, '#1f1a17');
    this.px(ctx, 42, 52, 12, 3, '#1f1a17');

    this.px(ctx, 30, 32, 10, 2, '#1f1a17');
    this.px(ctx, 56, 32, 10, 2, '#1f1a17');
    this.px(ctx, 33, 38, 5, 4, '#1f1a17');
    this.px(ctx, 34, 38, 2, 2, '#ffffff');
    this.px(ctx, 58, 38, 5, 4, '#1f1a17');
    this.px(ctx, 59, 38, 2, 2, '#ffffff');

    this.px(ctx, 44, 42, 8, 5, '#734426');
    this.px(ctx, 43, 46, 10, 2, '#5e381e');

    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 34, 15, 12);
    ctx.strokeRect(53, 34, 15, 12);
    ctx.beginPath();
    ctx.moveTo(43, 39); ctx.lineTo(53, 39);
    ctx.moveTo(28, 39); ctx.lineTo(20, 37);
    ctx.moveTo(68, 39); ctx.lineTo(76, 37);
    ctx.stroke();

    if (mood === 'thumbs_up') {
      this.px(ctx, 40, 52, 16, 4, '#ffffff');
      this.px(ctx, 40, 56, 16, 2, '#6b1c1c');

      this.px(ctx, 70, 48, 18, 26, '#9c6644');
      this.px(ctx, 74, 36, 8, 14, '#9c6644');
      this.px(ctx, 75, 34, 6, 4, '#b07d58');
      this.px(ctx, 72, 48, 12, 14, '#734426');
      this.px(ctx, 84, 28, 4, 4, '#ffd166');
      this.px(ctx, 85, 25, 2, 10, '#ffffff');
      this.px(ctx, 81, 29, 10, 2, '#ffffff');
    } else {
      this.px(ctx, 42, 54, 12, 2, '#5e381e');
      this.px(ctx, 44, 53, 8, 1, '#b07d58');
    }
  }
}

window.PixelSpriteEngine = new PixelSpriteEngine();
