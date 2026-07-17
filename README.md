# Invoicy

Generador de facturas simple y elegante — sin servidor, sin cuentas, todo local.

## Empezar

```bash
npm install
npm run build
# Abre index.html en tu navegador
```

Para desarrollo con live-reload:

```bash
npm run dev
```

## Arquitectura

```
src/
├── index.html          ← HTML limpio, sin JS inline
└── js/
    ├── main.js         ← Entry point
    ├── state.js        ← Reactive state store
    ├── render.js       ← Preview rendering
    ├── events.js       ← DOM event bindings
    ├── pdf.js          ← PDF generation (html2pdf)
    └── utils.js        ← Helpers compartidos
```

**Flujo de datos:** `events.js` → mutations → `state.js` → `subscribe()` → `render.js` → DOM

## Scripts

| Script          | Descripción                          |
|-----------------|--------------------------------------|
| `npm run build` | Bundles `src/` → `dist/app.js` + copia HTML a `index.html` |
| `npm run dev`   | Build con watch mode                 |
| `npm run lint`  | ESLint en `src/`                     |
| `npm run format`| Prettier format                      |

## License

MIT
