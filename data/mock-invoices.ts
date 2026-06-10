import { Invoice } from '../lib/types';

export const mockInvoices: Invoice[] = [
  {
    id: "INV-26001",
    invoiceNumber: "INV202606-001",
    quotationNumber: "QT202606-001",
    customerId: "CUST-001",
    customerName: "Pattana Electrical Engineering Co., Ltd.",
    date: "2026-06-06",
    dueDate: "2026-07-06",
    amount: 173687.75,
    paidAmount: 0.00,
    outstandingAmount: 173687.75,
    status: "Unpaid"
  },
  {
    id: "INV-26002",
    invoiceNumber: "INV202605-008",
    quotationNumber: "QT202605-008",
    customerId: "CUST-001",
    customerName: "Pattana Electrical Engineering Co., Ltd.",
    date: "2026-05-10",
    dueDate: "2026-06-10",
    amount: 200000.00,
    paidAmount: 28687.75,
    outstandingAmount: 171312.25,
    status: "Partially Paid"
  },
  {
    id: "INV-26003",
    invoiceNumber: "INV202605-002",
    quotationNumber: "QT202604-030",
    customerId: "CUST-002",
    customerName: "Thai Grid Construction Partners",
    date: "2026-04-10",
    dueDate: "2026-05-10",
    amount: 750000.00,
    paidAmount: 0.00,
    outstandingAmount: 750000.00,
    status: "Overdue"
  },
  {
    id: "INV-26004",
    invoiceNumber: "INV202606-003",
    quotationNumber: "QT202606-005",
    customerId: "CUST-002",
    customerName: "Thai Grid Construction Partners",
    date: "2026-06-08",
    dueDate: "2026-07-08",
    amount: 500000.00,
    paidAmount: 0.00,
    outstandingAmount: 500000.00,
    status: "Unpaid"
  },
  {
    id: "INV-26005",
    invoiceNumber: "INV202605-010",
    quotationNumber: "QT202605-002",
    customerId: "CUST-004",
    customerName: "Grand Property Developer Group Plc.",
    date: "2026-04-20",
    dueDate: "2026-05-20",
    amount: 875200.00,
    paidAmount: 0.00,
    outstandingAmount: 875200.00,
    status: "Overdue"
  },
  {
    id: "INV-26006",
    invoiceNumber: "INV202606-005",
    quotationNumber: "QT202606-009",
    customerId: "CUST-005",
    customerName: "Mega Power Supply Systems",
    date: "2026-06-05",
    dueDate: "2026-06-20",
    amount: 12500.00,
    paidAmount: 0.00,
    outstandingAmount: 12500.00,
    status: "Unpaid"
  },
  {
    id: "INV-26007",
    invoiceNumber: "INV202604-012",
    quotationNumber: "QT202604-001",
    customerId: "CUST-003",
    customerName: "Apex Cable & Wire Distributors",
    date: "2026-04-01",
    dueDate: "2026-05-01",
    amount: 350000.00,
    paidAmount: 350000.00,
    outstandingAmount: 0.00,
    status: "Paid"
  },
  {
    id: "INV-26008",
    invoiceNumber: "INV202605-001",
    quotationNumber: "QT202605-003",
    customerId: "CUST-005",
    customerName: "Mega Power Supply Systems",
    date: "2026-05-01",
    dueDate: "2026-05-16",
    amount: 98000.00,
    paidAmount: 98000.00,
    outstandingAmount: 0.00,
    status: "Paid"
  }
];
