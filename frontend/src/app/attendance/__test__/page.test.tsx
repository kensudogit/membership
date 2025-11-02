import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AttendancePage from '../page';

describe('AttendancePage', () => {
  beforeEach(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.fetch = vi.fn() as any;
    }
  });

  it('renders the page title', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/来場管理/i)).toBeInTheDocument();
    });
  });

  it('renders check-in input', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      const checkInInput = screen.getByPlaceholderText(/会員コード|QRコード/i);
      expect(checkInInput).toBeInTheDocument();
    });
  });

  it('handles check-in functionality', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      const checkInInput = screen.getByPlaceholderText(/会員コード|QRコード/i);
      fireEvent.change(checkInInput, { target: { value: 'MEM001' } });
    });
  });
});

