import { drawBuilding } from "./building.js";
import { drawTrace } from "./trace.js";

export { floorLabel } from "./building.js";

function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const names = ["sky", "soil", "ground", "facade", "facade-basement", "shaft", "window-off", "window-on", "car", "basement", "muted", "font-mono"];
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

function layout(width, height, journey, position) {
  const { floors, lowest, highest, firstBasementPosition: basement } = journey;
  const lastStep = floors.length - 1;
  const step = Math.min(Math.floor(position), lastStep);
  const carFloor = floors[step] + ((floors[step + 1] ?? floors[step]) - floors[step]) * (position - step);
  const roof = 26, underground = lowest < 0 ? 22 : 40;
  const floorHeight = (height - roof - underground) / (highest - lowest + 1);
  const floorTop = floor => roof + (highest - floor) * floorHeight;
  const facadeLeft = 44, facadeWidth = Math.min(150, Math.max(92, width * 0.24));
  const shaftWidth = Math.max(14, facadeWidth * 0.16);
  const plotLeft = facadeLeft + facadeWidth + 18, plotRight = width - 14;
  return {
    width, height, roof, floors, lowest, highest, basement, lastStep, step, carFloor, position,
    reachedBasement: basement !== null && step >= basement,
    floorHeight, floorTop,
    centerOf: floor => floorTop(floor) + floorHeight / 2,
    groundY: floorTop(0) + floorHeight,
    facade: { left: facadeLeft, width: facadeWidth },
    shaft: { left: facadeLeft + (facadeWidth - shaftWidth) / 2, width: shaftWidth },
    plot: { left: plotLeft, right: plotRight },
    xOf: instruction => plotLeft + (lastStep ? instruction / lastStep : 0) * (plotRight - plotLeft),
  };
}

export function drawScene(canvas, journey, position) {
  const { context, width, height } = prepare(canvas);
  const scene = layout(width, height, journey, position);
  const palette = readPalette();
  drawBuilding(context, scene, palette);
  drawTrace(context, scene, palette);
}
