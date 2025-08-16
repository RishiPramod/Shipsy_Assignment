import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import useAuth from '../../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth');

describe('Header', () => {
  it('renders the header with title and sign out button when user is authenticated', () => {
    // Arrange
    useAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText('ShipSy')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders the header without user info when not authenticated', () => {
    // Arrange
    useAuth.mockReturnValue({ user: null });

    // Act
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText('ShipSy')).toBeInTheDocument();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });
});
