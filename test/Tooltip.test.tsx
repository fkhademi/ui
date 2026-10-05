import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from '../src/components/Tooltip';

// happy-dom does no layout, so a "truncated" element is one whose content
// width is set larger than its box.
function setWidths(el: HTMLElement, scrollWidth: number, clientWidth: number) {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth });
}

async function hover(el: HTMLElement) {
  fireEvent.mouseEnter(el);
  await act(async () => { vi.advanceTimersByTime(400); });
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('Tooltip', () => {
  test('opens on hover after the delay and closes on leave', async () => {
    render(<Tooltip content="Close"><button aria-label="Close drawer">✕</button></Tooltip>);
    const btn = screen.getByRole('button', { name: 'Close drawer' });
    await hover(btn);
    expect(screen.getByRole('tooltip').textContent).toBe('Close');
    fireEvent.mouseLeave(btn);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  test('whenTruncated: opens only when the text is cut off', async () => {
    render(
      <>
        <Tooltip content="A long account name" whenTruncated><span>cut</span></Tooltip>
        <Tooltip content="Short" whenTruncated><span>fits</span></Tooltip>
      </>,
    );
    const cut = screen.getByText('cut');
    const fits = screen.getByText('fits');
    setWidths(cut, 300, 120);
    setWidths(fits, 80, 120);

    await hover(fits);
    expect(screen.queryByRole('tooltip')).toBeNull();

    await hover(cut);
    expect(screen.getByRole('tooltip').textContent).toBe('A long account name');
  });

  test('disabled never opens', async () => {
    render(<Tooltip content="Accounts" disabled><a href="/a">Accounts</a></Tooltip>);
    await hover(screen.getByText('Accounts'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
