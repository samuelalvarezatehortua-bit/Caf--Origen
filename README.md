# Café Origen: motor de analítica v0.1

Proyecto que analiza una muestra de 12 ventas de Café Origen. El motor calcula indicadores, agrupa los resultados y muestra un informe claro en la consola usando Node.js, sin dependencias externas.

## Requisitos

- Node.js LTS

## Ejecutar el reporte

Desde la raíz del proyecto, corre:

```sh
node src/reporte.js
```

El informe incluye el resumen general, las ventas por ciudad, las unidades por producto y los tres productos que más valor generaron. Además, contrasta un día con ventas frente a uno sin ventas.

## Verificar los cálculos

```sh
node src/verificar.js
```

Si alguna comprobación falla, el proceso termina con un código distinto de cero.

## Explorar los datos

```sh
node src/explorar.js
```

El script imprime la cantidad de registros, el primero y el último, el producto del registro en la posición 4 y la tabla completa. La estructura de los datos, los casos borde y la bitácora de depuración se documentan en [bitacora.md](./bitacora.md).

## Medir operaciones

```sh
node src/medir.js
```

El script crea historiales de 100, 1.000, 10.000 y 100.000 ventas y presenta en una tabla las operaciones contadas por cada función. Las predicciones, los resultados y el análisis Big O se encuentran en [bitacora.md](./bitacora.md).

## Medir tiempos de clientes recurrentes

```sh
node src/tiempos.js           # n = 1.000, 2.000, 4.000, 8.000 y 16.000, y estimaciones
node src/tiempos.js 100000    # además ejecuta 100.000 si la estimación es menor a 2 minutos
node src/costoOculto.js       # cuenta comparaciones y el trabajo oculto de includes
```

`tiempos.js` mide `clientesRecurrentes` con `console.time` / `console.timeEnd` y proyecta cuánto tardaría con 100.000 y 1.000.000 de ventas. `costoOculto.js` contrasta datos típicos con un peor caso armado a propósito. La tabla de tiempos, las estimaciones y el diagnóstico están en [bitacora.md](./bitacora.md).

## Comparar memoria: cadena de métodos frente a una pasada

```sh
node src/espacio.js
```

Enfrenta `totalCiudadCadena` (map, filter, map y reduce) con `totalCiudadUnaPasada` (un solo `for...of`). Comprueba que ambas devuelven el mismo valor con 10.000 ventas, cuenta los recorridos y los arreglos intermedios, mide los tiempos y ejecuta las dos con 1.000.000 de ventas bajo distintos límites de memoria. La clasificación espacial del motor y la decisión final se explican en [bitacora.md](./bitacora.md).

## Preguntas que responde

- ¿Cuál fue el total vendido y el ticket promedio?
- ¿Cuántas unidades se vendieron de cada producto?
- ¿Cuánto vendió cada ciudad, unificando las variantes de mayúsculas y espacios?
- ¿Cuáles son los tres productos que generaron más valor?
- ¿Cuáles fueron las ventas, las unidades y el ticket promedio en una fecha específica?
