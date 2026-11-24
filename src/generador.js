const productos = [
  { nombre: "Origen Huila 500 g", precio: 42000 },
  { nombre: "Origen Nariño 250 g", precio: 26000 },
  { nombre: "Prensa francesa", precio: 95000 },
  { nombre: "Origen Sierra 500 g", precio: 45000 },
  { nombre: "Molino manual", precio: 120000 }
];

const ciudades = ["Medellín", "Bogotá", "Cali", "Pereira"];
const fechas = [
  "2026-09-01",
  "2026-09-02",
  "2026-09-03",
  "2026-09-04",
  "2026-09-05",
  "2026-09-06",
  "2026-09-07"
];

function elegirAleatorio(elementos) {
  return elementos[Math.floor(Math.random() * elementos.length)];
}

function generarVentasNo(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError("n debe ser un entero no negativo.");
  }

  const cantidadClientes = Math.max(1, Math.floor(n / 3));
  const ventas = [];

  for (let i = 0; i < n; i += 1) {
    const producto = elegirAleatorio(productos);
    ventas.push({
      id: i + 1,
      fecha: elegirAleatorio(fechas),
      cliente: `C${String(Math.floor(Math.random() * cantidadClientes) + 1).padStart(2, "0")}`,
      producto: producto.nombre,
      ciudad: elegirAleatorio(ciudades),
      cantidad: Math.floor(Math.random() * 5) + 1,
      precio: producto.precio
    });
  }

  return ventas;
}

module.exports = { generarVentasNo };
