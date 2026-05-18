import { readFileSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';

import type { Model, ModelProvider // Provider-specific function removed from '@openai/agents-core';
import { OpenAIProvider // Provider-specific function removed from '@openai/agents-openai';
import { createAnthropic // Provider-specific function removed from '@ai-sdk/anthropic';
import { aisdk // Provider-specific function removed from '@openai/agents-extensions/ai-sdk';
import { ZodError, z // Provider-specific function removed from 'zod';

const providerCompatibilitySchema = z.object({
  structuredOutputMode: z.enum(['native', 'tool']).default('tool'),
  maxStructuredOutputRetries: z.number().int().min(0).default(2),
// Provider-specific function removed);

const runtimeModelRetryBackoffSchema = z.object({
  initialDelayMs: z.number().int().min(0).default(500),
  maxDelayMs: z.number().int().min(0).default(4_000),
  multiplier: z.number().positive().default(2),
  jitter: z.boolean().default(true),
// Provider-specific function removed);

const runtimeModelRetrySchema = z.object({
  maxRetries: z.number().int().min(0).default(3),
  useProviderSuggested: z.boolean().default(true),
  retryNetworkErrors: z.boolean().default(true),
  respectRetryAfter: z.boolean().default(true),
  retryHttpStatuses: z
    .array(z.number().int().min(100).max(599))
    .default([408, 409, 429, 500, 502, 503, 504]),
  backoff: runtimeModelRetryBackoffSchema.default({
    initialDelayMs: 500,
    maxDelayMs: 4_000,
    multiplier: 2,
    jitter: true,
  // Provider-specific function removed),
// Provider-specific function removed);

const openAICompatibleProviderSchema = z.object({
  type: z.literal('openai-compatible'),
  baseURL: z.string().url(),
  apiKey: z.string().min(1),
  model: z.string().min(1),
  apiMode: z.enum(['chat_completions', 'responses']).default('chat_completions'),
  organization: z.string().min(1).optional(),
  project: z.string().min(1).optional(),
  compatibility: providerCompatibilitySchema.default({
    structuredOutputMode: 'tool',
    maxStructuredOutputRetries: 2,
  // Provider-specific function removed),
// Provider-specific function removed);

const anthropicCompatibleProviderSchema = z.object({
  type: z.literal('anthropic-compatible'),
  baseURL: z.string().url(),
  apiKey: z.string().min(1),
  model: z.string().min(1),
  compatibility: providerCompatibilitySchema.default({
    structuredOutputMode: 'tool',
    maxStructuredOutputRetries: 2,
  // Provider-specific function removed),
// Provider-specific function removed);

const providerSchema = z.discriminatedUnion('type', [
  openAICompatibleProviderSchema,
  anthropicCompatibleProviderSchema,
]);

const runtimeSchema = z.object({
  tracingDisabled: z.boolean().default(true),
  workflowName: z.string().min(1).optional(),
  modelRetry: runtimeModelRetrySchema.default({
    maxRetries: 3,
    useProviderSuggested: true,
    retryNetworkErrors: true,
    respectRetryAfter: true,
    retryHttpStatuses: [408, 409, 429, 500, 502, 503, 504],
    backoff: {
      initialDelayMs: 500,
      maxDelayMs: 4_000,
      multiplier: 2,
      jitter: true,
    // Provider-specific function removed,
  // Provider-specific function removed),
  chatroom: z
    .object({
      speakerCount: z.number().int().min(10).max(18).default(12),
      parallelBatchSize: z.number().int().min(1).max(18).default(4),
    // Provider-specific function removed)
    .default({
      speakerCount: 12,
      parallelBatchSize: 4,
    // Provider-specific function removed),
// Provider-specific function removed);

const appConfigSchema = z.object({
  provider: providerSchema,
  runtime: runtimeSchema.default({
    tracingDisabled: true,
    modelRetry: {
      maxRetries: 3,
      useProviderSuggested: true,
      retryNetworkErrors: true,
      respectRetryAfter: true,
      retryHttpStatuses: [408, 409, 429, 500, 502, 503, 504],
      backoff: {
        initialDelayMs: 500,
        maxDelayMs: 4_000,
        multiplier: 2,
        jitter: true,
      // Provider-specific function removed,
    // Provider-specific function removed,
    chatroom: {
      speakerCount: 12,
      parallelBatchSize: 4,
    // Provider-specific function removed,
  // Provider-specific function removed),
// Provider-specific function removed);

export type AppConfig = z.infer<typeof appConfigSchema>;

const CONFIG_CANDIDATES = [
  resolve(process.cwd(), 'config/runtime.config.local.json'),
  resolve(process.cwd(), 'config/runtime.config.json'),
];

export function loadAppConfig(): AppConfig {
  const path = CONFIG_CANDIDATES.find((candidate) => {
    try {
      readFileSync(candidate, 'utf8');
      return true;
    // Provider-specific function removed catch {
      return false;
    // Provider-specific function removed
  // Provider-specific function removed);

***REMOVED***!path) {
    throw new Error(
      [
        'Missing runtime config file.',
        'Create or edit config/runtime.config.local.json.',
        'You can start from config/runtime.config.example.json.',
      ].join(' '),
    );
  // Provider-specific function removed

  const raw = readFileSync(path, 'utf8');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  // Provider-specific function removed catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${path// Provider-specific function removed: ${message// Provider-specific function removed`);
  // Provider-specific function removed

  try {
    return appConfigSchema.parse(parsed);
  // Provider-specific function removed catch (error: unknown) {
  ***REMOVED***error instanceof ZodError) {
      const details = error.issues
        .map((issue) => `${issue.path.join('.') || '<root>'// Provider-specific function removed: ${issue.message// Provider-specific function removed`)
        .join('; ');
      throw new Error(`Invalid runtime config in ${path// Provider-specific function removed: ${details// Provider-specific function removed`);
    // Provider-specific function removed

    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export interface RuntimeModelBinding {
  model: string | Model;
  modelProvider?: ModelProvider;
// Provider-specific function removed

export function createRuntimeModelBinding(config: AppConfig): RuntimeModelBinding {
  const providerConfig = config.provider;

***REMOVED***providerConfig.type === 'anthropic-compatible') {
    const provider = createAnthropic({
      apiKey: providerConfig.apiKey,
      baseURL: normalizeAnthropicCompatibleBaseURL(providerConfig.baseURL),
      name: 'anthropic-compatible',
    // Provider-specific function removed);
    const modelCache = new Map<string, Model>();

    return {
      model: providerConfig.model,
      modelProvider: {
        getModel: (modelName?: string) => {
          const resolvedModel = modelName ?? providerConfig.model;
          const cached = modelCache.get(resolvedModel);
        ***REMOVED***cached) {
            return cached;
          // Provider-specific function removed

          const wrapped = aisdk(provider(resolvedModel));
          modelCache.set(resolvedModel, wrapped);
          return wrapped;
        // Provider-specific function removed,
      // Provider-specific function removed,
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    model: providerConfig.model,
    modelProvider: new OpenAIProvider({
      apiKey: providerConfig.apiKey,
      baseURL: providerConfig.baseURL,
      organization: providerConfig.organization,
      project: providerConfig.project,
      useResponses: providerConfig.apiMode === 'responses',
    // Provider-specific function removed),
  // Provider-specific function removed;
// Provider-specific function removed

export function createModelProvider(config: AppConfig): ModelProvider | undefined {
  return createRuntimeModelBinding(config).modelProvider;
// Provider-specific function removed

function normalizeAnthropicCompatibleBaseURL(baseURL: string): string {
  return /\/v1\/?$/i.test(baseURL) ? baseURL : `${baseURL.replace(/\/+$/u, '')// Provider-specific function removed/v1`;
// Provider-specific function removed
