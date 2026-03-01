import { describe, expect, it } from 'vitest';
import { ShaderPipeline } from '@/lib/visual-shock/systems/ShaderPipeline';
import type { SystemContext } from '@/lib/visual-shock/types';

function createSystemContext(): SystemContext {
    return {
        getState: () => ({
            currentScene: 'hero',
            transitioning: false,
            theme: 'aurora',
            effectsEnabled: true,
            qualityLevel: 'high',
            cursorPosition: { x: 0, y: 0 },
            scrollPosition: 0,
            activeGestures: [],
            fps: 60,
            frameTime: 16.67,
            particleCount: 0,
            drawCalls: 0,
            audioEnabled: true,
            masterVolume: 0.8,
            preferences: {
                reducedMotion: false,
                theme: 'auto',
                audioEnabled: true,
                quality: 'auto',
            },
        }),
        setState: () => undefined,
        emitEvent: () => undefined,
    };
}

describe('visual-shock ShaderPipeline', () => {
    it('should parse uniforms from valid shader source', async () => {
        const pipeline = new ShaderPipeline();
        await pipeline.initialize(createSystemContext());

        const shader = await pipeline.loadShader(
            'uniform-test',
            `
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            attribute vec3 position;
            void main() {
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
            `
            uniform float uTime;
            void main() {
              gl_FragColor = vec4(vec3(uTime), 1.0);
            }`,
        );

        expect(shader.uniforms).toEqual(expect.arrayContaining(['projectionMatrix', 'modelViewMatrix', 'uTime']));
    });

    it('should return descriptive errors for invalid shader syntax', async () => {
        const pipeline = new ShaderPipeline();
        await pipeline.initialize(createSystemContext());

        const shader = await pipeline.loadShader(
            'invalid-shader',
            `
            uniform mat4 projectionMatrix;
            void main() {
              gl_Position = projectionMatrix * vec4(0.0);
            `,
            `
            void main() {
              gl_FragColor = vec4(1.0);
            }`,
        );

        expect(shader.compiled).toBe(false);
        expect(shader.errors.join(' ')).toContain('Brace mismatch');
    });
});
