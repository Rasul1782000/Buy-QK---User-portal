import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import Header from './Header'

vi.mock('../api/client', () => ({
  getPopularSearches: vi.fn().mockResolvedValue({ data: [] }),
  getMe: vi.fn().mockRejectedValue(new Error('Not authenticated')),
}))

function renderHeader(route = '/home') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </LanguageProvider>
    </MemoryRouter>
  )
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the logo', () => {
    renderHeader()

    expect(screen.getByText('Buy')).toBeInTheDocument()
    const qkElements = screen.getAllByText('QK')
    expect(qkElements.length).toBeGreaterThan(0)
  })

  it('renders search bar', () => {
    renderHeader()

    expect(screen.getByPlaceholderText(/Search "milk, bread, sugar/)).toBeInTheDocument()
  })

  it('renders cart button', () => {
    renderHeader()

    expect(screen.getByText('My Cart')).toBeInTheDocument()
  })

  it('renders login link when user is not logged in', () => {
    renderHeader('/login')

    const loginElements = screen.getAllByText('Login')
    expect(loginElements.length).toBeGreaterThan(0)
  })

  it('renders user name when logged in', () => {
    localStorage.setItem('buyqk_user', JSON.stringify({ name: 'John Doe' }))

    renderHeader()

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders logout button when logged in', () => {
    localStorage.setItem('buyqk_user', JSON.stringify({ name: 'John Doe' }))

    renderHeader()

    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('has link to home page on logo click', () => {
    renderHeader()

    const logoLink = screen.getByText('Buy').closest('a')
    expect(logoLink).toHaveAttribute('href', '/home')
  })

  it('renders popular search tags', () => {
    renderHeader()

    expect(screen.getByText('Popular:')).toBeInTheDocument()
  })
})
