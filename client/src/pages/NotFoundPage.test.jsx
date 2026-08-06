import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import NotFoundPage from './NotFoundPage'

function renderNotFoundPage() {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <NotFoundPage />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

describe('NotFoundPage', () => {
  it('renders 404 heading', () => {
    renderNotFoundPage()

    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders page not found message', () => {
    renderNotFoundPage()

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('renders descriptive message', () => {
    renderNotFoundPage()

    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument()
  })

  it('renders link to home page', () => {
    renderNotFoundPage()

    const homeLink = screen.getByText('Go to Home')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink.closest('a')).toHaveAttribute('href', '/home')
  })
})
