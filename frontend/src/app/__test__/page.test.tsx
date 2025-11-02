import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HomePage from '../page';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

describe('HomePage', () => {
  it('renders the main title', () => {
    render(<HomePage />);
    const title = screen.getByText('会員管理システム');
    expect(title).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<HomePage />);
    
    const features = [
      '会員管理',
      '会員証発行',
      'レッスン予約',
      '販売管理',
      'データ分析',
      '設定管理',
      'Web入会',
      'タブレット入会',
      '来場管理',
      '会費請求(口座振替)',
      '会費請求(クレジット)',
      '電話サポート',
    ];

    features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('renders quick stats', () => {
    render(<HomePage />);
    
    expect(screen.getByText('総会員数')).toBeInTheDocument();
    expect(screen.getByText('本日来場')).toBeInTheDocument();
    expect(screen.getByText('今月売上')).toBeInTheDocument();
    expect(screen.getByText('アクティブ予約')).toBeInTheDocument();
  });

  it('navigates to feature page when card is clicked', async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as any);

    render(<HomePage />);
    
    const memberCard = screen.getByText('会員管理').closest('div');
    if (memberCard && memberCard.parentElement) {
      memberCard.parentElement.click();
    }

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });
});

