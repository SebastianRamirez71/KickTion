"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/NavBar"
import Sidebar from "../components/Sidebar"
import LoginModal from "../components/LoginModal"

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} toggleLoginModal={toggleLoginModal} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
