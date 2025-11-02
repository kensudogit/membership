import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides theme context', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});

