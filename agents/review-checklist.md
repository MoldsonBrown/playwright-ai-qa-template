# Test PR review checklist

## Blocking

- [ ] No hard waits (`waitForTimeout`, `setTimeout`, `networkidle`), no `force: true`.
- [ ] Locators are role / label / test-id based; nothing coupled to layout, XPath or generated classes.
- [ ] Assertions are web-first (`await expect(locator)...`), not `expect(await locator.textContent())`.
- [ ] Every test asserts something meaningful about the user-visible outcome.
- [ ] Tests are independent: no shared mutable state, no dependence on execution order, unique data per test when the backend persists it.
- [ ] Selectors and flows live in Page Objects / fixtures, not in the spec.
- [ ] No secrets, tokens or real customer data. Config comes from env vars.
- [ ] No `test.only`; any `test.skip` / `test.fixme` has a linked reason.
- [ ] Lint, typecheck and tests pass in CI.

## Should fix

- [ ] Test name describes behavior ("locked-out user sees a clear error"), not steps.
- [ ] One behavior per test; long tests are split or use `test.step`.
- [ ] API used for setup/teardown instead of slow UI paths where possible.
- [ ] New Page Object methods are reusable and typed; no dead code.
- [ ] Ran locally with `--repeat-each=5` for new or changed tests.

## Nice to have

- [ ] Tags (`@smoke`, `@critical`) where it helps selective runs.
- [ ] Coverage gaps or follow-ups noted in the PR description.
