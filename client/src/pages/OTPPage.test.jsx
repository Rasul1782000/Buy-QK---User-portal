import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import OTPPage from './OTPPage'

vi.mock('../api/client', () => ({
  verifyOTP: vi.fn(),
  sendOTP: vi.fn().mockResolvedValue({ data: {} }),
  getMe: vi.fn().mockRejectedValue(new Error('Not authenticated')),
}))

import { verifyOTP, sendOTP } from '../api/client'

const TEST_IDENTIFIER = 'test@example.com'

function renderOTPPage(identifier = TEST_IDENTIFIER) {
  sessionStorage.setItem('buyqk_pending_identifier', identifier)
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/otp', state: { identifier } }]}>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/otp" element={<OTPPage />} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </MemoryRouter>
  )
}

describe('OTPPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders OTP form with all elements', async () => {
    renderOTPPage()

    await waitFor(() => {
      expect(screen.getByText('Verify OTP')).toBeInTheDocument()
    })
    expect(screen.getByText('Enter the 6-digit code sent to')).toBeInTheDocument()
    expect(screen.getByText('Verify')).toBeInTheDocument()
  })

  it('renders 6 OTP input fields', async () => {
    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(6)
    })
  })

  it('shows the identifier in subtitle', async () => {
    renderOTPPage('user@example.com')

    await waitFor(() => {
      const subtitle = screen.getByText(/Enter the 6-digit code sent to/)
      expect(subtitle).toHaveTextContent('user@example.com')
    })
  })

  it('shows dev OTP when provided', async () => {
    sessionStorage.setItem('buyqk_pending_identifier', TEST_IDENTIFIER)
    render(
      <MemoryRouter initialEntries={[{ pathname: '/otp', state: { identifier: TEST_IDENTIFIER, devOtp: '123456' } }]}>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/otp" element={<OTPPage />} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Dev code:/)).toBeInTheDocument()
    })
  })

  it('auto-focuses first input on mount', async () => {
    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveFocus()
    })
  })

  it('advances focus to next input after entering a digit', async () => {
    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '1' } })
      expect(inputs[1]).toHaveFocus()
    })
  })

  it('only accepts numeric input', async () => {
    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: 'a' } })
      expect(inputs[0]).toHaveValue('')
    })
  })

  it('shows error when submitting incomplete OTP', async () => {
    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '1' } })
      fireEvent.change(inputs[1], { target: { value: '2' } })
    })

    const submitButton = screen.getByText('Verify')
    expect(submitButton).toBeDisabled()
  })

  it('calls verifyOTP with correct data on submit', async () => {
    verifyOTP.mockResolvedValueOnce({
      data: { user: { name: 'Test User' } },
    })

    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: String(i + 1) } })
      }
      fireEvent.click(screen.getByText('Verify'))
    })

    await waitFor(() => {
      expect(verifyOTP).toHaveBeenCalledWith({
        email: TEST_IDENTIFIER,
        otp: '123456',
      })
    })
  })

  it('shows error on invalid OTP', async () => {
    verifyOTP.mockRejectedValueOnce({
      response: { data: { message: 'Invalid OTP' } },
    })

    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: String(i + 1) } })
      }
      fireEvent.click(screen.getByText('Verify'))
    })

    expect(await screen.findByText('Invalid OTP')).toBeInTheDocument()
  })

  it('disables submit button while verifying', async () => {
    verifyOTP.mockImplementation(() => new Promise(() => {}))

    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: String(i + 1) } })
      }
      fireEvent.click(screen.getByText('Verify'))
    })

    await waitFor(() => {
      expect(screen.getByText('Verifying...')).toBeInTheDocument()
    })
  })

  it('handles paste of 6-digit code', async () => {
    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      fireEvent.paste(inputs[0], {
        clipboardData: { getData: () => '123456' },
      })

      expect(inputs[0]).toHaveValue('1')
      expect(inputs[5]).toHaveValue('6')
    })
  })

  it('starts countdown timer after mount', async () => {
    sendOTP.mockResolvedValueOnce({ data: { devOtp: '123456' } })
    renderOTPPage()

    await waitFor(() => {
      expect(screen.getByText(/Resend OTP in/)).toBeInTheDocument()
    })
  })

  it('disables verify button when OTP is incomplete', async () => {
    renderOTPPage()

    await waitFor(() => {
      expect(screen.getByText('Verify')).toBeDisabled()
    })
  })

  it('enables verify button when all 6 digits entered', async () => {
    renderOTPPage()

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox')
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: String(i + 1) } })
      }
      expect(screen.getByText('Verify')).not.toBeDisabled()
    })
  })

  it('redirects to login if no identifier', async () => {
    renderOTPPage('')

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })
})
