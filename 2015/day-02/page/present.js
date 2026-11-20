const cos30 = Math.cos(Math.PI / 6);
const sin30 = 0.5;

function projector(region, { length, width, height }) {
  const scale = Math.min(
    (region.width * 0.6) / ((length + width) * cos30),
    (region.height * 0.6) / ((length + width) * sin30 + height),
  );
  const originX = region.left + region.width / 2 - ((length - width) / 2) * cos30 * scale;
  const originY = region.top + region.height / 2 - (((length + width) * sin30 - height) * scale) / 2;
  return (a, b, c) => [originX + (a - b) * cos30 * scale, originY + (a + b) * sin30 * scale - c * scale];
}

function polygon(context, points, fill, stroke) {
  context.beginPath();
  points.forEach(([x, y], index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = 1;
  context.stroke();
}

function ribbonPath({ length: l, width: w, height: h }) {
  const largest = Math.max(l, w, h);
  if (largest === h) return { segments: [[[l, 0, h / 2], [l, w, h / 2], [0, w, h / 2]]], bow: [l, w, h / 2] };
  if (largest === l) return { segments: [[[l / 2, 0, h], [l / 2, w, h], [l / 2, w, 0]]], bow: [l / 2, w / 2, h] };
  return { segments: [[[0, w / 2, h], [l, w / 2, h], [l, w / 2, 0]]], bow: [l / 2, w / 2, h] };
}

function drawRibbon(context, project, present, palette) {
  const { segments, bow } = ribbonPath(present);
  context.strokeStyle = palette.ribbon;
  context.lineWidth = 5;
  context.lineJoin = "round";
  for (const segment of segments) {
    context.beginPath();
    segment.forEach((point, index) => (index ? context.lineTo(...project(...point)) : context.moveTo(...project(...point))));
    context.stroke();
  }
  const [bowX, bowY] = project(...bow);
  context.fillStyle = palette.ribbon;
  context.shadowColor = palette.ribbon;
  context.shadowBlur = 6;
  for (const side of [-1, 1]) {
    context.beginPath();
    context.ellipse(bowX + side * 11, bowY - 6, 11, 6, side * -0.5, 0, Math.PI * 2);
    context.fill();
  }
  context.shadowBlur = 0;
}

function drawDimensions(context, project, { length: l, width: w, height: h }, palette) {
  context.font = `12px ${palette["font-mono"]}`;
  context.fillStyle = palette.muted;
  context.textBaseline = "middle";
  const labels = [
    [[l / 2, w, 0], -14, 12, "right", `largo ${l}`],
    [[l, w / 2, 0], 14, 12, "left", `ancho ${w}`],
    [[l, 0, h / 2], 12, 0, "left", `alto ${h}`],
  ];
  for (const [point, offsetX, offsetY, align, text] of labels) {
    const [x, y] = project(...point);
    context.textAlign = align;
    context.fillText(text, x + offsetX, y + offsetY);
  }
}

export function drawPresent(context, region, present, palette) {
  const project = projector(region, present);
  const { length: l, width: w, height: h } = present;
  polygon(context, [project(0, 0, h), project(l, 0, h), project(l, w, h), project(0, w, h)], palette["paper-top"], palette["paper-edge"]);
  polygon(context, [project(l, 0, 0), project(l, w, 0), project(l, w, h), project(l, 0, h)], palette["paper-right"], palette["paper-edge"]);
  polygon(context, [project(0, w, 0), project(l, w, 0), project(l, w, h), project(0, w, h)], palette["paper-left"], palette["paper-edge"]);
  drawRibbon(context, project, present, palette);
  drawDimensions(context, project, present, palette);
}
