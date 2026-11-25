# AI-agent workflows

How I use AI coding agents to ship stable Playwright suites faster, without lowering the bar.
The agent does the typing; the engineer owns the judgment. Every workflow ends with the same gate:

```bash
npm run lint && npm run typecheck && npm run test:chromium
```

| Workflow                          | When                                     | Prompt                                                                                                  |
| --------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Generate a test from a user story | New feature / acceptance criteria        | [`prompts/generate-test-from-story.md`](prompts/generate-test-from-story.md)                            |
| Review a test PR                  | Every PR that touches `tests/` or `src/` | [`prompts/review-test-pr.md`](prompts/review-test-pr.md) + [`review-checklist.md`](review-checklist.md) |
| Triage a flaky test               | A test appears in the flaky report       | [`prompts/triage-flaky-test.md`](prompts/triage-flaky-test.md)                                          |

Repo-wide rules for agents are in [`/AGENTS.md`](../AGENTS.md) and, for Cursor,
[`/.cursor/rules/playwright.mdc`](../.cursor/rules/playwright.mdc).

## 1. User story → test

1. Paste the story and acceptance criteria into the prompt.
2. The agent explores the page (Playwright MCP or `npx playwright codegen <url>`) to confirm real
   roles, labels and test ids. **It must not invent selectors.**
3. It extends or creates a Page Object, wires a fixture, writes one test per acceptance criterion.
4. It runs the gate and iterates until green, then runs the new test 5× with
   `--repeat-each=5` to catch flakiness before the PR exists.

## 2. PR review

The agent reviews the diff against [`review-checklist.md`](review-checklist.md) and returns
blocking issues, suggestions and a verdict. A human still approves.

## 3. Flaky-test triage

1. CI retries failed tests (`retries: 2`) and records a trace on the first retry.
2. `npm run flaky-report -- <dir-with-json-reports>` lists tests that passed only on retry,
   with counts and flaky rate across runs (the CI workflow writes it to the job summary).
3. For the top offender, the agent reads the trace/error, classifies the root cause and
   proposes a fix (never "add a retry" or "increase the timeout").
