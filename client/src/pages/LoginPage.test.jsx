import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import LoginPage from './LoginPage'

vi.mock('../api/client', () => ({
  login: vi.fn(),
  getMe: vi.fn().mockResolvedValue({ data: { user: { name: 'Test User' } } }),
}))

import { login } from '../api/client'

function renderLoginPage() {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders login form with all elements', () => {
    renderLoginPage()

    expect(screen.getByText('Welcome back! 👋')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email or phone number')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByText('Login →')).toBeInTheDocument()
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument()
    expect(screen.getByText('Remember Me')).toBeInTheDocument()
  })

  it('allows entering email in identifier field', () => {
    renderLoginPage()

    const input = screen.getByPlaceholderText('Enter email or phone number')
    fireEvent.change(input, { target: { value: 'test@example.com' } })

    expect(input).toHaveValue('test@example.com')
  })

  it('allows entering phone number in identifier field', () => {
    renderLoginPage()

    const input = screen.getByPlaceholderText('Enter email or phone number')
    fireEvent.change(input, { target: { value: '9876543210' } })

    expect(input).toHaveValue('9876543210')
  })

  it('shows error when submitting empty form', async () => {
    renderLoginPage()

    fireEvent.click(screen.getByText('Login →'))

    expect(await screen.findByText('Please enter both email and password')).toBeInTheDocument()
  })

  it('shows error when only identifier is provided', async () => {
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Enter email or phone number'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Login →'))

    expect(await screen.findByText('Please enter both email and password')).toBeInTheDocument()
  })

  it('calls login API with email when identifier contains @', async () => {
    login.mockResolvedValueOnce({ data: {} })

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Enter email or phone number'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByText('Login →'))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('calls login API with phone when identifier does not contain @', async () => {
    login.mockResolvedValueOnce({ data: {} })

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Enter email or phone number'), {
      target: { value: '9876543210' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByText('Login →'))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        phone: '9876543210',
        password: 'password123',
      })
    })
  })

  it('shows error message on login failure', async () => {
    login.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    })

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Enter email or phone number'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByText('Login →'))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    renderLoginPage()

    const passwordInput = screen.getByPlaceholderText('Enter your password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const eyeButton = screen.getByRole('button', { name: '' })
    fireEvent.click(eyeButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('has link to signup page', () => {
    renderLoginPage()

    const signupLink = screen.getByText('Create Account')
    expect(signupLink).toBeInTheDocument()
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup')
  })

  it('has link to forgot password page', () => {
    renderLoginPage()

    const forgotLink = screen.getByText('Forgot Password?')
    expect(forgotLink).toBeInTheDocument()
    expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password')
  })

  it('fills form from localStorage if saved identifier exists', () => {
    localStorage.setItem('buyqk_saved_identifier', 'saved@example.com')

    renderLoginPage()

    expect(screen.getByPlaceholderText('Enter email or phone number')).toHaveValue('saved@example.com')
    expect(screen.getByLabelText('Remember Me')).toBeChecked()
  })

  it('fills phone from localStorage if saved identifier is phone', () => {
    localStorage.setItem('buyqk_saved_identifier', '9876543210')

    renderLoginPage()

    expect(screen.getByPlaceholderText('Enter email or phone number')).toHaveValue('9876543210')
    expect(screen.getByLabelText('Remember Me')).toBeChecked()
  })

  it('disables submit button while submitting', async () => {
    login.mockImplementation(() => new Promise(() => {})) // never resolves

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Enter email or phone number'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByText('Login →'))

    await waitFor(() => {
      expect(screen.getByText('Logging in...')).toBeInTheDocument()
    })
  })

  it('renders social login buttons', () => {
    renderLoginPage()

    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument()
  })

  it('does not render demo login buttons', () => {
    renderLoginPage()

    expect(screen.queryByText('Demo Accounts')).not.toBeInTheDocument()
    expect(screen.queryByText('Demo User Login →')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin Demo Login →')).not.toBeInTheDocument()
  })
})
