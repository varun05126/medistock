import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Unauthorized from '../pages/common/Unauthorized';
import NotFound from '../pages/common/NotFound';
import Login from '../pages/auth/Login';
import { AuthProvider } from '../context/AuthContext';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn(() => null),
    fetchProfile: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('MediStock Frontend Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Navbar brand correctly', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText('MediStock')).toBeInTheDocument();
  });

  it('renders Unauthorized 403 screen with access denied message', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Unauthorized />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/403 - Access Denied/i)).toBeInTheDocument();
  });

  it('renders NotFound 404 screen', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
  });

  describe('Login Page and Role Dropdown', () => {
    it('renders login form with branding, credentials fields, and Select Role dropdown', () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      );

      // Branding
      expect(screen.getByRole('heading', { name: /MediStock/i })).toBeInTheDocument();
      expect(screen.getByText(/Medical Inventory Management Platform/i)).toBeInTheDocument();

      // Fields
      expect(screen.getByPlaceholderText(/Enter username or email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();

      // Ensure sample credentials panel is NOT exposed on production login card
      expect(screen.queryByText(/Sample Credentials/i)).not.toBeInTheDocument();
    });

    it('contains exactly the required roles in the dropdown: Admin, Pharmacist, Staff, Supplier', () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      );

      const select = screen.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option')).map((o) => o.textContent);

      expect(options).toEqual([
        'Select your role',
        'Admin',
        'Pharmacist',
        'Staff',
        'Supplier',
      ]);
    });

    it('validates that username, password, and role are required', async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      );

      const signInBtn = screen.getByRole('button', { name: /Sign In/i });

      // 1. Empty username
      fireEvent.click(signInBtn);
      expect(screen.getByText(/Username or email is required/i)).toBeInTheDocument();

      // 2. Filled username, empty password
      fireEvent.change(screen.getByPlaceholderText(/Enter username or email/i), {
        target: { value: 'admin' },
      });
      fireEvent.click(signInBtn);
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();

      // 3. Filled password, empty role
      fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(signInBtn);
      expect(screen.getByText(/Please select your role/i)).toBeInTheDocument();
    });

    it('submits valid credentials and role to login API', async () => {
      authService.login.mockResolvedValueOnce({
        token: 'mock-jwt-token',
        role: 'ADMIN',
        username: 'admin',
      });

      render(
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter username or email/i), {
        target: { value: 'admin' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
        target: { value: 'admin123' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'ADMIN' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          username: 'admin',
          password: 'admin123',
          role: 'ADMIN',
        });
      });
    });

    it('displays error message when backend returns role mismatch error', async () => {
      authService.login.mockRejectedValueOnce(
        new Error('The selected role does not match your account.')
      );

      render(
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter username or email/i), {
        target: { value: 'pharmacist' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
        target: { value: 'secret' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'SUPPLIER' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/The selected role does not match your account\./i)
        ).toBeInTheDocument();
      });
    });

    it('displays helpful connection guidance when a network error occurs', async () => {
      const netError = new Error('Network Error');
      netError.code = 'ERR_NETWORK';
      netError.request = {};
      authService.login.mockRejectedValueOnce(netError);

      render(
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter username or email/i), {
        target: { value: 'admin' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
        target: { value: 'admin123' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'ADMIN' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(screen.getByText(/Unable to connect/i)).toBeInTheDocument();
      });
    });
  });
});
