import React from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useLocation, Link } from "react-router-dom";
import { ShipWheelIcon, HomeIcon, UsersIcon, BellIcon } from "lucide-react";

export const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="h-full flex flex-col bg-base-200 border-r border-base-300">

      {/* Logo */}
      <div className="p-5 border-b border-base-300 hidden md:block">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-8 text-primary" />
          <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm truncate">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
};
