import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-white px-4 text-center">
      <p className="text-6xl font-black text-brand-green mb-4">404</p>
      <h1 className="text-2xl font-bold text-midnight mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/home"
        className="bg-brand-green hover:bg-brand-green-light text-white text-sm font-semibold px-6 py-3 rounded transition-colors"
      >
        Go to Home
      </Link>
    </div>
  )
}
