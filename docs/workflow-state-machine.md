# Workflow State Machine

> Core implementation: `src/workflows/chatroom-discussion.ts`
> Runner: `src/room-runtime/room-runner.ts`
> Compatibility runner implementation: `src/workflows/chatroom-runner.ts`
> Workflow engine: `src/core/workflow.ts`

## Overview

The chatroom workflow is the execution engine that advances a room. It is **not** the room itself — it is a bounded operational pass (Execution Run) that reads room state, orchestrates agent turns, and produces state transitions.

The workflow is defined declaratively as a list of **steps**. Each execution run builds its step list from the room blueprint and runs them sequentially.

## Two Workflow Entry Points

### `runChatroomWorkflow` — New Room

Creates initial state from scratch, then executes the workflow.

```
Input → createInitialChatroomState() → workflowRuntime.execute(definition, initialState)
```

Initial state includes:
- System message (round 0)
- User seed message (round 0)
- Roleplay scene state (if `roleplay_scene` room type)

### `continueChatroomWorkflow` — Existing Room

Clones previous state, appends a human message (if provided), then executes the workflow from the next round.

```
PreviousState → clone → append human message → workflowRuntime.execute(definition, clonedState)
```

Guard: Interview rooms require a human message if waiting for candidate reply.

## Step Types

The workflow engine supports three step kinds:

| Kind | Source | Description |
|---|---|---|
| `agent` | `agentStep()` | Single agent turn |
| `parallel` | `parallelStep()` | Multiple agents execute concurrently, outputs merged |
| `custom` | Direct `WorkflowStep` object | Arbitrary async logic (governance, interview planning) |

## Workflow Step Sequence

### Standard Room (expert_discussion, brainstorm_workshop, roleplay_scene)

For each round `R` (1 to N):

```
┌─────────────────────────┐
│ Room Admin Step (R)     │  ← if governance.roomAdmin.enabled
│ kind: custom            │
│ Decides: phase,         │
│   directive, objective  │
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ Host Moderation Step (R)│  ← if governance.host.enabled
│ kind: custom            │
│ Decides: moderation     │
│   message, focus        │
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ Speaker Batch 1 (R)     │  ← parallelStep or agentStep
│ Agents speak in parallel│     depending on batch size
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ Speaker Batch 2 (R)     │  ← if more speakers than batchSize
│ ...                     │
└──────────┬──────────────┘
           │
           ... more batches
```

After all rounds:

```
┌─────────────────────────┐
│ Summary Step            │  ← if summaryEnabled
│ kind: agent             │
│ Produces: finalSummary  │
│ + recorder update       │
└─────────────────────────┘
```

### Interview Room (interview_simulation)

For each round `R` (1 to N):

```
┌─────────────────────────┐
│ Room Admin Step (R)     │  ← if enabled
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ Host Moderation Step (R)│  ← if enabled
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ Interview Round Step (R)│  ← kind: custom
│ Plans next interviewer  │     parallelBatchSize = 1
│ Only ONE interviewer    │     (sequential, not parallel)
│ speaks per round        │
└──────────┬──────────────┘
           │
           ... next round
```

After all rounds:

```
┌─────────────────────────┐
│ Summary Step            │  ← interview-specific summary
│ Produces: InterviewSummary│  with scorecard
└─────────────────────────┘
```

**Key difference:** Interview rooms run `parallelBatchSize = 1` — only one interviewer speaks per round, because the interview flow depends on the candidate's previous answer.

## Interview Turn Planning

The interview round step uses a two-phase planning process:

### Phase 1: Plan Next Turn

`planInterviewNextTurn()` decides what happens next:

```
┌───────────────────────┐
│ Run interview-turn-   │
│ planner agent         │
│ (structured output)   │
└──────────┬────────────┘
           │
     ┌─────▼──────┐
     │ Valid?     │
     └─┬──────┬───┘
    Yes       No
     │         │
     │    ┌────▼────────────┐
     │    │ Fallback plan:  │
     │    │ rule-based      │
     │    │ stage progression│
     │    └────┬────────────┘
     │         │
┌────▼─────────▼──────────┐
│ ResolvedInterviewTurnPlan│
│ kind: 'ask' | 'wait' |  │
│       'finish'           │
└──────────────────────────┘
```

### Interview Turn Plan Kinds

| Kind | Meaning | Action |
|---|---|---|
| `ask` | An interviewer should ask a question | Execute the interviewer's turn |
| `wait` | Waiting for candidate reply | Skip this round, no agent speaks |
| `finish` | Interview is complete | Skip to summary |

### Interview Stages (for `kind: 'ask'`)

```
opening → hr_followup → technical_deep_dive → observer_followup → manager_round → hr_wrap_up
```

