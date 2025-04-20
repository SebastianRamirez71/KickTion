"use client"

import { Home, Compass, Heart, X } from "lucide-react"
import { Link } from "react-router-dom"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#141517] border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#53FC18]">KickTion</h2>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-800" aria-label="Close menu">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link to="/" className="flex items-center p-3 rounded-md hover:bg-gray-800 text-white" onClick={onClose}>
                <Home className="h-5 w-5 mr-3" />
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="flex items-center p-3 rounded-md hover:bg-gray-800 text-white"
                onClick={onClose}
              >
                <Compass className="h-5 w-5 mr-3" />
                Explorar
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="flex items-center p-3 rounded-md hover:bg-gray-800 text-white"
                onClick={onClose}
              >
                <Heart className="h-5 w-5 mr-3" />
                Siguiendo
              </Link>
            </li>
          </ul>

        </nav>
      </div>
    </>
  )
}

export default Sidebar