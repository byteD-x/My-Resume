import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectWebGLSupport } from '@/lib/visual-shock/utils/webgl';

describe('visual-shock WebGL detection', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return webgl2 when webgl2 context is available', () => {
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((contextId) => {
            if (contextId === 'webgl2') {
                return {} as RenderingContext;
            }
            return null;
        });

        expect(detectWebGLSupport()).toBe('webgl2');
    });

    it('should return none when no webgl context is available', () => {
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
        expect(detectWebGLSupport()).toBe('none');
    });
});
