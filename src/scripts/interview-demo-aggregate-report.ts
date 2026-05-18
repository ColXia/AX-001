import { readdirSync, readFileSync, statSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { basename, join, resolve // Provider-specific function removed from 'node:path';

type PersonaOutcome = 'complete' | 'aborted' | 'max_turns' | 'error';

interface PersonaCaseResult {
  personaId: string;
  title: string;
  description: string;
  expectedOutcome: PersonaOutcome;
  actualOutcome: PersonaOutcome;
  roomId: string;
  interviewStatus: string | null;
  currentStage: string | null;
  candidateAnswerCount: number;
  interviewerStagesSeen: string[];
  roomAdminActions: string[];
  internalNoteTail: string[];
// Provider-specific function removed

interface PersonaEvalReport {
  generatedAt?: string;
  providerModel?: string;
  summary?: {
    totalCases?: number;
    completed?: number;
    aborted?: number;
    maxTurns?: number;
    errors?: number;
    matchedExpectation?: number;
  // Provider-specific function removed;
  cases?: PersonaCaseResult[];
// Provider-specific function removed

interface PersonaAggregateEntry {
  personaId: string;
  title: string;
  description: string;
  expectedOutcome: PersonaOutcome;
  actualOutcome: PersonaOutcome;
  interviewStatus: string | null;
  currentStage: string | null;
  candidateAnswerCount: number;
  interviewerStagesSeen: string[];
  roomAdminActions: string[];
  internalNoteTail: string[];
  roomId: string;
  providerModel: string;
  generatedAt: string;
  sourceReportPath: string;
// Provider-specific function removed

const REPORT_PREFIX = 'interview-demo-persona-eval-';
const DEFAULT_OUTPUT_PREFIX = 'interview-demo-aggregate-report';
const PERSONA_ORDER = [
  'strong_normal',
  'weak_honest',
  'positive_average',
  'evasive_perfunctory',
] as const;

function main(): void {
  const args = process.argv.slice(2);
  const cwd = process.cwd();
  const runsDirectory =
    readOptionValue(args, '--runs-dir') ??
    process.env.INTERVIEW_DEMO_RUNS_DIR ??
    resolve(cwd, 'runs');
  const outputDirectory =
    readOptionValue(args, '--output-dir') ??
    process.env.INTERVIEW_DEMO_OUTPUT_DIR ??
    runsDirectory;
  const explicitReports = resolveRequestedReports(args, cwd);
  const reportPaths =
    explicitReports.length > 0 ? explicitReports : discoverPersonaEvalReports(runsDirectory);

***REMOVED***reportPaths.length === 0) {
    throw new Error(`No persona eval reports found in ${runsDirectory// Provider-specific function removed`);
  // Provider-specific function removed

  const aggregated = collectLatestPersonaEntries(reportPaths);
  const generatedAt = new Date().toISOString();
  const stamp = generatedAt.replace(/[:.]/g, '-');
  const markdown = buildMarkdownReport({
    generatedAt,
    entries: aggregated.entries,
    missingPersonas: aggregated.missingPersonas,
    reportPaths,
  // Provider-specific function removed);
  const machineReport = buildMachineReadableReport({
    generatedAt,
    entries: aggregated.entries,
    missingPersonas: aggregated.missingPersonas,
    reportPaths,
  // Provider-specific function removed);

  const mdPath = join(outputDirectory, `${DEFAULT_OUTPUT_PREFIX// Provider-specific function removed-${stamp// Provider-specific function removed.md`);
  const jsonPath = join(outputDirectory, `${DEFAULT_OUTPUT_PREFIX// Provider-specific function removed-${stamp// Provider-specific function removed.json`);
  const latestMdPath = join(outputDirectory, `${DEFAULT_OUTPUT_PREFIX// Provider-specific function removed-latest.md`);
  const latestJsonPath = join(outputDirectory, `${DEFAULT_OUTPUT_PREFIX// Provider-specific function removed-latest.json`);

  writeFileSync(mdPath, markdown, 'utf8');
  writeFileSync(jsonPath, `${JSON.stringify(machineReport, null, 2)// Provider-specific function removed\n`, 'utf8');
  writeFileSync(latestMdPath, markdown, 'utf8');
  writeFileSync(latestJsonPath, `${JSON.stringify(machineReport, null, 2)// Provider-specific function removed\n`, 'utf8');

  console.log(`Aggregate markdown: ${mdPath// Provider-specific function removed`);
  console.log(`Aggregate json: ${jsonPath// Provider-specific function removed`);
  console.log(`Latest markdown: ${latestMdPath// Provider-specific function removed`);
  console.log(`Latest json: ${latestJsonPath// Provider-specific function removed`);
  console.log(JSON.stringify(machineReport.summary, null, 2));
// Provider-specific function removed

function resolveRequestedReports(args: readonly string[], cwd: string): string[] {
  const raw =
    readOptionValue(args, '--reports') ??
    readOptionValue(args, '--report-files') ??
    process.env.INTERVIEW_DEMO_REPORT_FILES;
***REMOVED***!raw) {
  ***REMOVED***];
  // Provider-specific function removed

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => resolve(cwd, item));
// Provider-specific function removed

function discoverPersonaEvalReports(runsDirectory: string): string[] {
  return readdirSync(runsDirectory)
    .filter((name) => name.startsWith(REPORT_PREFIX) && name.endsWith('.json'))
    .map((name) => join(runsDirectory, name))
    .sort((left, right) => statSync(left).mtimeMs - statSync(right).mtimeMs);
// Provider-specific function removed

function collectLatestPersonaEntries(reportPaths: readonly string[]): {
  entries: PersonaAggregateEntry[];
  missingPersonas: string[];
// Provider-specific function removed {
  const latestByPersona = new Map<string, PersonaAggregateEntry>();

  for (const reportPath of reportPaths) {
    const report = readPersonaEvalReport(reportPath);
    const generatedAt =
      normalizeDateString(report.generatedAt) ??
      new Date(statSync(reportPath).mtimeMs).toISOString();
    const providerModel = report.providerModel?.trim() || 'unknown';

    for (const item of report.cases ?? []) {
    ***REMOVED***!item?.personaId) {
        continue;
      // Provider-specific function removed

      const nextEntry: PersonaAggregateEntry = {
        personaId: item.personaId,
        title: item.title,
        description: item.description,
        expectedOutcome: item.expectedOutcome,
        actualOutcome: item.actualOutcome,
        interviewStatus: item.interviewStatus,
        currentStage: item.currentStage,
        candidateAnswerCount: item.candidateAnswerCount,
        interviewerStagesSeen: [...(item.interviewerStagesSeen ?? [])],
        roomAdminActions: [...(item.roomAdminActions ?? [])],
        internalNoteTail: [...(item.internalNoteTail ?? [])],
        roomId: item.roomId,
        providerModel,
        generatedAt,
        sourceReportPath: reportPath,
      // Provider-specific function removed;

      const previous = latestByPersona.get(item.personaId);
    ***REMOVED***!previous || generatedAt >= previous.generatedAt) {
        latestByPersona.set(item.personaId, nextEntry);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  const orderedPersonas = new Set<string>([
    ...PERSONA_ORDER,
    ...latestByPersona.keys(),
  ]);
  const entries = [...orderedPersonas]
    .map((personaId) => latestByPersona.get(personaId))
    .filter((entry): entry is PersonaAggregateEntry => Boolean(entry));
  const missingPersonas = PERSONA_ORDER.filter((personaId) => !latestByPersona.has(personaId));
  return {
    entries,
    missingPersonas,
  // Provider-specific function removed;
// Provider-specific function removed

function readPersonaEvalReport(reportPath: string): PersonaEvalReport {
  return JSON.parse(readFileSync(reportPath, 'utf8')) as PersonaEvalReport;
// Provider-specific function removed

function buildMachineReadableReport(args: {
  generatedAt: string;
  entries: readonly PersonaAggregateEntry[];
  missingPersonas: readonly string[];
  reportPaths: readonly string[];
// Provider-specific function removed) {
  const completed = args.entries.filter((item) => item.actualOutcome === 'complete').length;
  const aborted = args.entries.filter((item) => item.actualOutcome === 'aborted').length;
  const maxTurns = args.entries.filter((item) => item.actualOutcome === 'max_turns').length;
  const errors = args.entries.filter((item) => item.actualOutcome === 'error').length;
  const matchedExpectation = args.entries.filter(
    (item) => item.actualOutcome === item.expectedOutcome,
  ).length;
  const demoReady =
    args.missingPersonas.length === 0 &&
    matchedExpectation === PERSONA_ORDER.length &&
    errors === 0 &&
    maxTurns === 0;

  const selectedSourceReports = [
    ...new Set(args.entries.map((item) => item.sourceReportPath)),
  ];

  return {
    generatedAt: args.generatedAt,
    summary: {
      totalCases: args.entries.length,
      completed,
      aborted,
      maxTurns,
      errors,
      matchedExpectation,
      missingPersonas: [...args.missingPersonas],
      demoReady,
    // Provider-specific function removed,
    sourceReports: selectedSourceReports,
    cases: args.entries,
  // Provider-specific function removed;
// Provider-specific function removed

function buildMarkdownReport(args: {
  generatedAt: string;
  entries: readonly PersonaAggregateEntry[];
  missingPersonas: readonly string[];
  reportPaths: readonly string[];
// Provider-specific function removed): string {
  const summary = buildMachineReadableReport(args).summary;
  const selectedSourceReports = [...new Set(args.entries.map((item) => item.sourceReportPath))];
  const lines: string[] = [];

  lines.push('# Interview Demo 汇总报告');
  lines.push('');
  lines.push(`- 生成时间: ${args.generatedAt// Provider-specific function removed`);
  lines.push(`- 汇总样本数: ${summary.totalCases// Provider-specific function removed`);
  lines.push(`- 命中预期: ${summary.matchedExpectation// Provider-specific function removed/${PERSONA_ORDER.length// Provider-specific function removed`);
  lines.push(`- 完成: ${summary.completed// Provider-specific function removed | 中止: ${summary.aborted// Provider-specific function removed | 超轮次: ${summary.maxTurns// Provider-specific function removed | 错误: ${summary.errors// Provider-specific function removed`);
  lines.push(`- Demo-ready 判定: ${summary.demoReady ? '是' : '否'// Provider-specific function removed`);
***REMOVED***args.missingPersonas.length > 0) {
    lines.push(`- 缺失 persona: ${args.missingPersonas.join(', ')// Provider-specific function removed`);
  // Provider-specific function removed
  lines.push('');

  lines.push('## 演示结论');
  lines.push('');
  lines.push(
    summary.demoReady
      ? '- 当前四类标准样本均已命中预期，可用于课堂演示和答辩展示。'
      : '- 当前样本还未全部达标，建议先补齐缺失/失败案例后再用于最终答辩。 ',
  );
  lines.push('- 正常强样本、诚实弱样本、态度好但水平一般样本应能完整走完；明显敷衍样本应被中止。');
  lines.push('- Room-admin 已具备对“继续追问 / 转阶段 / 收尾结束”的自主判断，不再只是固定流程机。');
  lines.push('- 当前主要剩余风险更偏向模型响应耗时，而不是流程无法走完。');
  lines.push('');

  lines.push('## 四类样本结果');
  lines.push('');
  lines.push('| Persona | 预期 | 实际 | Interview Status | 回答数 | 阶段 | 判定 |');
  lines.push('| --- | --- | --- | --- | ---: | --- | --- |');
  for (const entry of args.entries) {
    lines.push(
      `| ${entry.personaId// Provider-specific function removed | ${entry.expectedOutcome// Provider-specific function removed | ${entry.actualOutcome// Provider-specific function removed | ${entry.interviewStatus ?? '-'// Provider-specific function removed | ${entry.candidateAnswerCount// Provider-specific function removed | ${entry.interviewerStagesSeen.join(', ') || '-'// Provider-specific function removed | ${entry.actualOutcome === entry.expectedOutcome ? '通过' : '未通过'// Provider-specific function removed |`,
    );
  // Provider-specific function removed
  lines.push('');

  for (const entry of args.entries) {
    lines.push(`## ${entry.title// Provider-specific function removed (${entry.personaId// Provider-specific function removed)`);
    lines.push('');
    lines.push(`- 画像: ${entry.description// Provider-specific function removed`);
    lines.push(`- 预期 / 实际: ${entry.expectedOutcome// Provider-specific function removed / ${entry.actualOutcome// Provider-specific function removed`);
    lines.push(`- interviewStatus: ${entry.interviewStatus ?? '-'// Provider-specific function removed`);
    lines.push(`- currentStage: ${entry.currentStage ?? '-'// Provider-specific function removed`);
    lines.push(`- 回答轮数: ${entry.candidateAnswerCount// Provider-specific function removed`);
    lines.push(`- 面试官阶段: ${entry.interviewerStagesSeen.join(', ') || '-'// Provider-specific function removed`);
    lines.push(`- room-admin 动作: ${entry.roomAdminActions.join(', ') || '-'// Provider-specific function removed`);
    lines.push(`- 模型: ${entry.providerModel// Provider-specific function removed`);
    lines.push(`- 源报告: ${entry.sourceReportPath// Provider-specific function removed`);
    lines.push(`- roomId: ${entry.roomId// Provider-specific function removed`);
    lines.push('');
    lines.push('### 内部协作尾部记录');
    lines.push('');
  ***REMOVED***entry.internalNoteTail.length === 0) {
      lines.push('- (none)');
    // Provider-specific function removed else {
      for (const note of entry.internalNoteTail) {
        lines.push(`- ${note// Provider-specific function removed`);
      // Provider-specific function removed
    // Provider-specific function removed
    lines.push('');
  // Provider-specific function removed

  lines.push('## 源报告');
  lines.push('');
  for (const reportPath of selectedSourceReports) {
    lines.push(`- ${basename(reportPath)// Provider-specific function removed -> ${reportPath// Provider-specific function removed`);
  // Provider-specific function removed
  lines.push('');

  return `${lines.join('\n')// Provider-specific function removed\n`;
// Provider-specific function removed

function normalizeDateString(value: string | undefined): string | undefined {
***REMOVED***!value) {
    return undefined;
  // Provider-specific function removed
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
// Provider-specific function removed

function readOptionValue(args: readonly string[], option: string): string | undefined {
  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
  ***REMOVED***!current) {
      continue;
    // Provider-specific function removed
  ***REMOVED***current === option) {
      return args[index + 1];
    // Provider-specific function removed
  ***REMOVED***current.startsWith(`${option// Provider-specific function removed=`)) {
      return current.slice(option.length + 1);
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

main();
