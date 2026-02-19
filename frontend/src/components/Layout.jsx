import React, { useState } from 'react'
import { Sidebar } from './Sidebar.jsx'
import { Navbar } from './Navbar.jsx'

export const Layout = ({ children, showSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="h-screen overflow-hidden">

      <div className="flex h-full">

        {/* Sidebar */}
        {showSidebar && (
          <>
            <div
              className={`
                fixed md:static
                z-40
                h-full
                w-64
                bg-neutral-900
                transform
                transition-transform
                duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
              `}
            >
              <Sidebar />
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">

          {/* Navbar */}
          <Navbar setIsSidebarOpen={setIsSidebarOpen} />

          {/* Page Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </main>

        </div>

      </div>
    </div>
  )
}
