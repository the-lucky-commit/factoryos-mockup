import { Badge } from './badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Normalize string for safety
  const s = status.trim();

  // Stock status mapping
  if (s === 'In Stock') return <Badge variant="success">In Stock</Badge>;
  if (s === 'Low Stock') return <Badge variant="warning">Low Stock</Badge>;
  if (s === 'Out of Stock') return <Badge variant="danger">Out of Stock</Badge>;

  // Quotation status mapping
  if (s === 'Accepted') return <Badge variant="success">Accepted</Badge>;
  if (s === 'Sent') return <Badge variant="default">Sent</Badge>;
  if (s === 'Draft') return <Badge variant="secondary">Draft</Badge>;
  if (s === 'Expired') return <Badge variant="warning">Expired</Badge>;
  if (s === 'Rejected') return <Badge variant="danger">Rejected</Badge>;

  // Invoice status mapping
  if (s === 'Paid') return <Badge variant="success">Paid</Badge>;
  if (s === 'Partially Paid') return <Badge variant="info">Partially Paid</Badge>;
  if (s === 'Unpaid') return <Badge variant="warning">Unpaid</Badge>;
  if (s === 'Overdue') return <Badge variant="danger">Overdue</Badge>;

  // Stock movement mapping
  if (s === 'Receive Stock') return <Badge variant="success">Received</Badge>;
  if (s === 'Issue Stock') return <Badge variant="danger">Issued</Badge>;
  if (s === 'Adjust Stock') return <Badge variant="warning">Adjusted</Badge>;

  return <Badge variant="secondary">{status}</Badge>;
}
