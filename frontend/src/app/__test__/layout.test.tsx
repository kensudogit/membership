import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('has correct html lang attribute', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const htmlElement = container.parentElement;
    expect(htmlElement?.getAttribute('lang')).toBe('ja');
  });

  it('renders ThemeProvider', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

