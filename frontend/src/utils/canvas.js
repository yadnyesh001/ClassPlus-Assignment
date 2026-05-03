const DEFAULT_CONFIG = {
  name: { x: 0.5, y: 0.12, fontSize: 0.06, color: '#ffffff', align: 'center' },
  profile: { x: 0.12, y: 0.12, radius: 0.08 },
  wishes: {
    x: 0.5,
    y: 0.85,
    fontSize: 0.035,
    color: '#ffffff',
    align: 'center',
    maxWidth: 0.8,
  },
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function mergeConfig(cfg = {}) {
  return {
    name: { ...DEFAULT_CONFIG.name, ...(cfg.name || {}) },
    profile: { ...DEFAULT_CONFIG.profile, ...(cfg.profile || {}) },
    wishes: { ...DEFAULT_CONFIG.wishes, ...(cfg.wishes || {}) },
  };
}

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let line = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = `${line} ${words[i]}`;
      if (ctx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    lines.push(line);
  }
  return lines;
}

/**
 * Draws template + name + circular profile picture onto the canvas.
 * If `aspectRatio` (W/H) is given, the canvas uses that ratio and the
 * template is cover-cropped to fill it. Otherwise the canvas matches
 * the template's native aspect.
 */
export async function renderGreeting({
  canvas,
  templateUrl,
  name,
  wishes,
  profilePic,
  overlayConfig,
  maxWidth,
  aspectRatio,
}) {
  const cfg = mergeConfig(overlayConfig);
  const tpl = await loadImage(templateUrl);

  let W, H;
  if (aspectRatio) {
    W = maxWidth || 800;
    H = Math.round(W / aspectRatio);
  } else {
    const scale = maxWidth && tpl.width > maxWidth ? maxWidth / tpl.width : 1;
    W = Math.round(tpl.width * scale);
    H = Math.round(tpl.height * scale);
  }
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  if (aspectRatio) {
    const targetRatio = W / H;
    const srcRatio = tpl.width / tpl.height;
    let sx, sy, sw, sh;
    if (srcRatio > targetRatio) {
      sh = tpl.height;
      sw = sh * targetRatio;
      sx = (tpl.width - sw) / 2;
      sy = 0;
    } else {
      sw = tpl.width;
      sh = sw / targetRatio;
      sx = 0;
      sy = (tpl.height - sh) / 2;
    }
    ctx.drawImage(tpl, sx, sy, sw, sh, 0, 0, W, H);
  } else {
    ctx.drawImage(tpl, 0, 0, W, H);
  }

  // Profile picture (circular, top-left by default)
  if (profilePic) {
    try {
      const avatar = await loadImage(profilePic);
      const r = cfg.profile.radius * W;
      const cx = cfg.profile.x * W;
      const cy = cfg.profile.y * H;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      const size = r * 2;
      ctx.drawImage(avatar, cx - r, cy - r, size, size);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(2, r * 0.06);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();
    } catch {
      /* ignore avatar load failure — keep template */
    }
  }

  // Name overlay
  if (name) {
    const fontPx = Math.max(14, cfg.name.fontSize * H);
    ctx.font = `700 ${fontPx}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = cfg.name.align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = cfg.name.color;
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = Math.max(2, fontPx * 0.12);
    ctx.shadowOffsetY = 2;
    ctx.fillText(name, cfg.name.x * W, cfg.name.y * H);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }

  // Wishes overlay (multi-line, wrapped)
  if (wishes && wishes.trim()) {
    const fontPx = Math.max(12, cfg.wishes.fontSize * H);
    ctx.font = `500 ${fontPx}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = cfg.wishes.align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = cfg.wishes.color;
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = Math.max(2, fontPx * 0.18);
    ctx.shadowOffsetY = 2;

    const lines = wrapText(ctx, wishes.trim(), cfg.wishes.maxWidth * W);
    const lineHeight = fontPx * 1.25;
    const totalHeight = lineHeight * lines.length;
    const startY = cfg.wishes.y * H - totalHeight / 2 + lineHeight / 2;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cfg.wishes.x * W, startY + i * lineHeight);
    }

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }

  return canvas;
}

export async function exportPng(canvas) {
  return canvas.toDataURL('image/png');
}

export async function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
