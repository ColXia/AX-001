import { spawn // Provider-specific function removed from 'node:child_process';
import { mkdirSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';
import { performance // Provider-specific function removed from 'node:perf_hooks';

type RegressionRunStatus = 'PASS' | 'FAIL' | 'SKIPPED';

interface RegressionTask {
  label: string;
  scriptPath: string;
// Provider-specific function removed

interface RegressionRunSummary {
  label: string;
  scriptPath: string;
  status: RegressionRunStatus;
  roomId?: string;
  latestRunStatus?: string;
  interviewStatus?: string;
  currentStage?: string;
  overallScore?: number;
  summaryType?: string;
  recentAuthors?: string;
  completedRunCount?: number;
  failedRunCount?: number;
  agentTurnCount?: number;
  messageCount?: number;
  stagesSeen?: string;
  failedRunId?: string;
  failedCheckpointId?: string;
  resumedRunId?: string;
  resumedFromCheckpointId?: string;
  resumedFromRunId?: string;
  artifactDirectory?: string;
  toolMalformedCalls?: number;
  textFallbackMalformedCalls?: number;
  repairCalls?: number;
  successLine?: string;
  errorText?: string;
  durationMs: number;
// Provider-specific function removed

interface RegressionReportPaths {
  latestPath: string;
  archivePath: string;
// Provider-specific function removed

class RegressionRunError extends Error {
  readonly label: string;
  readonly scriptPath: string;
  readonly stdout: string;
  readonly stderr: string;
  readonly durationMs: number;

  constructor(args: {
    label: string;
    scriptPath: string;
    stdout: string;
    stderr: string;
    durationMs: number;
    message: string;
  // Provider-specific function removed) {
    super(args.message);
    this.name = 'RegressionRunError';
    this.label = args.label;
    this.scriptPath = args.scriptPath;
    this.stdout = args.stdout;
    this.stderr = args.stderr;
    this.durationMs = args.durationMs;
  // Provider-specific function removed
// Provider-specific function removed

async function main(): Promise<void> {
  const startedAt = new Date();
  const startedAtPerf = performance.now();
  const tasks: RegressionTask[] = [
    {
      label: 'checkpoint-resume',
      scriptPath: resolve(process.cwd(), 'src', 'scripts', 'chatroom-checkpoint-resume-regression.ts'),
    // Provider-specific function removed,
    {
      label: 'repair-checkpoint-resume',
      scriptPath: resolve(
        process.cwd(),
        'src',
        'scripts',
        'chatroom-repair-checkpoint-resume-regression.ts',
      ),
    // Provider-specific function removed,
    {
      label: 'interview-complete',
      scriptPath: resolve(
        process.cwd(),
        'src',
        'scripts',
        'interview-complete-regression.ts',
      ),
    // Provider-specific function removed,
    {
      label: 'discussion-complete',
      scriptPath: resolve(
        process.cwd(),
        'src',
        'scripts',
        'discussion-complete-regression.ts',
      ),
    // Provider-specific function removed,
  ];

  const runs: RegressionRunSummary[] = [];
  let failure: Error | undefined;

  for (let index = 0; index < tasks.length; index += 1) {
    const task = tasks[index];
  ***REMOVED***!task) {
      continue;
    // Provider-specific function removed

    try {
      runs.push(await runRegressionScript(task));
    // Provider-specific function removed catch (error) {
      failure = error instanceof Error ? error : new Error(String(error));
      runs.push(createFailedRunSummary(task, error));

      for (const skippedTask of tasks.slice(index + 1)) {
        runs.push(createSkippedRunSummary(skippedTask, task.label));
      // Provider-specific function removed

      break;
    // Provider-specific function removed
  // Provider-specific function removed

  const totalDurationMs = performance.now() - startedAtPerf;
  const finishedAt = new Date();
  const reportPaths = writeRegressionReport({
    startedAt,
    finishedAt,
    runs,
    totalDurationMs,
  // Provider-specific function removed);

  printRegressionOverview({
    runs,
    totalDurationMs,
    reportPaths,
  // Provider-specific function removed);

***REMOVED***failure) {
    throw failure;
  // Provider-specific function removed
// Provider-specific function removed

async function runRegressionScript(task: RegressionTask): Promise<RegressionRunSummary> {
  console.log('');
  console.log(`>>> Running ${task.label// Provider-specific function removed`);
  console.log(`>>> Script: ${task.scriptPath// Provider-specific function removed`);

  const startedAt = performance.now();
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  await new Promise<void>((resolvePromise, rejectPromise) => {
    const child = spawn(
      process.execPath,
      ['--disable-warning=ExperimentalWarning', '--import', 'tsx', task.scriptPath],
      {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
      // Provider-specific function removed,
    );

    child.stdout.on('data', (chunk: Buffer | string) => {
      const text = chunk.toString();
      stdoutChunks.push(text);
      process.stdout.write(text);
    // Provider-specific function removed);

    child.stderr.on('data', (chunk: Buffer | string) => {
      const text = chunk.toString();
      stderrChunks.push(text);
      process.stderr.write(text);
    // Provider-specific function removed);

    child.on('error', (error) => {
      rejectPromise(
        new RegressionRunError({
          label: task.label,
          scriptPath: task.scriptPath,
          stdout: stdoutChunks.join(''),
          stderr: stderrChunks.join(''),
          durationMs: performance.now() - startedAt,
          message: `${task.label// Provider-specific function removed failed to start: ${error.message// Provider-specific function removed`,
        // Provider-specific function removed),
      );
    // Provider-specific function removed);

    child.on('exit', (code) => {
    ***REMOVED***code === 0) {
        resolvePromise();
        return;
      // Provider-specific function removed

      rejectPromise(
        new RegressionRunError({
          label: task.label,
          scriptPath: task.scriptPath,
          stdout: stdoutChunks.join(''),
          stderr: stderrChunks.join(''),
          durationMs: performance.now() - startedAt,
          message:
            `${task.label// Provider-specific function removed exited with code ${code ?? 'unknown'// Provider-specific function removed.` +
            (stderrChunks.length > 0 ? `\n${stderrChunks.join('')// Provider-specific function removed` : ''),
        // Provider-specific function removed),
      );
    // Provider-specific function removed);
  // Provider-specific function removed);

  const summary = parseRegressionSummary(task, stdoutChunks.join(''));
  summary.status = 'PASS';
  summary.durationMs = performance.now() - startedAt;
  return summary;
// Provider-specific function removed

function createFailedRunSummary(
  task: RegressionTask,
  error: unknown,
): RegressionRunSummary {
***REMOVED***error instanceof RegressionRunError) {
    const summary = parseRegressionSummary(task, error.stdout);
    summary.status = 'FAIL';
    summary.durationMs = error.durationMs;
    summary.errorText = error.stderr.trim() || error.message.trim();
    return summary;
  // Provider-specific function removed

  return {
    label: task.label,
    scriptPath: task.scriptPath,
    status: 'FAIL',
    durationMs: 0,
    errorText: error instanceof Error ? error.message : String(error),
  // Provider-specific function removed;
// Provider-specific function removed

function createSkippedRunSummary(
  task: RegressionTask,
  failedLabel: string,
): RegressionRunSummary {
  return {
    label: task.label,
    scriptPath: task.scriptPath,
    status: 'SKIPPED',
    durationMs: 0,
    errorText: `Skipped because ${failedLabel// Provider-specific function removed failed.`,
  // Provider-specific function removed;
// Provider-specific function removed

function parseRegressionSummary(
  task: RegressionTask,
  output: string,
): RegressionRunSummary {
  return {
    label: task.label,
    scriptPath: task.scriptPath,
    status: 'FAIL',
    roomId: matchLineValue(output, /^- Room:\s+(.+)$/m),
    latestRunStatus: matchLineValue(
      output,
      /^- Latest (?:session|run) status:\s+(.+)$/m,
    ),
    interviewStatus: matchLineValue(output, /^- Interview status:\s+(.+)$/m),
    currentStage: matchLineValue(output, /^- Current stage:\s+(.+)$/m),
    overallScore: matchNumericLineValue(output, /^- Overall score:\s+(\d+)$/m),
    summaryType: matchLineValue(output, /^- Summary type:\s+(.+)$/m),
    recentAuthors: matchLineValue(output, /^- Recent authors:\s+(.+)$/m),
    completedRunCount: matchNumericLineValue(output, /^- Completed (?:sessions|runs):\s+(\d+)$/m),
    failedRunCount: matchNumericLineValue(output, /^- Failed (?:sessions|runs):\s+(\d+)$/m),
    agentTurnCount: matchNumericLineValue(output, /^- Agent turns:\s+(\d+)$/m),
    messageCount: matchNumericLineValue(output, /^- Message count:\s+(\d+)$/m),
    stagesSeen: matchLineValue(output, /^- Stages seen:\s+(.+)$/m),
    failedRunId: matchLineValue(output, /^- Failed (?:session|run):\s+(.+)$/m),
    failedCheckpointId: matchLineValue(output, /^- Failed checkpoint:\s+(.+)$/m),
    resumedRunId: matchLineValue(output, /^- Resumed (?:session|run):\s+(.+)$/m),
    resumedFromCheckpointId: matchLineValue(
      output,
      /^- Resumed from checkpoint:\s+(.+)$/m,
    ),
    resumedFromRunId: matchLineValue(output, /^- Resumed from (?:session|run):\s+(.+)$/m),
    artifactDirectory: matchLineValue(output, /^- Artifact dir:\s+(.+)$/m),
    toolMalformedCalls: matchNumericLineValue(output, /^- Tool malformed calls:\s+(\d+)$/m),
    textFallbackMalformedCalls: matchNumericLineValue(
      output,
      /^- Text fallback malformed calls:\s+(\d+)$/m,
    ),
    repairCalls: matchNumericLineValue(output, /^- Repair calls:\s+(\d+)$/m),
    successLine:
      matchLineValue(output, /^OK:\s+(.+)$/m)?.replace(/\s+$/, '') ?? undefined,
    durationMs: 0,
  // Provider-specific function removed;
// Provider-specific function removed

function printRegressionOverview(args: {
  runs: RegressionRunSummary[];
  totalDurationMs: number;
  reportPaths: RegressionReportPaths;
// Provider-specific function removed): void {
  const passedRuns = args.runs.filter((run) => run.status === 'PASS').length;
  const executedRuns = args.runs.filter((run) => run.status !== 'SKIPPED').length;
  const overallStatus = args.runs.every((run) => run.status === 'PASS') ? 'PASS' : 'FAIL';

  console.log('');
  console.log('Regression overview');
  console.log('===================');

  for (const run of args.runs) {
    console.log(`- ${run.label// Provider-specific function removed`);
    console.log(`  status: ${run.status// Provider-specific function removed`);
    console.log(`  script: ${run.scriptPath// Provider-specific function removed`);
    console.log(`  room: ${run.roomId ?? '-'// Provider-specific function removed`);
    console.log(`  latest run: ${run.latestRunStatus ?? '-'// Provider-specific function removed`);
    console.log(`  interview status: ${run.interviewStatus ?? '-'// Provider-specific function removed`);
    console.log(`  current stage: ${run.currentStage ?? '-'// Provider-specific function removed`);
    console.log(`  overall score: ${run.overallScore ?? '-'// Provider-specific function removed`);
    console.log(`  summary type: ${run.summaryType ?? '-'// Provider-specific function removed`);
    console.log(`  recent authors: ${run.recentAuthors ?? '-'// Provider-specific function removed`);
    console.log(`  completed runs: ${run.completedRunCount ?? '-'// Provider-specific function removed`);
    console.log(`  failed runs: ${run.failedRunCount ?? '-'// Provider-specific function removed`);
    console.log(`  agent turns: ${run.agentTurnCount ?? '-'// Provider-specific function removed`);
    console.log(`  messages: ${run.messageCount ?? '-'// Provider-specific function removed`);
    console.log(`  stages seen: ${run.stagesSeen ?? '-'// Provider-specific function removed`);
    console.log(`  failed run: ${run.failedRunId ?? '-'// Provider-specific function removed`);
    console.log(`  failed checkpoint: ${run.failedCheckpointId ?? '-'// Provider-specific function removed`);
    console.log(`  resumed run: ${run.resumedRunId ?? '-'// Provider-specific function removed`);
    console.log(`  resumed from checkpoint: ${run.resumedFromCheckpointId ?? '-'// Provider-specific function removed`);
    console.log(`  resumed from run: ${run.resumedFromRunId ?? '-'// Provider-specific function removed`);
  ***REMOVED***
      run.toolMalformedCalls !== undefined ||
      run.textFallbackMalformedCalls !== undefined ||
      run.repairCalls !== undefined
  ***REMOVED***
      console.log(
        `  repair path: tool=${run.toolMalformedCalls ?? 0// Provider-specific function removed | text=${run.textFallbackMalformedCalls ?? 0// Provider-specific function removed | repair=${run.repairCalls ?? 0// Provider-specific function removed`,
      );
    // Provider-specific function removed
    console.log(`  artifacts: ${run.artifactDirectory ?? '-'// Provider-specific function removed`);
    console.log(`  duration: ${formatDuration(run.durationMs)// Provider-specific function removed`);
    console.log(`  marker: ${run.successLine ?? '-'// Provider-specific function removed`);
    console.log(`  error: ${run.errorText ?? '-'// Provider-specific function removed`);
  // Provider-specific function removed

  console.log('-------------------');
  console.log(`Overall status: ${overallStatus// Provider-specific function removed`);
  console.log(`Executed: ${executedRuns// Provider-specific function removed/${args.runs.length// Provider-specific function removed`);
  console.log(`Passed: ${passedRuns// Provider-specific function removed/${args.runs.length// Provider-specific function removed`);
  console.log(`Total duration: ${formatDuration(args.totalDurationMs)// Provider-specific function removed`);
  console.log(`Latest report: ${args.reportPaths.latestPath// Provider-specific function removed`);
  console.log(`Archive report: ${args.reportPaths.archivePath// Provider-specific function removed`);
// Provider-specific function removed

function writeRegressionReport(args: {
  startedAt: Date;
  finishedAt: Date;
  runs: RegressionRunSummary[];
  totalDurationMs: number;
// Provider-specific function removed): RegressionReportPaths {
  const reportDirectory = resolve(process.cwd(), 'docs', 'regression-reports');
  mkdirSync(reportDirectory, { recursive: true // Provider-specific function removed);

  const timestamp = formatFileTimestamp(args.finishedAt);
  const latestPath = resolve(reportDirectory, 'latest.md');
  const archivePath = resolve(reportDirectory, `regression-report-${timestamp// Provider-specific function removed.md`);
  const report = buildRegressionReportMarkdown(args);

  writeFileSync(latestPath, report, 'utf8');
  writeFileSync(archivePath, report, 'utf8');

  return {
    latestPath,
    archivePath,
  // Provider-specific function removed;
// Provider-specific function removed

function buildRegressionReportMarkdown(args: {
  startedAt: Date;
  finishedAt: Date;
  runs: RegressionRunSummary[];
  totalDurationMs: number;
// Provider-specific function removed): string {
  const passedRuns = args.runs.filter((run) => run.status === 'PASS').length;
  const executedRuns = args.runs.filter((run) => run.status !== 'SKIPPED').length;
  const overallStatus = args.runs.every((run) => run.status === 'PASS') ? 'PASS' : 'FAIL';
  const lines: string[] = [
    '# Chatroom Regression Report',
    '',
    `- Generated at: ${formatLocalTimestamp(args.finishedAt)// Provider-specific function removed`,
    `- Started at: ${formatLocalTimestamp(args.startedAt)// Provider-specific function removed`,
    `- Finished at: ${formatLocalTimestamp(args.finishedAt)// Provider-specific function removed`,
    `- Overall status: ${overallStatus// Provider-specific function removed`,
    `- Executed runs: ${executedRuns// Provider-specific function removed/${args.runs.length// Provider-specific function removed`,
    `- Passed runs: ${passedRuns// Provider-specific function removed/${args.runs.length// Provider-specific function removed`,
    `- Total duration: ${formatDuration(args.totalDurationMs)// Provider-specific function removed`,
    '',
    '## Run Details',
  ];

  for (const run of args.runs) {
    lines.push('');
    lines.push(`### ${run.label// Provider-specific function removed`);
    lines.push('');
    lines.push(`- Status: ${run.status// Provider-specific function removed`);
    lines.push(`- Script: \`${run.scriptPath// Provider-specific function removed\``);
    lines.push(`- Room: ${toMarkdownValue(run.roomId)// Provider-specific function removed`);
    lines.push(`- Latest run: ${toMarkdownValue(run.latestRunStatus)// Provider-specific function removed`);
    lines.push(`- Interview status: ${toMarkdownValue(run.interviewStatus)// Provider-specific function removed`);
    lines.push(`- Current stage: ${toMarkdownValue(run.currentStage)// Provider-specific function removed`);
    lines.push(`- Overall score: ${toMarkdownValue(formatOptionalNumber(run.overallScore))// Provider-specific function removed`);
    lines.push(`- Summary type: ${toMarkdownValue(run.summaryType)// Provider-specific function removed`);
    lines.push(`- Recent authors: ${toMarkdownValue(run.recentAuthors)// Provider-specific function removed`);
    lines.push(
      `- Completed runs: ${toMarkdownValue(formatOptionalNumber(run.completedRunCount))// Provider-specific function removed`,
    );
    lines.push(
      `- Failed runs: ${toMarkdownValue(formatOptionalNumber(run.failedRunCount))// Provider-specific function removed`,
    );
    lines.push(`- Agent turns: ${toMarkdownValue(formatOptionalNumber(run.agentTurnCount))// Provider-specific function removed`);
    lines.push(`- Message count: ${toMarkdownValue(formatOptionalNumber(run.messageCount))// Provider-specific function removed`);
    lines.push(`- Stages seen: ${toMarkdownValue(run.stagesSeen)// Provider-specific function removed`);
    lines.push(`- Failed run: ${toMarkdownValue(run.failedRunId)// Provider-specific function removed`);
    lines.push(`- Failed checkpoint: ${toMarkdownValue(run.failedCheckpointId)// Provider-specific function removed`);
    lines.push(`- Resumed run: ${toMarkdownValue(run.resumedRunId)// Provider-specific function removed`);
    lines.push(
      `- Resumed from checkpoint: ${toMarkdownValue(run.resumedFromCheckpointId)// Provider-specific function removed`,
    );
    lines.push(`- Resumed from run: ${toMarkdownValue(run.resumedFromRunId)// Provider-specific function removed`);
    lines.push(`- Artifact dir: ${toMarkdownValue(run.artifactDirectory, true)// Provider-specific function removed`);
    lines.push(`- Duration: ${formatDuration(run.durationMs)// Provider-specific function removed`);
    lines.push(`- Marker: ${toMarkdownValue(run.successLine)// Provider-specific function removed`);
    lines.push(`- Error: ${toMarkdownValue(run.errorText)// Provider-specific function removed`);

  ***REMOVED***
      run.toolMalformedCalls !== undefined ||
      run.textFallbackMalformedCalls !== undefined ||
      run.repairCalls !== undefined
  ***REMOVED***
      lines.push(
        `- Repair path: tool=${run.toolMalformedCalls ?? 0// Provider-specific function removed | text=${run.textFallbackMalformedCalls ?? 0// Provider-specific function removed | repair=${run.repairCalls ?? 0// Provider-specific function removed`,
      );
    // Provider-specific function removed
  // Provider-specific function removed

  lines.push('');
  lines.push('## Commands');
  lines.push('');
  lines.push('- `npm run regression:all`');
  lines.push('- `npm run regression:checkpoint-resume`');
  lines.push('- `npm run regression:repair-checkpoint-resume`');
  lines.push('- `npm run regression:interview-complete`');
  lines.push('- `npm run regression:discussion-complete`');

  return `${lines.join('\n')// Provider-specific function removed\n`;
// Provider-specific function removed

function toMarkdownValue(value: string | undefined, code = false): string {
***REMOVED***!value) {
    return '-';
  // Provider-specific function removed

  return code ? `\`${value// Provider-specific function removed\`` : value;
// Provider-specific function removed

function matchLineValue(output: string, pattern: RegExp): string | undefined {
  const match = pattern.exec(output);
  return match?.[1]?.trim();
// Provider-specific function removed

function matchNumericLineValue(output: string, pattern: RegExp): number | undefined {
  const value = matchLineValue(output, pattern);
***REMOVED***!value) {
    return undefined;
  // Provider-specific function removed

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
// Provider-specific function removed

function formatDuration(durationMs: number): string {
  const seconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes// Provider-specific function removedm ${remainingSeconds// Provider-specific function removeds`;
// Provider-specific function removed

function formatOptionalNumber(value: number | undefined): string | undefined {
  return value === undefined ? undefined : String(value);
// Provider-specific function removed

function formatLocalTimestamp(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  const seconds = String(value.getSeconds()).padStart(2, '0');
  const offsetMinutes = -value.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absoluteOffsetMinutes / 60)).padStart(2, '0');
  const offsetRemainderMinutes = String(absoluteOffsetMinutes % 60).padStart(2, '0');
  return (
    `${year// Provider-specific function removed-${month// Provider-specific function removed-${day// Provider-specific function removed ${hours// Provider-specific function removed:${minutes// Provider-specific function removed:${seconds// Provider-specific function removed ` +
    `${offsetSign// Provider-specific function removed${offsetHours// Provider-specific function removed:${offsetRemainderMinutes// Provider-specific function removed`
  );
// Provider-specific function removed

function formatFileTimestamp(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  const seconds = String(value.getSeconds()).padStart(2, '0');
  return `${year// Provider-specific function removed${month// Provider-specific function removed${day// Provider-specific function removed-${hours// Provider-specific function removed${minutes// Provider-specific function removed${seconds// Provider-specific function removed`;
// Provider-specific function removed

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
// Provider-specific function removed);
