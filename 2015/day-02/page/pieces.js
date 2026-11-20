function faces({ length: l, width: w, height: h }) {
  const all = [
    { across: l, down: w, name: "largo×ancho" },
    { across: w, down: h, name: "ancho×alto" },
    { across: h, down: l, name: "alto×largo" },
  ];
  const smallest = all.reduce((best, face) => (face.across * face.down < best.across * best.down ? face : best));
  return { all, smallest };
}

function drawPiece(context, cell, scale, piece, highlighted, palette) {
  const labelSpace = 30;
  const width = piece.across * scale, height = piece.down * scale;
  const x = cell.left + (cell.width - width) / 2;
  const y = cell.top + (cell.height - labelSpace - height) / 2;
  context.fillStyle = piece.extra ? palette["window-on"] : palette["paper-top"];
  context.fillRect(x, y, width, height);
  context.strokeStyle = highlighted ? palette["window-on"] : palette["paper-edge"];
  context.lineWidth = highlighted ? 2 : 1;
  context.strokeRect(x, y, width, height);
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = piece.extra ? palette["window-on"] : palette.bright;
  context.font = `600 13px ${palette["font-mono"]}`;
  context.fillText(String(piece.across * piece.down), cell.left + cell.width / 2, cell.top + cell.height - labelSpace + 2);
  context.fillStyle = palette.muted;
  context.font = `10px ${palette["font-mono"]}`;
  context.fillText(piece.extra ? "extra" : piece.name, cell.left + cell.width / 2, cell.top + cell.height - labelSpace + 17);
}

export function drawPieces(context, region, present, palette) {
  const { all, smallest } = faces(present);
  const columns = 4, rows = 2;
  const cellWidth = region.width / columns, cellHeight = region.height / rows;
  const largestSide = Math.max(present.length, present.width, present.height);
  const scale = Math.min((cellWidth - 16) / largestSide, (cellHeight - 42) / largestSide);
  const pieces = [...all, { ...smallest, extra: true }, ...all];
  pieces.forEach((piece, index) => {
    const cell = {
      left: region.left + (index % columns) * cellWidth,
      top: region.top + Math.floor(index / columns) * cellHeight,
      width: cellWidth,
      height: cellHeight,
    };
    drawPiece(context, cell, scale, piece, !piece.extra && piece.name === smallest.name, palette);
  });
  const totalX = region.left + 3.5 * cellWidth, totalY = region.top + 1.5 * cellHeight;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = palette["window-on"];
  context.shadowColor = palette["window-on"];
  context.shadowBlur = 6;
  context.font = `600 22px ${palette["font-mono"]}`;
  context.fillText(`= ${present.paper}`, totalX, totalY - 8);
  context.shadowBlur = 0;
  context.fillStyle = palette.muted;
  context.font = `11px ${palette["font-mono"]}`;
  context.fillText("pies² de papel", totalX, totalY + 14);
}
