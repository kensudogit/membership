import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MultiStorePage from '../page';

describe('MultiStorePage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<MultiStorePage />);
    
    await waitFor(() => {
      expect(screen.getByText('多店舗展開機能')).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    render(<MultiStorePage />);
    
    await waitFor(() => {
      expect(screen.getByText('総店舗数')).toBeInTheDocument();
      expect(screen.getByText('営業中')).toBeInTheDocument();
      expect(screen.getByText('総会員数')).toBeInTheDocument();
      expect(screen.getByText('総売上')).toBeInTheDocument();
    });
  });

  it('renders new registration button', async () => {
    render(<MultiStorePage />);
    
    await waitFor(() => {
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });
  });

  it('opens new registration form when button is clicked', async () => {
    render(<MultiStorePage />);
    
    await waitFor(() => {
      const button = screen.getByText('新規登録');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('STORE001')).toBeInTheDocument();
    });
  });

  it('renders store table headers', async () => {
    render(<MultiStorePage />);
    
    await waitFor(() => {
      expect(screen.getByText('店舗コード')).toBeInTheDocument();
      expect(screen.getByText('店舗名')).toBeInTheDocument();
      expect(screen.getByText('住所')).toBeInTheDocument();
    });
  });
});

