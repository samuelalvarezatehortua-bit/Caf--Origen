const { performance } = require("node:perf_hooks");
const { clientesRecurrentes } = require("./analitica");
const { generarVentasNo } = require("./generador");

const tamanos = [1000, 2000, 4000, 8000, 16000];
const extras = process.argv.slice(2).map(Number).filter((n) => Number.isInteger(n) && n > 0);
const LIMITE_MS = 2 * 60 * 1000;

function medirTiempo(n) {
  const ventas = generarVentasNo(n);
  const etiqueta = `clientesRecurrentes n=${n}`;

  console.time(etiqueta);
  const inicio = performance.now();
  const recurrentes = clientesRecurrentes(ventas);
  const ms = performance.now() - inicio;
  console.timeEnd(etiqueta);

  return { n, ms, recurrentes: recurrentes.length };
}

clientesRecurrentes(generarVentasNo(1000));

console.log("Mediciones con console.time / console.timeEnd:");
const filas = tamanos.map(medirTiempo);

const tabla = filas.map((fila, i) => ({
  n: fila.n,
  "comparaciones n(n-1)/2": (fila.n * (fila.n - 1)) / 2,
  "tiempo (ms)": Number(fila.ms.toFixed(1)),
  "factor vs. anterior": i === 0 ? "-" : Number((fila.ms / filas[i - 1].ms).toFixed(2)),
  "clientes recurrentes": fila.recurrentes
}));
console.table(tabla);

const base = filas[filas.length - 1];
const estimar = (n) => base.ms * (n / base.n) ** 2;
const formatear = (ms) => (ms < 60000
  ? `${(ms / 1000).toFixed(1)} s`
  : ms < 3600000 ? `${(ms / 60000).toFixed(1)} min` : `${(ms / 3600000).toFixed(1)} h`);

console.log(`\nEstimaciones a partir de n=${base.n} (${base.ms.toFixed(1)} ms):`);
for (const n of [100000, 1000000]) {
  console.log(`  n=${n}: ${base.ms.toFixed(1)} ms × (${n}/${base.n})² = ${(n / base.n) ** 2} × -> ${formatear(estimar(n))}`);
}

for (const n of extras) {
  const estimado = estimar(n);
  if (estimado >= LIMITE_MS) {
    console.log(`\nn=${n}: estimación ${formatear(estimado)} ≥ 2 min; no se ejecuta.`);
    continue;
  }
  console.log(`\nn=${n}: estimación ${formatear(estimado)} < 2 min; se ejecuta.`);
  const fila = medirTiempo(n);
  console.log(`  real: ${formatear(fila.ms)} (error vs. estimación: ${(((fila.ms - estimado) / estimado) * 100).toFixed(1)} %)`);
}
