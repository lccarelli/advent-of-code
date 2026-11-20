export function floorLabel(floor) {
  if (floor === 0) return "PB";
  return floor < 0 ? `S${-floor}` : String(floor);
}

function countVisits(floors, step) {
  const visits = new Map();
  for (let index = 0; index <= step; index++) visits.set(floors[index], (visits.get(floors[index]) ?? 0) + 1);
  return visits;
}

function drawWindows(context, scene, palette) {
  const { facade, shaft, floorHeight, floorTop, lowest, highest } = scene;
  const visits = countVisits(scene.floors, scene.step);
  const mostVisits = Math.max(...visits.values());
  const sideWidth = (facade.width - shaft.width) / 2;
  const windowWidth = sideWidth * 0.3;
  const windowHeight = Math.max(1, Math.min(floorHeight * 0.55, 22));
  for (let floor = lowest; floor <= highest; floor++) {
    const top = floorTop(floor);
    context.fillStyle = floor < 0 ? palette["facade-basement"] : palette.facade;
    context.fillRect(facade.left, top, facade.width, floorHeight + 0.5);
    const lit = visits.get(floor) ?? 0;
    context.fillStyle = lit ? palette["window-on"] : palette["window-off"];
    context.globalAlpha = lit ? 0.35 + 0.65 * (lit / mostVisits) : 1;
    for (const sideLeft of [facade.left, shaft.left + shaft.width]) {
      for (const slot of [0, 1]) {
        const x = sideLeft + slot * (sideWidth / 2) + (sideWidth / 2 - windowWidth) / 2;
        context.fillRect(x, top + (floorHeight - windowHeight) / 2, windowWidth, windowHeight);
      }
    }
    context.globalAlpha = 1;
  }
}

function drawElevator(context, scene, palette) {
  const { shaft, floorTop, floorHeight, highest, lowest, centerOf, carFloor } = scene;
  context.fillStyle = palette.shaft;
  context.fillRect(shaft.left, floorTop(highest), shaft.width, floorTop(lowest) + floorHeight - floorTop(highest));
  const carHeight = Math.max(6, Math.min(floorHeight * 0.85, 34));
  context.fillStyle = palette.car;
  context.shadowColor = palette.car;
  context.shadowBlur = 8;
  context.fillRect(shaft.left + 2, centerOf(carFloor) - carHeight / 2, shaft.width - 4, carHeight);
  context.shadowBlur = 0;
}

function drawFloorLabels(context, scene, palette) {
  const { floorHeight, lowest, highest, facade, centerOf } = scene;
  context.font = `11px ${palette["font-mono"]}`;
  context.fillStyle = palette.muted;
  context.textAlign = "right";
  context.textBaseline = "middle";
  const labelEvery = [1, 2, 5, 10, 20, 25, 50, 100, 250, 500].find(every => every * floorHeight >= 14) ?? 1000;
  for (let floor = lowest; floor <= highest; floor++) {
    if (floor % labelEvery === 0) context.fillText(floorLabel(floor), facade.left - 8, centerOf(floor));
  }
}

export function drawBuilding(context, scene, palette) {
  const { width, height, groundY, facade, floorTop, floorHeight, highest } = scene;
  context.fillStyle = palette.sky;
  context.fillRect(0, 0, width, groundY);
  context.fillStyle = palette.soil;
  context.fillRect(0, groundY, width, height - groundY);
  context.fillStyle = palette.facade;
  context.fillRect(facade.left - 4, floorTop(highest) - 5, facade.width + 8, 5);
  drawWindows(context, scene, palette);
  drawElevator(context, scene, palette);
  if (scene.reachedBasement) {
    context.strokeStyle = palette.basement;
    context.lineWidth = 2;
    context.strokeRect(facade.left, floorTop(-1), facade.width, floorHeight);
  }
  context.strokeStyle = palette.ground;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, groundY);
  context.lineTo(width, groundY);
  context.stroke();
  drawFloorLabels(context, scene, palette);
}
