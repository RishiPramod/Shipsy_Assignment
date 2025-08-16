import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../SignUp';
import useAuth from '../../hooks/useAuth';
import { Toaster } from 'react-hot-toast';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth');

describe('SignUp', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      signUp: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it('renders the sign-up form', () => {
    // Act
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows an error message for invalid email', async () => {
    // Act
    render(
      <BrowserRouter>
        <Toaster />
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Assert
    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('shows an error message for short password', async () => {
    // Act
    render(
      <BrowserRouter>
        <Toaster />
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Assert
    expect(await screen.findByText('Password must be at least 6 characters long.')).toBeInTheDocument();
  });
});
