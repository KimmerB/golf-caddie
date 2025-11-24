import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';
import { ToastProvider } from '../../components/ToastProvider';

describe('HomePage', () => {
  it('renders hero actions', () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <HomePage />
        </ToastProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/On-course control/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start round/i })).toBeInTheDocument();
  });
});
