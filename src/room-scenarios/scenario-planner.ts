import type {
  ChatroomRoomBlueprint,
  RoomBlueprintGovernancePatch,
  RoomBlueprintRuntimeConfig,
// Provider-specific function removed from './room-blueprints.js';
import {
  createChatroomRoomBlueprint,
  resolveDefaultScenarioMaxReplyCharacters,
// Provider-specific function removed from './room-blueprints.js';
import {
  resolveInterviewScoreTemplate,
// Provider-specific function removed from '../workflows/interview-score-templates.js';
import type { RoomScenarioTemplateId // Provider-specific function removed from './scenario-templates.js';
import {
  TAVERN_ROLEPLAY_DEMO_CHARACTERS,
  type RoleplayCharacterCard,
// Provider-specific function removed from './roleplay/roleplay-characters.js';

const interviewSpeakerIds = [
  'interview-hr',
  'interview-technical',
  'interview-manager',
  'interview-observer',
] as const;

const projectDiscussionSpeakerIds = [
  'moderator-chat',
  'product-chat',
  'systems-chat',
  'implementation-chat',
  'research-chat',
  'skeptic-chat',
] as const;

const reportSeminarSpeakerIds = [
  'risk-chat',
  'research-chat',
  'systems-chat',
  'moderator-chat',
] as const;

export interface RoomScenarioPlanningBaseInput {
  scenarioTemplateId: RoomScenarioTemplateId;
  title?: string;
  topic?: string;
  objective?: string;
  constraints?: string[];
  runtimeConfig?: Partial<RoomBlueprintRuntimeConfig>;
  governance?: RoomBlueprintGovernancePatch;
  metadata?: Record<string, unknown>;
// Provider-specific function removed

export interface InterviewSimulationScenarioInput
  extends RoomScenarioPlanningBaseInput {
  scenarioTemplateId: 'interview_simulation';
  interview?: {
    candidateName?: string;
    targetRole?: string;
    candidateBackground?: string;
    targetLevel?: string;
    companyStyle?: string;
    focusAreas?: string[];
    scoreTemplateId?: string;
    scoreDimensions?: string[];
  // Provider-specific function removed;
// Provider-specific function removed

export interface FreeInterviewScenarioInput extends RoomScenarioPlanningBaseInput {
  scenarioTemplateId: 'free_interview';
  interview?: {
    candidateName?: string;
    targetRole?: string;
    candidateBackground?: string;
  // Provider-specific function removed;
// Provider-specific function removed

export interface ProjectDevelopmentDiscussionScenarioInput
  extends RoomScenarioPlanningBaseInput {
  scenarioTemplateId: 'project_development_discussion';
  project?: {
    projectName?: string;
    projectStage?: 'discovery' | 'planning' | 'implementation' | 'review';
    teamContext?: string;
    decisionFocus?: string[];
  // Provider-specific function removed;
// Provider-specific function removed

export interface ReportSeminarScenarioInput extends RoomScenarioPlanningBaseInput {
  scenarioTemplateId: 'report_seminar';
  report?: {
    reportKind?: string;
    presenterName?: string;
    domain?: string;
    reviewFocus?: string[];
  // Provider-specific function removed;
// Provider-specific function removed

export interface MurderMysteryScenarioInput extends RoomScenarioPlanningBaseInput {
  scenarioTemplateId: 'murder_mystery';
  mystery?: {
    caseTitle?: string;
    setting?: string;
    victimProfile?: string;
    focusAreas?: string[];
  // Provider-specific function removed;
  customCharacters?: RoleplayCharacterCard[];
// Provider-specific function removed

export interface TavernRoleplayDemoScenarioInput extends RoomScenarioPlanningBaseInput {
  scenarioTemplateId: 'tavern_roleplay_demo';
  tavern?: {
    tavernName?: string;
    setting?: string;
    openingSituation?: string;
    atmosphere?: string;
  // Provider-specific function removed;
  customCharacters?: RoleplayCharacterCard[];
// Provider-specific function removed

export interface DirectScenarioBlueprintInput extends RoomScenarioPlanningBaseInput {
  scenarioTemplateId: 'expert_discussion' | 'brainstorm_workshop' | 'roleplay_scene';
  topic: string;
  objective: string;
  customCharacters?: RoleplayCharacterCard[];
  speakerIds?: string[];
// Provider-specific function removed

export type RoomScenarioPlanningInput =
  | DirectScenarioBlueprintInput
  | InterviewSimulationScenarioInput
  | FreeInterviewScenarioInput
  | ProjectDevelopmentDiscussionScenarioInput
  | ReportSeminarScenarioInput
  | MurderMysteryScenarioInput
  | TavernRoleplayDemoScenarioInput;

export interface PlannedRoomScenario {
  blueprint: ChatroomRoomBlueprint;
  notes: string[];
// Provider-specific function removed

export function planChatroomRoomScenario(
  input: RoomScenarioPlanningInput,
): PlannedRoomScenario {
  switch (input.scenarioTemplateId) {
    case 'interview_simulation':
      return planInterviewSimulationScenario(input);
    case 'free_interview':
      return planFreeInterviewScenario(input);
    case 'project_development_discussion':
      return planProjectDevelopmentScenario(input);
    case 'report_seminar':
      return planReportSeminarScenario(input);
    case 'murder_mystery':
      return planMurderMysteryScenario(input);
    case 'tavern_roleplay_demo':
      return planTavernRoleplayDemoScenario(input);
    case 'expert_discussion':
    case 'brainstorm_workshop':
    case 'roleplay_scene':
      return {
        blueprint: createChatroomRoomBlueprint({
          scenarioTemplateId: input.scenarioTemplateId,
          title: input.title,
          topic: input.topic,
          objective: input.objective,
          constraints: input.constraints,
          speakerIds: input.speakerIds,
          customCharacters: input.customCharacters,
          runtimeConfig: input.runtimeConfig,
          governance: input.governance,
          metadata: input.metadata,
        // Provider-specific function removed),
        notes: [],
      // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

export function recommendRoomScenarioTemplate(input: {
  goal: string;
  preferredCategory?: 'analysis' | 'roleplay';
// Provider-specific function removed): RoomScenarioTemplateId {
  const text = input.goal.trim().toLowerCase();

  const score = (keywords: readonly string[]) =>
    keywords.reduce((total, keyword) => (text.includes(keyword) ? total + 1 : total), 0);

  const scores = [
    {
      templateId: 'interview_simulation' as const,
      score: score(['interview', '面试', '求职', 'candidate', 'hr', 'technical round']),
    // Provider-specific function removed,
    {
      templateId: 'project_development_discussion' as const,
      score: score(['project', '开发', '架构', 'implementation', 'delivery', 'roadmap']),
    // Provider-specific function removed,
    {
      templateId: 'report_seminar' as const,
      score: score(['report', 'seminar', '论文', '汇报', 'review draft', 'presentation']),
    // Provider-specific function removed,
    {
      templateId: 'murder_mystery' as const,
      score: score(['murder', 'mystery', '剧本杀', 'suspect', 'clue', 'deduction']),
    // Provider-specific function removed,
    {
      templateId: 'tavern_roleplay_demo' as const,
      score: score(['tavern', 'inn', '酒馆', '旅店', 'adventurer', '冒险者']),
    // Provider-specific function removed,
    {
      templateId: 'roleplay_scene' as const,
      score: score(['roleplay', 'rp', '角色扮演', 'scene', '剧情']),
    // Provider-specific function removed,
    {
      templateId: 'brainstorm_workshop' as const,
      score: score(['brainstorm', 'idea', '创意', 'workshop', '发散']),
    // Provider-specific function removed,
    {
      templateId: 'expert_discussion' as const,
      score: score(['analysis', 'discuss', '讨论', '研讨', 'review']),
    // Provider-specific function removed,
  ];

***REMOVED***input.preferredCategory === 'roleplay') {
    const mysteryScore = scores.find((item) => item.templateId === 'murder_mystery')?.score ?? 0;
    const tavernScore = scores.find((item) => item.templateId === 'tavern_roleplay_demo')?.score ?? 0;
    const roleplayScore = scores.find((item) => item.templateId === 'roleplay_scene')?.score ?? 0;
  ***REMOVED***tavernScore > mysteryScore && tavernScore > roleplayScore) {
      return 'tavern_roleplay_demo';
    // Provider-specific function removed
    return mysteryScore > roleplayScore ? 'murder_mystery' : 'roleplay_scene';
  // Provider-specific function removed

  const best = [...scores].sort((left, right) => right.score - left.score)[0];
  return best && best.score > 0 ? best.templateId : 'expert_discussion';
// Provider-specific function removed

function planInterviewSimulationScenario(
  input: InterviewSimulationScenarioInput,
): PlannedRoomScenario {
  const interview = input.interview ?? {// Provider-specific function removed;
  const scoring = resolveInterviewScoreTemplate({
    targetRole: interview.targetRole,
    focusAreas: interview.focusAreas,
    constraints: input.constraints,
    scoreTemplateId: interview.scoreTemplateId,
    scoreDimensions: interview.scoreDimensions,
  // Provider-specific function removed);
  const title =
    input.title ??
    compactLineParts([
      interview.targetRole,
      interview.targetLevel,
      'Interview Simulation',
    ]) ??
    'Interview Simulation';
  const topic =
    input.topic ??
    compactLineParts([
      interview.targetLevel,
      interview.targetRole,
      'Mock Interview',
    ]) ??
    'Mock Interview';
  const objective =
    input.objective ??
    compactLineParts([
      `Run a realistic interview simulation for ${interview.candidateName ?? 'the candidate'// Provider-specific function removed.`,
      interview.candidateBackground,
      interview.companyStyle ? `Use a ${interview.companyStyle// Provider-specific function removed interview style.` : undefined,
      interview.focusAreas && interview.focusAreas.length > 0
        ? `Focus on ${interview.focusAreas.join(', ')// Provider-specific function removed.`
        : undefined,
    ]) ??
    'Run a realistic interview simulation and end with actionable feedback.';

  const constraints = [
    ...(input.constraints ?? []),
    ...(interview.focusAreas && interview.focusAreas.length > 0
      ? [`Focus areas: ${interview.focusAreas.join(', ')// Provider-specific function removed`]
      : []),
  ];

  return {
    blueprint: createChatroomRoomBlueprint({
      scenarioTemplateId: input.scenarioTemplateId,
      title,
      topic,
      objective,
      constraints,
      speakerIds: [...interviewSpeakerIds],
      runtimeConfig: {
        summaryEnabled: true,
        maxReplyCharacters: resolveDefaultScenarioMaxReplyCharacters(input.scenarioTemplateId),
        ...input.runtimeConfig,
      // Provider-specific function removed,
      governance: input.governance,
      metadata: {
        ...(input.metadata ?? {// Provider-specific function removed),
        scenario: {
          kind: 'interview_simulation',
          ...interview,
          scoreTemplateId: scoring.templateId,
          scoreDimensions: scoring.dimensions,
        // Provider-specific function removed,
      // Provider-specific function removed,
    // Provider-specific function removed),
    notes: [
      'This scenario now runs in an interview-specific turn-taking mode: one panel role advances at a time and waits for the candidate response before the next stage.',
      `Interview scoring template: ${scoring.templateLabel// Provider-specific function removed (${scoring.templateId// Provider-specific function removed)`,
    ],
  // Provider-specific function removed;
// Provider-specific function removed

function planFreeInterviewScenario(
  input: FreeInterviewScenarioInput,
): PlannedRoomScenario {
  const interview = input.interview ?? {// Provider-specific function removed;
  const title =
    input.title ??
    compactLineParts([interview.targetRole, 'Free Interview']) ??
    'Free Interview';
  const topic =
    input.topic ??
    compactLineParts([interview.targetRole, 'Dynamic Interview']) ??
    'Dynamic Interview';
  const objective =
    input.objective ??
    compactLineParts([
      `Run a flexible interview for ${interview.candidateName ?? 'the candidate'// Provider-specific function removed.`,
      'The moderator will dynamically create interviewers based on candidate background.',
    ]) ??
    'Run a flexible interview with dynamically created interviewers.';

  return {
    blueprint: createChatroomRoomBlueprint({
      scenarioTemplateId: input.scenarioTemplateId,
      title,
      topic,
      objective,
      constraints: input.constraints,
      speakerIds: ['interview-moderator'],
      runtimeConfig: {
        summaryEnabled: true,
        maxReplyCharacters: resolveDefaultScenarioMaxReplyCharacters(input.scenarioTemplateId),
        ...input.runtimeConfig,
      // Provider-specific function removed,
      governance: input.governance,
      metadata: {
        ...(input.metadata ?? {// Provider-specific function removed),
        scenario: {
          kind: 'free_interview',
          ...interview,
        // Provider-specific function removed,
      // Provider-specific function removed,
    // Provider-specific function removed),
    notes: [
      'This scenario uses a moderator-driven interview flow.',
      'The moderator will greet the candidate, collect background info, and dynamically create specialized interviewers.',
    ],
  // Provider-specific function removed;
// Provider-specific function removed

function planProjectDevelopmentScenario(
  input: ProjectDevelopmentDiscussionScenarioInput,
): PlannedRoomScenario {
  const project = input.project ?? {// Provider-specific function removed;
  const title =
    input.title ??
    compactLineParts([
      project.projectName,
      'Project Development Discussion',
    ]) ??
    'Project Development Discussion';
  const topic =
    input.topic ??
    compactLineParts([
      project.projectName,
      project.projectStage,
      'Project Review',
    ]) ??
    'Project Review';
  const objective =
    input.objective ??
    compactLineParts([
      `Review the project from multiple roles and produce concrete next steps.`,
      project.teamContext,
      project.decisionFocus && project.decisionFocus.length > 0
        ? `Prioritize decisions around ${project.decisionFocus.join(', ')// Provider-specific function removed.`
        : undefined,
    ]) ??
    'Review the project and drive toward clear decisions, risks, and delivery steps.';

  const constraints = [
    ...(input.constraints ?? []),
    ...(project.projectStage ? [`Project stage: ${project.projectStage// Provider-specific function removed`] : []),
    ...(project.decisionFocus && project.decisionFocus.length > 0
      ? [`Decision focus: ${project.decisionFocus.join(', ')// Provider-specific function removed`]
      : []),
  ];

  return {
    blueprint: createChatroomRoomBlueprint({
      scenarioTemplateId: input.scenarioTemplateId,
      title,
      topic,
      objective,
      constraints,
      speakerIds: [...projectDiscussionSpeakerIds],
      runtimeConfig: {
        summaryEnabled: true,
        maxReplyCharacters: resolveDefaultScenarioMaxReplyCharacters(input.scenarioTemplateId),
        ...input.runtimeConfig,
      // Provider-specific function removed,
      governance: input.governance,
      metadata: {
        ...(input.metadata ?? {// Provider-specific function removed),
        scenario: {
          kind: 'project_development_discussion',
          ...project,
        // Provider-specific function removed,
      // Provider-specific function removed,
    // Provider-specific function removed),
    notes: [],
  // Provider-specific function removed;
// Provider-specific function removed

function planReportSeminarScenario(
  input: ReportSeminarScenarioInput,
): PlannedRoomScenario {
  const report = input.report ?? {// Provider-specific function removed;
  const title =
    input.title ??
    compactLineParts([
      report.reportKind,
      report.domain,
      'Report Seminar',
    ]) ??
    'Report Seminar';
  const topic =
    input.topic ??
    compactLineParts([
      report.reportKind,
      report.domain,
      'Report Review',
    ]) ??
    'Report Review';
  const objective =
    input.objective ??
    compactLineParts([
      `Run a seminar-style critique for ${report.presenterName ?? 'the presenter'// Provider-specific function removed.`,
      report.reviewFocus && report.reviewFocus.length > 0
        ? `Focus on ${report.reviewFocus.join(', ')// Provider-specific function removed.`
        : undefined,
    ]) ??
    'Review the report and surface findings, objections, and revision guidance.';

  const constraints = [
    ...(input.constraints ?? []),
    ...(report.reviewFocus && report.reviewFocus.length > 0
      ? [`Review focus: ${report.reviewFocus.join(', ')// Provider-specific function removed`]
      : []),
  ];

  return {
    blueprint: createChatroomRoomBlueprint({
      scenarioTemplateId: input.scenarioTemplateId,
      title,
      topic,
      objective,
      constraints,
      speakerIds: [...reportSeminarSpeakerIds],
      runtimeConfig: {
        summaryEnabled: true,
        maxReplyCharacters: resolveDefaultScenarioMaxReplyCharacters(input.scenarioTemplateId),
        ...input.runtimeConfig,
      // Provider-specific function removed,
      governance: input.governance,
      metadata: {
        ...(input.metadata ?? {// Provider-specific function removed),
        scenario: {
          kind: 'report_seminar',
          ...report,
        // Provider-specific function removed,
      // Provider-specific function removed,
    // Provider-specific function removed),
    notes: [],
  // Provider-specific function removed;
// Provider-specific function removed

function planMurderMysteryScenario(
  input: MurderMysteryScenarioInput,
): PlannedRoomScenario {
  const mystery = input.mystery ?? {// Provider-specific function removed;
  const customCharacters = input.customCharacters;
  const title =
    input.title ??
    mystery.caseTitle ??
    'Murder Mystery';
  const topic =
    input.topic ??
    compactLineParts([
      mystery.caseTitle,
      mystery.setting,
      'Mystery Investigation',
    ]) ??
    'Mystery Investigation';
  const objective =
    input.objective ??
    compactLineParts([
      'Run a deduction-focused roleplay room where the user investigates the case.',
      mystery.victimProfile ? `Victim: ${mystery.victimProfile// Provider-specific function removed.` : undefined,
      mystery.focusAreas && mystery.focusAreas.length > 0
        ? `Emphasize ${mystery.focusAreas.join(', ')// Provider-specific function removed.`
        : undefined,
    ]) ??
    'Investigate the mystery, question the cast, and uncover the most credible explanation.';

  const constraints = [
    ...(input.constraints ?? []),
    ...(mystery.setting ? [`Setting: ${mystery.setting// Provider-specific function removed`] : []),
    ...(mystery.focusAreas && mystery.focusAreas.length > 0
      ? [`Focus areas: ${mystery.focusAreas.join(', ')// Provider-specific function removed`]
      : []),
  ];

  return {
    blueprint: createChatroomRoomBlueprint({
      scenarioTemplateId: input.scenarioTemplateId,
      title,
      topic,
      objective,
      constraints,
      customCharacters,
      runtimeConfig: {
        summaryEnabled: true,
        maxReplyCharacters: resolveDefaultScenarioMaxReplyCharacters(input.scenarioTemplateId),
        ...input.runtimeConfig,
      // Provider-specific function removed,
      governance: input.governance,
      metadata: {
        ...(input.metadata ?? {// Provider-specific function removed),
        scenario: {
          kind: 'murder_mystery',
          phaseModel: ['case setup', 'clue collision', 'deduction wrap-up'],
          runtimeNote:
            'Uses the roleplay room runtime with proactive room-admin event injection for clue and phase control.',
          ...mystery,
        // Provider-specific function removed,
      // Provider-specific function removed,
    // Provider-specific function removed),
    notes: [
      'This scenario uses the roleplay runtime with game-master governance for clue injection, phase shifts, and cast changes.',
    ],
  // Provider-specific function removed;
// Provider-specific function removed

function planTavernRoleplayDemoScenario(
  input: TavernRoleplayDemoScenarioInput,
): PlannedRoomScenario {
  const tavern = input.tavern ?? {// Provider-specific function removed;
  const tavernName = tavern.tavernName ?? 'The Rusty Lantern';
  const setting =
    tavern.setting ??
    'A rain-soaked roadside tavern at the edge of an old trade road.';
  const openingSituation =
    tavern.openingSituation ??
    'The human player enters as a traveler just as a rumor, a missing caravan, and an unpaid debt collide in the common room.';
  const customCharacters =
    input.customCharacters && input.customCharacters.length > 0
      ? input.customCharacters
      : TAVERN_ROLEPLAY_DEMO_CHARACTERS;

  return {
    blueprint: createChatroomRoomBlueprint({
      scenarioTemplateId: input.scenarioTemplateId,
      title: input.title ?? `${tavernName// Provider-specific function removed Tavern Demo`,
      topic: input.topic ?? tavernName,
      objective:
        input.objective ??
        [
          'Run a live tavern roleplay sub-room where each NPC is an independent agent with its own role memory.',
          openingSituation,
          'Let the user talk naturally, ask questions, make choices, or start trouble; agents should react in character rather than follow a fixed script.',
        ].join(' '),
      constraints: [
        ...(input.constraints ?? []),
        `Setting: ${setting// Provider-specific function removed`,
        `Opening situation: ${openingSituation// Provider-specific function removed`,
        `Atmosphere: ${tavern.atmosphere ?? 'warm, suspicious, rain outside, secrets near the hearth'// Provider-specific function removed`,
        'Role memory rule: keep each character thread stable by characterId; do not merge NPC memories.',
      ],
      customCharacters,
      runtimeConfig: {
        summaryEnabled: true,
        maxReplyCharacters: resolveDefaultScenarioMaxReplyCharacters(input.scenarioTemplateId),
        ...input.runtimeConfig,
      // Provider-specific function removed,
      governance: input.governance,
      metadata: {
        ...(input.metadata ?? {// Provider-specific function removed),
        scenario: {
          kind: 'tavern_roleplay_demo',
          parentRuntime: 'roleplay_scene',
          tavernName,
          setting,
          openingSituation,
          atmosphere: tavern.atmosphere,
          roleMemory: 'character_thread',
        // Provider-specific function removed,
      // Provider-specific function removed,
    // Provider-specific function removed),
    notes: [
      'Tavern demo runs on the roleplay room runtime with stable role-card speaker ids.',
      'Each NPC is an independent agent participant; local room agent-thread memory belongs to the role card, not to the provider model instance.',
    ],
  // Provider-specific function removed;
// Provider-specific function removed

function compactLineParts(parts: Array<string | undefined>): string | undefined {
  const normalized = parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
  return normalized.length > 0 ? normalized.join(' ') : undefined;
// Provider-specific function removed
