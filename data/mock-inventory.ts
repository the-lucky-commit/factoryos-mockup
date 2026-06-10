import { InventoryMovement } from '../lib/types';

export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: "MV-001",
    productSku: "CV-1X50-0.6/1KV",
    productName: "CV Cable 1x50 sq.mm 0.6/1kV",
    type: "Receive Stock",
    quantity: 500,
    date: "2026-06-08T09:30:00Z",
    notes: "Production Batch #CV-50-202606",
    operator: "Sompot K. (Warehouse Lead)"
  },
  {
    id: "MV-002",
    productSku: "NYY-4X25-0.6/1KV",
    productName: "NYY Cable 4x25 sq.mm 0.6/1kV",
    type: "Issue Stock",
    quantity: 150,
    date: "2026-06-07T14:15:00Z",
    notes: "Shipped for SO-260601 (Thai Grid)",
    operator: "Anek S. (Warehouse Staff)"
  },
  {
    id: "MV-003",
    productSku: "THW-1X2.5-450/750V-G",
    productName: "THW Wire 1x2.5 sq.mm 450/750V (Green/Yellow)",
    type: "Issue Stock",
    quantity: 50,
    date: "2026-06-06T11:00:00Z",
    notes: "Stock depleted - Shipped for SO-260599",
    operator: "Anek S. (Warehouse Staff)"
  },
  {
    id: "MV-004",
    productSku: "VCT-4X2.5-450/750V",
    productName: "VCT Cable 4x2.5 sq.mm 450/750V",
    type: "Receive Stock",
    quantity: 1000,
    date: "2026-06-05T08:00:00Z",
    notes: "Supplier Delivery (Phelps Dodge)",
    operator: "Sompot K. (Warehouse Lead)"
  },
  {
    id: "MV-005",
    productSku: "THW-1X10-450/750V",
    productName: "THW Wire 1x10 sq.mm 450/750V",
    type: "Adjust Stock",
    quantity: -5,
    date: "2026-06-04T16:30:00Z",
    notes: "Physical inventory audit correction (-5 rolls)",
    operator: "Sompot K. (Warehouse Lead)"
  },
  {
    id: "MV-006",
    productSku: "AL-THW-A-1X70-450/750V",
    productName: "Aluminum Cable THW-A 1x70 sq.mm 450/750V",
    type: "Receive Stock",
    quantity: 2000,
    date: "2026-06-02T10:45:00Z",
    notes: "Production Batch #AL-70-202605",
    operator: "Anek S. (Warehouse Staff)"
  }
];
