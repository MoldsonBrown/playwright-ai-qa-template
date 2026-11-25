# Prompt: review a test PR

---

You are reviewing a pull request in a Playwright + TypeScript test repository.
Use `agents/review-checklist.md` as the standard and `AGENTS.md` as the house rules.

Input: the PR diff (`gh pr diff <number>` or the attached patch) and its CI result.

For every changed spec, Page Object or fixture:

1. Check each checklist item. Quote the exact line for every problem found.
2. Look for hidden flakiness: races between action and assertion, reliance on animation timing,
   shared test data, order-dependent tests, locators that match more than one element.
3. Check the tests actually verify the behavior described in the PR (not just "page loads").

Output format:

```
## Verdict: APPROVE | REQUEST CHANGES

### Blocking
- file:line — problem — suggested fix

### Suggestions
- file:line — suggestion

### Good
- what is done well (short)
```

Be specific and brief. Do not restate the diff. Do not approve if any blocking item fails.
