import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import useAuth from '../../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth');

describe('Login', () => {
  it('renders the login form', () => {
    // Arrange
    useAuth.mockReturnValue({
      signIn: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
