export async function loadSolver(url) {
  const bytes = await (await fetch(url)).arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes);
  const rust = instance.exports;

  return function solve(instructions) {
    const encoded = new TextEncoder().encode(instructions);
    const capacity = encoded.length + 1;
    const text = rust.allocate_text(encoded.length);
    new Uint8Array(rust.memory.buffer, text, encoded.length).set(encoded);
    const output = rust.allocate_numbers(capacity);
    const count = rust.write_floors(text, encoded.length, output);
    const floors = Array.from(new Int32Array(rust.memory.buffer, output, count));
    const finalFloor = rust.final_floor(text, encoded.length);
    const basement = rust.first_basement_position(text, encoded.length);
    rust.release_numbers(output, capacity);
    rust.release_text(text, encoded.length);
    return { floors, finalFloor, firstBasementPosition: basement < 0 ? null : basement };
  };
}
