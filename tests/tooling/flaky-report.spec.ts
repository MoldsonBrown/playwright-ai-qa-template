import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { aggregate, flakyTests, loadReports, renderMarkdown } from '../../scripts/flaky-report';

const fixtures = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

test.describe('flaky-report script', () => {
  test('aggregates flaky tests across runs, most flaky first', () => {
    const reports = loadReports([fixtures]);
    expect(reports).toHaveLength(2);

    const stats = aggregate(reports);
    expect(stats.size).toBe(3);

    const flaky = flakyTests(stats);
    expect(flaky.map((f) => [f.project, f.title, f.flaky, f.runs])).toEqual([
      ['chromium', 'Shop – checkout › completes a purchase', 2, 2],
      ['chromium', 'adds items', 1, 2],
    ]);
    expect(flaky[0]?.retriesNeeded).toBe(3);
    expect(flaky[0]?.lastError).toBe('Error: expect(locator).toHaveText');
  });

  test('renders a markdown table and respects --min', () => {
    const stats = aggregate(loadReports([fixtures]));

    const md = renderMarkdown(flakyTests(stats), stats.size, 2);
    expect(md).toContain(
      '| 1 | `ui/shop.spec.ts` › Shop – checkout › completes a purchase | chromium | 2 | 2 | 100% |',
    );

    const onlyRepeat = flakyTests(stats, 2);
    expect(onlyRepeat).toHaveLength(1);
    expect(renderMarkdown([], stats.size, 2)).toContain('No flaky tests found');
  });
});
