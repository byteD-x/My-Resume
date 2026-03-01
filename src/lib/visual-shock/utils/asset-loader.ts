export interface AssetRetryOptions<T> {
  assetId: string;
  loader: () => Promise<T>;
  fallbackLoader?: () => Promise<T>;
  maxAttempts?: number;
  baseDelayMs?: number;
  onAttemptError?: (error: unknown, attempt: number) => void;
  onFallback?: (error: unknown) => void;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export async function loadAssetWithRetry<T>({
  assetId,
  loader,
  fallbackLoader,
  maxAttempts = 3,
  baseDelayMs = 120,
  onAttemptError,
  onFallback,
}: AssetRetryOptions<T>): Promise<T> {
  let lastError: unknown = null;
  const attempts = Math.max(1, Math.round(maxAttempts));

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await loader();
    } catch (error) {
      lastError = error;
      onAttemptError?.(error, attempt);
      if (attempt < attempts) {
        const waitMs = Math.round(baseDelayMs * 2 ** (attempt - 1));
        await delay(waitMs);
      }
    }
  }

  if (fallbackLoader) {
    try {
      onFallback?.(lastError);
      return await fallbackLoader();
    } catch (error) {
      lastError = error;
      onAttemptError?.(error, attempts + 1);
    }
  }

  throw new Error(
    `[visual-shock] asset "${assetId}" failed after ${attempts} attempt(s): ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}
