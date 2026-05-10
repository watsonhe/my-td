type Listener = (...args: any[]) => void;

class EventBusImpl {
  private listeners = new Map<string, Listener[]>();

  on(event: string, fn: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(fn);
  }

  off(event: string, fn: Listener): void {
    const list = this.listeners.get(event);
    if (!list) return;
    const idx = list.indexOf(fn);
    if (idx !== -1) list.splice(idx, 1);
  }

  emit(event: string, ...args: any[]): void {
    const list = this.listeners.get(event);
    if (!list) return;
    for (const fn of list) {
      fn(...args);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const EventBus = new EventBusImpl();
