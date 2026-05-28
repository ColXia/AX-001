export interface ProviderDescriptor {
  baseURL?: string;
  model?: string;
}

export function getProviderWarning(
  _descriptor: ProviderDescriptor | null | undefined,
): string | null {
  return null;
}

export function explainProviderErrorMessage(
  message: string,
  _descriptor: ProviderDescriptor | null | undefined,
): string {
  const normalized = normalizeProviderText(message);
  if (!normalized) {
    return 'Request failed.';
  }
  return normalized;
}

function normalizeProviderText(value: unknown): string {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : '';
}
