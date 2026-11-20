// Palmera Cover Studio — cover rendering engine.
//
// drawCover paints a complete GTA-style magazine cover onto any 2D canvas:
// photo panels with white poster borders, a colour grade, a heavy condensed
// masthead, coverlines, a sticker badge, an issue line and a barcode. The
// editor's live preview and the PNG export both call this one function, so
// what you see is exactly what gets exported.

export const SIZES = {
  square: { w: 1080, h: 1080, label: 'Square 1080 × 1080' },
  portrait: { w: 1080, h: 1350, label: 'Portrait 1080 × 1350' },
  wide: { w: 1920, h: 1080, label: 'Wide 1920 × 1080' },
};

export const DISPLAY_FONT = "'Palmera Display', 'Arial Black', sans-serif";
export const BODY_FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

// Panel rectangles are fractions of the canvas. linesAt names where the
// coverline stack sits; mastheadAt is the masthead's baseline anchor.
export const LAYOUTS = [
  {
    id: 'poster-grid', name: 'Poster Grid',
    panels: [
      { x: 0.025, y: 0.025, w: 0.585, h: 0.95 },
      { x: 0.635, y: 0.025, w: 0.34, h: 0.4625 },
      { x: 0.635, y: 0.5125, w: 0.34, h: 0.4625 },
    ],
    masthead: 'top', linesAt: 'main-bottom', sticker: 'top-right',
  },
  {
    id: 'full-bleed', name: 'Full Bleed',
    panels: [{ x: 0, y: 0, w: 1, h: 1 }],
    masthead: 'top', linesAt: 'left-bottom', sticker: 'right',
  },
  {
    id: 'duo-split', name: 'Duo Split',
    panels: [
      { x: 0.02, y: 0.02, w: 0.465, h: 0.96 },
      { x: 0.515, y: 0.02, w: 0.465, h: 0.96 },
    ],
    masthead: 'top', linesAt: 'left-bottom', sticker: 'top-right',
  },
  {
    id: 'trio-strip', name: 'Trio Strip',
    panels: [
      { x: 0.02, y: 0.02, w: 0.96, h: 0.30 },
      { x: 0.02, y: 0.35, w: 0.96, h: 0.30 },
      { x: 0.02, y: 0.68, w: 0.96, h: 0.30 },
    ],
    masthead: 'top', linesAt: 'strip-bottom', sticker: 'top-right',
  },
  {
    id: 'newsstand', name: 'Newsstand',
    panels: [{ x: 0, y: 0, w: 1, h: 1 }],
    masthead: 'top', linesAt: 'above-banner', sticker: 'right', banner: true,
  },
  {
    id: 'neon-frame', name: 'Neon Frame',
    panels: [{ x: 0.045, y: 0.045, w: 0.91, h: 0.91 }],
    masthead: 'bottom', linesAt: 'right-stack', sticker: 'top-right', frame: 'neon',
  },
];

