import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import WelcomeFlash from './components/WelcomeFlash'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import OTPPage from './pages/OTPPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<WelcomeFlash />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPasswordPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/otp"
              element={
                <PublicOnlyRoute>
                  <OTPPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col items-center justify-center min-h-screen bg-surface-white">
                    <h1 className="text-2xl font-bold text-midnight mb-2">Welcome to BuyQK</h1>
                    <p className="text-gray-500">You are logged in.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  )
}
