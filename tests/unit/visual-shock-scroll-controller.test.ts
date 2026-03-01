import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollControllerSystem } from '@/lib/visual-shock/systems/ScrollController';
import type { GlobalState, SystemContext } from '@/lib/visual-shock/types';

class MockIntersectionObserver {
    static latest: MockIntersectionObserver | null = null;

    private readonly callback: IntersectionObserverCallback;

    private readonly observed = new Set<Element>();

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        MockIntersectionObserver.latest = this;
    }

    observe(target: Element): void {
        this.observed.add(target);
    }

    unobserve(target: Element): void {
        this.observed.delete(target);
    }

    disconnect(): void {
        this.observed.clear();
    }

    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }

    trigger(target: Element, isIntersecting: boolean): void {
        if (!this.observed.has(target)) return;
        this.callback(
            [
                {
                    target,
                    isIntersecting,
                    intersectionRatio: isIntersecting ? 1 : 0,
                } as IntersectionObserverEntry,
            ],
            this as unknown as IntersectionObserver,
        );
    }
}

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

function createContext(): SystemContext {
    return {
        getState: () => baseState,
        setState: () => undefined,
        emitEvent: () => undefined,
    };
}

function setScrollPosition(x: number, y: number): void {
    Object.defineProperty(window, 'scrollX', {
        value: x,
        writable: true,
        configurable: true,
    });
    Object.defineProperty(window, 'scrollY', {
        value: y,
        writable: true,
        configurable: true,
    });
}

describe('visual-shock ScrollController', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        MockIntersectionObserver.latest = null;
        Object.defineProperty(window, 'IntersectionObserver', {
            configurable: true,
            writable: true,
            value: MockIntersectionObserver,
        });
        setScrollPosition(0, 0);
        Object.defineProperty(document.documentElement, 'scrollHeight', {
            configurable: true,
            value: 4000,
        });
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            writable: true,
            value: 1000,
        });
    });

    it('should update parallax layers with easing and bidirectional movement', async () => {
        const controller = new ScrollControllerSystem();
        await controller.initialize(createContext());

        const layer = document.createElement('div');
        document.body.append(layer);
        controller.addParallaxLayer(layer, 0.1, 2, 'both');

        setScrollPosition(120, 240);
        window.dispatchEvent(new Event('scroll'));
        controller.update(1, baseState);

        expect(layer.style.transform).toContain('translate3d(');
        expect(layer.style.transform).toContain('-12.00px');
        expect(layer.style.transform).toContain('-24.00px');
    });

    it('should fire triggers and support reverse activation when scrolling up', async () => {
        const controller = new ScrollControllerSystem();
        await controller.initialize(createContext());

        let triggerCount = 0;
        controller.onScrollTrigger(200, () => {
            triggerCount += 1;
        });

        setScrollPosition(0, 240);
        window.dispatchEvent(new Event('scroll'));
        controller.update(1, baseState);
        expect(triggerCount).toBe(1);

        setScrollPosition(0, 80);
        window.dispatchEvent(new Event('scroll'));
        controller.update(1, baseState);

        setScrollPosition(0, 260);
        window.dispatchEvent(new Event('scroll'));
        controller.update(1, baseState);
        expect(triggerCount).toBe(2);
    });

    it('should wire reveal observer and stagger delay classes', async () => {
        const revealTarget = document.createElement('section');
        revealTarget.setAttribute('data-vs-reveal', '');
        revealTarget.dataset.vsRevealOrder = '2';
        document.body.append(revealTarget);

        const controller = new ScrollControllerSystem();
        await controller.initialize(createContext());

        expect(revealTarget.classList.contains('vs-reveal-base')).toBe(true);
        expect(revealTarget.style.transitionDelay).toBe('160ms');

        MockIntersectionObserver.latest?.trigger(revealTarget, true);
        expect(revealTarget.classList.contains('vs-reveal-visible')).toBe(true);

        MockIntersectionObserver.latest?.trigger(revealTarget, false);
        expect(revealTarget.classList.contains('vs-reveal-visible')).toBe(false);
    });

    it('should intercept wheel events when scroll-jacking is enabled', async () => {
        const scrollToSpy = vi.fn();
        Object.defineProperty(window, 'scrollTo', {
            configurable: true,
            writable: true,
            value: scrollToSpy,
        });
        const originalRaf = window.requestAnimationFrame;
        const originalCancelRaf = window.cancelAnimationFrame;
        Object.defineProperty(window, 'requestAnimationFrame', {
            configurable: true,
            writable: true,
            value: (callback: FrameRequestCallback) => {
                callback(16);
                return 1;
            },
        });
        Object.defineProperty(window, 'cancelAnimationFrame', {
            configurable: true,
            writable: true,
            value: () => undefined,
        });

        const controller = new ScrollControllerSystem();
        await controller.initialize(createContext());
        controller.enableScrollJacking(true);

        const wheelEvent = new WheelEvent('wheel', {
            deltaY: 120,
            deltaX: 0,
            cancelable: true,
        });
        window.dispatchEvent(wheelEvent);

        expect(wheelEvent.defaultPrevented).toBe(true);
        expect(scrollToSpy).toHaveBeenCalled();

        Object.defineProperty(window, 'requestAnimationFrame', {
            configurable: true,
            writable: true,
            value: originalRaf,
        });
        Object.defineProperty(window, 'cancelAnimationFrame', {
            configurable: true,
            writable: true,
            value: originalCancelRaf,
        });
    });
});
