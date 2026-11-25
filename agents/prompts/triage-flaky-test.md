# Prompt: triage a flaky test

---

A test is flaky (fails, then passes on retry). Find the root cause and fix it properly.

**Inputs**

- Flaky report row: <paste row from `npm run flaky-report`>
- Error message / stack from the failed attempt: <paste>
- Trace: <path to trace.zip> (open with `npx playwright show-trace <file>`)

**Rules**

- Forbidden fixes: adding retries, raising timeouts, `waitForTimeout`, `force: true`, `test.skip`.
- Reproduce first: `npx playwright test <file> -g "<title>" --repeat-each=20 --workers=4`.

**Classify the root cause** (pick one, explain the evidence from the trace):

1. **Race / missing wait** — action or assertion before the UI is ready → wait on a web-first
   assertion of the state that matters.
2. **Unstable locator** — matches several elements or depends on layout → role/test-id locator,
   scoped to its container.
3. **Test data collision** — parallel tests share or mutate the same data → unique data per test,
   API setup/teardown.
4. **Order dependency / leaked state** — relies on a previous test → make it self-contained.
5. **Environment / third party** — slow or failing dependency → mock with `page.route`, or
   quarantine with a ticket (`test.fixme` + link) and report it.
6. **Real product bug** — intermittent app behavior → file a bug with trace and repro rate.

**Deliver**

- Root cause + evidence (1–3 lines).
- The fix (diff).
- Proof: repro command before/after, e.g. "failed 4/20 → passed 20/20".
