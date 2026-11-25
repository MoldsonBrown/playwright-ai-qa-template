# Playwright + AI Agents — QA Automation Template

[![CI](https://github.com/MoldsonBrown/playwright-ai-qa-template/actions/workflows/ci.yml/badge.svg)](https://github.com/MoldsonBrown/playwright-ai-qa-template/actions/workflows/ci.yml)

A production-style Playwright + TypeScript suite that shows how I build **stable, fast, maintainable
end-to-end tests** and use **AI coding agents** to write, review and de-flake them — without
lowering the quality bar.

Everything runs against public demo apps ([TodoMVC](https://demo.playwright.dev/todomvc),
[Sauce Demo](https://www.saucedemo.com), [JSONPlaceholder](https://jsonplaceholder.typicode.com)),
so you can clone it and run it in two minutes.

_Versión en español: [docs/README.es.md](docs/README.es.md)._

## What it shows

- **Stable by design:** role / label / test-id locators, web-first assertions, zero hard waits
  (enforced by ESLint), fully parallel and independent tests.
- **Clean architecture:** Page Object Model + Playwright fixtures + typed API client.
- **UI + API testing** in one config: Chromium, Firefox and WebKit projects plus a browserless API project.
- **CI that scales:** GitHub Actions with lint, typecheck, 3-way sharding, merged HTML report and
  traces on first retry.
- **Flaky-test visibility:** a script that reads Playwright JSON results across runs and ranks the
  tests that only passed on retry — published to every CI run summary.
- **AI-agent workflow:** versioned rules and prompts for generating tests from user stories,
  reviewing test PRs against a checklist, and triaging flaky tests by root cause.

## Structure

```
.
├── AGENTS.md                  # Rules for AI coding agents (Cursor, Claude Code, Codex…)
├── agents/                    # Agent workflows, prompts and PR review checklist
├── .cursor/rules/             # Cursor-specific rules
├── .github/workflows/ci.yml   # Lint → typecheck → sharded tests → merged report + flaky summary
├── playwright.config.ts       # Projects: chromium, firefox, webkit, api, tooling
├── scripts/flaky-report.ts    # Flaky-test report from Playwright JSON results
├── src/
│   ├── api/                   # Typed API clients
│   ├── config/                # Target URLs (overridable via env)
│   ├── data/                  # Test data
│   ├── fixtures/              # Custom fixtures (page objects, logged-in state, API client)
│   └── pages/                 # Page Objects
└── tests/
    ├── api/                   # API tests (no browser)
    ├── tooling/               # Tests for the repo's own scripts
    └── ui/                    # UI tests (3 browsers)
```

## Run it

Requires Node 22+.

```bash
npm ci
npx playwright install --with-deps   # or: npx playwright install chromium
npm run lint && npm run typecheck
npm run test:chromium                # chromium + API + tooling
npm test                             # all projects
npm run report                       # open the HTML report
```

Target URLs can be overridden with env vars (see `.env.example`).

## AI-agent workflow

The agent does the typing, the engineer owns the judgment. Every workflow ends with the same gate:
`npm run lint && npm run typecheck && npm run test:chromium`.

| Workflow                                                                                 | Prompt                                                                                       |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| User story → Page Object + tests (selectors verified on the real page, run 5× before PR) | [generate-test-from-story](agents/prompts/generate-test-from-story.md)                       |
| Test PR review against a checklist, with a verdict                                       | [review-test-pr](agents/prompts/review-test-pr.md) · [checklist](agents/review-checklist.md) |
| Flaky test → root-cause classification → fix with before/after repro rate                | [triage-flaky-test](agents/prompts/triage-flaky-test.md)                                     |

Details in [agents/README.md](agents/README.md).

## Flaky-test report

```bash
npm test                                         # writes reports/results.json locally
npm run flaky-report -- reports                  # one or many JSON reports / folders
npm run flaky-report -- runs/ --min 2 --out flaky.md
```

Output (markdown, also added to each CI run summary):

| #   | Test                                                       | Project  | Flaky | Runs | Flaky rate | Hard fails | Last error                        |
| --- | ---------------------------------------------------------- | -------- | ----: | ---: | ---------: | ---------: | --------------------------------- |
| 1   | `ui/shop.spec.ts` › Shop – checkout › completes a purchase | chromium |     2 |    2 |       100% |          0 | Error: expect(locator).toHaveText |

## Services

I help startups get reliable test automation in place quickly:

- **Audit (fixed price, 1–2 weeks):** review of your current suite and CI — flakiness, speed,
  coverage gaps — with a prioritized action plan.
- **Migration / setup:** move from Cypress or Selenium to Playwright, or build a QA automation
  foundation from scratch, with CI and AI-agent workflows included.
- **Monthly retainer:** ongoing test development, maintenance and flaky-test triage.

Contact: open an issue or reach me on LinkedIn.

## License

[MIT](LICENSE) © Nelson Ceballos
