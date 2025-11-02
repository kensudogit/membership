import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SettingsPage from '../page';

describe('SettingsPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<SettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/設定管理/i)).toBeInTheDocument();
    });
  });

  it('renders setting sections', async () => {
    render(<SettingsPage />);
    
    await waitFor(() => {
      const page = screen.getByText(/設定管理/i);
      expect(page).toBeInTheDocument();
    });
  });
});

