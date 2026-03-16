import path from 'path';
import fs from 'fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import { scheduleDeferredTask } from '@/lib/visual-shock/utils/defer';

const homePageClientPath = path.resolve(process.cwd(), 'src/components/HomePageClient.tsx');
const visualShockPath = path.resolve(process.cwd(), 'src/components/VisualShock.tsx');

async function loadNextConfigWithEnv(
    env: Partial<Record<'NEXT_PUBLIC_STATIC_EXPORT' | 'NEXT_PUBLIC_BASE_PATH', string>>,
) {
    const previousStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT;
    const previousBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
    vi.resetModules();
    if (typeof env.NEXT_PUBLIC_STATIC_EXPORT === 'string') {
        process.env.NEXT_PUBLIC_STATIC_EXPORT = env.NEXT_PUBLIC_STATIC_EXPORT;
    } else {
        delete process.env.NEXT_PUBLIC_STATIC_EXPORT;
    }
    if (typeof env.NEXT_PUBLIC_BASE_PATH === 'string') {
        process.env.NEXT_PUBLIC_BASE_PATH = env.NEXT_PUBLIC_BASE_PATH;
    } else {
        delete process.env.NEXT_PUBLIC_BASE_PATH;
    }

    const mod = await import('../../next.config');
    const config = mod.default as Record<string, unknown>;

    if (typeof previousStatic === 'string') {
        process.env.NEXT_PUBLIC_STATIC_EXPORT = previousStatic;
    } else {
        delete process.env.NEXT_PUBLIC_STATIC_EXPORT;
    }
    if (typeof previousBasePath === 'string') {
        process.env.NEXT_PUBLIC_BASE_PATH = previousBasePath;
    } else {
        delete process.env.NEXT_PUBLIC_BASE_PATH;
    }

    return config;
}

describe('visual-shock Deployment Compatibility', () => {
    beforeEach(() => {
        vi.useRealTimers();
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('should configure dual deployment modes in next.config.ts', async () => {
        const staticConfig = await loadNextConfigWithEnv({
            NEXT_PUBLIC_STATIC_EXPORT: 'true',
            NEXT_PUBLIC_BASE_PATH: 'My-Resume',
        });
        expect(staticConfig.output).toBe('export');
        expect(staticConfig.trailingSlash).toBe(true);
        expect(staticConfig.basePath).toBe('/My-Resume');
        expect(staticConfig.assetPrefix).toBe('/My-Resume/');
        const staticEnv = staticConfig.env as Record<string, string>;
        expect(staticEnv.NEXT_PUBLIC_DEPLOY_TARGET).toBe('static-export');

        const serverConfig = await loadNextConfigWithEnv({
            NEXT_PUBLIC_STATIC_EXPORT: 'false',
        });
        expect(serverConfig.output).toBe('standalone');
        expect(serverConfig.basePath).toBeUndefined();
        const serverEnv = serverConfig.env as Record<string, string>;
        expect(serverEnv.NEXT_PUBLIC_DEPLOY_TARGET).toBe('server');
    });

    it('Property 113: WebGL components should be configured for client-side only rendering', () => {
        const homePageClientSource = fs.readFileSync(homePageClientPath, 'utf8');
        const visualShockSource = fs.readFileSync(visualShockPath, 'utf8');

        expect(homePageClientSource).toMatch(/const VisualShock = dynamic\(/);
        expect(homePageClientSource).toMatch(/const VisualShock = dynamic\([\s\S]*ssr:\s*false[\s\S]*\)/);
        expect(visualShockSource).toMatch(/const HeroScene = dynamic\([\s\S]*ssr:\s*false[\s\S]*\)/);
    });

    it('Property 114: missing WebGL should render fallback experience', async () => {
        vi.doMock('@/hooks/useReducedMotion', () => ({
            useReducedMotion: () => false,
        }));
        vi.doMock('@/hooks/useLowPerformanceMode', () => ({
            useLowPerformanceMode: () => false,
        }));
        vi.doMock('@/lib/visual-shock', async () => {
            const actual = await vi.importActual<typeof import('@/lib/visual-shock')>('@/lib/visual-shock');
            return {
                ...actual,
                detectWebGLSupport: () => 'none',
            };
        });

        const { default: VisualShock } = await import('@/components/VisualShock');
        render(React.createElement(VisualShock));
        expect(screen.queryByTestId('webgl-fallback')).not.toBeNull();
    });

    it('Property 115: heavy 3D asset load should be deferred after initial render', () => {
        const homePageClientSource = fs.readFileSync(homePageClientPath, 'utf8');
        expect(homePageClientSource).toContain('scheduleDeferredTask');
        expect(homePageClientSource).toContain('setShouldMountVisualShock(true)');

        vi.useFakeTimers();
        fc.assert(
            fc.property(fc.integer({ min: 30, max: 1500 }), (delay) => {
                let called = false;
                const cancel = scheduleDeferredTask(() => {
                    called = true;
                }, delay);

                expect(called).toBe(false);
                vi.advanceTimersByTime(delay + 1);
                expect(called).toBe(true);
                cancel();
            }),
            { numRuns: 100 },
        );
        vi.useRealTimers();
    });
});
