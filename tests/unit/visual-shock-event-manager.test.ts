import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { EventManager } from '@/lib/visual-shock/core/EventManager';

describe('visual-shock EventManager', () => {
    it('should deliver published event to subscribed handlers', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1, maxLength: 24 }),
                fc.string({ maxLength: 120 }),
                (eventType, payloadValue) => {
                    const manager = new EventManager();
                    let received = '';

                    manager.subscribe(eventType, (event) => {
                        received = String(event.payload);
                    });

                    manager.publish({
                        type: eventType,
                        source: 'test',
                        timestamp: Date.now(),
                        payload: payloadValue,
                    });

                    expect(received).toBe(payloadValue);
                },
            ),
            { numRuns: 100 },
        );
    });

    it('should stop delivering event after unsubscribe', () => {
        fc.assert(
            fc.property(fc.string({ minLength: 1, maxLength: 24 }), (eventType) => {
                const manager = new EventManager();
                let calledCount = 0;

                const unsubscribe = manager.subscribe(eventType, () => {
                    calledCount += 1;
                });

                unsubscribe();
                manager.publish({
                    type: eventType,
                    source: 'test',
                    timestamp: Date.now(),
                });

                expect(calledCount).toBe(0);
            }),
            { numRuns: 100 },
        );
    });
});
