import { describe, expect, it, vi } from 'vitest';
import { loadAssetWithRetry } from '@/lib/visual-shock/utils/asset-loader';

describe('visual-shock asset loader', () => {
    it('should retry failed asset loading with exponential backoff', async () => {
        let attempt = 0;
        const result = await loadAssetWithRetry({
            assetId: 'retry-target',
            maxAttempts: 3,
            baseDelayMs: 0,
            loader: async () => {
                attempt += 1;
                if (attempt < 3) {
                    throw new Error(`attempt-${attempt}-failed`);
                }
                return 'ok';
            },
        });

        expect(result).toBe('ok');
        expect(attempt).toBe(3);
    });

    it('should switch to fallback loader after max attempts', async () => {
        const onAttemptError = vi.fn();
        const value = await loadAssetWithRetry({
            assetId: 'fallback-target',
            maxAttempts: 3,
            baseDelayMs: 0,
            loader: async () => {
                throw new Error('primary-failed');
            },
            fallbackLoader: async () => 'fallback-ok',
            onAttemptError,
        });

        expect(value).toBe('fallback-ok');
        expect(onAttemptError).toHaveBeenCalledTimes(3);
    });
});
