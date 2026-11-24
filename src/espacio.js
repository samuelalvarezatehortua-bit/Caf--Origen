const { performance } = require("node:perf_hooks");
const { spawnSync } = require("node:child_process");
const { valorVenta, normalizarCiudad, totalCiudadUnaPasada } = require("./analitica");
const { generarVentasNo } = require("./generador");

function totalCiudadCadena(ventas, ciudad) {
  const ciudadBuscada = normalizarCiudad(ciudad);

  return ventas
    .map((venta) => ({ ...venta, ciudad: normalizarCiudad(venta.ciudad) }))
    .filter((venta) => venta.ciudad === ciudadBuscada)
    .map(valorVenta)
    .reduce((total, valor) => total + valor, 0);
}

function recursosCadena(ventas, ciudad) {
  const ciudadBuscada = normalizarCiudad(ciudad);
  const normalizadas = ventas.map((venta) => ({ ...venta, ciudad: normalizarCiudad(venta.ciudad) }));
  const filtradas = normalizadas.filter((venta) => venta.ciudad === ciudadBuscada);
  const valores = filtradas.map(valorVenta);
  valores.reduce((total, valor) => total + valor, 0);

  return {
    version: "totalCiudadCadena",
    recorridos: 4,
    "elementos visitados": ventas.length + normalizadas.length + filtradas.length + valores.length,
    "arreglos nuevos": 3,
    "elementos en arreglos nuevos": normalizadas.length + filtradas.length + valores.length,
    "objetos copiados": normalizadas.length
  };
}

function recursosUnaPasada(ventas) {
  return {
    version: "totalCiudadUnaPasada",
    recorridos: 1,
    "elementos visitados": ventas.length,
    "arreglos nuevos": 0,
    "elementos en arreglos nuevos": 0,
    "objetos copiados": 0
  };
}

function ejecutarConLimite(version, megas) {
  const resultado = spawnSync(process.execPath, [
    `--max-old-space-size=${megas}`,
    __filename,
    "--hijo",
    version
  ], { encoding: "utf8" });

  return resultado.status === 0 ? "termina" : "sin memoria";
}

function medirTiempo(funcion, ventas, ciudad) {
  const inicio = performance.now();
  funcion(ventas, ciudad);
  return performance.now() - inicio;
}

const indiceHijo = process.argv.indexOf("--hijo");

if (require.main === module && indiceHijo !== -1) {
  const funcion = process.argv[indiceHijo + 1] === "cadena" ? totalCiudadCadena : totalCiudadUnaPasada;
  funcion(generarVentasNo(1000000), "Medellín");
} else if (require.main === module) {
  const ciudad = "Medellín";
  const ventas = generarVentasNo(10000);
  const cadena = totalCiudadCadena(ventas, ciudad);
  const unaPasada = totalCiudadUnaPasada(ventas, ciudad);

  console.log(`n = ${ventas.length}, ciudad = ${ciudad}`);
  console.log(`  totalCiudadCadena:    ${cadena}`);
  console.log(`  totalCiudadUnaPasada: ${unaPasada}`);
  console.log(`  ¿Iguales (===)?: ${cadena === unaPasada ? "Sí" : "No"}`);

  console.log("\nRecorridos y arreglos intermedios (n = 10.000):");
  console.table([recursosCadena(ventas, ciudad), recursosUnaPasada(ventas)]);

  console.log("Tiempo al crecer n:");
  console.table([10000, 100000, 1000000].map((n) => {
    const datos = generarVentasNo(n);
    totalCiudadCadena(datos, ciudad);
    totalCiudadUnaPasada(datos, ciudad);
    return {
      n,
      "cadena (ms)": Number(medirTiempo(totalCiudadCadena, datos, ciudad).toFixed(1)),
      "una pasada (ms)": Number(medirTiempo(totalCiudadUnaPasada, datos, ciudad).toFixed(1))
    };
  }));

  console.log("1.000.000 de ventas con memoria limitada (--max-old-space-size):");
  console.table([130, 160, 200, 250].map((megas) => ({
    "límite (MB)": megas,
    totalCiudadCadena: ejecutarConLimite("cadena", megas),
    totalCiudadUnaPasada: ejecutarConLimite("unaPasada", megas)
  })));
}

module.exports = { totalCiudadCadena };
