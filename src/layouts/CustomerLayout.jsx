import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoleSwitcherBar } from '../components/common/RoleSwitcherBar';
import { CustomerNavbar } from '../components/common/CustomerNavbar';
import { CustomerFooter } from '../components/common/CustomerFooter';
import { Toast } from '../components/common/Toast';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <RoleSwitcherBar />
      <CustomerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CustomerFooter />
      <Toast />
    </div>
  );
};
