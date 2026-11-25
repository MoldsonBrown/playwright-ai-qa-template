# AGENTS.md

Instructions for AI coding agents (Cursor, Claude Code, Codex, Copilot, etc.) working in this repo.
Detailed workflows and prompts live in [`agents/`](agents/README.md).

## Project facts

- Playwright Test + TypeScript (strict). Node 22+.
- Page Objects in `src/pages`, fixtures in `src/fixtures`, API clients in `src/api`, test data in `src/data`.
- Tests: `tests/ui` (chromium/firefox/webkit), `tests/api` (no browser), `tests/tooling` (repo scripts).

## Commands (run before declaring a task done)

```bash
npm run lint && npm run typecheck && npm run test:chromium
```

## Non-negotiable rules

1. **No hard waits.** Never use `page.waitForTimeout`, `setTimeout` or `networkidle`. Wait on UI state with web-first assertions (`await expect(locator).toBeVisible()`).
2. **Locator priority:** `getByRole` → `getByLabel` / `getByPlaceholder` → `getByTestId` → stable `data-*` attribute. No XPath, no CSS chains tied to layout, no `nth()` unless order is the behavior under test.
3. **Tests use fixtures and page objects**, never raw selectors. New page → new class in `src/pages` + fixture in `src/fixtures/index.ts`.
4. **One behavior per test**, independent and parallel-safe: no shared state, no ordering assumptions.
5. **Assert outcomes the user sees**, not implementation details.
6. **No secrets in code.** Use env vars (see `.env.example`).
7. **Never "fix" a flaky test by adding retries, timeouts or `test.skip`.** Find the root cause (see `agents/prompts/triage-flaky-test.md`).
