import React from "react";
import { Outlet } from "react-router-dom";
import LogoutModal from "../../components/Modals/LogoutModal";

import { SideBar, TopBar } from "../../components/ProtectedNavigations";
import {
  TransactionViewAndUpdateModal,
  TransactionDeleteModal,
} from "../../components/Modals";

const Dashboard = () => {
  return (
    <>
      {/* 🔥 Keep modals OUTSIDE layout height restrictions */}
      <LogoutModal />
      <TransactionViewAndUpdateModal />
      <TransactionDeleteModal />

      {/* 🔥 Allow natural scrolling */}
      <main className="w-full min-h-screen flex bg-slate-50">
        <SideBar />

        <section className="w-full xl:w-[85%] flex flex-col min-h-screen">
          <TopBar />

          {/* 🔥 Important: allow content to grow & scroll */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
