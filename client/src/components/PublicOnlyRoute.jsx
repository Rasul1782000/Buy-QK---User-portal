import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-green border-t-transparent" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/home" replace />
  }

  return children
}
