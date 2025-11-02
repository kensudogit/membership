import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SeminarsPage from '../page';

describe('SeminarsPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<SeminarsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('セミナー・シンポジウム運営管理')).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    render(<SeminarsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('開催予定')).toBeInTheDocument();
      expect(screen.getByText('総参加者数')).toBeInTheDocument();
      expect(screen.getByText('総定員数')).toBeInTheDocument();
      expect(screen.getByText('出席率')).toBeInTheDocument();
    });
  });

  it('renders new registration button', async () => {
    render(<SeminarsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });
  });

  it('opens new registration form when button is clicked', async () => {
    render(<SeminarsPage />);
    
    await waitFor(() => {
      const button = screen.getByText('新規登録');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('SEM001')).toBeInTheDocument();
    });
  });

  it('renders filter options', async () => {
    render(<SeminarsPage />);
    
    await waitFor(() => {
      const typeFilter = screen.getByDisplayValue('全ての種類');
      const statusFilter = screen.getByDisplayValue('全てのステータス');
      expect(typeFilter).toBeInTheDocument();
      expect(statusFilter).toBeInTheDocument();
    });
  });

  it('renders seminar table headers', async () => {
    render(<SeminarsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('コード')).toBeInTheDocument();
      expect(screen.getByText('タイトル')).toBeInTheDocument();
      expect(screen.getByText('種類')).toBeInTheDocument();
      expect(screen.getByText('場所')).toBeInTheDocument();
    });
  });
});

