import { X } from "lucide-react"
import { useState } from "react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    console.log("Login attempt with:", { email, password })
    // Resetear campos y cerrar modal
    setEmail("")
    setPassword("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      

      <div className="bg-[#232629] rounded-lg shadow-xl z-10 w-full max-w-sm mx-4 border border-gray-800">
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 text-white  hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1B1E] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#53FC18] placeholder-gray-500"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1B1E] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#53FC18] placeholder-gray-500"
                placeholder="Contraseña"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#53FC18] text-black font-medium py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-1 focus:ring-[#53FC18] mt-2"
            >
              Iniciar Sesion
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
