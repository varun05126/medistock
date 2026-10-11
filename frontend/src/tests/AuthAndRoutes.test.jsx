import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Unauthorized from '../pages/common/Unauthorized';
import NotFound from '../pages/common/NotFound';
import { AuthProvider } from '../context/AuthContext';

describe('MediStock Frontend Components', () => {
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
});
