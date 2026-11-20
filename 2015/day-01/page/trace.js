function drawAxis(context, scene, palette) {
  const { plot, roof, lastStep } = scene;
  context.font = `11px ${palette["font-mono"]}`;
  context.fillStyle = palette.muted;
  context.textBaseline = "middle";
  context.textAlign = "left";
  context.fillText("instrucción 0", plot.left, roof / 2);
  context.textAlign = "right";
  context.fillText(String(lastStep), plot.right, roof / 2);
}

function drawPath(context, scene, palette) {
  const { floors, step, position, carFloor, lastStep, plot, facade, xOf, centerOf } = scene;
  context.strokeStyle = palette.car;
  context.lineWidth = 1.5;
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(xOf(0), centerOf(floors[0]));
  const stride = Math.max(1, Math.floor(lastStep / ((plot.right - plot.left) * 2)));
  for (let instruction = stride; instruction <= step; instruction += stride) {
    context.lineTo(xOf(instruction), centerOf(floors[instruction]));
  }
  context.lineTo(xOf(position), centerOf(carFloor));
  context.stroke();

  context.setLineDash([3, 4]);
  context.globalAlpha = 0.45;
  context.beginPath();
  context.moveTo(facade.left + facade.width, centerOf(carFloor));
  context.lineTo(xOf(position), centerOf(carFloor));
  context.stroke();
  context.setLineDash([]);
  context.globalAlpha = 1;

  context.fillStyle = palette.car;
  context.shadowColor = palette.car;
  context.shadowBlur = 8;
  context.beginPath();
  context.arc(xOf(position), centerOf(carFloor), 4.5, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;
}

function drawBasementMarker(context, scene, palette) {
  const { basement, xOf, roof, height, centerOf, plot } = scene;
  const markerX = xOf(basement);
  context.strokeStyle = palette.basement;
  context.lineWidth = 1.2;
  context.beginPath();
  context.moveTo(markerX, roof);
  context.lineTo(markerX, height - 4);
  context.stroke();
  context.fillStyle = palette.basement;
  context.beginPath();
  context.arc(markerX, centerOf(-1), 5.5, 0, Math.PI * 2);
  context.fill();
  context.font = `600 12px ${palette["font-mono"]}`;
  context.textBaseline = "bottom";
  const nearRight = markerX > plot.right - 190;
  context.textAlign = nearRight ? "right" : "left";
  context.fillText(`entra al sótano · instrucción ${basement}`, markerX + (nearRight ? -7 : 7), height - 5);
}

export function drawTrace(context, scene, palette) {
  drawAxis(context, scene, palette);
  drawPath(context, scene, palette);
  if (scene.reachedBasement) drawBasementMarker(context, scene, palette);
}
