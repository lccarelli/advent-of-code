export async function loadSolver(url) {
  const bytes = await (await fetch(url)).arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes);
  const rust = instance.exports;

  return function solve(list) {
    const encoded = new TextEncoder().encode(list);
    const capacity = (list.split("\n").length + 1) * 5;
    const text = rust.allocate_text(encoded.length);
    new Uint8Array(rust.memory.buffer, text, encoded.length).set(encoded);
    const output = rust.allocate_numbers(capacity);
    const count = rust.write_presents(text, encoded.length, output, capacity);
    const values = Array.from(new Int32Array(rust.memory.buffer, output, count * 5));
    const totalPaper = rust.total_wrapping_paper(text, encoded.length);
    const totalRibbon = rust.total_ribbon(text, encoded.length);
    rust.release_numbers(output, capacity);
    rust.release_text(text, encoded.length);
    const presents = Array.from({ length: count }, (_, index) => {
      const [length, width, height, paper, ribbon] = values.slice(index * 5, index * 5 + 5);
      return { length, width, height, paper, ribbon };
    });
    return { presents, totalPaper, totalRibbon };
  };
}
