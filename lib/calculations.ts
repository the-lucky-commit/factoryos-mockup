import { Product, QuotationItem, Invoice } from './types';

// Calculate the sum of items before tax or flat discount
export function calculateSubtotal(items: QuotationItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

// Calculate the VAT amount based on rate (percentage, e.g., 7)
export function calculateVat(subtotalAfterDiscount: number, vatRatePercent: number = 7): number {
  return subtotalAfterDiscount * (vatRatePercent / 100);
}

// Calculate the grand total
export function calculateTotals(items: QuotationItem[], discountFlat: number = 0, vatRatePercent: number = 7) {
  const subtotal = calculateSubtotal(items);
  const subtotalAfterDiscount = Math.max(0, subtotal - discountFlat);
  const vatAmount = calculateVat(subtotalAfterDiscount, vatRatePercent);
  const grandTotal = subtotalAfterDiscount + vatAmount;

  return {
    subtotal,
    discountFlat,
    subtotalAfterDiscount,
    vatAmount,
    grandTotal,
  };
}

// Calculate total value of inventory (stock * cost or stock * selling price)
// We will use stock * cost for asset inventory value
export function calculateInventoryValue(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.stock * p.cost, 0);
}

// Count items where stock <= minStock
export function calculateLowStockCount(products: Product[]): number {
  return products.filter((p) => p.stock <= p.minStock).length;
}

// Sum of unpaid/outstanding invoice balances
export function calculateOutstandingAmount(invoices: Invoice[]): number {
  return invoices.reduce((sum, inv) => {
    if (inv.status !== 'Paid') {
      return sum + inv.outstandingAmount;
    }
    return sum;
  }, 0);
}

// Sum of overdue invoice balances
export function calculateOverdueAmount(invoices: Invoice[]): number {
  return invoices.reduce((sum, inv) => {
    if (inv.status === 'Overdue') {
      return sum + inv.outstandingAmount;
    }
    return sum;
  }, 0);
}