export const GRADES = [
  {
    id: 'vice-sunset', name: 'Vice Sunset',
    filter: 'saturate(1.35) contrast(1.08) brightness(1.04)',
    tint(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(255, 94, 58, 0.13)');
      g.addColorStop(0.45, 'rgba(255, 170, 60, 0.04)');
      g.addColorStop(1, 'rgba(140, 0, 150, 0.20)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'neon-nights', name: 'Neon Nights',
    filter: 'saturate(1.32) contrast(1.16) brightness(0.99)',
    tint(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(0, 229, 255, 0.13)');
      g.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
      g.addColorStop(1, 'rgba(255, 43, 166, 0.17)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'golden-hour', name: 'Golden Hour',
    filter: 'sepia(0.24) saturate(1.22) contrast(1.05) brightness(1.07)',
    tint(ctx, w, h) {
      const g = ctx.createRadialGradient(w * 0.5, h * 0.32, h * 0.1, w * 0.5, h * 0.5, h * 0.95);
      g.addColorStop(0, 'rgba(255, 196, 86, 0.16)');
      g.addColorStop(1, 'rgba(120, 52, 0, 0.15)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'midnight-chrome', name: 'Midnight Chrome',
    filter: 'saturate(0.86) contrast(1.22) brightness(0.98) hue-rotate(-10deg)',
    tint(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(38, 84, 190, 0.16)');
      g.addColorStop(1, 'rgba(2, 6, 26, 0.24)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    },
  },
  {
    id: 'clean-gloss', name: 'Clean Gloss',
    filter: 'saturate(1.10) contrast(1.05) brightness(1.02)',
    tint() {},
  },
  {
    id: 'mono-noir', name: 'Mono Noir',
    filter: 'grayscale(1) contrast(1.28) brightness(1.03)',
    tint(ctx, w, h) {
      ctx.fillStyle = 'rgba(255, 226, 170, 0.06)';
      ctx.fillRect(0, 0, w, h);
    },
  },
];

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}

export function gradeById(id) {
  return GRADES.find((g) => g.id === id) ?? GRADES[0];
}

export function defaultTexts() {
  return {
    masthead: 'VICE HEAT',
    kicker: 'PALMERA — THE BOULEVARD ISSUE',
    line1: 'SUNSET CHASES & NEON NIGHTS',
    line2: '12 RIDES THAT OWN THE STRIP',
    line3: 'PIER AFTER DARK: WHERE THE CITY GLOWS',
    sticker: 'FREE POSTER INSIDE!',
    issue: 'ISSUE 07 — 2026',
    banner: 'PLUS: THE BEACH CLUB MAP EVERYONE IS HUNTING',
  };
}

// Draw one photo into a panel rect, cover-fit, honouring the panel focus
// (zoom 1..2.6, fx/fy 0..1 choose which part of the overflow stays visible).
function drawPanelPhoto(ctx, img, rect, focus, filter) {
  const { x, y, w, h } = rect;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.filter = filter;
  const zoom = focus?.zoom ?? 1;
  const fx = focus?.fx ?? 0.5;
  const fy = focus?.fy ?? 0.5;
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
  const rw = img.naturalWidth * scale;
  const rh = img.naturalHeight * scale;
  ctx.drawImage(img, x - (rw - w) * fx, y - (rh - h) * fy, rw, rh);
  ctx.restore();
  ctx.filter = 'none';
}

// Shrink the font until the text fits maxWidth; returns the px size used.
function fitFont(ctx, text, px, maxWidth, family, spacing = '0px') {
  let size = px;
  ctx.font = `${size}px ${family}`;
  try { ctx.letterSpacing = spacing; } catch { /* older engines */ }
  while (size > 10 && ctx.measureText(text).width > maxWidth) {
    size *= 0.94;
    ctx.font = `${size}px ${family}`;
  }
  return size;
}

function outlinedText(ctx, text, x, y, { fill, stroke = 'rgba(8,6,18,0.92)', width, align = 'left' }) {
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.textAlign = 'left';
}

function drawMasthead(ctx, w, h, layout, texts) {
  const atBottom = layout.masthead === 'bottom';
  const base = atBottom ? h * 0.90 : h * 0.155;
  ctx.save();
  ctx.transform(1, 0, -0.045, 1, 0, 0); // a whisper of poster italic
  const size = fitFont(ctx, texts.masthead, h * 0.17, w * 0.94, DISPLAY_FONT, '-1px');
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = size * 0.12;
  ctx.shadowOffsetY = size * 0.05;
  outlinedText(ctx, texts.masthead, w * 0.5, base, {
    fill: '#ffffff', width: size * 0.16, align: 'center',
  });
  ctx.restore();
  // kicker chip above the masthead (or below it when the masthead sits low)
  const label = texts.kicker.toUpperCase();
  ctx.font = `${Math.round(h * 0.026)}px ${BODY_FONT}`;
  try { ctx.letterSpacing = '3px'; } catch { /* ignore */ }
  const tw = ctx.measureText(label).width + w * 0.03;
  const chipH = h * 0.042;
  const chipY = atBottom ? base + h * 0.035 : base - h * 0.155 + h * 0.012;
  ctx.fillStyle = '#ff2e88';
  ctx.beginPath();
  ctx.roundRect(w * 0.5 - tw / 2, chipY, tw, chipH, chipH / 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, w * 0.5, chipY + chipH / 2 + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  try { ctx.letterSpacing = '0px'; } catch { /* ignore */ }
}

function drawCoverlines(ctx, w, h, layout, texts) {
  const lines = [texts.line1, texts.line2, texts.line3].filter((s) => s && s.trim());
  if (!lines.length) return;
  const size = h * 0.040;
  const step = size * 1.42;
  let x = w * 0.045;
  let y;
  if (layout.linesAt === 'main-bottom') y = h * 0.965 - step * (lines.length - 1);
  else if (layout.linesAt === 'strip-bottom') y = h * 0.955 - step * (lines.length - 1);
  else if (layout.linesAt === 'above-banner') y = h * 0.845 - step * (lines.length - 1);
  else if (layout.linesAt === 'right-stack') { x = w * 0.60; y = h * 0.30; }
  else y = h * 0.955 - step * (lines.length - 1); // left-bottom
  lines.forEach((line, i) => {
    const px = fitFont(ctx, line, size, w * (layout.linesAt === 'right-stack' ? 0.36 : 0.62), DISPLAY_FONT);
    ctx.fillStyle = i === 0 ? '#ffd21f' : '#ff2e88';
    ctx.fillRect(x, y - px * 0.78, px * 0.52, px * 0.52);
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = px * 0.16;
    ctx.shadowOffsetY = px * 0.05;
    outlinedText(ctx, line, x + px * 0.78, y, {
      fill: i === 0 ? '#ffd21f' : '#ffffff', width: px * 0.13,
    });
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    y += step;
  });
}

function drawSticker(ctx, w, h, layout, texts) {
  if (!texts.sticker || !texts.sticker.trim()) return;
  const r = Math.min(w, h) * 0.085;
  const cx = layout.sticker === 'top-right' || layout.sticker === 'right' ? w * 0.915 : w * 0.915;
  const cy = layout.sticker === 'right' ? h * 0.30 : h * 0.115;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.21);
  ctx.beginPath();
  const spikes = 14;
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.82;
    const a = (Math.PI * i) / spikes;
    const px = Math.cos(a) * rad;
    const py = Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffd21f';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = r * 0.18;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#14101f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const words = texts.sticker.toUpperCase().split(' ');
  const mid = Math.ceil(words.length / 2);
  const rows = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')].filter(Boolean);
  rows.forEach((row, i) => {
    const px = fitFont(ctx, row, r * 0.42, r * 1.5, DISPLAY_FONT);
    ctx.font = `${px}px ${DISPLAY_FONT}`;
    ctx.fillText(row, 0, (i - (rows.length - 1) / 2) * px * 1.05);
  });
  ctx.restore();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawIssueAndBarcode(ctx, w, h, layout, texts) {
  ctx.font = `600 ${Math.round(h * 0.020)}px ${BODY_FONT}`;
  try { ctx.letterSpacing = '2px'; } catch { /* ignore */ }
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 6;
  ctx.fillText(texts.issue.toUpperCase(), w * 0.035, h * 0.038);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  try { ctx.letterSpacing = '0px'; } catch { /* ignore */ }
  if (layout.banner) return; // the banner carries the bottom edge instead
  // barcode, bottom-right
  const bw = w * 0.105;
  const bh = h * 0.052;
  const bx = w - bw - w * 0.03;
  const by = h - bh - h * 0.028;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = '#111111';
  let seed = 7;
  for (const ch of texts.issue + texts.masthead) seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
  let cx = bx + bw * 0.07;
  while (cx < bx + bw * 0.9) {
    seed = (seed * 137 + 71) % 9973;
    const barW = (1 + (seed % 3)) * (bw * 0.012);
    if (seed % 3 !== 0) ctx.fillRect(cx, by + bh * 0.10, barW, bh * 0.62);
    cx += barW + bw * 0.014;
  }
  ctx.font = `${Math.round(bh * 0.22)}px ${BODY_FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('0 70989 02461 07', bx + bw / 2, by + bh * 0.92);
  ctx.textAlign = 'left';
}

function drawBanner(ctx, w, h, texts) {
  const bh = h * 0.115;
  const g = ctx.createLinearGradient(0, h - bh, w, h - bh);
  g.addColorStop(0, '#ff2e88');
  g.addColorStop(1, '#7a1fa2');
  ctx.fillStyle = g;
  ctx.fillRect(0, h - bh, w, bh);
  const px = fitFont(ctx, texts.banner, bh * 0.44, w * 0.92, DISPLAY_FONT);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  outlinedText(ctx, texts.banner, w * 0.5, h - bh / 2, {
    fill: '#ffffff', width: px * 0.10, align: 'center',
  });
  ctx.textBaseline = 'alphabetic';
}

export function drawCover(ctx, w, h, state) {
  const layout = layoutById(state.layoutId);
  const grade = gradeById(state.gradeId);
  ctx.fillStyle = layout.frame === 'neon' ? '#07070d' : '#101018';
  ctx.fillRect(0, 0, w, h);

  layout.panels.forEach((p, i) => {
    const rect = { x: p.x * w, y: p.y * h, w: p.w * w, h: p.h * h };
    const photo = state.photos[state.panelPhoto[i] ?? 0] ?? state.photos[0];
    const img = photo?.img ?? photo; // photo records are { img, label }
    if (img) drawPanelPhoto(ctx, img, rect, state.focus[i], grade.filter);
    if (layout.frame === 'neon') {
      ctx.save();
      ctx.strokeStyle = '#ff2eaa';
      ctx.lineWidth = Math.max(3, w * 0.004);
      ctx.shadowColor = '#ff2eaa';
      ctx.shadowBlur = w * 0.02;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    } else if (layout.panels.length > 1 || p.w < 1) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(5, w * 0.0055);
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    }
  });

  grade.tint(ctx, w, h);
  drawIssueAndBarcode(ctx, w, h, layout, state.texts);
  if (layout.banner) drawBanner(ctx, w, h, state.texts);
  drawCoverlines(ctx, w, h, layout, state.texts);
  drawMasthead(ctx, w, h, layout, state.texts);
  drawSticker(ctx, w, h, layout, state.texts);
}

export function renderCoverCanvas(state) {
  const size = SIZES[state.sizeKey] ?? SIZES.square;
  const canvas = document.createElement('canvas');
  canvas.width = size.w;
  canvas.height = size.h;
  drawCover(canvas.getContext('2d'), size.w, size.h, state);
  return canvas;
}

export function exportCoverPNG(state) {
  const canvas = renderCoverCanvas(state);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vice-heat-cover-${state.sizeKey}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
}
