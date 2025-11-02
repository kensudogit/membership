import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import LockersPage from '../page';

describe('LockersPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<LockersPage />);
    
    await waitFor(() => {
      expect(screen.getByText('契約ロッカー管理')).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    render(<LockersPage />);
    
    await waitFor(() => {
      expect(screen.getByText('契約中')).toBeInTheDocument();
      expect(screen.getByText('月額収益')).toBeInTheDocument();
      expect(screen.getByText('空きロッカー')).toBeInTheDocument();
    });
  });

  it('renders new registration button', async () => {
    render(<LockersPage />);
    
    await waitFor(() => {
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });
  });

  it('opens new registration form when button is clicked', async () => {
    render(<LockersPage />);
    
    await waitFor(() => {
      const button = screen.getByText('新規登録');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('L001')).toBeInTheDocument();
    });
  });

  it('renders filter options', async () => {
    render(<LockersPage />);
    
    await waitFor(() => {
      const filterSelect = screen.getByDisplayValue('全て');
      expect(filterSelect).toBeInTheDocument();
    });
  });

  it('filters lockers by status', async () => {
    render(<LockersPage />);
    
    await waitFor(() => {
      const filterSelect = screen.getByDisplayValue('全て');
      fireEvent.change(filterSelect, { target: { value: 'ACTIVE' } });
    });
  });
});

