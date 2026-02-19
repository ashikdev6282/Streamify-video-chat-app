import React from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useLocation, Link } from "react-router-dom";
import {
  ShipWheelIcon,
  BellIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";
import { useLogout } from "../hooks/useLogout.js";



export const Navbar = ({ setIsSidebarOpen }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 h-16 flex items-center px-4 sm:px-6">
      <div className="flex items-center justify-between w-full">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* Mobile Hamburger */}
          {isChatPage && (
            <button
              className="md:hidden btn btn-ghost btn-circle"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          )}

          {/* Logo */}
          {isChatPage && (
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamify
              </span>
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Notifications */}
          <Link to={"/notifications"}>
            <button className="btn btn-ghost btn-circle">
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
            </button>
          </Link>

          {/* Theme */}
          <ThemeSelector />

          {/* Avatar */}
          <div className="avatar">
            <div className="w-8 sm:w-9 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
              />
            </div>
          </div>

          {/* Logout */}
          <button
            className="btn btn-ghost btn-circle"
            onClick={logoutMutation}
          >
            <LogOutIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
          </button>
        </div>

      </div>
    </nav>
  );
};
