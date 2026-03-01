import type {
  EventHandler,
  IEventManager,
  SystemEvent,
  Unsubscribe,
} from "@/lib/visual-shock/types";

const WILDCARD_EVENT = "*";

function isPromiseLike<TValue = unknown>(
  value: unknown,
): value is PromiseLike<TValue> {
  return typeof value === "object" && value !== null && "then" in value;
}

export class EventManager implements IEventManager {
  private handlers = new Map<string, Set<EventHandler>>();

  private queue: SystemEvent[] = [];

  private flushing = false;

  subscribe(eventType: string, handler: EventHandler): Unsubscribe {
    const set = this.handlers.get(eventType) ?? new Set<EventHandler>();
    set.add(handler);
    this.handlers.set(eventType, set);

    return () => {
      const current = this.handlers.get(eventType);
      if (!current) return;
      current.delete(handler);
      if (current.size === 0) {
        this.handlers.delete(eventType);
      }
    };
  }

  publish(event: SystemEvent): void {
    this.queue.push(event);
    this.flushSync();
  }

  async publishAsync(event: SystemEvent): Promise<void> {
    this.queue.push(event);
    await this.flushAsync();
  }

  clear(eventType?: string): void {
    if (eventType) {
      this.handlers.delete(eventType);
      return;
    }

    this.handlers.clear();
    this.queue = [];
  }

  private resolveHandlers(eventType: string): EventHandler[] {
    const exactHandlers = this.handlers.get(eventType);
    const wildcardHandlers = this.handlers.get(WILDCARD_EVENT);
    const merged = new Set<EventHandler>();

    if (exactHandlers) {
      exactHandlers.forEach((handler) => merged.add(handler));
    }
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => merged.add(handler));
    }

    return Array.from(merged);
  }

  private flushSync(): void {
    if (this.flushing) return;
    this.flushing = true;

    try {
      while (this.queue.length > 0) {
        const event = this.queue.shift();
        if (!event) continue;

        const handlers = this.resolveHandlers(event.type);
        handlers.forEach((handler) => {
          try {
            const result = handler(event);
            if (isPromiseLike(result)) {
              void result.catch((error: unknown) => {
                console.error("[EventManager] async handler failed", error);
              });
            }
          } catch (error) {
            console.error("[EventManager] handler failed", error);
          }
        });
      }
    } finally {
      this.flushing = false;
    }
  }

  private async flushAsync(): Promise<void> {
    while (this.flushing) {
      await Promise.resolve();
    }

    this.flushing = true;

    try {
      while (this.queue.length > 0) {
        const event = this.queue.shift();
        if (!event) continue;

        const handlers = this.resolveHandlers(event.type);
        const calls = handlers.map(async (handler) => {
          try {
            await handler(event);
          } catch (error) {
            console.error("[EventManager] handler failed", error);
          }
        });

        await Promise.all(calls);
      }
    } finally {
      this.flushing = false;
    }
  }
}
