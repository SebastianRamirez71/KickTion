import { X, LogIn, LogOut, Loader2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { isAuthenticated, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleKickLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await login()
      onClose()
    } catch (error) {
      console.error('Error during KICK login:', error)
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await logout()
      onClose()
    } catch (error) {
      console.error('Error during logout:', error)
      setError('Error al cerrar sesión. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#232629] rounded-xl shadow-2xl z-10 w-full max-w-sm mx-4 border border-gray-800">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-800 text-white hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              {isAuthenticated 
                ? '¿Estás seguro que quieres cerrar sesión?' 
                : 'Inicia sesión con tu cuenta de KICK para acceder a todas las funciones.'}
            </p>
            
            <button
              onClick={isAuthenticated ? handleLogout : handleKickLogin}
              disabled={isLoading}
              className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  {isAuthenticated ? (
                    <>
                      <LogOut className="h-5 w-5" />
                      <span>Cerrar Sesión</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      <span>Iniciar Sesión con KICK</span>
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
