import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

vi.mock('../api/client', () => ({
  getMe: vi.fn(),
  getCategories: vi.fn().mockResolvedValue({ data: [] }),
  getBanners: vi.fn().mockResolvedValue({ data: [] }),
}))

import { getMe } from '../api/client'

function renderWithAuth(ui, { route = '/', user = null } = {}) {
  if (user) {
    localStorage.setItem('buyqk_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('buyqk_user')
  }

  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <AuthProvider>{ui}</AuthProvider>
      </LanguageProvider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows loading spinner while checking auth', async () => {
    getMe.mockImplementation(() => new Promise(() => {})) // never resolves

    renderWithAuth(
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { route: '/home' }
    )

    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders children when user is authenticated', async () => {
    getMe.mockResolvedValueOnce({
      data: { user: { name: 'Test User' } },
    })

    renderWithAuth(
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { route: '/home', user: { name: 'Test User' } }
    )

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  it('redirects to login when user is not authenticated', async () => {
    getMe.mockRejectedValueOnce(new Error('Not authenticated'))

    renderWithAuth(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { route: '/home' }
    )

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })
})

describe('PublicOnlyRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows loading spinner while checking auth', async () => {
    getMe.mockImplementation(() => new Promise(() => {}))

    renderWithAuth(
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <div>Login Form</div>
            </PublicOnlyRoute>
          }
        />
      </Routes>,
      { route: '/login' }
    )

    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders children when user is not authenticated', async () => {
    getMe.mockRejectedValueOnce(new Error('Not authenticated'))

    renderWithAuth(
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <div>Login Form</div>
            </PublicOnlyRoute>
          }
        />
      </Routes>,
      { route: '/login' }
    )

    await waitFor(() => {
      expect(screen.getByText('Login Form')).toBeInTheDocument()
    })
  })

  it('redirects to home when user is already authenticated', async () => {
    getMe.mockResolvedValueOnce({
      data: { user: { name: 'Test User' } },
    })

    renderWithAuth(
      <Routes>
        <Route path="/home" element={<div>Home Page</div>} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <div>Login Form</div>
            </PublicOnlyRoute>
          }
        />
      </Routes>,
      { route: '/login', user: { name: 'Test User' } }
    )

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument()
    })
  })
})
