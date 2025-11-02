import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import WebEnrollmentPage from '../page';

describe('WebEnrollmentPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<WebEnrollmentPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Web入会/i)).toBeInTheDocument();
    });
  });

  it('renders progress steps', async () => {
    render(<WebEnrollmentPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/基本情報/i)).toBeInTheDocument();
    });
  });

  it('handles form navigation', async () => {
    render(<WebEnrollmentPage />);
    
    await waitFor(() => {
      const nextButton = screen.queryByText(/次へ/i);
      if (nextButton) {
        fireEvent.click(nextButton);
      }
    });
  });
});

