import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LessonsPage from '../page';

describe('LessonsPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<LessonsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/レッスン予約/i)).toBeInTheDocument();
    });
  });

  it('renders search and filter inputs', async () => {
    render(<LessonsPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/検索/);
      expect(searchInput).toBeInTheDocument();
    });
  });
});

