import { X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { isAuthenticated, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false)

  const handleKickLogin = async () => {
    try {
      setIsLoading(true)
      await login()
      onClose()
    } catch (error) {
      console.error('Error during KICK login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-[#232629] rounded-lg shadow-xl z-10 w-full max-w-sm mx-4 border border-gray-800">
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 text-white hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
            <p className="text-gray-400 mt-2">Continúa con tu cuenta de KICK</p>
          </div>

          <button
            onClick={isAuthenticated ? logout : login}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {isAuthenticated ? 'Logout' : 'Login with Kick'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
