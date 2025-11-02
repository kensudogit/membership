import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CardsPage from '../page';

describe('CardsPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<CardsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/会員証発行/i)).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    render(<CardsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/検索/);
      expect(searchInput).toBeInTheDocument();
    });
  });
});

