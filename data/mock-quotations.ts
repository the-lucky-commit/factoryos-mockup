import { Quotation } from '../lib/types';

export const mockQuotations: Quotation[] = [
  {
    id: "QT-26001",
    quotationNumber: "QT202606-001",
    customerId: "CUST-001",
    customerName: "Pattana Electrical Engineering Co., Ltd.",
    date: "2026-06-05",
    expiryDate: "2026-07-05",
    items: [
      {
        sku: "CV-1X50-0.6/1KV",
        name: "CV Cable 1x50 sq.mm 0.6/1kV",
        unit: "Meter",
        qty: 500,
        unitPrice: 215.00,
        discount: 5, // 5% discount
        total: 102125.00 // (500 * 215) * 0.95
      },
      {
        sku: "NYY-4X16-0.6/1KV",
        name: "NYY Cable 4x16 sq.mm 0.6/1kV",
        unit: "Meter",
        qty: 200,
        unitPrice: 330.00,
        discount: 5,
        total: 62700.00 // (200 * 330) * 0.95
      }
    ],
    discount: 2500.00, // Additional flat discount
    vatRate: 7,
    subtotal: 164825.00, // 102125 + 62700
    vatAmount: 11362.75, // (164825 - 2500) * 0.07
    grandTotal: 173687.75, // 162325 + 11362.75
    status: "Accepted",
    salesperson: "Ananya W. (Senior Account Executive)",
    terms: "Payment within 30 days after document receipt. Cable drums are returnable within 60 days.",
    notes: "Prices include delivery to Samut Prakan project site. Thank you for your business."
  },
  {
    id: "QT-26002",
    quotationNumber: "QT202606-002",
    customerId: "CUST-002",
    customerName: "Thai Grid Construction Partners",
    date: "2026-06-08",
    expiryDate: "2026-07-08",
    items: [
      {
        sku: "CV-1X95-0.6/1KV",
        name: "CV Cable 1x95 sq.mm 0.6/1kV",
        unit: "Meter",
        qty: 1200,
        unitPrice: 410.00,
        discount: 10,
        total: 442800.00
      },
      {
        sku: "AL-THW-A-1X70-450/750V",
        name: "Aluminum Cable THW-A 1x70 sq.mm 450/750V",
        unit: "Meter",
        qty: 5000,
        unitPrice: 39.50,
        discount: 10,
        total: 177750.00
      }
    ],
    discount: 10000.00,
    vatRate: 7,
    subtotal: 620550.00,
    vatAmount: 42738.50,
    grandTotal: 653288.50,
    status: "Sent",
    salesperson: "Charnchai P. (Sales Manager)",
    terms: "60 Days Credit. Delivery timeline: 10-14 days post PO.",
    notes: "Special project pricing discount applied. Subject to raw copper commodity price adjustments if PO is delayed."
  },
  {
    id: "QT-26003",
    quotationNumber: "QT202606-003",
    customerId: "CUST-004",
    customerName: "Grand Property Developer Group Plc.",
    date: "2026-06-09",
    expiryDate: "2026-07-09",
    items: [
      {
        sku: "VCT-4X2.5-450/750V",
        name: "VCT Cable 4x2.5 sq.mm 450/750V",
        unit: "Meter",
        qty: 1500,
        unitPrice: 65.00,
        discount: 8,
        total: 89700.00
      },
      {
        sku: "CTL-12X1.5-0.6/1KV",
        name: "Control Cable 12 Core 1.5 sq.mm 0.6/1kV",
        unit: "Meter",
        qty: 400,
        unitPrice: 98.00,
        discount: 5,
        total: 37240.00
      }
    ],
    discount: 0.00,
    vatRate: 7,
    subtotal: 126940.00,
    vatAmount: 8885.80,
    grandTotal: 135825.80,
    status: "Draft",
    salesperson: "Ananya W. (Senior Account Executive)",
    terms: "45 Days Credit.",
    notes: "Draft prepared for building extension phase 2. Waiting for customer core-count validation."
  },
  {
    id: "QT-26004",
    quotationNumber: "QT202605-015",
    customerId: "CUST-005",
    customerName: "Mega Power Supply Systems",
    date: "2026-05-15",
    expiryDate: "2026-06-15",
    items: [
      {
        sku: "THW-1X10-450/750V",
        name: "THW Wire 1x10 sq.mm 450/750V",
        unit: "Roll",
        qty: 10,
        unitPrice: 1450.00,
        discount: 0,
        total: 14500.00
      }
    ],
    discount: 0.00,
    vatRate: 7,
    subtotal: 14500.00,
    vatAmount: 1015.00,
    grandTotal: 15515.00,
    status: "Expired",
    salesperson: "Ananya W. (Senior Account Executive)",
    terms: "Cash on delivery.",
    notes: "Small order customer did not follow up. Quotation expired."
  },
  {
    id: "QT-26005",
    quotationNumber: "QT202605-012",
    customerId: "CUST-002",
    customerName: "Thai Grid Construction Partners",
    date: "2026-05-10",
    expiryDate: "2026-06-10",
    items: [
      {
        sku: "NYY-4X25-0.6/1KV",
        name: "NYY Cable 4x25 sq.mm 0.6/1kV",
        unit: "Meter",
        qty: 800,
        unitPrice: 510.00,
        discount: 12,
        total: 359040.00
      }
    ],
    discount: 5000.00,
    vatRate: 7,
    subtotal: 359040.00,
    vatAmount: 24782.80,
    grandTotal: 378822.80,
    status: "Rejected",
    salesperson: "Charnchai P. (Sales Manager)",
    terms: "60 Days Credit.",
    notes: "Rejected due to delivery timeline competition. Competitor offered immediate ex-stock."
  }
];
