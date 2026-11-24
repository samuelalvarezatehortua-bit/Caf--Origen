# Café Origen: motor de analítica v0.1

Este proyecto examina una muestra de 12 ventas de Café Origen. El motor calcula indicadores, organiza los resultados por grupos y presenta un informe legible en la consola. Funciona con Node.js y no requiere dependencias externas.

## Requisitos

- Node.js LTS

## Generar el reporte

Ubícate en la raíz del proyecto y ejecuta:

```sh
node src/reporte.js
```

El informe muestra un resumen general, las ventas por ciudad, las unidades por producto y los tres productos que más valor aportaron. También compara un día con ventas contra otro sin ventas.

## Comprobar los cálculos

```sh
node src/verificar.js
```

Cuando alguna comprobación falla, el proceso finaliza con un código distinto de cero.

## Revisar los datos

```sh
node src/explorar.js
```

El script muestra cuántos registros hay, cuáles son el primero y el último, qué producto tiene el registro en la posición 4 y la tabla completa. La estructura de los datos, los casos límite y la bitácora de depuración están documentados en [bitacora.md](./bitacora.md).

## Medir operaciones

```sh
node src/medir.js
```

El script genera historiales de 100, 1.000, 10.000 y 100.000 ventas y exhibe en una tabla cuántas operaciones realiza cada función. Las predicciones, los resultados y el análisis Big O aparecen en [bitacora.md](./bitacora.md).

## Medir tiempos de clientes recurrentes

```sh
node src/tiempos.js           # n = 1.000, 2.000, 4.000, 8.000 y 16.000, y estimaciones
node src/tiempos.js 100000    # también corre 100.000 si la estimación es inferior a 2 minutos
node src/costoOculto.js       # cuenta comparaciones y el trabajo oculto de includes
```

`tiempos.js` mide `clientesRecurrentes` con `console.time` / `console.timeEnd` y proyecta el tiempo que tomaría con 100.000 y 1.000.000 de ventas. `costoOculto.js` compara datos típicos con un peor caso diseñado a propósito. La tabla de tiempos, las estimaciones y el diagnóstico se encuentran en [bitacora.md](./bitacora.md).

## Comparar memoria: cadena de métodos contra una sola pasada

```sh
node src/espacio.js
```

Pone frente a frente `totalCiudadCadena` (map, filter, map y reduce) y `totalCiudadUnaPasada` (un único `for...of`). Verifica que ambas den el mismo resultado con 10.000 ventas, cuenta los recorridos y los arreglos intermedios, mide los tiempos y ejecuta las dos con 1.000.000 de ventas bajo diferentes límites de memoria. La clasificación espacial del motor y la decisión final se explican en [bitacora.md](./bitacora.md).

## Preguntas que responde

- ¿Cuánto se vendió en total y cuál es el ticket promedio?
- ¿Cuántas unidades se vendieron de cada producto?
- ¿Cuánto vendió cada ciudad, unificando las variantes de mayúsculas y espacios?
- ¿Qué tres productos generaron más valor?
- ¿Cuáles fueron las ventas, las unidades y el ticket promedio en una fecha concreta?