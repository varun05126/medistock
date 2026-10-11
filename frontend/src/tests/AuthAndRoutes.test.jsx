import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Unauthorized from '../pages/common/Unauthorized';
import NotFound from '../pages/common/NotFound';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
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

    it('renders "Don\'t have an account? Create here" linking to /register', () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthProvider>
      );

      expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
      const link = screen.getByRole('link', { name: /Create here/i });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe('/register');
    });
  });

  describe('Create Account Page (Register)', () => {
    it('renders all registration fields and Create Account button', () => {
      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: /MediStock/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/name@medistock\.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Choose username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter password \(min 6 characters\)/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();

      const signInLink = screen.getByRole('link', { name: /Sign in/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink.getAttribute('href')).toBe('/login');
    });

    it('role dropdown does NOT include Admin role for public self-registration', () => {
      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      const select = screen.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option')).map((o) => o.textContent);

      expect(options).toEqual(['Staff', 'Pharmacist', 'Supplier']);
      expect(options).not.toContain('Admin');
    });

    it('validates required fields on empty submit', async () => {
      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(screen.getByText(/Full name is required\./i)).toBeInTheDocument();
      });
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('validates email format', async () => {
      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter full name/i), {
        target: { value: 'Alex Morgan' },
      });
      fireEvent.change(screen.getByPlaceholderText(/name@medistock\.com/i), {
        target: { value: 'invalid-email' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address\./i)).toBeInTheDocument();
      });
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('validates that password and confirm password match', async () => {
      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter full name/i), {
        target: { value: 'Alex Morgan' },
      });
      fireEvent.change(screen.getByPlaceholderText(/name@medistock\.com/i), {
        target: { value: 'alex@medistock.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Choose username/i), {
        target: { value: 'alexm' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter password \(min 6 characters\)/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), {
        target: { value: 'differentpassword' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match\./i)).toBeInTheDocument();
      });
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('submits valid registration and displays success message', async () => {
      authService.register.mockResolvedValueOnce({
        success: true,
        message: 'User registered successfully',
      });

      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter full name/i), {
        target: { value: 'Alex Morgan' },
      });
      fireEvent.change(screen.getByPlaceholderText(/name@medistock\.com/i), {
        target: { value: 'alex@medistock.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Choose username/i), {
        target: { value: 'alexm' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter password \(min 6 characters\)/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          name: 'Alex Morgan',
          email: 'alex@medistock.com',
          username: 'alexm',
          password: 'password123',
          role: 'STAFF',
          supplierId: null,
        });
        expect(screen.getByText(/User registered successfully/i)).toBeInTheDocument();
      });
    });

    it('displays server error message when registration fails', async () => {
      authService.register.mockRejectedValueOnce({
        message: 'Email is already in use: alex@medistock.com',
      });

      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter full name/i), {
        target: { value: 'Alex Morgan' },
      });
      fireEvent.change(screen.getByPlaceholderText(/name@medistock\.com/i), {
        target: { value: 'alex@medistock.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Choose username/i), {
        target: { value: 'alexm' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter password \(min 6 characters\)/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(screen.getByText(/Email is already in use/i)).toBeInTheDocument();
      });
    });
  });
});
