import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import SignupPage from './SignupPage'

vi.mock('../api/client', () => ({
  signup: vi.fn(),
  getMe: vi.fn().mockResolvedValue({ data: { user: { name: 'Test User' } } }),
}))

import { signup } from '../api/client'

function renderSignupPage() {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders signup form with all elements', () => {
    renderSignupPage()

    expect(screen.getByText('Create account')).toBeInTheDocument()
    expect(screen.getByText('Get started with BuyQK')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Re-enter your password')).toBeInTheDocument()
    expect(screen.getByText('Sign Up →')).toBeInTheDocument()
  })

  it('shows error when submitting empty form', async () => {
    renderSignupPage()

    fireEvent.click(screen.getByText('Sign Up →'))

    expect(await screen.findByText('Please fill in all required fields')).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    renderSignupPage()

    fireEvent.change(screen.getByPlaceholderText('Your full name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
      target: { value: 'different123' },
    })
    fireEvent.click(screen.getByText('Sign Up →'))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
  })

  it('shows error when password is less than 8 characters', async () => {
    renderSignupPage()

    fireEvent.change(screen.getByPlaceholderText('Your full name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'short' },
    })
    fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByText('Sign Up →'))

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument()
  })

  it('shows error when terms are not agreed', async () => {
    renderSignupPage()

    fireEvent.change(screen.getByPlaceholderText('Your full name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByText('Sign Up →'))

    expect(await screen.findByText('Please agree to the Terms & Conditions')).toBeInTheDocument()
  })

  it('calls signup API with correct data when all valid', async () => {
    signup.mockResolvedValueOnce({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
    })

    renderSignupPage()

    fireEvent.change(screen.getByPlaceholderText('Your full name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByLabelText(/I agree to the Terms/))
    fireEvent.click(screen.getByText('Sign Up →'))

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('shows error on signup failure', async () => {
    signup.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    })

    renderSignupPage()

    fireEvent.change(screen.getByPlaceholderText('Your full name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'existing@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByLabelText(/I agree to the Terms/))
    fireEvent.click(screen.getByText('Sign Up →'))

    expect(await screen.findByText('Email already exists')).toBeInTheDocument()
  })

  it('has link to login page', () => {
    renderSignupPage()

    const loginLink = screen.getByText('Sign in')
    expect(loginLink).toBeInTheDocument()
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
  })

  it('toggles password visibility for both password fields', () => {
    renderSignupPage()

    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const confirmInput = screen.getByPlaceholderText('Re-enter your password')

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(confirmInput).toHaveAttribute('type', 'password')

    const eyeButtons = screen.getAllByRole('button', { name: '' })
    fireEvent.click(eyeButtons[0])

    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('disables submit button while submitting', async () => {
    signup.mockImplementation(() => new Promise(() => {}))

    renderSignupPage()

    fireEvent.change(screen.getByPlaceholderText('Your full name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Re-enter your password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByLabelText(/I agree to the Terms/))
    fireEvent.click(screen.getByText('Sign Up →'))

    await waitFor(() => {
      expect(screen.getByText('Creating account...')).toBeInTheDocument()
    })
  })
})
