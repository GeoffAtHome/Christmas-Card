import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/xmas-main.ts';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  (globalThis as unknown as { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;
  document.body.innerHTML = '';
});

describe('xmas-main', () => {
  it('registers the component', () => {
    const element = document.createElement('xmas-main');
    document.body.appendChild(element);

    expect(customElements.get('xmas-main')).toBeTruthy();
    expect(element.tagName).toBe('XMAS-MAIN');
  });

  it('renders a shadow root', async () => {
    const element = document.createElement('xmas-main');
    document.body.appendChild(element);

    await Promise.resolve();
    expect(element.shadowRoot).not.toBeNull();
  });
});
