import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BillingCreditPage from '../page';

describe('BillingCreditPage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<BillingCreditPage />);
    
    await waitFor(() => {
      expect(screen.getByText('会費請求(クレジット)')).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    render(<BillingCreditPage />);
    
    await waitFor(() => {
      expect(screen.getByText('総請求額')).toBeInTheDocument();
      expect(screen.getByText('決済完了')).toBeInTheDocument();
      expect(screen.getByText('処理中')).toBeInTheDocument();
    });
  });

  it('renders new registration button', async () => {
    render(<BillingCreditPage />);
    
    await waitFor(() => {
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });
  });

  it('opens new registration form when button is clicked', async () => {
    render(<BillingCreditPage />);
    
    await waitFor(() => {
      const button = screen.getByText('新規登録');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('MEM0001')).toBeInTheDocument();
    });
  });

  it('renders billing table headers', async () => {
    render(<BillingCreditPage />);
    
    await waitFor(() => {
      expect(screen.getByText('会員コード')).toBeInTheDocument();
      expect(screen.getByText('会員名')).toBeInTheDocument();
      expect(screen.getByText('カード情報')).toBeInTheDocument();
      expect(screen.getByText('請求額')).toBeInTheDocument();
    });
  });
});

