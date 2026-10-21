import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Gateway Page
import { RoleSelectPage } from './pages/RoleSelectPage';

// Customer Pages
import { CustomerHome } from './pages/customer/CustomerHome';
import { CustomerShop } from './pages/customer/CustomerShop';
import { CustomerCart } from './pages/customer/CustomerCart';
import { CustomerCheckout } from './pages/customer/CustomerCheckout';
import { CustomerPayment } from './pages/customer/CustomerPayment';
import { CustomerOrders } from './pages/customer/CustomerOrders';
import { CustomerTrackOrder } from './pages/customer/CustomerTrackOrder';
import { CustomerSupport } from './pages/customer/CustomerSupport';
import { CustomerProfile } from './pages/customer/CustomerProfile';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FarmerIncomingOrders } from './pages/farmer/FarmerIncomingOrders';
import { FarmerAcceptedOrders } from './pages/farmer/FarmerAcceptedOrders';
import { FarmerInventory } from './pages/farmer/FarmerInventory';
import { FarmerPickupSchedule } from './pages/farmer/FarmerPickupSchedule';
import { FarmerEarnings } from './pages/farmer/FarmerEarnings';
import { FarmerHistory } from './pages/farmer/FarmerHistory';
import { FarmerMessages } from './pages/farmer/FarmerMessages';

// Driver Pages
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DriverSchedule } from './pages/driver/DriverSchedule';
import { DriverPickups } from './pages/driver/DriverPickups';
import { DriverRoute } from './pages/driver/DriverRoute';
import { DriverHistory } from './pages/driver/DriverHistory';

// City Hub Pages
import { HubDashboard } from './pages/hub/HubDashboard';
import { HubIncomingShipments } from './pages/hub/HubIncomingShipments';
import { HubInventory } from './pages/hub/HubInventory';
import { HubQualityInspection } from './pages/hub/HubQualityInspection';
import { HubPacking } from './pages/hub/HubPacking';
import { HubDispatch } from './pages/hub/HubDispatch';
import { HubReports } from './pages/hub/HubReports';

// Delivery Agent Pages
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { DeliveryPackages } from './pages/delivery/DeliveryPackages';
import { DeliveryRoute } from './pages/delivery/DeliveryRoute';
import { DeliveryConfirm } from './pages/delivery/DeliveryConfirm';
import { DeliveryHistory } from './pages/delivery/DeliveryHistory';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminFarmers } from './pages/admin/AdminFarmers';
import { AdminDelivery } from './pages/admin/AdminDelivery';
import { AdminTransit } from './pages/admin/AdminTransit';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminReports } from './pages/admin/AdminReports';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Demo Role Gateway */}
          <Route path="/roles" element={<RoleSelectPage />} />

          {/* 1. Customer Portal */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Navigate to="/customer" replace />} />
            <Route path="customer" element={<CustomerHome />} />
            <Route path="customer/shop" element={<CustomerShop initialCategory="all" />} />
            <Route path="customer/vegetables" element={<CustomerShop initialCategory="vegetables" />} />
            <Route path="customer/fruits" element={<CustomerShop initialCategory="fruits" />} />
            <Route path="customer/cart" element={<CustomerCart />} />
            <Route path="customer/checkout" element={<CustomerCheckout />} />
            <Route path="customer/payment" element={<CustomerPayment />} />
            <Route path="customer/orders" element={<CustomerOrders />} />
            <Route path="customer/orders/:orderId" element={<CustomerTrackOrder />} />
            <Route path="customer/support" element={<CustomerSupport />} />
            <Route path="customer/profile" element={<CustomerProfile />} />
          </Route>

          {/* 2. Farmer Portal */}
          <Route path="/farmer" element={<DashboardLayout role="farmer" />}>
            <Route index element={<FarmerDashboard />} />
            <Route path="incoming" element={<FarmerIncomingOrders />} />
            <Route path="accepted" element={<FarmerAcceptedOrders />} />
            <Route path="inventory" element={<FarmerInventory />} />
            <Route path="schedule" element={<FarmerPickupSchedule />} />
            <Route path="earnings" element={<FarmerEarnings />} />
            <Route path="history" element={<FarmerHistory />} />
            <Route path="messages" element={<FarmerMessages />} />
          </Route>

          {/* 3. Collection Driver Portal */}
          <Route path="/collection-driver" element={<DashboardLayout role="driver" />}>
            <Route index element={<DriverDashboard />} />
            <Route path="schedule" element={<DriverSchedule />} />
            <Route path="pickups" element={<DriverPickups />} />
            <Route path="route" element={<DriverRoute />} />
            <Route path="history" element={<DriverHistory />} />
          </Route>

          {/* 4. City Hub Staff Portal */}
          <Route path="/city-hub" element={<DashboardLayout role="hub" />}>
            <Route index element={<HubDashboard />} />
            <Route path="shipments" element={<HubIncomingShipments />} />
            <Route path="inventory" element={<HubInventory />} />
            <Route path="quality" element={<HubQualityInspection />} />
            <Route path="packing" element={<HubPacking />} />
            <Route path="dispatch" element={<HubDispatch />} />
            <Route path="reports" element={<HubReports />} />
          </Route>

          {/* 5. Delivery Agent Portal */}
          <Route path="/delivery-agent" element={<DashboardLayout role="delivery" />}>
            <Route index element={<DeliveryDashboard />} />
            <Route path="packages" element={<DeliveryPackages />} />
            <Route path="route" element={<DeliveryRoute />} />
            <Route path="confirm" element={<DeliveryConfirm />} />
            <Route path="history" element={<DeliveryHistory />} />
          </Route>

          {/* 6. Admin Operations Portal */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="transit" element={<AdminTransit />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="farmers" element={<AdminFarmers />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/customer" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
