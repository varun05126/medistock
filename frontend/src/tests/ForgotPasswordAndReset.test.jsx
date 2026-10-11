import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('MediStock Forgot and Reset Password Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ForgotPassword Page', () => {
    it('renders heading, email field, and submit button', () => {
      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: /Reset Password/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/user@medistock\.com/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Back to Sign In/i })).toBeInTheDocument();
    });

    it('validates empty email submit', () => {
      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));
      expect(screen.getByText(/Please enter your email address/i)).toBeInTheDocument();
    });

    it('validates invalid email format', () => {
      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/user@medistock\.com/i), {
        target: { value: 'notanemail' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    it('submits valid email and renders success message without revealing account existence', async () => {
      api.post.mockResolvedValueOnce({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.',
      });

      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/user@medistock\.com/i), {
        target: { value: 'doctor@medistock.com' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', {
          email: 'doctor@medistock.com',
        });
        expect(screen.getByText(/Check Your Email/i)).toBeInTheDocument();
        expect(screen.getByText(/doctor@medistock\.com/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Return to Sign In/i })).toBeInTheDocument();
      });
    });
  });

  describe('ResetPassword Page', () => {
    it('shows error if token is missing in URL query params', () => {
      render(
        <MemoryRouter initialEntries={['/reset-password']}>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Invalid or missing reset token/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Request New Reset Link/i })).toBeInTheDocument();
    });

    it('renders password fields when token is present', () => {
      render(
        <MemoryRouter initialEntries={['/reset-password?token=sampleToken123']}>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: /Set New Password/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Minimum 6 characters/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Repeat new password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
    });

    it('validates password length less than 6 characters', () => {
      render(
        <MemoryRouter initialEntries={['/reset-password?token=sampleToken123']}>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/Minimum 6 characters/i), {
        target: { value: '123' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Repeat new password/i), {
        target: { value: '123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

      expect(screen.getByText(/New password must be at least 6 characters long/i)).toBeInTheDocument();
    });

    it('validates passwords do not match', () => {
      render(
        <MemoryRouter initialEntries={['/reset-password?token=sampleToken123']}>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/Minimum 6 characters/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Repeat new password/i), {
        target: { value: 'password999' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    it('submits valid token and matching passwords and renders success state', async () => {
      api.post.mockResolvedValueOnce({
        success: true,
        message: 'Password has been reset successfully.',
      });

      render(
        <MemoryRouter initialEntries={['/reset-password?token=validToken456']}>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/Minimum 6 characters/i), {
        target: { value: 'brandNewPassword123' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Repeat new password/i), {
        target: { value: 'brandNewPassword123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
          token: 'validToken456',
          newPassword: 'brandNewPassword123',
        });
        expect(screen.getByText(/Password Reset Complete!/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Sign In Now/i })).toBeInTheDocument();
      });
    });

    it('displays error message when token has expired or is invalid', async () => {
      api.post.mockRejectedValueOnce({
        message: 'This password reset token has expired. Please request a new one.',
      });

      render(
        <MemoryRouter initialEntries={['/reset-password?token=expiredToken789']}>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/Minimum 6 characters/i), {
        target: { value: 'brandNewPassword123' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Repeat new password/i), {
        target: { value: 'brandNewPassword123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

      await waitFor(() => {
        expect(screen.getByText(/This password reset token has expired/i)).toBeInTheDocument();
      });
    });
  });
});
