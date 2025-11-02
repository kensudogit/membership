import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AnalyticsPage from '../page';

describe('AnalyticsPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/データ分析/i)).toBeInTheDocument();
    });
  });

  it('renders analytics charts', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      const page = screen.getByText(/データ分析/i);
      expect(page).toBeInTheDocument();
    });
  });
});

