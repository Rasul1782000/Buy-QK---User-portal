import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import ForgotPasswordPage from './ForgotPasswordPage'

vi.mock('../api/client', () => ({
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  getMe: vi.fn().mockResolvedValue({ data: { user: { name: 'Test User' } } }),
}))

import { forgotPassword, resetPassword } from '../api/client'

function renderForgotPasswordPage() {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ForgotPasswordPage />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders step 1 (email form) by default', () => {
    renderForgotPasswordPage()

    expect(screen.getByText('Forgot password?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByText('Send Reset Link →')).toBeInTheDocument()
  })

  it('shows error when submitting empty email', async () => {
    renderForgotPasswordPage()

    fireEvent.click(screen.getByText('Send Reset Link →'))

    expect(await screen.findByText('Please enter your email address')).toBeInTheDocument()
  })

  it('calls forgotPassword API with correct email', async () => {
    forgotPassword.mockResolvedValueOnce({
      data: { message: 'Reset link sent' },
    })

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith({ email: 'test@example.com' })
    })
  })

  it('shows success message on successful email submission', async () => {
    forgotPassword.mockResolvedValueOnce({
      data: { message: 'Reset link sent to your email' },
    })

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    expect(await screen.findByText('Reset link sent to your email')).toBeInTheDocument()
  })

  it('shows error on forgotPassword failure', async () => {
    forgotPassword.mockRejectedValueOnce({
      response: { data: { message: 'User not found' } },
    })

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'unknown@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    expect(await screen.findByText('User not found')).toBeInTheDocument()
  })

  it('advances to step 2 when resetToken is returned', async () => {
    forgotPassword.mockResolvedValueOnce({
      data: { message: 'Reset link sent', resetToken: 'abc123' },
    })

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    await waitFor(() => {
      expect(screen.getByText('Reset password')).toBeInTheDocument()
    })
  })

  it('shows password fields in step 2', async () => {
    forgotPassword.mockResolvedValueOnce({
      data: { message: 'Reset link sent', resetToken: 'abc123' },
    })

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Re-enter your password')).toBeInTheDocument()
    })
  })

  it('shows error when passwords do not match in step 2', async () => {
    forgotPassword.mockResolvedValueOnce({
      data: { message: 'Reset link sent', resetToken: 'abc123' },
    })

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
        target: { value: 'different123' },
      })
      fireEvent.click(screen.getByText('Reset Password →'))
    })

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
  })

  it('shows error when password is too short in step 2', async () => {
    forgotPassword.mockResolvedValueOnce({
      data: { message: 'Reset link sent', resetToken: 'abc123' },
    })

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
        target: { value: 'short' },
      })
      fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
        target: { value: 'short' },
      })
      fireEvent.click(screen.getByText('Reset Password →'))
    })

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument()
  })

  it('calls resetPassword API with correct data', async () => {
    forgotPassword.mockResolvedValueOnce({
      data: { message: 'Reset link sent', resetToken: 'abc123' },
    })
    resetPassword.mockResolvedValueOnce({
      data: { message: 'Password reset successful' },
    })

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
        target: { value: 'newpassword123' },
      })
      fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
        target: { value: 'newpassword123' },
      })
      fireEvent.click(screen.getByText('Reset Password →'))
    })

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        token: 'abc123',
        password: 'newpassword123',
      })
    })
  })

  it('has link back to login page', () => {
    renderForgotPasswordPage()

    const loginLink = screen.getByText('Back to sign in')
    expect(loginLink).toBeInTheDocument()
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
  })

  it('disables submit button while submitting', async () => {
    forgotPassword.mockImplementation(() => new Promise(() => {}))

    renderForgotPasswordPage()

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Send Reset Link →'))

    await waitFor(() => {
      expect(screen.getByText('Sending...')).toBeInTheDocument()
    })
  })
})
