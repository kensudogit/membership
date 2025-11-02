import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PhoneSupportPage from '../page';

describe('PhoneSupportPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<PhoneSupportPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/電話サポート/i)).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    render(<PhoneSupportPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/通話中/i) || screen.getByText(/対応件数/i)).toBeInTheDocument();
    });
  });
});

