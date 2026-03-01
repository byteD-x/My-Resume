import { beforeEach, describe, expect, it, vi } from 'vitest';
import fc from 'fast-check';
import { GestureControllerSystem } from '@/lib/visual-shock/systems/GestureController';
import { angleToEightDirection } from '@/lib/visual-shock/utils/gesture';
import type { GlobalState, SystemContext, SystemEvent } from '@/lib/visual-shock/types';

class MockRecognizer {
    constructor(options?: unknown) {
        void options;
    }

    recognizeWith(): void {
        return;
    }
}

class MockHammerManager {
    static latest: MockHammerManager | null = null;

    private handlers = new Map<string, Set<(event: HammerInput) => void>>();

    constructor(element: HTMLElement) {
        void element;
        MockHammerManager.latest = this;
    }

    add(): void {
        return;
    }

    on(events: string, handler: (event: HammerInput) => void): void {
        events.split(/\s+/).forEach((eventName) => {
            const set = this.handlers.get(eventName) ?? new Set<(event: HammerInput) => void>();
            set.add(handler);
            this.handlers.set(eventName, set);
        });
    }

    off(events: string, handler: (event: HammerInput) => void): void {
        events.split(/\s+/).forEach((eventName) => {
            const set = this.handlers.get(eventName);
            if (!set) return;
            set.delete(handler);
            if (set.size === 0) {
                this.handlers.delete(eventName);
            }
        });
    }

    destroy(): void {
        this.handlers.clear();
    }

    emit(eventName: string, event: Partial<HammerInput>): void {
        const handlers = this.handlers.get(eventName);
        if (!handlers) return;
        const payload = createHammerInput(event);
        handlers.forEach((handler) => handler(payload));
    }
}

const hammerMock = {
    Manager: MockHammerManager,
    Pan: MockRecognizer,
    Swipe: MockRecognizer,
    Pinch: MockRecognizer,
    Rotate: MockRecognizer,
    Press: MockRecognizer,
    DIRECTION_ALL: 30,
};

vi.mock('hammerjs', () => ({
    default: hammerMock,
    ...hammerMock,
}));

const baseState: GlobalState = {
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
};

function createContext(events: SystemEvent[] = []): SystemContext {
    return {
        getState: () => baseState,
        setState: () => undefined,
        emitEvent: (event) => {
            events.push(event);
        },
    };
}

function createHammerInput(partial: Partial<HammerInput>): HammerInput {
    return {
        angle: 0,
        center: { x: 0, y: 0 },
        deltaTime: 16,
        deltaX: 0,
        deltaY: 0,
        direction: 1,
        distance: 0,
        eventType: 4,
        isFinal: true,
        isFirst: true,
        maxPointers: 1,
        offsetDirection: 1,
        overallVelocity: 0,
        overallVelocityX: 0,
        overallVelocityY: 0,
        pointerType: 'touch',
        pointers: [],
        rotation: 0,
        scale: 1,
        srcEvent: new Event('mock'),
        target: document.body,
        timeStamp: Date.now(),
        type: 'mock',
        velocity: 0,
        velocityX: 0,
        velocityY: 0,
        ...partial,
    } as unknown as HammerInput;
}

function dispatchPointer(
    root: HTMLElement,
    type: 'pointerdown' | 'pointermove' | 'pointerup',
    pointerId: number,
    x: number,
    y: number,
    isPrimary: boolean,
): void {
    const event = new Event(type, { bubbles: true, cancelable: true }) as PointerEvent;
    Object.defineProperty(event, 'pointerId', { value: pointerId });
    Object.defineProperty(event, 'clientX', { value: x });
    Object.defineProperty(event, 'clientY', { value: y });
    Object.defineProperty(event, 'isPrimary', { value: isPrimary });
    root.dispatchEvent(event);
}

