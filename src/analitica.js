function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function totalVendido(ventas, contador) {
  let total = 0;

  for (const venta of ventas) {
    if (contador) {
      contador.operaciones += 1;
    }
    total += valorVenta(venta);
  }

  return total;
}

function totalVendidoM(ventas) {
  return ventas.reduce((total, venta) => total + valorVenta(venta), 0);
}

function unidadesVendidas(ventas) {
  let unidades = 0;

  for (const venta of ventas) {
    unidades += venta.cantidad;
  }

  return unidades;
}

function unidadesVendidasM(ventas) {
  return ventas.reduce((unidades, venta) => unidades + venta.cantidad, 0);
}

function ventaMayor(ventas, contador) {
  if (ventas.length === 0) {
    return null;
  }

  let mayor = ventas[0];

  for (const venta of ventas) {
    if (contador) {
      contador.operaciones += 2;
    }
    if (valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }

  return mayor;
}

function ticketPromedio(ventas) {
  let total = 0;
  let contador = 0;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
      contador += 1;
    }
  }

  if (contador === 0) {
    return 0;
  }

  return total / contador;
}

function ventasPorCiudad(ventas, ciudad) {
  let total = 0;
  const ciudadBuscada = ciudad.trim().toLowerCase();

  for (const venta of ventas) {
    const ciudadVenta = venta.ciudad.trim().toLowerCase();

    if (ciudadVenta === ciudadBuscada) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function ventasPorCiudadM(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();

  return ventas
    .filter((venta) => venta.ciudad.trim().toLowerCase() === ciudadBuscada)
    .map(valorVenta)
    .reduce((total, valor) => total + valor, 0);
}

function normalizarCiudad(ciudad) {
  return ciudad.trim().toLowerCase();
}

function totalCiudadUnaPasada(ventas, ciudad) {
  const ciudadBuscada = normalizarCiudad(ciudad);
  let total = 0;

  for (const venta of ventas) {
    if (normalizarCiudad(venta.ciudad) === ciudadBuscada) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function totalPorCiudad(ventas, contador) {
  const totales = {};
  const nombres = {};

  for (const venta of ventas) {
    if (contador) {
      contador.operaciones += 1;
    }

    const ciudad = venta.ciudad.trim();
    const clave = ciudad.toLowerCase();
    if (contador) {
      contador.operaciones += 1;
    }
    if (!Object.hasOwn(totales, clave)) {
      totales[clave] = 0;
      nombres[clave] = ciudad;
    }

    totales[clave] += valorVenta(venta);
  }

  const resultado = {};
  for (const [clave, total] of Object.entries(totales)) {
    if (contador) {
      contador.operaciones += 1;
    }
    resultado[nombres[clave]] = total;
  }

  return resultado;
}

function unidadesPorProducto(ventas) {
  return ventas.reduce((unidades, venta) => {
    unidades[venta.producto] = (unidades[venta.producto] ?? 0) + venta.cantidad;
    return unidades;
  }, {});
}

function topProductosPorValor(ventas, k) {
  const valoresPorProducto = ventas.reduce((valores, venta) => {
    valores[venta.producto] = (valores[venta.producto] ?? 0) + valorVenta(venta);
    return valores;
  }, {});

  return [...Object.entries(valoresPorProducto)]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([producto, valorGenerado]) => ({ producto, valorGenerado }));
}

function ventasDelDia(ventas, fecha) {
  return ventas.filter((venta) => venta.fecha === fecha);
}

function clientesRecurrentes(ventas) {
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (ventas[i].cliente === ventas[j].cliente &&
        !recurrentes.includes(ventas[i].cliente)) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

module.exports = {
  valorVenta,
  totalVendido,
  totalVendidoM,
  unidadesVendidas,
  unidadesVendidasM,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  ventasPorCiudadM,
  normalizarCiudad,
  totalCiudadUnaPasada,
  totalCiudad: totalCiudadUnaPasada,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentes
};