/**
 * Flaky-test report for Playwright JSON results.
 *
 * Reads one or more Playwright JSON reports (files or directories, searched recursively),
 * aggregates every test by `project › file › title`, and lists the tests that were
 * flaky (failed at least once, then passed on retry) with counts across runs.
 *
 * Usage:
 *   npx tsx scripts/flaky-report.ts <report.json|dir> [...more] [--out flaky.md] [--min 1]
 *
 * Exit code is always 0 unless the input is invalid: this is a reporting tool, not a gate.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// --- Minimal subset of the Playwright JSON reporter schema -------------------------------

type TestStatus = 'expected' | 'unexpected' | 'flaky' | 'skipped';

interface JsonResult {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
  retry: number;
  duration: number;
  error?: { message?: string };
  errors?: { message?: string }[];
}

interface JsonTest {
  projectName: string;
  status: TestStatus;
  results: JsonResult[];
}

interface JsonSpec {
  title: string;
  file: string;
  line?: number;
  tests: JsonTest[];
}

interface JsonSuite {
  title: string;
  file?: string;
  specs?: JsonSpec[];
  suites?: JsonSuite[];
}

export interface JsonReport {
  suites: JsonSuite[];
}

// --- Aggregation ------------------------------------------------------------------------

export interface TestStats {
  key: string;
  project: string;
  file: string;
  title: string;
  runs: number;
  passed: number;
  flaky: number;
  failed: number;
  skipped: number;
  /** Total attempts that failed before a pass (only counted for flaky runs). */
  retriesNeeded: number;
  lastError?: string;
}

/** Flatten nested describe blocks into `Describe › Nested › test title`. */
function* walk(
  suite: JsonSuite,
  parents: string[],
  isFileSuite: boolean,
): Generator<{ spec: JsonSpec; path: string[] }> {
  // Top-level suites are files; their title is the file name, which we report separately.
  const path = isFileSuite ? [] : [...parents, suite.title];
  for (const spec of suite.specs ?? []) yield { spec, path };
  for (const child of suite.suites ?? []) yield* walk(child, path, false);
}

function firstLine(msg: string | undefined): string | undefined {
  if (!msg) return undefined;
  // Strip ANSI colour codes that Playwright adds to error messages.
  // eslint-disable-next-line no-control-regex
  const clean = msg.replace(/\u001b\[[0-9;]*m/g, '').trim();
  return clean.split('\n')[0]?.slice(0, 160);
}

export function aggregate(reports: JsonReport[]): Map<string, TestStats> {
  const stats = new Map<string, TestStats>();

  for (const report of reports) {
    for (const root of report.suites ?? []) {
      for (const { spec, path } of walk(root, [], true)) {
        const title = [...path, spec.title].filter(Boolean).join(' › ');
        for (const test of spec.tests) {
          const key = `${test.projectName} › ${spec.file} › ${title}`;
          const s =
            stats.get(key) ??
            ({
              key,
              project: test.projectName,
              file: spec.file,
              title,
              runs: 0,
              passed: 0,
              flaky: 0,
              failed: 0,
              skipped: 0,
              retriesNeeded: 0,
            } satisfies TestStats);

          s.runs += 1;
          if (test.status === 'expected') s.passed += 1;
          else if (test.status === 'skipped') s.skipped += 1;
          else if (test.status === 'unexpected') s.failed += 1;
          else if (test.status === 'flaky') {
            s.flaky += 1;
            s.retriesNeeded += test.results.filter((r) => r.status !== 'passed').length;
          }

          const failedResult = [...test.results].reverse().find((r) => r.status !== 'passed');
          const err = firstLine(failedResult?.error?.message ?? failedResult?.errors?.[0]?.message);
          if (err && test.status !== 'expected') s.lastError = err;

          stats.set(key, s);
        }
      }
    }
  }
  return stats;
}

export function flakyTests(stats: Map<string, TestStats>, min = 1): TestStats[] {
  return [...stats.values()]
    .filter((s) => s.flaky >= min)
    .sort(
      (a, b) =>
        b.flaky - a.flaky || b.flaky / b.runs - a.flaky / a.runs || a.key.localeCompare(b.key),
    );
}

export function renderMarkdown(
  flaky: TestStats[],
  totalTests: number,
  reportCount: number,
): string {
  const lines = [
    '## Flaky test report',
    '',
    `Analyzed **${reportCount}** report(s), **${totalTests}** unique test(s). ` +
      `Flaky = failed at least once and passed on retry.`,
    '',
  ];
  if (flaky.length === 0) {
    lines.push('No flaky tests found. 🎉');
    return lines.join('\n') + '\n';
  }
  lines.push('| # | Test | Project | Flaky | Runs | Flaky rate | Hard fails | Last error |');
  lines.push('|---|------|---------|------:|-----:|-----------:|-----------:|------------|');
  flaky.forEach((s, i) => {
    const rate = `${Math.round((s.flaky / s.runs) * 100)}%`;
    const err = (s.lastError ?? '').replace(/\|/g, '\\|');
    lines.push(
      `| ${i + 1} | \`${s.file}\` › ${s.title} | ${s.project} | ${s.flaky} | ${s.runs} | ${rate} | ${s.failed} | ${err} |`,
    );
  });
  return lines.join('\n') + '\n';
}

// --- CLI --------------------------------------------------------------------------------

function collectJsonFiles(target: string): string[] {
  const abs = resolve(target);
  if (!existsSync(abs)) throw new Error(`Not found: ${target}`);
  if (statSync(abs).isFile()) return [abs];
  return readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const child = join(abs, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : collectJsonFiles(child);
    return entry.name.endsWith('.json') ? [child] : [];
  });
}

export function loadReports(targets: string[]): JsonReport[] {
  const files = targets.flatMap(collectJsonFiles);
  return files
    .map((f) => JSON.parse(readFileSync(f, 'utf8')) as unknown)
    .filter(
      (r): r is JsonReport =>
        typeof r === 'object' && r !== null && Array.isArray((r as JsonReport).suites),
    );
}

function main(argv: string[]): void {
  const targets: string[] = [];
  let out: string | undefined;
  let min = 1;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === '--out') out = argv[++i];
    else if (arg === '--min') min = Number(argv[++i] ?? 1);
    else if (arg === '-h' || arg === '--help') {
      console.log(
        'Usage: tsx scripts/flaky-report.ts <report.json|dir> [...] [--out file.md] [--min N]',
      );
      return;
    } else targets.push(arg);
  }
  if (targets.length === 0) targets.push('reports');

  const reports = loadReports(targets);
  if (reports.length === 0) {
    console.error(`No Playwright JSON reports found in: ${targets.join(', ')}`);
    process.exitCode = 1;
    return;
  }
  const stats = aggregate(reports);
  const md = renderMarkdown(flakyTests(stats, min), stats.size, reports.length);
  console.log(md);
  if (out) writeFileSync(out, md);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2));
}
