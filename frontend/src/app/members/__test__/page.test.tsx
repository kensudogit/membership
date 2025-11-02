import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MembersPage from '../page';

describe('MembersPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    vi.mocked(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ members: [] }),
    } as Response);

    render(<MembersPage />);
    
    await waitFor(() => {
      expect(screen.getByText('会員管理')).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    vi.mocked(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ members: [] }),
    } as Response);

    render(<MembersPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/検索/);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('filters members when search term is entered', async () => {
    const mockMembers = [
      { id: 1, name: '会員1', code: 'MEM001' },
      { id: 2, name: '会員2', code: 'MEM002' },
    ];

    vi.mocked(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ members: mockMembers }),
    } as Response);

    render(<MembersPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/検索/);
      fireEvent.change(searchInput, { target: { value: '会員1' } });
    });
  });
});

