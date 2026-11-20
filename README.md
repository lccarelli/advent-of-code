# Advent of Code

Soluciones en Rust, cortas y con tests, compiladas a WebAssembly para verlas funcionar en una página por día.

**Visualizaciones:** https://lccarelli.github.io/advent-of-code/

## 2015

| Día | Puzzle | Solución | Visualización |
| --- | --- | --- | --- |
| 1 | [Not Quite Lisp](https://adventofcode.com/2015/day/1) | [`2015/day-01`](2015/day-01/src/lib.rs) | [El ascensor de Santa](https://lccarelli.github.io/advent-of-code/2015/day-01/) |

## Cada día

```
2015/day-01/
  src/lib.rs     solución + tests con los ejemplos del enunciado
  src/wasm.rs    funciones que llama la página
  src/main.rs    resuelve input.txt por terminal
  page/          visualización
  input.txt      tu input (no se publica)
```

```sh
cargo test -p aoc-2015-day-01
cargo run -p aoc-2015-day-01
```

Para ver las páginas localmente:

```sh
rustup target add wasm32-unknown-unknown
./scripts/build.sh
python3 -m http.server -d _site
```

Advent of Code pide no publicar los inputs, por eso `input.txt` está ignorado.
