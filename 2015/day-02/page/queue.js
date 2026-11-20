export function drawQueue(context, region, journey, current, palette) {
  const { presents, mostPaper } = journey;
  const labelSpace = 16;
  const barWidth = region.width / presents.length;
  const gap = barWidth > 4 ? 1 : 0;
  presents.forEach((present, index) => {
    const barHeight = Math.max(2, (present.paper / mostPaper) * (region.height - labelSpace));
    context.fillStyle = index === current ? palette.bright : index < current ? palette["window-on"] : palette["window-off"];
    context.globalAlpha = index < current ? 0.7 : 1;
    context.fillRect(region.left + index * barWidth, region.top + region.height - labelSpace - barHeight, Math.max(1, barWidth - gap), barHeight);
  });
  context.globalAlpha = 1;
  context.font = `11px ${palette["font-mono"]}`;
  context.fillStyle = palette.muted;
  context.textBaseline = "bottom";
  context.textAlign = "left";
  context.fillText("regalo 1", region.left, region.top + region.height);
  context.textAlign = "center";
  context.fillText("papel de cada regalo", region.left + region.width / 2, region.top + region.height);
  context.textAlign = "right";
  context.fillText(String(presents.length), region.left + region.width, region.top + region.height);
}
