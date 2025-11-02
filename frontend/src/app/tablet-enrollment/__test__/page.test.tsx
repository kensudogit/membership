import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TabletEnrollmentPage from '../page';

describe('TabletEnrollmentPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<TabletEnrollmentPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/タブレット入会/i)).toBeInTheDocument();
    });
  });

  it('renders member search', async () => {
    render(<TabletEnrollmentPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/検索/i);
      expect(searchInput).toBeInTheDocument();
    });
  });
});

