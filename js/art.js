/* ==========================================================================
   PYTHOMORI: AUTHENTIC 1-BIT PIXEL ART (OMORI WHITE SPACE REPLICA)
   Exact 4-directional sprite rendering for Ponytail Girl & pixel objects.
   ========================================================================== */

const PythomoriPixelArt = {
  px(ctx, x, y, w, h, color = '#000000') {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  },

  // 1. Ponytail Girl Sprite (Explicitly rendered for all 4 directions)
  drawPonytailGirl(ctx, x, y, direction = 'down', frame = 0) {
    const bob = (frame % 2 === 1) ? 2 : 0;
    const px = Math.floor(x);
    const py = Math.floor(y);

    if (direction === 'down') {
      // DOWN: Front View
      // Ponytail (Back right)
      this.px(ctx, px + 22, py + 8 - bob, 8, 18, '#140f1a');
      this.px(ctx, px + 26, py + 14 - bob, 6, 12, '#0d0a12');

      // Head Base & Skin
      this.px(ctx, px + 6, py + 10 - bob, 20, 16, '#ffe8c2');

      // Bangs & Hair Fringe (Covering forehead)
      this.px(ctx, px + 4, py + 2 - bob, 24, 10, '#2a2236');
      this.px(ctx, px + 2, py + 8 - bob, 6, 10, '#1c1624'); // Left bang
      this.px(ctx, px + 24, py + 8 - bob, 6, 10, '#1c1624'); // Right bang
      this.px(ctx, px + 10, py + 12 - bob, 4, 4, '#1c1624'); // Center bang
      this.px(ctx, px + 18, py + 12 - bob, 4, 3, '#1c1624');

      // Eyes (Looking straight down/forward)
      this.px(ctx, px + 8, py + 16 - bob, 4, 6, '#0d0d12');
      this.px(ctx, px + 9, py + 17 - bob, 2, 2, '#ffffff');
      this.px(ctx, px + 18, py + 16 - bob, 4, 6, '#0d0d12');
      this.px(ctx, px + 19, py + 17 - bob, 2, 2, '#ffffff');

      // Outfit - Collar & Lavender Vest
      this.px(ctx, px + 10, py + 24 - bob, 12, 4, '#ffffff');
      this.px(ctx, px + 6, py + 26 - bob, 20, 14, '#52436e');
      this.px(ctx, px + 14, py + 26 - bob, 4, 14, '#2e2342'); // Center dark line

      // Hands
      this.px(ctx, px + 2, py + 30 - bob, 4, 6, '#ffe8c2');
      this.px(ctx, px + 26, py + 30 - bob, 4, 6, '#ffe8c2');

      // Skirt & Feet
      this.px(ctx, px + 6, py + 38 - bob, 20, 4, '#14121a');
      if (frame % 2 === 1) {
        this.px(ctx, px + 8, py + 42, 6, 4, '#0d0d12');
        this.px(ctx, px + 18, py + 40, 6, 4, '#0d0d12');
      } else {
        this.px(ctx, px + 8, py + 42, 6, 4, '#0d0d12');
        this.px(ctx, px + 18, py + 42, 6, 4, '#0d0d12');
      }

    } else if (direction === 'left') {
      // LEFT: Facing Left
      // Ponytail trails behind on the RIGHT side
      this.px(ctx, px + 20, py + 6 - bob, 10, 20, '#140f1a');
      this.px(ctx, px + 24, py + 12 - bob, 8, 16, '#0d0a12');

      // Head & Skin (Shifted left)
      this.px(ctx, px + 4, py + 10 - bob, 18, 16, '#ffe8c2');

      // Hair (Top & back)
      this.px(ctx, px + 4, py + 2 - bob, 20, 10, '#2a2236');
      this.px(ctx, px + 16, py + 8 - bob, 8, 14, '#1c1624'); // Back hair
      this.px(ctx, px + 2, py + 8 - bob, 8, 10, '#1c1624'); // Front bang over eye

      // Single Eye on Left Side (Looking Left)
      this.px(ctx, px + 6, py + 16 - bob, 4, 6, '#0d0d12');
      this.px(ctx, px + 6, py + 17 - bob, 2, 2, '#ffffff'); // Glint on left

      // Outfit facing Left
      this.px(ctx, px + 6, py + 24 - bob, 10, 4, '#ffffff');
      this.px(ctx, px + 4, py + 26 - bob, 18, 14, '#52436e');
      this.px(ctx, px + 10, py + 26 - bob, 3, 14, '#2e2342');

      // Hand on left
      this.px(ctx, px + 2, py + 30 - bob, 4, 6, '#ffe8c2');

      // Skirt & Feet
      this.px(ctx, px + 4, py + 38 - bob, 18, 4, '#14121a');
      if (frame % 2 === 1) {
        this.px(ctx, px + 4, py + 42, 6, 4, '#0d0d12'); // Stepping left foot
        this.px(ctx, px + 14, py + 40, 6, 4, '#0d0d12');
      } else {
        this.px(ctx, px + 6, py + 42, 6, 4, '#0d0d12');
        this.px(ctx, px + 14, py + 42, 6, 4, '#0d0d12');
      }

    } else if (direction === 'right') {
      // RIGHT: Facing Right
      // Ponytail trails behind on the LEFT side
      this.px(ctx, px + 2, py + 6 - bob, 10, 20, '#140f1a');
      this.px(ctx, px, py + 12 - bob, 8, 16, '#0d0a12');

      // Head & Skin (Shifted right)
      this.px(ctx, px + 10, py + 10 - bob, 18, 16, '#ffe8c2');

      // Hair (Top & back)
      this.px(ctx, px + 8, py + 2 - bob, 20, 10, '#2a2236');
      this.px(ctx, px + 8, py + 8 - bob, 8, 14, '#1c1624'); // Back hair left
      this.px(ctx, px + 22, py + 8 - bob, 8, 10, '#1c1624'); // Front bang over right

      // Single Eye on Right Side (Looking Right)
      this.px(ctx, px + 22, py + 16 - bob, 4, 6, '#0d0d12');
      this.px(ctx, px + 24, py + 17 - bob, 2, 2, '#ffffff'); // Glint on right

      // Outfit facing Right
      this.px(ctx, px + 16, py + 24 - bob, 10, 4, '#ffffff');
      this.px(ctx, px + 10, py + 26 - bob, 18, 14, '#52436e');
      this.px(ctx, px + 18, py + 26 - bob, 3, 14, '#2e2342');

      // Hand on right
      this.px(ctx, px + 26, py + 30 - bob, 4, 6, '#ffe8c2');

      // Skirt & Feet
      this.px(ctx, px + 10, py + 38 - bob, 18, 4, '#14121a');
      if (frame % 2 === 1) {
        this.px(ctx, px + 22, py + 42, 6, 4, '#0d0d12'); // Stepping right foot
        this.px(ctx, px + 12, py + 40, 6, 4, '#0d0d12');
      } else {
        this.px(ctx, px + 12, py + 42, 6, 4, '#0d0d12');
        this.px(ctx, px + 20, py + 42, 6, 4, '#0d0d12');
      }

    } else if (direction === 'up') {
      // UP: Back View
      // Ponytail in Center-Back
      this.px(ctx, px + 10, py + 4 - bob, 14, 24, '#140f1a');
      this.px(ctx, px + 12, py + 8 - bob, 10, 18, '#2e253b');

      // Full Hair covering back of head
      this.px(ctx, px + 4, py + 2 - bob, 24, 20, '#2a2236');
      this.px(ctx, px + 2, py + 8 - bob, 28, 14, '#1c1624');

      // Outfit Back (Lavender with dark center line)
      this.px(ctx, px + 6, py + 24 - bob, 20, 16, '#52436e');
      this.px(ctx, px + 14, py + 24 - bob, 4, 16, '#2e2342');

      // Arms
      this.px(ctx, px + 2, py + 28 - bob, 4, 8, '#52436e');
      this.px(ctx, px + 26, py + 28 - bob, 4, 8, '#52436e');

      // Skirt & Feet
      this.px(ctx, px + 6, py + 38 - bob, 20, 4, '#14121a');
      if (frame % 2 === 1) {
        this.px(ctx, px + 8, py + 42, 6, 4, '#0d0d12');
        this.px(ctx, px + 18, py + 40, 6, 4, '#0d0d12');
      } else {
        this.px(ctx, px + 8, py + 42, 6, 4, '#0d0d12');
        this.px(ctx, px + 18, py + 42, 6, 4, '#0d0d12');
      }
    }
  },

  // 2. Pixel Art Laptop (Matching OMORI Screenshot 3)
  drawPixelLaptop(ctx, x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);

    this.px(ctx, px, py, 32, 24, '#000000');
    this.px(ctx, px + 2, py + 2, 28, 20, '#ffffff');
    
    // Pixel pattern screen
    for (let sy = py + 4; sy < py + 20; sy += 3) {
      for (let sx = px + 4; sx < px + 28; sx += 3) {
        if ((sx + sy) % 2 === 0) {
          this.px(ctx, sx, sy, 2, 2, '#000000');
        }
      }
    }

    // Keyboard Base
    this.px(ctx, px - 4, py + 24, 40, 8, '#000000');
    this.px(ctx, px - 2, py + 26, 36, 4, '#ffffff');
    for (let kx = px; kx < px + 32; kx += 4) {
      this.px(ctx, kx, py + 27, 2, 2, '#000000');
    }
  },

  // 3. Pixel Art Sketchbook
  drawPixelSketchbook(ctx, x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);

    this.px(ctx, px, py, 28, 36, '#000000');
    this.px(ctx, px + 2, py + 2, 24, 32, '#ffffff');

    // Spiral binding
    for (let sy = py + 4; sy < py + 32; sy += 5) {
      this.px(ctx, px - 2, sy, 4, 2, '#000000');
    }

    // Red bookmark/mark
    this.px(ctx, px + 12, py + 14, 6, 6, '#ff0000');
    this.px(ctx, px + 14, py + 12, 2, 10, '#ff0000');
  },

  // 4. Pixel Art Tissue Box
  drawPixelTissueBox(ctx, x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);

    this.px(ctx, px, py + 6, 26, 20, '#000000');
    this.px(ctx, px + 2, py + 8, 22, 16, '#ffffff');
    this.px(ctx, px + 18, py + 6, 8, 20, '#000000');

    this.px(ctx, px + 6, py + 8, 12, 3, '#000000');

    // White Tissue sticking out
    this.px(ctx, px + 8, py, 8, 8, '#ffffff');
    this.px(ctx, px + 10, py - 4, 6, 6, '#ffffff');
    this.px(ctx, px + 7, py + 1, 2, 7, '#000000');
    this.px(ctx, px + 15, py - 3, 2, 11, '#000000');
    this.px(ctx, px + 10, py - 4, 6, 2, '#000000');
  },

  // 5. Pixel Art Mewo Cat
  drawPixelMewo(ctx, x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);

    this.px(ctx, px + 4, py + 8, 28, 14, '#000000');
    this.px(ctx, px, py + 12, 8, 8, '#000000');

    this.px(ctx, px + 16, py + 2, 18, 16, '#000000');

    this.px(ctx, px + 16, py - 2, 4, 6, '#000000');
    this.px(ctx, px + 28, py - 2, 4, 6, '#000000');

    this.px(ctx, px + 20, py + 6, 3, 4, '#ffffff');
    this.px(ctx, px + 28, py + 6, 3, 4, '#ffffff');
    this.px(ctx, px + 21, py + 8, 2, 2, '#000000');
    this.px(ctx, px + 29, py + 8, 2, 2, '#000000');
  },

  // 6. Pixel Art Hanging Lightbulb
  drawPixelLightbulb(ctx, x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);

    for (let wy = 0; wy < py - 10; wy += 3) {
      this.px(ctx, px, wy, 2, 3, '#000000');
    }

    this.px(ctx, px - 4, py - 10, 10, 4, '#000000');
    this.px(ctx, px - 7, py - 6, 16, 16, '#000000');
    this.px(ctx, px - 5, py - 4, 12, 12, '#ffffff');

    this.px(ctx, px - 1, py - 2, 4, 4, '#000000');
    this.px(ctx, px, py + 2, 2, 3, '#000000');

    // Rays
    this.px(ctx, px - 11, py + 1, 2, 2, '#000000');
    this.px(ctx, px + 11, py + 1, 2, 2, '#000000');
    this.px(ctx, px - 9, py + 8, 2, 2, '#000000');
    this.px(ctx, px + 9, py + 8, 2, 2, '#000000');
    this.px(ctx, px, py + 13, 2, 2, '#000000');

    // Oval Shadow beneath
    this.px(ctx, px - 10, py + 28, 22, 4, '#cccccc');
    this.px(ctx, px - 6, py + 26, 14, 8, '#cccccc');
  },

  // 7. Pixel Art White Door
  drawPixelWhiteDoor(ctx, x, y) {
    const px = Math.floor(x);
    const py = Math.floor(y);

    this.px(ctx, px, py, 38, 56, '#000000');
    this.px(ctx, px + 2, py + 2, 34, 52, '#ffffff');

    this.px(ctx, px, py + 8, 2, 6, '#000000');
    this.px(ctx, px, py + 40, 2, 6, '#000000');
    this.px(ctx, px + 28, py + 28, 3, 3, '#000000');
  },

  // 8. White Mat (White rectangle with 2px black border)
  drawPixelWhiteMat(ctx, x, y, w, h) {
    const px = Math.floor(x);
    const py = Math.floor(y);

    this.px(ctx, px, py, w, h, '#000000');
    this.px(ctx, px + 2, py + 2, w - 4, h - 4, '#ffffff');
  },

  getAvatarSvg(charId) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
      <rect width="100" height="100" fill="#ffffff"/>
      <path d="M 65 15 C 80 15 90 28 88 50 C 85 62 76 58 72 45 Z" fill="#1e1826" stroke="#000" stroke-width="2"/>
      <ellipse cx="50" cy="50" rx="24" ry="22" fill="#ffe8c2" stroke="#000" stroke-width="2"/>
      <path d="M 26 42 C 24 20 40 14 52 14 C 66 14 78 22 76 42 C 70 34 62 44 52 36 C 44 44 34 36 26 42 Z" fill="#2a2236" stroke="#000" stroke-width="2"/>
      <rect x="38" y="46" width="6" height="8" fill="#000000"/>
      <rect x="40" y="47" width="2" height="2" fill="#ffffff"/>
      <rect x="58" y="46" width="6" height="8" fill="#000000"/>
      <rect x="60" y="47" width="2" height="2" fill="#ffffff"/>
      <path d="M 34 100 L 38 76 Q 50 74 62 76 L 66 100 Z" fill="#52436e" stroke="#000" stroke-width="2"/>
      <polygon points="46,76 50,84 54,76" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
};
