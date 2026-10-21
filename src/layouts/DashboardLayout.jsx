import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RoleSwitcherBar } from '../components/common/RoleSwitcherBar';
import { DashboardSidebar } from '../components/common/DashboardSidebar';
import { Toast } from '../components/common/Toast';
import { useApp } from '../context/AppContext';

export const DashboardLayout = ({ role }) => {
  const { switchRole, activeRole } = useApp();
  const location = useLocation();

  // Keep activeRole in sync with URL layout if user directly navigates to a URL
  useEffect(() => {
    if (role && activeRole !== role) {
      switchRole(role);
    }
  }, [role, activeRole, switchRole]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-800">
      <RoleSwitcherBar />
      <div className="flex-1 flex flex-col lg:flex-row overflow-x-hidden">
        <DashboardSidebar role={role} />
        <main className="flex-1 bg-slate-50 min-h-[calc(100vh-2.5rem)] pb-16">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
};