describe('visual-shock GestureController', () => {
    beforeEach(() => {
        MockHammerManager.latest = null;
    });

    it('should map all 8 swipe directions', () => {
        fc.assert(
            fc.property(
                fc.constantFrom(
                    { angle: 0, direction: 'right' },
                    { angle: 45, direction: 'down-right' },
                    { angle: 90, direction: 'down' },
                    { angle: 135, direction: 'down-left' },
                    { angle: 180, direction: 'left' },
                    { angle: 225, direction: 'up-left' },
                    { angle: 270, direction: 'up' },
                    { angle: 315, direction: 'up-right' },
                ),
                ({ angle, direction }) => {
                    expect(angleToEightDirection(angle)).toBe(direction);
                },
            ),
            { numRuns: 100 },
        );
    });

    it('should recognize swipe and emit visual feedback event', async () => {
        const emittedEvents: SystemEvent[] = [];
        const root = document.createElement('div');
        document.body.append(root);

        const controller = new GestureControllerSystem({
            getRootElement: () => root,
        });
        await controller.initialize(createContext(emittedEvents));

        const received: Array<{ direction: string; velocity: number }> = [];
        controller.onSwipe((direction, velocity) => {
            received.push({ direction, velocity });
        });

        MockHammerManager.latest?.emit('swipe', {
            angle: 0,
            deltaX: 120,
            deltaY: 8,
            velocityX: 1.1,
            velocityY: 0.1,
            center: { x: 240, y: 140 },
        });

        expect(received).toHaveLength(1);
        expect(received[0].direction).toBe('right');
        expect(received[0].velocity).toBeGreaterThan(0);
        expect(emittedEvents.some((event) => event.type === 'gesture-feedback')).toBe(true);
    });

    it('should recognize pinch, rotate and long-press', async () => {
        const root = document.createElement('div');
        document.body.append(root);
        const controller = new GestureControllerSystem({
            getRootElement: () => root,
        });
        await controller.initialize(createContext());

        let pinchScale = 0;
        let rotateAngle = 0;
        let longPressDuration = 0;
        controller.onPinch((scale) => {
            pinchScale = scale;
        });
        controller.onRotate((angle) => {
            rotateAngle = angle;
        });
        controller.onLongPress((_position, duration) => {
            longPressDuration = duration;
        });

        MockHammerManager.latest?.emit('pinchmove', {
            scale: 1.24,
            center: { x: 100, y: 120 },
        });
        MockHammerManager.latest?.emit('rotatemove', {
            rotation: 38,
            center: { x: 90, y: 110 },
        });
        MockHammerManager.latest?.emit('press', {
            center: { x: 120, y: 140 },
        });

        expect(pinchScale).toBeGreaterThan(1);
        expect(Math.abs(rotateAngle)).toBeGreaterThan(2);
        expect(longPressDuration).toBeGreaterThanOrEqual(200);
    });

    it('should filter accidental below-threshold swipe events', async () => {
        const root = document.createElement('div');
        document.body.append(root);
        const controller = new GestureControllerSystem({
            getRootElement: () => root,
        });
        await controller.initialize(createContext());

        let triggerCount = 0;
        controller.onSwipe(() => {
            triggerCount += 1;
        });

        MockHammerManager.latest?.emit('swipe', {
            angle: 90,
            deltaX: 4,
            deltaY: 6,
            velocityX: 0.02,
            velocityY: 0.01,
            center: { x: 40, y: 52 },
        });

        expect(triggerCount).toBe(0);
    });

    it('should cap active touches at 5 points', async () => {
        const root = document.createElement('div');
        document.body.append(root);
        const controller = new GestureControllerSystem({
            getRootElement: () => root,
        });
        await controller.initialize(createContext());

        for (let i = 1; i <= 6; i += 1) {
            dispatchPointer(root, 'pointerdown', i, i * 10, i * 10, i === 1);
        }

        expect(controller.getTouchCount()).toBe(5);
    });
});
