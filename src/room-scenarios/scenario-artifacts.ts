import type {
  ChatroomFinalSummary,
  FinalSummary,
  InterviewSummary,
  RoleplaySummary,
// Provider-specific function removed from '../agents/schemas.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import {
  inferInterviewStageFromMessages,
  inferInterviewStatusFromMessages,
  isInterviewMetaContent as isInterviewMetaMessageContent,
// Provider-specific function removed from '../workflows/interview-room-utils.js';
import type {
  ChatroomHostDirective,
  ChatroomMessage,
  ChatroomRoomAdminDirective,
  ChatroomRecorderCheckpoint,
// Provider-specific function removed from '../workflows/chatroom-types.js';
import { resolveInterviewStatusFromState // Provider-specific function removed from '../workflows/interview-room-controller.js';
import {
  formatRoomBlueprintGovernanceSummary,
// Provider-specific function removed from './room-blueprints.js';
import {
  resolveRoomScenarioTemplate,
  type RoomParticipantSlot,
  type RoomScenarioTemplateId,
// Provider-specific function removed from './scenario-templates.js';
import { resolveInterviewScoreTemplate // Provider-specific function removed from '../workflows/interview-score-templates.js';

export interface RoomScenarioArtifactBundle {
  artifactType: string;
  jsonFileName: string;
  markdownFileName: string;
  payload: Record<string, unknown>;
  markdown: string;
// Provider-specific function removed

const INTERVIEW_REPAIR_PROMPT_PATTERNS = [
  /encoding issue|garbled|corrupt(?:ed)?|mojibake/i,
  /编码问题|乱码|显示异常|转码/u,
];

export function buildRoomScenarioArtifactBundle(
  state: Readonly<ChatroomState>,
  options: {
    generatedAt: string;
  // Provider-specific function removed,
): RoomScenarioArtifactBundle | null {
  const scenarioTemplateId =
    state.roomBlueprint?.scenarioTemplateId ?? state.scenarioTemplateId;
***REMOVED***!scenarioTemplateId) {
***REMOVED***
  // Provider-specific function removed

  switch (scenarioTemplateId) {
    case 'interview_simulation':
    case 'free_interview':
      return buildInterviewArtifact(state, options.generatedAt);
    case 'project_development_discussion':
      return buildProjectArtifact(state, options.generatedAt);
    case 'report_seminar':
      return buildReportArtifact(state, options.generatedAt);
    case 'murder_mystery':
      return buildMysteryArtifact(state, options.generatedAt);
    case 'tavern_roleplay_demo':
    case 'roleplay_scene':
      return buildRoleplayArtifact(state, options.generatedAt);
    case 'brainstorm_workshop':
    case 'expert_discussion':
      return buildDiscussionArtifact(state, options.generatedAt, scenarioTemplateId);
  // Provider-specific function removed
// Provider-specific function removed

function buildInterviewArtifact(
  state: Readonly<ChatroomState>,
  generatedAt: string,
): RoomScenarioArtifactBundle {
  const summary = summarizeFinalSummary(state.finalSummary);
  const interviewSummary = isInterviewSummary(state.finalSummary)
    ? state.finalSummary
    : undefined;
  const scenario = getScenarioMetadata(state);
  const panel = listParticipantLabels(state, 'agent');
  const candidateLabel = findHumanParticipantLabel(state) ?? 'Candidate';
  const focusAreas = resolveScenarioList(
    scenario,
    'focusAreas',
    state.constraints,
    ['Focus areas'],
  );
  const scoringGuide = resolveInterviewScoreTemplate({
    targetRole: asOptionalString(scenario?.targetRole) ?? state.topic,
    focusAreas,
    constraints: state.constraints,
    scoreTemplateId: asOptionalString(scenario?.scoreTemplateId),
    scoreDimensions: asStringArray(scenario?.scoreDimensions),
  // Provider-specific function removed);
  const interviewerQuestions = collectQuestionPrompts(
    state.messages.filter((message) => message.role === 'agent'),
    8,
  );
  const payload = {
    version: 1,
    artifactType: 'interview_report',
    scenarioTemplateId: 'interview_simulation',
    scenarioLabel: resolveRoomScenarioTemplate('interview_simulation').label,
    roomTitle: resolveRoomTitle(state),
    roomType: state.roomType,
    topic: state.topic,
    objective: state.objective,
    generatedAt,
    candidate: {
      slotLabel: candidateLabel,
      name: asOptionalString(scenario?.candidateName),
      targetRole: asOptionalString(scenario?.targetRole),
      targetLevel: asOptionalString(scenario?.targetLevel),
      background: asOptionalString(scenario?.candidateBackground),
      companyStyle: asOptionalString(scenario?.companyStyle),
    // Provider-specific function removed,
    panel,
    focusAreas,
    scoreTemplateId: scoringGuide.templateId,
    scoreTemplateLabel: scoringGuide.templateLabel,
    scoreDimensions: scoringGuide.dimensions,
    interviewStatus: interviewSummary?.interviewStatus ?? resolveInterviewStatusFromState(state),
    currentStage: interviewSummary?.currentStage ?? inferInterviewStage(state.messages),
    interviewReadiness: interviewSummary?.interviewReadiness ?? 'insufficient_signal',
    overallScore: interviewSummary?.overallScore ?? 0,
    competencyScores: interviewSummary?.competencyScores ?? [],
    interviewerQuestions,
    recorderSummary: summary.headline,
    strengths: summary.highlights,
    concerns: summary.concerns,
    missedQuestions: interviewSummary?.missedQuestions ?? [],
    suggestedAnswerImprovements:
      interviewSummary?.suggestedAnswerImprovements ?? [],
    followUpQuestions: interviewSummary?.followUpQuestions ?? [],
    recommendedNextSteps: summary.nextSteps,
    transcriptStats: buildTranscriptStats(state),
  // Provider-specific function removed satisfies Record<string, unknown>;

  const markdown = [
    '# Interview Report',
    '',
    ...buildArtifactFrontMatter(state, 'interview_report', generatedAt),
    `- Candidate: ${candidateLabel// Provider-specific function removed`,
    `- Target Role: ${asOptionalString(scenario?.targetRole) ?? '-'// Provider-specific function removed`,
    `- Target Level: ${asOptionalString(scenario?.targetLevel) ?? '-'// Provider-specific function removed`,
    `- Interview Status: ${interviewSummary?.interviewStatus ?? resolveInterviewStatusFromState(state)// Provider-specific function removed`,
    `- Current Stage: ${interviewSummary?.currentStage ?? inferInterviewStage(state.messages)// Provider-specific function removed`,
    `- Overall Score: ${interviewSummary?.overallScore ?? '-'// Provider-specific function removed`,
    `- Focus Areas: ${focusAreas.length > 0 ? focusAreas.join(' | ') : '-'// Provider-specific function removed`,
    `- Score Template: ${scoringGuide.templateLabel// Provider-specific function removed (${scoringGuide.templateId// Provider-specific function removed)`,
    `- Score Dimensions: ${scoringGuide.dimensions.join(' | ')// Provider-specific function removed`,
    `- Panel: ${panel.length > 0 ? panel.join(', ') : '-'// Provider-specific function removed`,
    '',
    '## Recorder Summary',
    '',
    summary.headline || '-',
    '',
    ...buildMarkdownInterviewScores(interviewSummary?.competencyScores ?? []),
    ...buildMarkdownListSection('## Strengths', summary.highlights),
    ...buildMarkdownListSection('## Concerns', summary.concerns),
    ...buildMarkdownListSection(
      '## Missed Questions',
      interviewSummary?.missedQuestions ?? [],
    ),
    ...buildMarkdownListSection(
      '## Suggested Answer Improvements',
      interviewSummary?.suggestedAnswerImprovements ?? [],
    ),
    ...buildMarkdownListSection(
      '## Follow-up Questions',
      interviewSummary?.followUpQuestions ?? [],
    ),
    ...buildMarkdownListSection('## Recommended Next Steps', summary.nextSteps),
    ...buildMarkdownListSection('## Interviewer Questions', interviewerQuestions),
    ...buildMarkdownRoomAdminTimeline(state.roomAdminState?.history),
    ...buildMarkdownHostTimeline(state.hostState?.history),
    ...buildMarkdownRecorderTimeline(
      state.recorderState?.entries,
      interviewSummary?.interviewStatus,
    ),
  ].join('\n');

  return {
    artifactType: 'interview_report',
    jsonFileName: 'scenario-report.json',
    markdownFileName: 'scenario-report.md',
    payload,
    markdown,
  // Provider-specific function removed;
// Provider-specific function removed

function buildProjectArtifact(
  state: Readonly<ChatroomState>,
  generatedAt: string,
): RoomScenarioArtifactBundle {
  const summary = summarizeFinalSummary(state.finalSummary);
  const scenario = getScenarioMetadata(state);
  const panel = listParticipantLabels(state, 'agent');
  const decisionFocus = resolveScenarioList(
    scenario,
    'decisionFocus',
    state.constraints,
    ['Decision focus'],
  );
  const payload = {
    version: 1,
    artifactType: 'project_review_report',
    scenarioTemplateId: 'project_development_discussion',
    scenarioLabel: resolveRoomScenarioTemplate('project_development_discussion').label,
    roomTitle: resolveRoomTitle(state),
    roomType: state.roomType,
    topic: state.topic,
    objective: state.objective,
    generatedAt,
    project: {
      projectName: asOptionalString(scenario?.projectName),
      projectStage: asOptionalString(scenario?.projectStage),
      teamContext: asOptionalString(scenario?.teamContext),
    // Provider-specific function removed,
    reviewPanel: panel,
    decisionFocus,
    decisionLog: summary.highlights,
    risks: summary.concerns,
    actionItems: summary.nextSteps,
    recorderSummary: summary.headline,
    transcriptStats: buildTranscriptStats(state),
  // Provider-specific function removed satisfies Record<string, unknown>;

  const markdown = [
    '# Project Review Report',
    '',
    ...buildArtifactFrontMatter(state, 'project_review_report', generatedAt),
    `- Project: ${asOptionalString(scenario?.projectName) ?? '-'// Provider-specific function removed`,
    `- Stage: ${asOptionalString(scenario?.projectStage) ?? '-'// Provider-specific function removed`,
    `- Decision Focus: ${decisionFocus.length > 0 ? decisionFocus.join(' | ') : '-'// Provider-specific function removed`,
    `- Panel: ${panel.length > 0 ? panel.join(', ') : '-'// Provider-specific function removed`,
    '',
    '## Recorder Summary',
    '',
    summary.headline || '-',
    '',
    ...buildMarkdownListSection('## Decision Log', summary.highlights),
    ...buildMarkdownListSection('## Risks', summary.concerns),
    ...buildMarkdownListSection('## Action Items', summary.nextSteps),
    ...buildMarkdownRoomAdminTimeline(state.roomAdminState?.history),
    ...buildMarkdownHostTimeline(state.hostState?.history),
    ...buildMarkdownRecorderTimeline(state.recorderState?.entries),
  ].join('\n');

  return {
    artifactType: 'project_review_report',
    jsonFileName: 'scenario-report.json',
    markdownFileName: 'scenario-report.md',
    payload,
    markdown,
  // Provider-specific function removed;
// Provider-specific function removed

function buildReportArtifact(
  state: Readonly<ChatroomState>,
  generatedAt: string,
): RoomScenarioArtifactBundle {
  const summary = summarizeFinalSummary(state.finalSummary);
  const scenario = getScenarioMetadata(state);
  const panel = listParticipantLabels(state, 'agent');
  const reviewFocus = resolveScenarioList(
    scenario,
    'reviewFocus',
    state.constraints,
    ['Review focus'],
  );
  const presenterLabel = findHumanParticipantLabel(state) ?? 'Presenter';
  const payload = {
    version: 1,
    artifactType: 'seminar_review_report',
    scenarioTemplateId: 'report_seminar',
    scenarioLabel: resolveRoomScenarioTemplate('report_seminar').label,
    roomTitle: resolveRoomTitle(state),
    roomType: state.roomType,
    topic: state.topic,
    objective: state.objective,
    generatedAt,
    presenter: {
      slotLabel: presenterLabel,
      name: asOptionalString(scenario?.presenterName),
    // Provider-specific function removed,
    report: {
      reportKind: asOptionalString(scenario?.reportKind),
      domain: asOptionalString(scenario?.domain),
      reviewFocus,
    // Provider-specific function removed,
    reviewPanel: panel,
    keyFindings: summary.highlights,
    openObjections: summary.concerns,
    revisionGuidance: summary.nextSteps,
    recorderSummary: summary.headline,
    transcriptStats: buildTranscriptStats(state),
  // Provider-specific function removed satisfies Record<string, unknown>;

  const markdown = [
    '# Seminar Review Report',
    '',
    ...buildArtifactFrontMatter(state, 'seminar_review_report', generatedAt),
    `- Presenter: ${presenterLabel// Provider-specific function removed`,
    `- Report Kind: ${asOptionalString(scenario?.reportKind) ?? '-'// Provider-specific function removed`,
    `- Domain: ${asOptionalString(scenario?.domain) ?? '-'// Provider-specific function removed`,
    `- Review Focus: ${reviewFocus.length > 0 ? reviewFocus.join(' | ') : '-'// Provider-specific function removed`,
    `- Review Panel: ${panel.length > 0 ? panel.join(', ') : '-'// Provider-specific function removed`,
    '',
    '## Recorder Summary',
    '',
    summary.headline || '-',
    '',
    ...buildMarkdownListSection('## Key Findings', summary.highlights),
    ...buildMarkdownListSection('## Open Objections', summary.concerns),
    ...buildMarkdownListSection('## Revision Guidance', summary.nextSteps),
    ...buildMarkdownRoomAdminTimeline(state.roomAdminState?.history),
    ...buildMarkdownHostTimeline(state.hostState?.history),
    ...buildMarkdownRecorderTimeline(state.recorderState?.entries),
  ].join('\n');

  return {
    artifactType: 'seminar_review_report',
    jsonFileName: 'scenario-report.json',
    markdownFileName: 'scenario-report.md',
    payload,
    markdown,
  // Provider-specific function removed;
// Provider-specific function removed

function buildMysteryArtifact(
  state: Readonly<ChatroomState>,
  generatedAt: string,
): RoomScenarioArtifactBundle {
  const summary = summarizeFinalSummary(state.finalSummary);
  const scenario = getScenarioMetadata(state);
  const cast = listParticipantLabels(state, 'agent');
  const focusAreas = resolveScenarioList(
    scenario,
    'focusAreas',
    state.constraints,
    ['Focus areas'],
  );
  const payload = {
    version: 1,
    artifactType: 'mystery_case_report',
    scenarioTemplateId: 'murder_mystery',
    scenarioLabel: resolveRoomScenarioTemplate('murder_mystery').label,
    roomTitle: resolveRoomTitle(state),
    roomType: state.roomType,
    topic: state.topic,
    objective: state.objective,
    generatedAt,
    case: {
      caseTitle: asOptionalString(scenario?.caseTitle),
      setting: asOptionalString(scenario?.setting),
      victimProfile: asOptionalString(scenario?.victimProfile),
      focusAreas,
    // Provider-specific function removed,
    investigator: findHumanParticipantLabel(state) ?? 'Lead Investigator',
    cast,
    caseSummary: summary.headline,
    clueBoard: summary.highlights,
    openThreads: summary.concerns,
    nextLeads: summary.nextSteps,
    transcriptStats: buildTranscriptStats(state),
  // Provider-specific function removed satisfies Record<string, unknown>;

  const markdown = [
    '# Mystery Case Report',
    '',
    ...buildArtifactFrontMatter(state, 'mystery_case_report', generatedAt),
    `- Case Title: ${asOptionalString(scenario?.caseTitle) ?? resolveRoomTitle(state)// Provider-specific function removed`,
    `- Setting: ${asOptionalString(scenario?.setting) ?? '-'// Provider-specific function removed`,
    `- Investigator: ${findHumanParticipantLabel(state) ?? 'Lead Investigator'// Provider-specific function removed`,
    `- Cast: ${cast.length > 0 ? cast.join(', ') : '-'// Provider-specific function removed`,
    '',
    '## Case Summary',
    '',
    summary.headline || '-',
    '',
    ...buildMarkdownListSection('## Clue Board', summary.highlights),
    ...buildMarkdownListSection('## Open Threads', summary.concerns),
    ...buildMarkdownListSection('## Next Leads', summary.nextSteps),
    ...buildMarkdownRoomAdminTimeline(state.roomAdminState?.history),
    ...buildMarkdownHostTimeline(state.hostState?.history),
    ...buildMarkdownRecorderTimeline(state.recorderState?.entries),
  ].join('\n');

  return {
    artifactType: 'mystery_case_report',
    jsonFileName: 'scenario-report.json',
    markdownFileName: 'scenario-report.md',
    payload,
    markdown,
  // Provider-specific function removed;
// Provider-specific function removed

function buildRoleplayArtifact(
  state: Readonly<ChatroomState>,
  generatedAt: string,
): RoomScenarioArtifactBundle {
  const summary = summarizeFinalSummary(state.finalSummary);
  const cast = listParticipantLabels(state, 'agent');
  const payload = {
    version: 1,
    artifactType: 'roleplay_recap',
    scenarioTemplateId:
      state.roomBlueprint?.scenarioTemplateId ?? state.scenarioTemplateId ?? 'roleplay_scene',
    scenarioLabel: resolveRoomScenarioTemplate(
      state.roomBlueprint?.scenarioTemplateId ?? state.scenarioTemplateId ?? 'roleplay_scene',
    ).label,
    roomTitle: resolveRoomTitle(state),
    roomType: state.roomType,
    topic: state.topic,
    objective: state.objective,
    generatedAt,
    cast,
    recap: summary.headline,
    keyMoments: summary.highlights,
    openThreads: summary.concerns,
    nextMoments: summary.nextSteps,
    transcriptStats: buildTranscriptStats(state),
  // Provider-specific function removed satisfies Record<string, unknown>;

  const markdown = [
    '# Roleplay Recap',
    '',
    ...buildArtifactFrontMatter(state, 'roleplay_recap', generatedAt),
    `- Cast: ${cast.length > 0 ? cast.join(', ') : '-'// Provider-specific function removed`,
    '',
    '## Narrative Summary',
    '',
    summary.headline || '-',
    '',
    ...buildMarkdownListSection('## Key Moments', summary.highlights),
    ...buildMarkdownListSection('## Open Threads', summary.concerns),
    ...buildMarkdownListSection('## Next Moments', summary.nextSteps),
    ...buildMarkdownRoomAdminTimeline(state.roomAdminState?.history),
    ...buildMarkdownHostTimeline(state.hostState?.history),
    ...buildMarkdownRecorderTimeline(state.recorderState?.entries),
  ].join('\n');

  return {
    artifactType: 'roleplay_recap',
    jsonFileName: 'scenario-report.json',
    markdownFileName: 'scenario-report.md',
    payload,
    markdown,
  // Provider-specific function removed;
// Provider-specific function removed

function buildDiscussionArtifact(
  state: Readonly<ChatroomState>,
  generatedAt: string,
  scenarioTemplateId: Extract<
    RoomScenarioTemplateId,
    'expert_discussion' | 'brainstorm_workshop'
  >,
): RoomScenarioArtifactBundle {
  const summary = summarizeFinalSummary(state.finalSummary);
  const payload = {
    version: 1,
    artifactType: 'discussion_report',
    scenarioTemplateId,
    scenarioLabel: resolveRoomScenarioTemplate(scenarioTemplateId).label,
    roomTitle: resolveRoomTitle(state),
    roomType: state.roomType,
    topic: state.topic,
    objective: state.objective,
    generatedAt,
    requester: findHumanParticipantLabel(state) ?? 'Requester',
    panel: listParticipantLabels(state, 'agent'),
    summary: summary.headline,
    highlights: summary.highlights,
    concerns: summary.concerns,
    nextSteps: summary.nextSteps,
    transcriptStats: buildTranscriptStats(state),
  // Provider-specific function removed satisfies Record<string, unknown>;

  const markdown = [
    '# Discussion Report',
    '',
    ...buildArtifactFrontMatter(state, 'discussion_report', generatedAt),
    `- Requester: ${findHumanParticipantLabel(state) ?? 'Requester'// Provider-specific function removed`,
    '',
    '## Summary',
    '',
    summary.headline || '-',
    '',
    ...buildMarkdownListSection('## Highlights', summary.highlights),
    ...buildMarkdownListSection('## Concerns', summary.concerns),
    ...buildMarkdownListSection('## Next Steps', summary.nextSteps),
    ...buildMarkdownRoomAdminTimeline(state.roomAdminState?.history),
    ...buildMarkdownHostTimeline(state.hostState?.history),
    ...buildMarkdownRecorderTimeline(state.recorderState?.entries),
  ].join('\n');

  return {
    artifactType: 'discussion_report',
    jsonFileName: 'scenario-report.json',
    markdownFileName: 'scenario-report.md',
    payload,
    markdown,
  // Provider-specific function removed;
// Provider-specific function removed

function buildArtifactFrontMatter(
  state: Readonly<ChatroomState>,
  artifactType: string,
  generatedAt: string,
): string[] {
  const scenarioTemplateId =
    state.roomBlueprint?.scenarioTemplateId ?? state.scenarioTemplateId ?? '-';
  const governanceSummary = formatRoomBlueprintGovernanceSummary(
    state.roomBlueprint?.governance,
  );
  const roomAdminDirectiveCount = state.roomAdminState?.history.length ?? 0;
  const hostDirectiveCount = state.hostState?.history.length ?? 0;
  const recorderCheckpointCount = state.recorderState?.entries.length ?? 0;

***REMOVED***
    `- Artifact Type: ${artifactType// Provider-specific function removed`,
    `- Scenario Template: ${scenarioTemplateId// Provider-specific function removed`,
    `- Room Title: ${resolveRoomTitle(state)// Provider-specific function removed`,
    `- Room Type: ${state.roomType// Provider-specific function removed`,
    `- Topic: ${state.topic// Provider-specific function removed`,
    `- Objective: ${state.objective// Provider-specific function removed`,
    `- Governance: ${governanceSummary// Provider-specific function removed`,
    `- Room Admin Directives: ${roomAdminDirectiveCount// Provider-specific function removed`,
    `- Host Directives: ${hostDirectiveCount// Provider-specific function removed`,
    `- Recorder Checkpoints: ${recorderCheckpointCount// Provider-specific function removed`,
    `- Generated At: ${generatedAt// Provider-specific function removed`,
    '',
  ];
// Provider-specific function removed

function buildMarkdownListSection(title: string, items: readonly string[]): string[] {
***REMOVED***
    title,
    '',
    ...(items.length > 0 ? items.map((item) => `- ${item// Provider-specific function removed`) : ['-']),
    '',
  ];
// Provider-specific function removed

function buildMarkdownInterviewScores(
  scores: InterviewSummary['competencyScores'],
): string[] {
***REMOVED***scores.length === 0) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    '## Competency Scores',
    '',
    ...scores.flatMap((item) => [
      `- ${item.dimension// Provider-specific function removed: ${item.score// Provider-specific function removed/5`,
      ...(item.evidence.length > 0 ? item.evidence.map((evidence) => `  - Evidence: ${evidence// Provider-specific function removed`) : []),
      ...(item.risks.length > 0 ? item.risks.map((risk) => `  - Risk: ${risk// Provider-specific function removed`) : []),
    ]),
    '',
  ];
// Provider-specific function removed

function buildMarkdownRecorderTimeline(
  checkpoints: readonly ChatroomRecorderCheckpoint[] | undefined,
  finalInterviewStatus?: InterviewSummary['interviewStatus'],
): string[] {
***REMOVED***!checkpoints || checkpoints.length === 0) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    '## Recorder Timeline',
    '',
    ...checkpoints.slice(-6).map((checkpoint) =>
      {
        const detailLine = resolveRecorderTimelineDetailLine({
          checkpoint,
          finalInterviewStatus,
        // Provider-specific function removed);

      ***REMOVED***
          `- Round ${checkpoint.round// Provider-specific function removed | ${checkpoint.createdAt// Provider-specific function removed | ${checkpoint.headline// Provider-specific function removed`,
          checkpoint.currentStage ? `  - Stage: ${checkpoint.currentStage// Provider-specific function removed` : undefined,
          checkpoint.interviewStatus
            ? `  - Status: ${checkpoint.interviewStatus// Provider-specific function removed`
            : undefined,
          checkpoint.highlights[0]
            ? `  - Highlight: ${checkpoint.highlights[0]// Provider-specific function removed`
            : undefined,
          detailLine,
        ]
          .filter((item): item is string => Boolean(item))
          .join('\n');
      // Provider-specific function removed,
    ),
    '',
  ];
// Provider-specific function removed

function resolveRecorderTimelineDetailLine(args: {
  checkpoint: ChatroomRecorderCheckpoint;
  finalInterviewStatus?: InterviewSummary['interviewStatus'];
// Provider-specific function removed): string | undefined {
  const primaryDetail =
    args.checkpoint.concerns[0]
      ? `  - Concern: ${args.checkpoint.concerns[0]// Provider-specific function removed`
      : args.checkpoint.nextSteps[0]
        ? `  - Next: ${args.checkpoint.nextSteps[0]// Provider-specific function removed`
        : undefined;

***REMOVED***
    args.finalInterviewStatus === 'complete' &&
    args.checkpoint.interviewStatus !== 'complete' &&
    primaryDetail &&
    /编码问题|尚未回答|待候选人补答|等待候选人|未闭环/u.test(primaryDetail)
***REMOVED***
    return undefined;
  // Provider-specific function removed

  return primaryDetail;
// Provider-specific function removed

function buildMarkdownHostTimeline(
  directives: readonly ChatroomHostDirective[] | undefined,
): string[] {
***REMOVED***!directives || directives.length === 0) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    '## Host Timeline',
    '',
    ...directives.slice(-6).map((directive) =>
      [
        `- Round ${directive.round// Provider-specific function removed | ${directive.createdAt// Provider-specific function removed | ${directive.action// Provider-specific function removed/${directive.visibility// Provider-specific function removed`,
        directive.headline ? `  - Headline: ${directive.headline// Provider-specific function removed` : undefined,
        directive.focus ? `  - Focus: ${directive.focus// Provider-specific function removed` : undefined,
        directive.reason ? `  - Reason: ${directive.reason// Provider-specific function removed` : undefined,
      ]
        .filter((item): item is string => Boolean(item))
        .join('\n'),
    ),
    '',
  ];
// Provider-specific function removed

function buildMarkdownRoomAdminTimeline(
  directives: readonly ChatroomRoomAdminDirective[] | undefined,
): string[] {
***REMOVED***!directives || directives.length === 0) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    '## Room Admin Timeline',
    '',
    ...directives.slice(-6).map((directive) =>
      [
        `- Round ${directive.round// Provider-specific function removed | ${directive.createdAt// Provider-specific function removed | ${directive.action// Provider-specific function removed/${directive.visibility// Provider-specific function removed`,
        directive.phaseLabel ? `  - Phase: ${directive.phaseLabel// Provider-specific function removed` : undefined,
        directive.phaseObjective
          ? `  - Phase Objective: ${directive.phaseObjective// Provider-specific function removed`
          : undefined,
        directive.eventLabel || directive.eventMessage
          ? `  - Event: ${directive.eventLabel || directive.eventMessage// Provider-specific function removed`
          : undefined,
        directive.participantAdditions.length > 0
          ? `  - Participants: ${directive.participantAdditions.map((item) => item.name).join(', ')// Provider-specific function removed`
          : undefined,
        directive.reason ? `  - Reason: ${directive.reason// Provider-specific function removed` : undefined,
      ]
        .filter((item): item is string => Boolean(item))
        .join('\n'),
    ),
    '',
  ];
// Provider-specific function removed

function resolveRoomTitle(state: Readonly<ChatroomState>): string {
  return state.roomBlueprint?.title ?? state.topic;
// Provider-specific function removed

function findHumanParticipantLabel(state: Readonly<ChatroomState>): string | undefined {
  return state.roomBlueprint?.participantSlots.find(
    (slot) => slot.participantType === 'human',
  )?.label;
// Provider-specific function removed

function listParticipantLabels(
  state: Readonly<ChatroomState>,
  participantType: RoomParticipantSlot['participantType'],
): string[] {
  const slots = state.roomBlueprint?.participantSlots ?? [];
  return takeUniqueStrings(
    slots
      .filter((slot) => slot.participantType === participantType)
      .map((slot) => slot.label),
  );
// Provider-specific function removed

function buildTranscriptStats(state: Readonly<ChatroomState>): Record<string, unknown> {
  return {
    rounds: state.messages.reduce((max, message) => Math.max(max, message.round), 0),
    messageCount: state.messages.length,
    agentMessageCount: state.messages.filter((message) => message.role === 'agent').length,
    humanMessageCount: state.messages.filter((message) => message.role === 'user').length,
  // Provider-specific function removed;
// Provider-specific function removed

function collectQuestionPrompts(
  messages: readonly ChatroomMessage[],
  limit: number,
): string[] {
  const prompts: string[] = [];

  for (const message of messages) {
  ***REMOVED***isInterviewMetaContent(message.content) || isInterviewRepairPrompt(message.content)) {
      continue;
    // Provider-specific function removed

    const paragraphs = message.content
      .split(/\n\s*\n/g)
      .map((paragraph) => normalizePromptLikeText(paragraph))
      .filter(Boolean);

    let addedFromMessage = false;
    for (const paragraph of paragraphs) {
    ***REMOVED***looksLikeQuestionPrompt(paragraph)) {
        prompts.push(paragraph);
        addedFromMessage = true;
      // Provider-specific function removed
    ***REMOVED***prompts.length >= limit) {
        return takeUniqueStrings(prompts).slice(0, limit);
      // Provider-specific function removed
    // Provider-specific function removed

  ***REMOVED***!addedFromMessage && paragraphs.length > 0) {
      prompts.push(paragraphs[0]!);
    ***REMOVED***prompts.length >= limit) {
        return takeUniqueStrings(prompts).slice(0, limit);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  return takeUniqueStrings(prompts).slice(0, limit);
// Provider-specific function removed

function isInterviewRepairPrompt(value: string***REMOVED***
  return INTERVIEW_REPAIR_PROMPT_PATTERNS.some((pattern) => pattern.test(value));
// Provider-specific function removed

function looksLikeQuestionPrompt(value: string***REMOVED***
  return /[?？]/.test(value) || /^(\d+[\.\)]|\*\*.+\*\*|请|假设)/.test(value);
// Provider-specific function removed

function normalizePromptLikeText(value: string): string {
  return truncateText(
    value
      .replace(/[*#>-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
    220,
  );
// Provider-specific function removed

function isInterviewMetaContent(value: string***REMOVED***
  return isInterviewMetaMessageContent(value);
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
***REMOVED***value.length <= limit) {
    return value;
  // Provider-specific function removed

  return `${value.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

function getScenarioMetadata(state: Readonly<ChatroomState>): Record<string, unknown> | undefined {
  const scenario = state.roomBlueprint?.metadata?.scenario;
  return isJsonRecord(scenario) ? scenario : undefined;
// Provider-specific function removed

function resolveScenarioList(
  scenario: Record<string, unknown> | undefined,
  key: string,
  constraints: readonly string[],
  prefixes: readonly string[],
): string[] {
  const direct = scenario?.[key];
***REMOVED***Array.isArray(direct)) {
    const values = takeUniqueStrings(
      direct.map((item) => (typeof item === 'string' ? item.trim() : '')),
    );
  ***REMOVED***values.length > 0) {
      return values;
    // Provider-specific function removed
  // Provider-specific function removed

  const extracted: string[] = [];
  for (const constraint of constraints) {
    const prefix = prefixes.find((item) =>
      constraint.toLowerCase().startsWith(`${item.toLowerCase()// Provider-specific function removed:`),
    );
  ***REMOVED***!prefix) {
      continue;
    // Provider-specific function removed

    const value = constraint.slice(prefix.length + 1).trim();
    extracted.push(
      ...value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    );
  // Provider-specific function removed

  return takeUniqueStrings(extracted);
// Provider-specific function removed

function summarizeFinalSummary(
  summary: ChatroomFinalSummary | undefined,
): {
  headline: string;
  highlights: string[];
  concerns: string[];
  nextSteps: string[];
// Provider-specific function removed {
***REMOVED***!summary) {
    return {
      headline: '',
      highlights: [],
      concerns: [],
      nextSteps: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***isInterviewSummary(summary)) {
    return {
      headline: summary.executiveSummary,
      highlights: takeUniqueStrings(summary.strengths),
      concerns: takeUniqueStrings(summary.weaknesses),
      nextSteps: takeUniqueStrings(summary.recommendedNextActions),
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***isAnalysisSummary(summary)) {
    return {
      headline: summary.executiveSummary,
      highlights: takeUniqueStrings(summary.consensus),
      concerns: takeUniqueStrings(summary.remainingDisagreements),
      nextSteps: takeUniqueStrings(summary.recommendedNextActions),
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    headline: summary.narrativeSummary,
    highlights: takeUniqueStrings([
      ...summary.keyEvents,
      ...summary.characterHighlights,
    ]),
    concerns: takeUniqueStrings([
      ...summary.cliffhangers,
      ...summary.relationshipChanges,
    ]),
    nextSteps: takeUniqueStrings(summary.cliffhangers),
  // Provider-specific function removed;
// Provider-specific function removed

function isAnalysisSummary(summary: ChatroomFinalSummary): summary is FinalSummary {
  return 'consensus' in summary;
// Provider-specific function removed

function isInterviewSummary(
  summary: ChatroomFinalSummary | undefined,
): summary is InterviewSummary {
  return Boolean(summary) &&
    typeof summary === 'object' &&
    !Array.isArray(summary) &&
    'competencyScores' in summary;
// Provider-specific function removed

function inferInterviewStatus(
  messages: readonly ChatroomMessage[],
): InterviewSummary['interviewStatus'] {
  return inferInterviewStatusFromMessages(messages);
// Provider-specific function removed

function inferInterviewStage(messages: readonly ChatroomMessage[]): string {
  return inferInterviewStageFromMessages(messages);
// Provider-specific function removed

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
// Provider-specific function removed

function asStringArray(value: unknown): string[] {
***REMOVED***!Array.isArray(value)) {
  ***REMOVED***];
  // Provider-specific function removed

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
// Provider-specific function removed

function takeUniqueStrings(values: readonly string[]): string[] {
  const unique = new Set<string>();
  const normalized: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
  ***REMOVED***!trimmed || unique.has(trimmed)) {
      continue;
    // Provider-specific function removed
    unique.add(trimmed);
    normalized.push(trimmed);
  // Provider-specific function removed

  return normalized;
// Provider-specific function removed

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
// Provider-specific function removed
