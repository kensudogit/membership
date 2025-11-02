import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SalesPage from '../page';

describe('SalesPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<SalesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/販売管理/i)).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    render(<SalesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/売上/i) || screen.getByText(/在庫/i)).toBeInTheDocument();
    });
  });
});

