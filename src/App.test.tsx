import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders dashboard header', () => {
    render(<App />);
    expect(screen.getByText(/mini analytics/i)).toBeInTheDocument();
  });
});
