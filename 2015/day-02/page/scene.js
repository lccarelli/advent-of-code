import { drawPresent } from "./present.js";
import { drawPieces } from "./pieces.js";
import { drawQueue } from "./queue.js";

function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const names = ["sky", "rule", "bright", "muted", "window-off", "window-on", "paper-top", "paper-left", "paper-right", "paper-edge", "ribbon", "font-mono"];
  return Object.fromEntries(names.map(name => [name, style.getPropertyValue(`--${name}`).trim()]));
}

function prepare(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth, height = canvas.clientHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width, height };
}

function regions(width, height) {
  const queue = { left: 14, top: height - 78, width: width - 28, height: 66 };
  const available = height - 92;
  if (width >= 640) {
    return {
      present: { left: 0, top: 0, width: width * 0.44, height: available },
      pieces: { left: width * 0.46, top: 24, width: width * 0.52, height: available - 36 },
      queue,
    };
  }
  return {
    present: { left: 0, top: 0, width, height: available * 0.52 },
    pieces: { left: 8, top: available * 0.52, width: width - 16, height: available * 0.48 },
    queue,
  };
}

export function drawScene(canvas, journey, current) {
  const { context, width, height } = prepare(canvas);
  const palette = readPalette();
  context.fillStyle = palette.sky;
  context.fillRect(0, 0, width, height);
  if (!journey.presents.length) return;
  const area = regions(width, height);
  drawPresent(context, area.present, journey.presents[current], palette);
  drawPieces(context, area.pieces, journey.presents[current], palette);
  context.strokeStyle = palette.rule;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(area.queue.left, area.queue.top - 8);
  context.lineTo(area.queue.left + area.queue.width, area.queue.top - 8);
  context.stroke();
  drawQueue(context, area.queue, journey, current, palette);
}