| Stage | Description | Min Turns |
|---|---|---|
| `opening` | HR opens the interview, introduces the process | 1 |
| `hr_followup` | HR asks behavioral/situational questions | 2 |
| `technical_deep_dive` | Technical interviewer asks domain questions | 3 |
| `observer_followup` | Observer asks clarifying questions | 0 (conditional) |
| `manager_round` | Manager asks leadership/culture questions | 0 (conditional) |
| `hr_wrap_up` | HR closes the interview | 1 |

Stage transitions are governed by:
- Structured output from the `interview-turn-planner` agent
- Fallback rule-based progression when the planner fails
- Minimum turn counts per stage
- Interview summary signals (readiness, score, confidence)

### Phase 2: Execute Interviewer Turn

If the plan is `ask`:

1. Resolve which interviewer speaks (from `plan.speakerId`)
2. Check if a panel discussion or handoff is needed
3. Build the interviewer's prompt with stage guidance
4. Execute the agent turn
5. Append the interviewer's message to the room

## Governance Steps

### Room Admin Step

```
Input: room blueprint, round, transcript count, current phase
  ↓
Run chatroomRoomAdminProfile agent (structured output)
  ↓
If success → applyChatroomRoomAdminTurn()
  - Updates roomAdminState (phaseLabel, phaseObjective, directive)
  - May append a governance message to the room
If failure → buildChatroomRoomAdminFallback()
  - Rule-based fallback phase progression
```

The room admin decides:
- Current phase label and objective
- Whether to advance the phase
- Governance directives for the round

### Host Moderation Step

```
Input: room blueprint, round, transcript count, current phase
  ↓
Run chatroomHostModerationProfile agent (structured output)
  ↓
If success → applyChatroomHostModerationTurn()
  - Updates hostState
  - May append a moderation message to the room
If failure → buildChatroomHostFallback()
  - Rule-based fallback moderation
```

The host decides:
- Whether to moderate this round
- Focus areas and speaking instructions
- Whether to highlight or redirect the discussion

## Summary Step

```
Input: full transcript, room type, scenario template
  ↓
Run summary profile agent (structured output)
  ↓
Apply: normalizeScenarioSummaryOutput()
  - Sets state.finalSummary
  - Creates recorder update
  - May append a summary message to the room
```

Summary profiles vary by scenario:
- `expert_discussion` / `brainstorm_workshop` → `chatroomSummaryProfile`
- `roleplay_scene` → `roleplaySummaryProfile`
- `interview_simulation` → `interviewSummaryProfile`

## State Transitions

### ChatroomState Fields

```typescript
interface ChatroomState {
  roomType: ChatroomRoomTypeId;
  scenarioTemplateId?: string;
  roomBlueprint?: ChatroomRoomBlueprint;
  topic: string;
  objective: string;
  constraints: string[];
  speakerIds: string[];
  messages: ChatroomMessage[];
  roleplayScene?: RoleplaySceneState;
  customCharacters?: RoleplayCharacterCard[];
  customRoleplayTemplates?: Map<string, RoleplayCharacterTemplate>;
  finalSummary?: ChatroomFinalSummary;
  roomAdminState?: ChatroomRoomAdminState;
  hostState?: ChatroomHostState;
  recorderState?: ChatroomRecorderState;
  maxReplyCharacters?: number;
// Provider-specific function removed
```

### Message Roles

| Role | Source | Description |
|---|---|---|
| `system` | System | Initial room setup message |
| `user` | Human | Human participant message |
| `agent` | Agent | Speaker agent contribution |
| `summary` | Summary agent | Final summary message |

### State Mutation Flow

Each step mutates `ChatroomState` through `context.sharedState.mutate()`:

1. Step reads `stateBefore = context.sharedState.readSnapshot()`
2. Step executes agent or custom logic
3. Step calls `context.sharedState.mutate((state) => { ... // Provider-specific function removed)`
4. Mutations are versioned (optimistic concurrency)
5. After mutation, the workflow engine persists a checkpoint

## Checkpoint and Resume

The workflow engine supports checkpoint/resume:

1. **Checkpoint**: After each step, the engine saves `ChatroomState` to `FileWorkflowCheckpointStore`
2. **Failure**: If a step fails, the run status becomes `failed` and the checkpoint remains
3. **Resume**: A new execution run can resume from the latest checkpoint:
   - `resumedFromRunId` points to the failed run
   - The workflow replays from the failed step
   - State is restored from the checkpoint

See `docs/checkpoint-regression-playbook.md` for the full regression workflow.

## Parallel Execution

For standard rooms with many speakers:

1. Speakers are divided into batches of `parallelBatchSize` (default: 4)
2. Each batch runs as a `parallelStep` — all speakers in the batch execute concurrently
3. After all branches complete, the `merge` function appends outputs to the state
4. The next batch runs sequentially after the current batch completes

This keeps large rooms (10-18 speakers) practical while maintaining chatroom feel.
