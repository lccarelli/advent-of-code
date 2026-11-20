import { loadSolver } from "./rust.js";
import { drawScene, floorLabel } from "./scene.js";

const byId = id => document.getElementById(id);
const speedButtons = [...document.querySelectorAll("[data-speed]")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const solve = await loadSolver("solution.wasm");
let journey, position = 0, playing = false, lastFrame = 0, speed = 400;

function generatedSample() {
  let seed = 2015;
  const random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  return [[60, 0.85], [700, 0.56], [1100, 0.44], [1200, 0.53]]
    .map(([length, upChance]) => Array.from({ length }, () => (random() < upChance ? "(" : ")")).join(""))
    .join("");
}

const lastStep = () => journey.floors.length - 1;
const step = () => Math.floor(position);

function narration() {
  const { instructions, floors, firstBasementPosition } = journey;
  const current = step();
  if (current === 0) return `Planta baja. ${instructions.length} instrucciones por delante.`;
  const instruction = instructions[current - 1];
  const verb = instruction === "(" ? "sube" : "baja";
  let sentence = `Instrucción ${current}: <strong>${instruction}</strong> ${verb} de ${floorLabel(floors[current - 1])} a <strong>${floorLabel(floors[current])}</strong>.`;
  if (current === firstBasementPosition) sentence += " Primera vez en el sótano: respuesta de la Parte 2.";
  if (current === lastStep()) sentence += " Fin del recorrido: respuesta de la Parte 1.";
  return sentence;
}

function render() {
  drawScene(byId("building"), journey, position);
  byId("narration").innerHTML = narration();
  byId("play").textContent = playing ? "Pausa" : "Reproducir";
  speedButtons.forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.speed) === speed)));
}

function goTo(target) {
  position = Math.max(0, Math.min(target, lastStep()));
  render();
}

function tick(now) {
  if (!playing) return;
  const target = position + ((now - lastFrame) / 1000) * speed;
  lastFrame = now;
  if (target >= lastStep()) playing = false;
  goTo(target);
  if (playing) requestAnimationFrame(tick);
}

function togglePlay() {
  playing = !playing;
  if (playing && step() >= lastStep()) position = 0;
  lastFrame = performance.now();
  render();
  if (playing) requestAnimationFrame(tick);
}

function startJourney(text, note) {
  const result = solve(text);
  const instructions = [...text].filter(character => character === "(" || character === ")").join("");
  journey = { ...result, instructions, lowest: Math.min(0, ...result.floors), highest: Math.max(0, ...result.floors) };
  byId("final-floor").textContent = result.finalFloor;
  byId("basement-position").textContent = result.firstBasementPosition ?? "nunca llega";
  byId("source-note").textContent = note;
  speed = instructions.length <= 12 ? 2 : instructions.length <= 300 ? 80 : instructions.length <= 4000 ? 400 : 2000;
  playing = false;
  position = reducedMotion ? lastStep() : 0;
  if (reducedMotion) render(); else togglePlay();
}

function loadSample() {
  const sample = generatedSample();
  byId("input").value = sample;
  startJourney(sample, "Instrucciones generadas al azar. Pegá o cargá tu input: se procesa solo en tu navegador.");
}

byId("play").addEventListener("click", togglePlay);
byId("restart").addEventListener("click", () => goTo(0));
byId("back").addEventListener("click", () => goTo(step() - 1));
byId("forward").addEventListener("click", () => goTo(step() + 1));
byId("end").addEventListener("click", () => goTo(lastStep()));
speedButtons.forEach(button => button.addEventListener("click", () => {
  speed = Number(button.dataset.speed);
  render();
}));
byId("run").addEventListener("click", () => startJourney(byId("input").value, "Usando el input pegado."));
byId("sample").addEventListener("click", loadSample);
byId("input-file").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (file) startJourney((byId("input").value = await file.text()), `Usando ${file.name}.`);
});
addEventListener("resize", render);

loadSample();
