const ventas = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia
} = require("./analitica");

const formatoPesos = (valor) => valor.toLocaleString("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function mostrarSeccion(titulo) {
  console.log(`\n${"=".repeat(64)}\n${titulo}\n${"-".repeat(64)}`);
}

function mostrarResumenDelDia(fecha) {
  const ventasDelDiaSeleccionado = ventasDelDia(ventas, fecha);

  console.log(`\n  ${fecha}`);
  if (ventasDelDiaSeleccionado.length === 0) {
    console.log("  Sin ventas registradas para esta fecha.");
  }
  console.log(`  Registros: ${ventasDelDiaSeleccionado.length}`);
  console.log(`  Unidades:  ${unidadesVendidas(ventasDelDiaSeleccionado)}`);
  console.log(`  Total:     ${formatoPesos(totalVendido(ventasDelDiaSeleccionado))}`);
  console.log(`  Ticket promedio: ${formatoPesos(ticketPromedio(ventasDelDiaSeleccionado))}`);
}

console.log("CAFÉ ORIGEN | MOTOR DE ANALÍTICA v0.1");

mostrarSeccion("1. RESUMEN GENERAL");
console.log(`  Registros de venta: ${ventas.length}`);
console.log(`  Unidades vendidas:  ${unidadesVendidas(ventas)}`);
console.log(`  Ventas totales:     ${formatoPesos(totalVendido(ventas))}`);
console.log(`  Ticket promedio:    ${formatoPesos(ticketPromedio(ventas))}`);
console.log("\n  Resumen por día");
mostrarResumenDelDia("2026-09-01");
mostrarResumenDelDia("2026-09-07");

mostrarSeccion("2. VENTAS POR CIUDAD");
console.table(Object.entries(totalPorCiudad(ventas)).map(([ciudad, valor]) => ({
  Ciudad: ciudad,
  "Ventas (COP)": formatoPesos(valor)
})));

mostrarSeccion("3. UNIDADES POR PRODUCTO");
console.table(Object.entries(unidadesPorProducto(ventas)).map(([producto, unidades]) => ({
  Producto: producto,
  Unidades: unidades
})));

mostrarSeccion("4. TOP 3 DE PRODUCTOS POR VALOR");
console.table(topProductosPorValor(ventas, 3).map(({ producto, valorGenerado }) => ({
  Producto: producto,
  "Valor generado (COP)": formatoPesos(valorGenerado)
})));
