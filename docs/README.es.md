# Playwright + agentes de IA — template de QA automation

Suite de Playwright + TypeScript con estilo de producción que muestra cómo armo **tests end-to-end
estables, rápidos y mantenibles**, y cómo uso **agentes de IA** para escribirlos, revisarlos y
eliminar tests flaky sin bajar la calidad.

Corre contra apps demo públicas (TodoMVC, Sauce Demo, JSONPlaceholder).

## Qué muestra

- Locators por rol, label o test id, assertions web-first y cero esperas fijas (controlado por ESLint).
- Page Object Model, fixtures de Playwright y cliente de API tipado.
- Tests de UI (Chromium, Firefox, WebKit) y de API en una sola configuración.
- GitHub Actions con lint, typecheck, tests en 3 shards, reporte HTML unificado y traces en el primer retry.
- Un script que lee los resultados JSON de varias corridas y lista los tests flaky (pasaron solo con retry).
- Reglas y prompts para agentes: generar tests desde historias de usuario, revisar PRs con un
  checklist y analizar tests flaky por causa raíz.

## Cómo correrlo

```bash
npm ci
npx playwright install --with-deps
npm run lint && npm run typecheck
npm run test:chromium
npm run flaky-report -- reports
```

## Servicios

- **Auditoría** (precio fijo, 1–2 semanas) de la suite y el CI, con plan de acción.
- **Migración o setup:** de Cypress o Selenium a Playwright, o QA automation desde cero.
- **Abono mensual:** desarrollo y mantenimiento de tests y triage de flaky tests.

Contacto: abrí un issue o escribime por [LinkedIn](https://www.linkedin.com/in/nelson-ceballos-2021/).

Más detalle en el [README en inglés](../README.md).
