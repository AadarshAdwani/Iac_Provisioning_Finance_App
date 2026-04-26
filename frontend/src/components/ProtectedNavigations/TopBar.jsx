import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";

import { Settings, ShutDown as Logout } from "../../utils/Icons";
import arrow from "../../assets/arrow.gif";
import avatar from "../../assets/avatar.webp";
import { openModal } from "../../features/logoutModal/logoutModalSlice";
import Menu from "./Menu";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isRouteActive = (path) => location.pathname === path;

  return (
    <header className="w-full h-16 md:h-20 flex justify-between items-center px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
      
      {/* Mobile Menu Toggle */}
      <div className="xl:hidden flex items-center">
        <Menu />
      </div>

      {/* Left Section: Link & Animation */}
      <div className="hidden md:flex items-center gap-x-4">
        <img src={arrow} alt="arrow icon" className="w-8 opacity-80" />
        <Link
          to="https://www.linkedin.com/in/saxena-shourya/"
          target="_blank"
          className="text-sm font-semibold text-slate-500 transition-all hover:text-primary flex items-center gap-1 group"
        >
          Contact Developer
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"></span>
        </Link>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-x-3 md:gap-x-5">
        
        <div className="flex items-center gap-x-2 mr-2 border-r border-slate-200 pr-4">
          <button
            title="Settings"
            className={`p-2 rounded-xl transition-all cursor-pointer 
              ${isRouteActive("/dashboard/settings") 
                ? "bg-primary/10 text-primary" 
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            onClick={() => navigate("/dashboard/settings")}
          >
            <Settings className="size-5" />
          </button>

          <button
            title="Logout"
            className="p-2 text-slate-500 rounded-xl transition-all cursor-pointer hover:bg-red-50 hover:text-red-600"
            onClick={() => dispatch(openModal())}
          >
            <Logout className="size-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-x-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-900 leading-none">User Name</p>
            <p className="text-[10px] text-slate-500 mt-1">Free Tier</p>
          </div>
          <Avatar
            src={avatar}
            name="Avatar"
            size="md"
            className="cursor-pointer border-2 border-white shadow-sm"
            classNames={{
              base: "bg-primary/10",
            }}
            showFallback
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;