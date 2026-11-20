import { loadSolver } from "./rust.js";
import { drawScene } from "./scene.js";

const byId = id => document.getElementById(id);
const speedButtons = [...document.querySelectorAll("[data-speed]")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const solve = await loadSolver("solution.wasm");
let journey, position = 0, playing = false, lastFrame = 0, speed = 2;

function generatedSample() {
  let seed = 2015;
  const random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const side = () => 1 + Math.floor(random() * 29);
  const presents = Array.from({ length: 298 }, () => `${side()}x${side()}x${side()}`);
  return ["2x3x4", "1x1x10", ...presents].join("\n");
}

const lastIndex = () => Math.max(0, journey.presents.length - 1);
const current = () => Math.floor(position);

function narration() {
  const { presents, paperSoFar, ribbonSoFar } = journey;
  if (!presents.length) return "No hay regalos en el input: cada línea tiene que ser como 2x3x4.";
  const index = current();
  const { length: l, width: w, height: h, paper, ribbon } = presents[index];
  const faces = [l * w, w * h, h * l];
  const [shortest, middle] = [l, w, h].sort((a, b) => a - b);
  return [
    `Regalo ${index + 1} de ${presents.length}: <strong>${l}x${w}x${h}</strong>.`,
    `Papel: 2·${faces[0]} + 2·${faces[1]} + 2·${faces[2]} + ${Math.min(...faces)} de extra = <strong>${paper}</strong> pies².`,
    `Cinta: ${shortest}+${shortest}+${middle}+${middle} + ${l * w * h} de moño = <strong>${ribbon}</strong> pies.`,
    `Acumulado: ${paperSoFar[index]} pies² de papel · ${ribbonSoFar[index]} pies de cinta.`,
  ].join("<br>");
}

function render() {
  drawScene(byId("scene"), journey, current());
  byId("narration").innerHTML = narration();
  byId("play").textContent = playing ? "Pausa" : "Reproducir";
  speedButtons.forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.speed) === speed)));
}

function goTo(target) {
  position = Math.max(0, Math.min(target, lastIndex()));
  render();
}

function tick(now) {
  if (!playing) return;
  const target = position + ((now - lastFrame) / 1000) * speed;
  lastFrame = now;
  if (target >= lastIndex()) playing = false;
  goTo(target);
  if (playing) requestAnimationFrame(tick);
}

function togglePlay() {
  playing = !playing;
  if (playing && current() >= lastIndex()) position = 0;
  lastFrame = performance.now();
  render();
  if (playing) requestAnimationFrame(tick);
}

function runningTotals(values) {
  let total = 0;
  return values.map(value => (total += value));
}

function startJourney(list, note) {
  const result = solve(list);
  journey = {
    ...result,
    mostPaper: Math.max(1, ...result.presents.map(present => present.paper)),
    paperSoFar: runningTotals(result.presents.map(present => present.paper)),
    ribbonSoFar: runningTotals(result.presents.map(present => present.ribbon)),
  };
  byId("total-paper").textContent = result.totalPaper;
  byId("total-ribbon").textContent = result.totalRibbon;
  byId("source-note").textContent = note;
  speed = result.presents.length <= 5 ? 0.5 : result.presents.length <= 400 ? 2 : 60;
  playing = false;
  position = reducedMotion ? lastIndex() : 0;
  if (reducedMotion || !result.presents.length) render(); else togglePlay();
}

function loadSample() {
  const sample = generatedSample();
  byId("input").value = sample;
  startJourney(sample, "Lista generada al azar; empieza con los dos ejemplos del enunciado. Pegá o cargá tu input: se procesa solo en tu navegador.");
}

byId("play").addEventListener("click", togglePlay);
byId("restart").addEventListener("click", () => goTo(0));
byId("back").addEventListener("click", () => goTo(current() - 1));
byId("forward").addEventListener("click", () => goTo(current() + 1));
byId("end").addEventListener("click", () => goTo(lastIndex()));
speedButtons.forEach(button => button.addEventListener("click", () => {
  speed = Number(button.dataset.speed);
  render();
}));
byId("run").addEventListener("click", () => startJourney(byId("input").value, "Usando la lista pegada."));
byId("sample").addEventListener("click", loadSample);
byId("input-file").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (file) startJourney((byId("input").value = await file.text()), `Usando ${file.name}.`);
});
addEventListener("resize", render);

loadSample();
