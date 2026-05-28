# Configuration Reference

> Config loader: `src/config/app-config.ts`
> Template: `config/runtime.config.example.json`
> Local config: `config/runtime.config.local.json` (gitignored)

## Config File Resolution

The system searches for config files in this order:

1. `config/runtime.config.local.json` — local override (gitignored)
2. `config/runtime.config.json` — shared config

The first file found is used. If neither exists, the application throws an error.

All validation is done via Zod schemas. Invalid config produces a detailed error message with field paths.

## Top-Level Structure

```json
{
  "provider": { ... },
  "runtime": { ... }
}
```

## `provider` — Model Provider Settings

Configures the OpenAI-compatible API provider used by all agents.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `type` | `"openai-compatible"` | YES | — | Must be `"openai-compatible"` (only supported type) |
| `baseURL` | string (URL) | YES | — | API base URL, e.g. `"https://api.openai.com/v1"` |
| `apiKey` | string | YES | — | API key (min 1 character) |
| `model` | string | YES | — | Model identifier, e.g. `"gpt-4o"` |
| `apiMode` | `"chat_completions"` \| `"responses"` | NO | `"chat_completions"` | API mode to use |
| `organization` | string | NO | — | OpenAI organization ID |
| `project` | string | NO | — | OpenAI project ID |
| `compatibility` | object | NO | (see below) | Provider compatibility settings |

### Provider Compatibility Note

- Some OpenAI-compatible providers have limited support for structured outputs or self-built backend/automation workflows.
- If room creation fails with authorization errors, verify your API key supports the intended usage, or switch to a fully compatible provider.

### `provider.compatibility`

Controls how structured outputs are handled for providers with varying JSON support.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `structuredOutputMode` | `"native"` \| `"tool"` | NO | `"tool"` | How to submit structured outputs |
| `maxStructuredOutputRetries` | integer | NO | `2` | Max retries for structured output parsing |

**`structuredOutputMode` values:**

| Mode | Description |
|---|---|
| `"tool"` | Safer default. Submits structured outputs through tool calls, avoiding reliance on native JSON parsing. Recommended for most OpenAI-compatible providers. |
| `"native"` | Uses the provider's native structured output API. Only use if your provider fully supports it. |

**`apiMode` values:**

| Mode | Description |
|---|---|
| `"chat_completions"` | Standard Chat Completions API. Recommended for most providers. |
| `"responses"` | OpenAI Responses API. Only use if your provider actually supports it. |

## `runtime` — Runtime Settings

Controls workflow behavior, tracing, and chatroom defaults.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `tracingDisabled` | boolean | NO | `true` | Disable per-run tracing and SDK global tracing provider |
| `workflowName` | string | NO | — | Workflow name for tracing/observability |
| `modelRetry` | object | NO | (see below) | Model request retry configuration |
| `chatroom` | object | NO | (see below) | Chatroom-specific settings |

### `runtime.modelRetry`

Configures retry behavior for model API requests. Useful for providers that occasionally drop connections under load.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `maxRetries` | integer | NO | `3` | Maximum number of retry attempts |
| `useProviderSuggested` | boolean | NO | `true` | Respect provider-suggested retry delays (e.g., `Retry-After` header) |
| `retryNetworkErrors` | boolean | NO | `true` | Retry on network errors (connection drops, timeouts) |
| `respectRetryAfter` | boolean | NO | `true` | Honor `Retry-After` headers from 429/503 responses |
| `retryHttpStatuses` | integer[] | NO | `[408, 409, 429, 500, 502, 503, 504]` | HTTP status codes that trigger a retry |
| `backoff` | object | NO | (see below) | Exponential backoff configuration |

### `runtime.modelRetry.backoff`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `initialDelayMs` | integer | NO | `500` | Initial delay before first retry (ms) |
| `maxDelayMs` | integer | NO | `4000` | Maximum delay cap (ms) |
| `multiplier` | number | NO | `2` | Backoff multiplier (delay × multiplier each attempt) |
| `jitter` | boolean | NO | `true` | Add random jitter to prevent thundering herd |

**Backoff formula:** `delay = min(initialDelayMs × multiplier^attempt, maxDelayMs) ± jitter`

### `runtime.chatroom`

Chatroom-specific runtime configuration.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `speakerCount` | integer | NO | `12` | Default roster size for new `expert_discussion` rooms (range: 10–18) |
| `parallelBatchSize` | integer | NO | `4` | How many speaker agents execute in parallel per chat round (range: 1–18) |

**`speakerCount` notes:**
- The project ships an 18-agent expert roster
- Recommended range: 10–18 for `expert_discussion`
- `roleplay_scene` works best with 3–5 speakers
- Interview rooms auto-set `parallelBatchSize = 1`

**`parallelBatchSize` notes:**
- Default `4` balances concurrency with interactivity
- Higher values increase throughput but may reduce chatroom feel
- Value `1` means strictly sequential agent turns
- Interview rooms override this to `1` regardless of config

## Minimal Config Example

```json
{
  "provider": {
    "type": "openai-compatible",
    "baseURL": "https://api.openai.com/v1",
    "apiKey": "sk-...",
    "model": "gpt-4o"
  }
}
```

All `runtime` fields have defaults, so you only need to specify `provider`.

## Full Config Example

```json
{
  "provider": {
    "type": "openai-compatible",
    "baseURL": "https://your-provider.example.com/v1",
    "apiKey": "your_api_key",
    "model": "your-model-name",
    "apiMode": "chat_completions",
    "organization": "org-123",
    "project": "proj-456",
    "compatibility": {
      "structuredOutputMode": "tool",
      "maxStructuredOutputRetries": 2
    }
  },
  "runtime": {
    "tracingDisabled": true,
    "workflowName": "ax-001-analysis",
    "modelRetry": {
      "maxRetries": 3,
      "useProviderSuggested": true,
      "retryNetworkErrors": true,
      "respectRetryAfter": true,
      "retryHttpStatuses": [408, 409, 429, 500, 502, 503, 504],
      "backoff": {
        "initialDelayMs": 500,
        "maxDelayMs": 4000,
        "multiplier": 2,
        "jitter": true
      }
    },
    "chatroom": {
      "speakerCount": 12,
      "parallelBatchSize": 4
    }
  }
}
```

## Config Validation Errors

If the config file contains invalid values, the application exits with an error like:

```
Invalid runtime config in config/runtime.config.local.json:
provider.apiKey: Too small: expected string to have at least 1 character;
runtime.chatroom.speakerCount: Number must be less than or equal to 18
```

The Zod schema validates:
- `provider.apiKey` must be non-empty
- `provider.model` must be non-empty
- `provider.baseURL` must be a valid URL
- `runtime.chatroom.speakerCount` must be 10–18
- `runtime.chatroom.parallelBatchSize` must be 1–18
- `runtime.modelRetry.backoff.initialDelayMs` must be ≥ 0
- `runtime.modelRetry.retryHttpStatuses` values must be 100–599
