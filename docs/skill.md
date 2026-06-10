# Technical Skill Guide

## Frontend
Use component-based architecture.
Prefer reusable components over duplicated UI.

Recommended components:
- `StatCard`
- `DataTable`
- `StatusBadge`
- `PageHeader`
- `ModuleCard`
- `ChartCard`
- `DocumentPreview`
- `ProductSelector`
- `CustomerSelector`
- `LineItemTable`

## Styling
Use Tailwind CSS.

Design style:
- Modern SaaS
- Neutral background
- Clear hierarchy
- Professional B2B tone
- Consistent spacing
- Responsive layout

## shadcn/ui
Use shadcn/ui components where appropriate:
- Card
- Button
- Badge
- Table
- Tabs
- Dialog
- Dropdown
- Select
- Input
- Textarea
- Separator

## Charts
Use Recharts.

Recommended charts:
- Line chart for monthly revenue
- Bar chart for product category sales
- Pie chart for quotation status
- Area chart for inventory value
- Horizontal bar chart for top products

## Data
All mock data should live in `/data`.
Do not fetch external data.

## Types
All shared interfaces should live in `/lib/types.ts`.

Example types:
- Product
- Customer
- InventoryMovement
- Quotation
- QuotationItem
- Invoice
- DashboardMetric
- ReportSummary

## Calculations
All reusable calculations should live in `/lib/calculations.ts`.

Examples:
- `calculateSubtotal`
- `calculateDiscount`
- `calculateVat`
- `calculateGrandTotal`
- `calculateInventoryValue`
- `calculateLowStockItems`
- `calculateOutstandingAmount`

## Mock Interactivity
The mockup should include basic interactivity:
- Search products
- Filter by category
- Select customer
- Add quotation items
- Update quantity
- Calculate quotation total
- Preview document
- Filter invoice status
- Filter inventory status

No persistence is required.
