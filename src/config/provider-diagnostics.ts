export interface ProviderDescriptor {
  baseURL?: string;
  model?: string;
// Provider-specific function removed

***REMOVED***
// Provider-specific patterns removed

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
// Provider-specific function removed

export function getProviderWarning(
***REMOVED***
): string | null {
***REMOVED***
***REMOVED***
  // Provider-specific function removed

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
return null;
// Provider-specific function removed

export function explainProviderErrorMessage(
  message: string,
***REMOVED***
): string {
  const normalized = normalizeProviderText(message);
***REMOVED***!normalized) {
    return 'Request failed.';
  // Provider-specific function removed

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
  return null;
  // Provider-specific function removed

  return normalized;
// Provider-specific function removed

function normalizeProviderText(value: unknown): string {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : '';
// Provider-specific function removed
