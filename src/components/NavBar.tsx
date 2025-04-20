"use client"

import { Menu, User } from "lucide-react"

interface NavbarProps {
  toggleSidebar: () => void
  toggleLoginModal: () => void
}

const Navbar = ({ toggleSidebar, toggleLoginModal }: NavbarProps) => {
  return (
    <nav className="bg-[#232629] text-white border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Menú hamburguesa a la izquierda */}
          <div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-800 focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Nombre KickTion Beta en el centro */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#53FC18]">KickTion</h1>
            <span className="text-xs bg-gray-700 text-white px-1 rounded ml-1 mt-1">BETA</span>
          </div>

          {/* Botón de login a la derecha */}
          <div>
            <button
              onClick={toggleLoginModal}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
              aria-label="Login"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar