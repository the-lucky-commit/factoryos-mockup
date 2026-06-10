# Agent Instructions

## Project Name
FactoryOS Mockup

## Primary Goal
Build an interactive mockup of a unified Business Operating System for a factory / industrial cable trading company.

This project is not a full ERP system yet. It is a client-facing prototype that demonstrates how disconnected workflows can be unified into one platform.

## Important Rule
Do not over-engineer this project.
The current goal is to create a realistic, polished, clickable mockup that can be deployed to Vercel and shown to a client.

## Tech Stack
Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Recharts
- Mock data only

Do not use:
- Real database
- Authentication
- Payment gateway
- External API
- Complex backend
- Server actions unless absolutely necessary
- Environment variables

## UI Language
The application UI must be in English.

## Product Direction
This is a Business Operating System for factory operations, not a generic admin panel.
The product should unify:
- Product master data
- Inventory
- Quotation
- Invoice
- Customer data
- Reports
- Dashboard
- Settings

## Domain
The client business is related to industrial cables, electrical products, and factory supply.
Use realistic product examples:
- CV Cable
- NYY Cable
- VCT Cable
- THW Wire
- Control Cable
- Aluminum Cable
- Copper Cable
- Flexible Cable
- Building Wire

## Design Principles
- Professional
- Clean
- Modern B2B SaaS
- Easy to understand
- Presentation-ready
- Not too playful
- Not too dark
- Not too complex

## Required Pages
- Dashboard
- Products
- Inventory
- Quotations
- Create Quotation
- Invoices
- Customers
- Reports
- Settings

## Required Folder Rules
- Mock data must live in: `/data`
- Types must live in: `/lib/types.ts`
- Business calculations must live in: `/lib/calculations.ts`
- Reusable UI components must live in: `/components`
- Documentation must live in: `/docs`

## Mockup Behavior
The system should feel interactive.
Allowed mock interactions:
- Search
- Filter
- Sort
- Tabs
- Select customer
- Add quotation item
- Calculate totals
- Open preview modal
- Toggle document preview
- View product details
- View status badges

Do not implement persistence. State can reset on refresh.

## Quality Bar
Every page must look like it belongs to the same product.
Avoid:
- Empty pages
- Lorem ipsum
- Generic sample data
- Inconsistent spacing
- Inconsistent card styles
- Broken responsive layout
- Random colors
- Unused components

## Final Output
The final app should be good enough to present to a client as:
“This is the first visual mockup of a unified Business Operating System platform.”
