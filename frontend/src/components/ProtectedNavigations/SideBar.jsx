import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Dashboard,
  Income,
  Expense,
  Settings,
  ShutDown as Logout,
} from "../../utils/Icons";
import { openModal } from "../../features/logoutModal/logoutModalSlice";

import logo from "/logo.webp";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isRouteActive = (path) => location.pathname === path;

  return (
    <nav className="hidden xl:flex flex-col w-[18%] h-full bg-white border-r border-slate-200 py-6 transition-all">
      {/* Brand Logo Section */}
      <div
        className="px-6 flex items-center gap-x-3 cursor-pointer mb-10"
        onClick={() => navigate("/dashboard")}
      >
        <img src={logo} alt="spend smart logo" className="w-10 h-10 object-contain" />
        <h5 className="text-2xl font-bold tracking-tight text-slate-900">
          Spend<span className="text-primary">Smart.</span>
        </h5>
      </div>

      {/* Navigation Menu */}
      <menu className="w-full flex-1 flex flex-col px-4">
        <div className="flex flex-col gap-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>

          <li
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm
              ${isRouteActive("/dashboard")
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            onClick={() => navigate("/dashboard")}
          >
            <Dashboard className="size-5" />
            Dashboard
          </li>

          <li
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm
              ${isRouteActive("/dashboard/incomes")
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            onClick={() => navigate("/dashboard/incomes")}
          >
            <Income className="size-5" />
            Incomes
          </li>

          <li
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm
              ${isRouteActive("/dashboard/expenses")
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            onClick={() => navigate("/dashboard/expenses")}
          >
            <Expense className="size-5" />
            Expenses
          </li>

          {/* ── Finance Quiz ── */}
          <li
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm
              ${isRouteActive("/dashboard/finance-quiz")
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            onClick={() => navigate("/dashboard/finance-quiz")}
          >
            <span className="size-5 text-base">📊</span>
            Finance Quiz
          </li>

          {/* ── AI Assistant ── */}
          <li
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm
              ${isRouteActive("/dashboard/ai-assistant")
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            onClick={() => navigate("/dashboard/ai-assistant")}
          >
            <span className="size-5 text-base">🧠</span>
            AI Assistant
          </li>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col gap-y-2 border-t border-slate-100 pt-6">
          <li
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm
              ${isRouteActive("/dashboard/settings")
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            onClick={() => navigate("/dashboard/settings")}
          >
            <Settings className="size-5" />
            Settings
          </li>

          <li
            className="flex items-center gap-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm text-slate-500 hover:bg-red-50 hover:text-red-600"
            onPointerDown={() => dispatch(openModal())}
          >
            <Logout className="size-5" />
            Logout
          </li>
        </div>
      </menu>
    </nav>
  );
};

export default SideBar;