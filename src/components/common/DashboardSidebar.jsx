import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Inbox,
  CheckCircle,
  PackageCheck,
  Calendar,
  Wallet,
  History,
  MessageSquare,
  Truck,
  MapPin,
  ClipboardCheck,
  Building2,
  FileCheck2,
  Boxes,
  Send,
  BarChart3,
  Bike,
  Package,
  Users,
  Tractor,
  Layers,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Leaf
} from 'lucide-react';

export const DashboardSidebar = ({ role = 'farmer' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { orders, users, activeProfileId } = useApp();

  // Dynamic notification/task count badges
  const incomingFarmerOrdersCount = orders.filter(
    (o) => o.fulfillmentStatus === 'CONFIRMED' && !o.assignedFarmerId
  ).length;

  const readyPickupsCount = orders.filter(
    (o) => o.fulfillmentStatus === 'READY_FOR_PICKUP'
  ).length;

  const incomingHubShipmentsCount = orders.filter(
    (o) => o.fulfillmentStatus === 'PICKED_UP' || o.fulfillmentStatus === 'RECEIVED_AT_HUB'
  ).length;

  const hubPendingInspectionCount = orders.filter(
    (o) => o.fulfillmentStatus === 'RECEIVED_AT_HUB'
  ).length;

  const hubPendingPackingCount = orders.filter(
    (o) => o.fulfillmentStatus === 'QUALITY_CHECKED'
  ).length;

  const agentAssignedPackagesCount = orders.filter(
    (o) => o.fulfillmentStatus === 'ASSIGNED_TO_DELIVERY' || o.fulfillmentStatus === 'OUT_FOR_DELIVERY'
  ).length;

  // Role Menus
  const menusByRole = {
    farmer: {
      portalName: 'Farmer Portal',
      subtitle: 'Organic Harvest & Supply',
      accentColor: 'text-lime-400',
      links: [
        { path: '/farmer', label: 'Dashboard', icon: LayoutDashboard, end: true },
        {
          path: '/farmer/incoming',
          label: 'Incoming Orders',
          icon: Inbox,
          badge: incomingFarmerOrdersCount > 0 ? incomingFarmerOrdersCount : null,
          badgeColor: 'bg-emerald-500 text-white',
        },
        { path: '/farmer/accepted', label: 'My Accepted Orders', icon: CheckCircle },
        { path: '/farmer/inventory', label: 'My Produce / Inventory', icon: Boxes },
        { path: '/farmer/schedule', label: 'Pickup Schedule', icon: Calendar },
        { path: '/farmer/earnings', label: 'Quota & Payments', icon: Wallet },
        { path: '/farmer/history', label: 'Supply History', icon: History },
        { path: '/farmer/messages', label: 'Messages & Support', icon: MessageSquare },
      ],
    },
    driver: {
      portalName: 'Collection Driver',
      subtitle: 'Farm to City Hub Transit',
      accentColor: 'text-amber-400',
      links: [
        { path: '/collection-driver', label: 'Dashboard', icon: LayoutDashboard, end: true },
        {
          path: '/collection-driver/schedule',
          label: 'Pickup Schedule',
          icon: Calendar,
          badge: readyPickupsCount > 0 ? readyPickupsCount : null,
          badgeColor: 'bg-amber-500 text-white',
        },
        { path: '/collection-driver/pickups', label: 'Pickup Verification', icon: ClipboardCheck },
        { path: '/collection-driver/route', label: 'My Route & Nav', icon: MapPin },
        { path: '/collection-driver/history', label: 'Trip History', icon: History },
      ],
    },
    hub: {
      portalName: 'City Hub Staff',
      subtitle: 'QC, Sorting & Dispatch Center',
      accentColor: 'text-indigo-400',
      links: [
        { path: '/city-hub', label: 'Dashboard', icon: LayoutDashboard, end: true },
        {
          path: '/city-hub/shipments',
          label: 'Incoming Shipments',
          icon: Truck,
          badge: incomingHubShipmentsCount > 0 ? incomingHubShipmentsCount : null,
          badgeColor: 'bg-indigo-500 text-white',
        },
        { path: '/city-hub/inventory', label: 'Hub Inventory', icon: Boxes },
        {
          path: '/city-hub/quality',
          label: 'Quality Inspection',
          icon: FileCheck2,
          badge: hubPendingInspectionCount > 0 ? hubPendingInspectionCount : null,
          badgeColor: 'bg-teal-500 text-white',
        },
        {
          path: '/city-hub/packing',
          label: 'Order Sorting & Packing',
          icon: PackageCheck,
          badge: hubPendingPackingCount > 0 ? hubPendingPackingCount : null,
          badgeColor: 'bg-cyan-500 text-white',
        },
        { path: '/city-hub/dispatch', label: 'Dispatch (2-Wheelers)', icon: Send },
        { path: '/city-hub/reports', label: 'Hub Reports', icon: BarChart3 },
      ],
    },
    delivery: {
      portalName: 'Delivery Agent',
      subtitle: 'Last-Mile Doorstep Delivery',
      accentColor: 'text-cyan-400',
      links: [
        { path: '/delivery-agent', label: 'Dashboard', icon: LayoutDashboard, end: true },
        {
          path: '/delivery-agent/packages',
          label: 'Assigned Packages',
          icon: Package,
          badge: agentAssignedPackagesCount > 0 ? agentAssignedPackagesCount : null,
          badgeColor: 'bg-cyan-500 text-white',
        },
        { path: '/delivery-agent/route', label: 'My Route & Map', icon: MapPin },
        { path: '/delivery-agent/confirm', label: 'Delivery Confirmation', icon: CheckCircle },
        { path: '/delivery-agent/history', label: 'Delivery History', icon: History },
      ],
    },
    admin: {
      portalName: 'Admin Portal',
      subtitle: 'End-to-End Operations Control',
      accentColor: 'text-purple-400',
      links: [
        { path: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard, end: true },
        { path: '/admin/orders', label: 'Incoming & All Orders', icon: Inbox },
        { path: '/admin/transit', label: 'Transit & Supply Chain', icon: ArrowRightLeft },
        { path: '/admin/customers', label: 'Customers', icon: Users },
        { path: '/admin/farmers', label: 'Farmers', icon: Tractor },
        { path: '/admin/delivery', label: 'Delivery Fleet', icon: Truck },
        { path: '/admin/inventory', label: 'Central Inventory', icon: Layers },
        { path: '/admin/payments', label: 'Quota & Payments', icon: Wallet },
        { path: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
  };

  const currentMenu = menusByRole[role] || menusByRole.farmer;

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 relative border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      } min-h-[calc(100vh-2.5rem)]`}
    >
      {/* Brand & Portal Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link to={`/${role === 'farmer' ? 'farmer' : role === 'driver' ? 'collection-driver' : role === 'hub' ? 'city-hub' : role === 'delivery' ? 'delivery-agent' : 'admin'}`} className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Leaf className="w-5 h-5 text-lime-300" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <h2 className="font-extrabold text-white text-sm tracking-tight truncate">
                {currentMenu.portalName}
              </h2>
              <span className={`text-[10px] font-medium tracking-wide ${currentMenu.accentColor}`}>
                {currentMenu.subtitle}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition hidden lg:block"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {currentMenu.links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition group ${
                  isActive
                    ? 'bg-forest-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`
              }
              title={collapsed ? link.label : ''}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="truncate">{link.label}</span>}
              </div>
              {!collapsed && link.badge && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                    link.badgeColor || 'bg-forest-500 text-white'
                  }`}
                >
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Profile summary card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {role.charAt(0).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <span className="block text-xs font-semibold text-white truncate">
                {role === 'farmer'
                  ? users.farmers.find((f) => f.id === activeProfileId)?.name || 'Farmer Ramesh'
                  : role === 'driver'
                  ? users.collectionDrivers.find((d) => d.id === activeProfileId)?.name || 'Driver Mahesh'
                  : role === 'hub'
                  ? users.cityHubStaff.name
                  : role === 'delivery'
                  ? users.deliveryAgents.find((a) => a.id === activeProfileId)?.name || 'Agent Arun'
                  : 'Dr. Radhika Menon'}
              </span>
              <span className="block text-[10px] text-slate-500 truncate capitalize">
                {role} Mode
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
              {role.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
