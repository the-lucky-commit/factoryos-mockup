export interface Product {
  sku: string;
  name: string;
  category: string;
  cableType: string;
  core: number; // number of cores, e.g., 1, 2, 4, 12
  size: string; // e.g., "1.5", "10", "50", "95"
  voltage: string; // e.g., "0.6/1kV", "450/750V"
  color: string; // e.g., "Black", "Green/Yellow", "Red"
  unit: string; // e.g., "Meter", "Roll", "Drum"
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  datasheet: boolean;
  image?: string;
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  creditTerm: string; // e.g., "Cash", "30 Days", "60 Days"
  totalOrders: number;
  outstandingBalance: number;
}

export interface InventoryMovement {
  id: string;
  productSku: string;
  productName: string;
  type: 'Receive Stock' | 'Issue Stock' | 'Adjust Stock';
  quantity: number;
  date: string;
  notes: string;
  operator: string;
}

export interface QuotationItem {
  sku: string;
  name: string;
  unit: string;
  qty: number;
  unitPrice: number;
  discount: number; // Percentage or value, let's treat it as percentage for simplicity, or flat rate
  total: number; // (qty * unitPrice) * (1 - discount/100)
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  expiryDate: string;
  items: QuotationItem[];
  discount: number; // Flat discount
  vatRate: number; // e.g., 7 for 7%
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  salesperson: string;
  terms: string;
  notes: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
}

export interface DashboardMetric {
  totalRevenue: number;
  activeQuotations: number;
  pendingInvoices: number;
  inventoryValue: number;
  lowStockItems: number;
  monthlyOrders: number;
}
