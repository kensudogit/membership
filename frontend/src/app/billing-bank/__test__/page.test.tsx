import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BillingBankPage from '../page';

describe('BillingBankPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<BillingBankPage />);
    
    await waitFor(() => {
      expect(screen.getByText('会費請求(口座振替)')).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    render(<BillingBankPage />);
    
    await waitFor(() => {
      expect(screen.getByText('総請求額')).toBeInTheDocument();
      expect(screen.getByText('入金済み')).toBeInTheDocument();
      expect(screen.getByText('未入金')).toBeInTheDocument();
    });
  });

  it('renders new registration button', async () => {
    render(<BillingBankPage />);
    
    await waitFor(() => {
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });
  });

  it('opens new registration form when button is clicked', async () => {
    render(<BillingBankPage />);
    
    await waitFor(() => {
      const button = screen.getByText('新規登録');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('MEM0001')).toBeInTheDocument();
    });
  });

  it('renders billing table headers', async () => {
    render(<BillingBankPage />);
    
    await waitFor(() => {
      expect(screen.getByText('会員コード')).toBeInTheDocument();
      expect(screen.getByText('会員名')).toBeInTheDocument();
      expect(screen.getByText('銀行名')).toBeInTheDocument();
      expect(screen.getByText('請求額')).toBeInTheDocument();
    });
  });

  it('filters by status', async () => {
    render(<BillingBankPage />);
    
    await waitFor(() => {
      const filterSelect = screen.getByDisplayValue('全て');
      fireEvent.change(filterSelect, { target: { value: 'PAID' } });
    });
  });
});

