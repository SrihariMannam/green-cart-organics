import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Search, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = ({ title, subtitle, breadcrumb = [] }) => {
  const navigate = useNavigate();
  const { activeRole, notifications, markNotificationAsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter notifications for active portal
  const roleNotifications = notifications.filter(
    (n) => n.targetRole === activeRole || n.targetRole === 'admin'
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-8 z-30 shadow-2xs">
      <div>
        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-slate-400 mb-1">
            <span>Portal</span>
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span>/</span>
                <span className={idx === breadcrumb.length - 1 ? 'text-forest-700 font-semibold' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3">
        {/* Portal status badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-200 text-xs font-semibold text-forest-800">
          <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
          <span className="capitalize">{activeRole} System Live</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition"
            aria-label="Toggle notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Portal Notifications</span>
                <span className="text-xs text-slate-500">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {roleNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No active notifications for this role.
                  </div>
                ) : (
                  roleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                        !notif.read ? 'bg-forest-50/50' : ''
                      }`}
                    >
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
