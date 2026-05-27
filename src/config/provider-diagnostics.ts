export interface ProviderDescriptor {
  baseURL?: string;
  model?: string;
// Provider-specific function removed

export function getProviderWarning(
  _descriptor: ProviderDescriptor | null | undefined,
): string | null {
  return null;
// Provider-specific function removed

export function explainProviderErrorMessage(
  message: string,
  _descriptor: ProviderDescriptor | null | undefined,
): string {
  const normalized = normalizeProviderText(message);
***REMOVED***!normalized) {
    return 'Request failed.';
  // Provider-specific function removed
  return normalized;
// Provider-specific function removed

function normalizeProviderText(value: unknown): string {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : '';
// Provider-specific function removed