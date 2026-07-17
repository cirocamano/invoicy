# Cómo contribuir

¡Bienvenido! Este documento explica cómo está organizado el proyecto y cómo hacer cambios.

## Filosofía

- **Sin build complejo.** Usamos esbuild porque es rápido y no necesita configuración. Si tu PR necesita un nuevo paso de build, explicá por qué.
- **Estado reactivo simple.** Todo el estado vive en `src/js/state.js`. Si modificás UI, hacelo a través del estado — no mutés el DOM directamente afuera de `render.js`.
- **JS modular, CSS inline.** El CSS vive en `index.html` (inline, no externalizado) para mantener un solo archivo entregable. Si necesitás CSS modules, discutámoslo primero en un issue.

## Setup

```bash
npm install
npm run build
```

## Antes de enviar un PR

```bash
npm run lint
npm run format
npm run build
```

- Corregí todo lo que el linter reporte.
- Probá los cambios en el navegador (Chrome + Firefox mínimo).
- Si agregás una dependencia, explicá por qué en el PR description.

## Estructura del estado (`state.js`)

```js
setState({ key: value })   // muta el estado global
subscribe(fn)              // se ejecuta en cada cambio
getState()                  // snapshot actual
```

Usá las helpers (`addItem`, `updateItem`, `removeItem`) para ítems. No manipulés `state.items` directamente.

## Áreas para contribuir

- Tests unitarios (Estado y render)
- Soporte multi-idioma
- Más opciones de diseño (fuentes, tamaños)
- Exportar a otros formatos (HTML standalone, PNG)
- Guardado/ carga de plantillas locales

Revisá los issues abiertos antes de empezar — puede que alguien ya esté trabajando en lo mismo.
