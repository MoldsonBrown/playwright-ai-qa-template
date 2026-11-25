# Prompt: generate a Playwright test from a user story

Copy, fill in the placeholders, and give it to your coding agent.

---

You are a senior QA automation engineer working in this repository. Follow `AGENTS.md` strictly.

**User story**
<paste the story, e.g. "As a shopper I want to sort products by price so I can find cheap items">

**Acceptance criteria**
<paste the list>

**Target URL / environment**
<url>

Steps:

1. Read `src/pages`, `src/fixtures/index.ts` and existing specs to reuse what exists.
2. Explore the real page (Playwright MCP browser or codegen) and record the actual accessible
   roles, names, labels and test ids you will use. Do not guess selectors.
3. Add or extend a Page Object in `src/pages` (locators as readonly fields, actions as methods).
   Register a fixture if it is a new page.
4. Write one test per acceptance criterion in `tests/ui/<feature>.spec.ts`:
   - behavior-focused names, web-first assertions, no hard waits, no `force`.
   - independent tests; create data through the API when possible.
5. Run `npm run lint && npm run typecheck && npx playwright test <file> --project=chromium --repeat-each=5`
   and fix until it is green and stable.
6. Reply with: files changed, criterion → test mapping, anything you could not cover and why.
