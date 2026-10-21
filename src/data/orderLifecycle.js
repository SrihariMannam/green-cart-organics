// Centralized definition of the supply chain lifecycle, status steps, and validation

export const FULFILLMENT_STAGES = {
  CONFIRMED: {
    key: 'CONFIRMED',
    label: 'Order Confirmed',
    customerStep: 1,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Order placed by customer and confirmed.',
  },
  FARMER_ACCEPTED: {
    key: 'FARMER_ACCEPTED',
    label: 'Accepted by Farmer',
    customerStep: 2,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Farmer claimed and committed to preparing produce.',
  },
  READY_FOR_PICKUP: {
    key: 'READY_FOR_PICKUP',
    label: 'Ready for Collection',
    customerStep: 3,
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Harvested, weighed, and awaiting truck collection.',
  },
  PICKED_UP: {
    key: 'PICKED_UP',
    label: 'In Transit to City Hub',
    customerStep: 4,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Collected by truck driver and moving to city hub.',
  },
  RECEIVED_AT_HUB: {
    key: 'RECEIVED_AT_HUB',
    label: 'Received at City Hub',
    customerStep: 5,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Arrived at hub aggregation center for quality check.',
  },
  QUALITY_CHECKED: {
    key: 'QUALITY_CHECKED',
    label: 'Quality Checked',
    customerStep: 5,
    color: 'bg-teal-100 text-teal-800 border-teal-300',
    description: 'Inspected for freshness, sorted, and graded.',
  },
  PACKED: {
    key: 'PACKED',
    label: 'Packed & Awaiting Dispatch',
    customerStep: 6,
    color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    description: 'Packed into eco-crates with custom barcode labels.',
  },
  ASSIGNED_TO_DELIVERY: {
    key: 'ASSIGNED_TO_DELIVERY',
    label: 'Assigned to Delivery Agent',
    customerStep: 6,
    color: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Assigned to 2-wheeler delivery partner for last mile.',
  },
  OUT_FOR_DELIVERY: {
    key: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    customerStep: 7,
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Delivery partner is en route to customer doorstep.',
  },
  DELIVERED: {
    key: 'DELIVERED',
    label: 'Delivered',
    customerStep: 8,
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Successfully handed over to customer.',
  },
  CANCELLED: {
    key: 'CANCELLED',
    label: 'Cancelled',
    customerStep: -1,
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'Order was cancelled.',
  },
  ISSUE_REPORTED: {
    key: 'ISSUE_REPORTED',
    label: 'Issue Reported',
    customerStep: -1,
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Delivery failed or shortage reported.',
  }
};

// Customer-facing 8-step tracking sequence
export const CUSTOMER_TRACKING_STEPS = [
  { step: 1, title: 'Order Confirmed', key: 'CONFIRMED', desc: 'Received & verified' },
  { step: 2, title: 'Accepted by Farmer', key: 'FARMER_ACCEPTED', desc: 'Harvest scheduled' },
  { step: 3, title: 'Ready for Collection', key: 'READY_FOR_PICKUP', desc: 'Weighed & packed at farm' },
  { step: 4, title: 'Picked Up by Driver', key: 'PICKED_UP', desc: 'EV truck in transit to hub' },
  { step: 5, title: 'Received at City Hub', key: 'RECEIVED_AT_HUB', desc: 'QC & sorting' },
  { step: 6, title: 'Packed & Dispatched', key: 'ASSIGNED_TO_DELIVERY', desc: 'Handoff to 2-wheeler agent' },
  { step: 7, title: 'Out for Delivery', key: 'OUT_FOR_DELIVERY', desc: 'Near your location' },
  { step: 8, title: 'Delivered', key: 'DELIVERED', desc: 'Handed over fresh' },
];

export const PAYMENT_METHODS = {
  UPI: 'UPI',
  COD: 'COD',
};

export const PAYMENT_STATUS = {
  PAID_DEMO: {
    key: 'PAID_DEMO',
    label: 'Paid (Demo UPI)',
    color: 'bg-emerald-100 text-emerald-800',
  },
  PENDING_ON_DELIVERY: {
    key: 'PENDING_ON_DELIVERY',
    label: 'Pay on Delivery (COD)',
    color: 'bg-amber-100 text-amber-800',
  },
  COLLECTED_ON_DELIVERY: {
    key: 'COLLECTED_ON_DELIVERY',
    label: 'Collected on Delivery',
    color: 'bg-emerald-100 text-emerald-800',
  },
};
