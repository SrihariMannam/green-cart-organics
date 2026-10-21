import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FARMER_INVENTORY,
} from '../data/initialData';
import { generateId } from '../utils/formatters';

const STORAGE_KEYS = {
  PRODUCTS: 'gco_v1_products',
  USERS: 'gco_v1_users',
  ORDERS: 'gco_v1_orders',
  INVENTORY: 'gco_v1_inventory',
  NOTIFICATIONS: 'gco_v1_notifications',
  CART: 'gco_v1_cart',
  ACTIVE_ROLE: 'gco_v1_active_role',
  ACTIVE_PROFILE_ID: 'gco_v1_active_profile_id',
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Core State with localStorage fallback
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return stored ? JSON.parse(stored) : INITIAL_FARMER_INVENTORY;
    } catch {
      return INITIAL_FARMER_INVENTORY;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Current active portal & profile
  const [activeRole, setActiveRole] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || 'customer';
    } catch {
      return 'customer';
    }
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID) || 'cust-1';
    } catch {
      return 'cust-1';
    }
  });

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to sync products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to sync users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to sync inventory to localStorage', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to sync notifications to localStorage', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, activeRole);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, activeProfileId);
    } catch (e) {
      console.error('Failed to sync active role to localStorage', e);
    }
  }, [activeRole, activeProfileId]);

  // Switch role helper
  const switchRole = (newRole, newProfileId = null) => {
    setActiveRole(newRole);
    if (newProfileId) {
      setActiveProfileId(newProfileId);
    } else {
      // Default profile ID per role
      if (newRole === 'customer') setActiveProfileId('cust-1');
      else if (newRole === 'farmer') setActiveProfileId('farmer-1');
      else if (newRole === 'driver') setActiveProfileId('driver-1');
      else if (newRole === 'hub') setActiveProfileId('hub-1');
      else if (newRole === 'delivery') setActiveProfileId('agent-1');
      else if (newRole === 'admin') setActiveProfileId('admin-1');
    }
  };

  // Switch specifically between sub-profiles of the same role (e.g. Farmer 1 vs Farmer 2)
  const setRoleProfile = (profileId) => {
    setActiveProfileId(profileId);
  };

  // Notifications helper
  const addNotification = ({ targetRole, targetId = null, title, message, orderId = null }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      targetRole,
      targetId,
      title,
      message,
      time: 'Just now',
      read: false,
      orderId,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // --- CART MANAGEMENT ---
  const addToCart = (product, quantityKg = 1) => {
    const qty = Number(quantityKg);
    if (qty <= 0 || isNaN(qty)) {
      showToast('Please select a valid quantity greater than 0 kg', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantityKg: item.quantityKg + qty }
            : item
        );
      }
      return [...prev, { product, quantityKg: qty }];
    });
    showToast(`Added ${qty} kg of ${product.name} to cart!`, 'success');
  };

  const updateCartQuantity = (productId, newQuantityKg) => {
    const qty = Number(newQuantityKg);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantityKg: qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart Calculations & 3-veg + 3-fruit validations
  const distinctVegetables = cart.filter((item) => item.product.category === 'vegetables');
  const distinctFruits = cart.filter((item) => item.product.category === 'fruits');
  const vegetablesCount = distinctVegetables.length;
  const fruitsCount = distinctFruits.length;

  const isVegetableRequirementMet = vegetablesCount >= 3;
  const isFruitRequirementMet = fruitsCount >= 3;
  const isMinimumRequirementMet = true; // Special organic offer removed

  const totalCartWeightKg = cart.reduce((acc, item) => acc + item.quantityKg, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.pricePerKg * item.quantityKg, 0);
  const cartDeliveryFee = cartSubtotal >= 500 ? 0 : (cart.length > 0 ? 40 : 0);
  const cartTotalAmount = cartSubtotal + cartDeliveryFee;

  // --- ORDER CREATION & LIFECYCLE ACTIONS ---

  // 1. Create Order (from Customer Checkout -> Payment)
  const placeOrder = ({ customerDetails, paymentMethod, paymentDetails = {} }) => {
    // Minimum requirement check removed (offer disabled)


    const orderId = generateId('GCO');
    const orderItems = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      category: item.product.category,
      pricePerKg: item.product.pricePerKg,
      quantityKg: item.quantityKg,
      subtotal: item.product.pricePerKg * item.quantityKg,
    }));

    const isPaid = paymentMethod === 'UPI';
    const newOrder = {
      id: orderId,
      orderDate: new Date().toISOString(),
      customer: {
        id: users.customer.id,
        name: customerDetails.fullName,
        phone: customerDetails.phone,
        address: `${customerDetails.addressLine}, ${customerDetails.locality}, ${customerDetails.city} - ${customerDetails.pincode}`,
        locality: customerDetails.locality,
        city: customerDetails.city,
        pincode: customerDetails.pincode,
        deliveryInstructions: customerDetails.deliveryInstructions || '',
      },
      items: orderItems,
      totalWeightKg: totalCartWeightKg,
      itemSubtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      totalAmount: cartTotalAmount,
      paymentMethod,
      paymentStatus: isPaid ? 'PAID_DEMO' : 'PENDING_ON_DELIVERY',
      paymentDetails: isPaid
        ? {
            txnId: paymentDetails.txnId || `UPI-${Date.now()}`,
            timestamp: new Date().toISOString(),
            mockApp: paymentDetails.mockApp || 'Google Pay',
          }
        : null,
      fulfillmentStatus: 'CONFIRMED',
      assignedFarmerId: null,
      farmerAcceptedAt: null,
      preparedProduce: [],
      actualPreparedKg: null,
      pickupRecord: null,
      hubReceipt: null,
      qualityInspection: null,
      packingRecord: null,
      deliveryAssignment: null,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Customer order placed successfully.',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Broadcast notifications
    addNotification({
      targetRole: 'admin',
      title: `New Order Placed: ${orderId}`,
      message: `${customerDetails.fullName} placed an order of ${totalCartWeightKg.toFixed(1)} kg (${formatCurrency(cartTotalAmount)}).`,
      orderId,
    });

    addNotification({
      targetRole: 'farmer',
      title: `New Farm Produce Request: ${orderId}`,
      message: `Open order available for harvest in ${customerDetails.locality}. First-come, first-served claim.`,
      orderId,
    });

    showToast(`Order ${orderId} confirmed successfully!`, 'success');
    return { success: true, order: newOrder };
  };

  // 2. Farmer Acceptance (First-Come, First-Served Concurrency Simulation)
  const acceptOrderByFarmer = (orderId, farmerId) => {
    // Read directly from state / storage to avoid stale closure
    const currentOrder = orders.find((o) => o.id === orderId);
    if (!currentOrder) {
      return { success: false, message: 'Order not found.' };
    }

    if (currentOrder.assignedFarmerId) {
      const assignedFarmer = users.farmers.find((f) => f.id === currentOrder.assignedFarmerId);
      const farmerName = assignedFarmer ? assignedFarmer.name : 'another farmer';
      const msg = `This order has already been accepted by ${farmerName}.`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    const currentFarmer = users.farmers.find((f) => f.id === farmerId);
    const farmerName = currentFarmer ? currentFarmer.name : 'Farmer';

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            assignedFarmerId: farmerId,
            farmerAcceptedAt: new Date().toISOString(),
            fulfillmentStatus: 'FARMER_ACCEPTED',
            notes: `Accepted by ${farmerName}. Harvest preparation scheduled.`,
          };
        }
        return o;
      })
    );

    addNotification({
      targetRole: 'customer',
      title: 'Order Update!',

      message: `${farmerName} has claimed your order ${orderId} and started preparing fresh produce.`,
      orderId,
    });

    addNotification({
      targetRole: 'admin',
      title: `Order Claimed: ${orderId}`,
      message: `${farmerName} accepted order ${orderId} (first-come, first-served).`,
      orderId,
    });

    showToast(`You have successfully claimed order ${orderId}!`, 'success');
    return { success: true };
  };

  // 3. Farmer Produce Preparation & Dispatch to Collection
  const prepareProduceForOrder = (orderId, { preparedItems, actualPreparedKg, notes }) => {
    const currentOrder = orders.find((o) => o.id === orderId);
    if (!currentOrder) return { success: false, message: 'Order not found' };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            preparedProduce: preparedItems,
            actualPreparedKg: Number(actualPreparedKg),
            fulfillmentStatus: 'READY_FOR_PICKUP',
            farmerNotes: notes || '',
          };
        }
        return o;
      })
    );

    addNotification({
      targetRole: 'driver',
      title: `Pickup Ready at Farm: ${orderId}`,
      message: `Produce weighed & ready (${actualPreparedKg} kg). Scheduled for collection truck dispatch.`,
      orderId,
    });

    addNotification({
      targetRole: 'customer',
      title: 'Produce Harvested & Packed!',
      message: `Your produce for ${orderId} has been harvested and is awaiting collection truck pickup.`,
      orderId,
    });

    showToast(`Order ${orderId} marked Ready for Pickup!`, 'success');
    return { success: true };
  };

  // 4. Collection Driver Verification & Pickup
  const confirmPickupByDriver = (orderId, { driverId, collectedKg, condition, notes, photoUrl }) => {
    const driver = users.collectionDrivers.find((d) => d.id === driverId);
    const driverName = driver ? driver.name : 'Collection Driver';

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: 'PICKED_UP',
            pickupRecord: {
              pickupId: generateId('PKP'),
              driverId,
              driverName,
              vehicleNumber: driver ? driver.vehicleNumber : 'Truck EV',
              collectedKg: Number(collectedKg),
              collectedAt: new Date().toISOString(),
              condition: condition || 'Fresh & Good Condition',
              notes: notes || '',
              photoUrl: photoUrl || null,
            },
          };
        }
        return o;
      })
    );

    addNotification({
      targetRole: 'hub',
      title: `Truck En Route to Hub: ${orderId}`,
      message: `${driverName} collected ${collectedKg} kg. Heading towards City Aggregation Hub.`,
      orderId,
    });

    addNotification({
      targetRole: 'customer',
      title: 'Produce Picked Up from Farm',
      message: `Driver ${driverName} collected your produce and is transporting it to our central hub.`,
      orderId,
    });

    showToast(`Pickup verified! Order ${orderId} is now in transit to City Hub.`, 'success');
    return { success: true };
  };

  // 5. Driver Confirm Delivery to Hub / Hub Receipt
  const confirmDeliveryToHub = (orderId, { bayNumber = 'Bay 1', receivedBy = 'hub-1' }) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: 'RECEIVED_AT_HUB',
            hubReceipt: {
              receivedAt: new Date().toISOString(),
              receivedBy,
              bayNumber,
              receivedKg: o.pickupRecord ? o.pickupRecord.collectedKg : o.totalWeightKg,
            },
          };
        }
        return o;
      })
    );

    addNotification({
      targetRole: 'hub',
      title: `Shipment Arrived at Hub: ${orderId}`,
      message: `Shipment received at ${bayNumber}. Ready for quality inspection.`,
      orderId,
    });

    showToast(`Order ${orderId} confirmed as received at City Hub!`, 'success');
    return { success: true };
  };

  // 6. City Hub Quality Inspection
  const submitQualityInspection = (orderId, { inspectedBy, acceptedKg, rejectedKg, grade, notes, photoUrl }) => {
    const acc = Number(acceptedKg);
    const rej = Number(rejectedKg);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: 'QUALITY_CHECKED',
            qualityInspection: {
              inspectedBy,
              acceptedKg: acc,
              rejectedKg: rej,
              grade,
              notes: notes || '',
              photoUrl: photoUrl || null,
              inspectedAt: new Date().toISOString(),
            },
          };
        }
        return o;
      })
    );

    addNotification({
      targetRole: 'hub',
      title: `Quality Inspection Complete: ${orderId}`,
      message: `Accepted: ${acc} kg, Rejected: ${rej} kg. Grade: ${grade}. Ready for packing.`,
      orderId,
    });

    showToast(`Quality inspection recorded for ${orderId}`, 'success');
    return { success: true };
  };

  // 7. City Hub Sorting & Packing
  const packOrderAtHub = (orderId, { packedBy, packageCount, packageWeightKg, packageLabel }) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: 'PACKED',
            packingRecord: {
              packedBy,
              packageCount: Number(packageCount) || 1,
              packageWeightKg: Number(packageWeightKg),
              packageLabel: packageLabel || `PKG-${orderId}-BOX1`,
              packedAt: new Date().toISOString(),
            },
          };
        }
        return o;
      })
    );

    showToast(`Order ${orderId} successfully packed and labeled!`, 'success');
    return { success: true };
  };

  // 8. City Hub Dispatch to 2-Wheeler Delivery Agent
  const dispatchToDeliveryAgent = (orderId, { agentId, estimatedSlot }) => {
    const agent = users.deliveryAgents.find((a) => a.id === agentId);
    const agentName = agent ? agent.name : 'Delivery Partner';
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: 'ASSIGNED_TO_DELIVERY',
            deliveryAssignment: {
              agentId,
              agentName,
              assignedAt: new Date().toISOString(),
              estimatedSlot: estimatedSlot || '11:00 AM - 01:00 PM',
              deliveryOtp: generatedOtp,
            },
          };
        }
        return o;
      })
    );

    addNotification({
      targetRole: 'delivery',
      targetId: agentId,
      title: `New Package Assigned: ${orderId}`,
      message: `Package ready for pickup at hub. Delivery address: ${orders.find((o) => o.id === orderId)?.customer?.locality}.`,
      orderId,
    });

    addNotification({
      targetRole: 'customer',
      title: 'Order Packed & Assigned!',
      message: `Your organic box ${orderId} is assigned to 2-wheeler partner ${agentName}.`,
      orderId,
    });

    showToast(`Order ${orderId} dispatched to ${agentName}!`, 'success');
    return { success: true };
  };

  // 9. Delivery Agent Marks Out for Delivery
  const markOutForDelivery = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: 'OUT_FOR_DELIVERY',
            deliveryAssignment: {
              ...(o.deliveryAssignment || {}),
              outForDeliveryAt: new Date().toISOString(),
            },
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    const otp = targetOrder?.deliveryAssignment?.deliveryOtp || '****';

    addNotification({
      targetRole: 'customer',
      title: `Out for Delivery: ${orderId}`,
      message: `Delivery agent is arriving soon! Please share OTP ${otp} upon delivery.`,
      orderId,
    });

    showToast(`Order ${orderId} is now Out for Delivery!`, 'success');
    return { success: true };
  };

  // 10. Delivery Agent Confirms Handover
  const confirmDelivery = (orderId, { enteredOtp, proofNotes, photoUrl, paymentCollected = true }) => {
    const currentOrder = orders.find((o) => o.id === orderId);
    if (!currentOrder) return { success: false, message: 'Order not found' };

    const expectedOtp = currentOrder.deliveryAssignment?.deliveryOtp;
    if (expectedOtp && enteredOtp && enteredOtp.trim() !== expectedOtp.trim()) {
      showToast('Incorrect OTP! Please check with customer or check the order card.', 'error');
      return { success: false, message: 'Incorrect OTP' };
    }

    const isCod = currentOrder.paymentMethod === 'COD';

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: 'DELIVERED',
            paymentStatus: isCod && paymentCollected ? 'COLLECTED_ON_DELIVERY' : o.paymentStatus,
            deliveryAssignment: {
              ...(o.deliveryAssignment || {}),
              deliveredAt: new Date().toISOString(),
              proofNotes: proofNotes || 'Handed over directly to customer',
              proofPhotoUrl: photoUrl || null,
              paymentCollected: isCod ? paymentCollected : true,
            },
          };
        }
        return o;
      })
    );

    addNotification({
      targetRole: 'customer',
      title: `Order Delivered: ${orderId}!`,
      message: 'Your farm-fresh organic produce has been successfully delivered. Enjoy healthy meals!',
      orderId,
    });

    addNotification({
      targetRole: 'admin',
      title: `Order Complete: ${orderId}`,
      message: `Delivered to ${currentOrder.customer.name} (${isCod ? 'COD collected' : 'UPI prepaid'}).`,
      orderId,
    });

    showToast(`Order ${orderId} marked as DELIVERED successfully!`, 'success');
    return { success: true };
  };

  // 11. Report Delivery Issue / Failed Delivery
  const reportDeliveryIssue = (orderId, { reason, notes }) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: 'ISSUE_REPORTED',
            deliveryIssue: {
              reason,
              notes,
              reportedAt: new Date().toISOString(),
            },
          };
        }
        return o;
      })
    );

    addNotification({
      targetRole: 'admin',
      title: `Delivery Issue: ${orderId}`,
      message: `Reason: ${reason} - ${notes}`,
      orderId,
    });

    showToast(`Issue reported for ${orderId}. Flagged for hub resolution.`, 'warning');
    return { success: true };
  };

  // 12. Reset All Demo Data (Admin requirement)
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CART);

    setProducts(INITIAL_PRODUCTS);
    setUsers(INITIAL_USERS);
    setOrders(INITIAL_ORDERS);
    setInventory(INITIAL_FARMER_INVENTORY);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCart([]);
    setActiveRole('customer');
    setActiveProfileId('cust-1');

    showToast('Demo data successfully reset to initial factory state!', 'info');
  };

  const value = {
    // Data
    products,
    users,
    orders,
    inventory,
    notifications,
    cart,
    activeRole,
    activeProfileId,
    toast,

    // Cart calculations & validators
    distinctVegetables,
    distinctFruits,
    vegetablesCount,
    fruitsCount,
    isVegetableRequirementMet,
    isFruitRequirementMet,
    isMinimumRequirementMet,
    totalCartWeightKg,
    cartSubtotal,
    cartDeliveryFee,
    cartTotalAmount,

    // Methods
    switchRole,
    setRoleProfile,
    showToast,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    addNotification,
    markNotificationAsRead,

    // Order Lifecycle Handlers
    placeOrder,
    acceptOrderByFarmer,
    prepareProduceForOrder,
    confirmPickupByDriver,
    confirmDeliveryToHub,
    submitQualityInspection,
    packOrderAtHub,
    dispatchToDeliveryAgent,
    markOutForDelivery,
    confirmDelivery,
    reportDeliveryIssue,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
