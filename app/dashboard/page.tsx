'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  mockMonthlyRevenue, 
  mockCategorySales, 
  mockQuotationStatus, 
  mockTopProducts 
} from '@/data/mock-dashboard';
import { mockProducts } from '@/data/mock-products';
import { mockQuotations } from '@/data/mock-quotations';
import { mockInvoices } from '@/data/mock-invoices';
import { 
  calculateInventoryValue, 
  calculateLowStockCount, 
  calculateOutstandingAmount, 
  calculateOverdueAmount 
} from '@/lib/calculations';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { 
  DollarSign, 
  FileText, 
  Receipt, 
  Boxes, 
  AlertTriangle, 
  TrendingUp, 
  PlusCircle, 
  ChevronRight,
  Download,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dynamic metrics
  const totalRevenueYTD = mockMonthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const activeQuotesCount = mockQuotations.filter(q => q.status === 'Sent' || q.status === 'Accepted' || q.status === 'Draft').length;
  const pendingInvoicesCount = mockInvoices.filter(inv => inv.status === 'Unpaid' || inv.status === 'Partially Paid' || inv.status === 'Overdue').length;
  const inventoryValue = calculateInventoryValue(mockProducts);
  const lowStockCount = calculateLowStockCount(mockProducts);
  const juneOrdersCount = mockMonthlyRevenue[mockMonthlyRevenue.length - 1].orders;

  // Recent quotations for a quick widget
  const recentQuotations = mockQuotations.slice(0, 3);
  
  // Recent invoices for a quick widget
  const recentInvoices = mockInvoices.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Executive Dashboard" 
        description="Real-time operations summary and financial overview for FactoryOS."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="w-4 h-4" /> Export Report
            </Button>
            <Link href="/quotations/new">
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle className="w-4 h-4" /> Create Quotation
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Revenue YTD */}
        <Card className="hover:border-blue-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase">Revenue (YTD)</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-bold text-slate-900 tracking-tight truncate" title={formatCurrency(totalRevenueYTD)}>
                {formatCurrency(totalRevenueYTD, false)}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1 truncate">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" /> +25.5% vs Last Year
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Active Quotes */}
        <Card className="hover:border-indigo-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase">Active Quotes</span>
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-bold text-slate-900 tracking-tight truncate">{activeQuotesCount}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                Draft, Sent & Accepted
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Pending Invoices */}
        <Card className="hover:border-amber-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase">Pending Invoices</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-bold text-slate-900 tracking-tight truncate">{pendingInvoicesCount}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                Unpaid / Partially Paid
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Inventory Asset Value */}
        <Card className="hover:border-emerald-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase">Inventory Value</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-bold text-slate-900 tracking-tight truncate" title={formatCurrency(inventoryValue)}>
                {formatCurrency(inventoryValue, false)}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                Asset value at cost price
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Low Stock Items */}
        <Card className="hover:border-rose-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase">Low Stock Alert</span>
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-bold text-slate-900 tracking-tight truncate">{lowStockCount}</h3>
              <p className="text-xs text-rose-600 font-semibold mt-1 truncate">
                Needs procurement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 6: June Orders */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 uppercase">Monthly Orders</span>
              <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-bold text-slate-900 tracking-tight truncate">{juneOrdersCount}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                Completed orders in June
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue YTD Trend */}
        <Card className="p-1">
          <CardHeader>
            <CardTitle>Monthly Revenue & Sales Orders</CardTitle>
            <CardDescription>YTD performance showing sales growth and order counts.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockMonthlyRevenue} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value, name) => [name === 'revenue' ? formatCurrency(value as number) : value, name]} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (THB)" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders Count" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Chart...</div>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Category Sales */}
        <Card className="p-1">
          <CardHeader>
            <CardTitle>Sales Share by Product Category</CardTitle>
            <CardDescription>Product classification performance by total sold value.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-between">
            {mounted ? (
              <>
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockCategorySales}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {mockCategorySales.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 pr-6 space-y-3">
                  {mockCategorySales.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                      </div>
                      <span className="font-bold text-slate-950">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Chart...</div>
            )}
          </CardContent>
        </Card>

        {/* Chart 3: Top Selling Products */}
        <Card className="p-1">
          <CardHeader>
            <CardTitle>Top Selling Cable Products</CardTitle>
            <CardDescription>Ranking based on total revenue generated.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTopProducts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v/1000}k`} />
                  <YAxis dataKey="sku" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={100} />
                  <Tooltip formatter={(v) => formatCurrency(v as number)} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16}>
                    {mockTopProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#1d4ed8' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Chart...</div>
            )}
          </CardContent>
        </Card>

        {/* Chart 4: Quotation Status distribution */}
        <Card className="p-1">
          <CardHeader>
            <CardTitle>Quotation Pipeline Status</CardTitle>
            <CardDescription>Breakdown of all quotations issued to date.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockQuotationStatus} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={36}>
                    {mockQuotationStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Chart...</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row of lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Quotations Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Quotations</CardTitle>
              <CardDescription>Latest quotations prepared by the sales team.</CardDescription>
            </div>
            <Link href="/quotations">
              <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 font-semibold text-blue-600">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 border-t border-slate-100">
            <div className="divide-y divide-slate-100">
              {recentQuotations.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{quote.quotationNumber}</span>
                      <StatusBadge status={quote.status} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 block">{quote.customerName}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-sm font-bold text-slate-950 block">{formatCurrency(quote.grandTotal)}</span>
                    <span className="text-xs text-slate-400 block">{quote.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Outstanding Invoices</CardTitle>
              <CardDescription>Invoices waiting for customer payments.</CardDescription>
            </div>
            <Link href="/invoices">
              <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 font-semibold text-blue-600">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 border-t border-slate-100">
            <div className="divide-y divide-slate-100">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{inv.invoiceNumber}</span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 block">{inv.customerName}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-sm font-bold text-slate-950 block">{formatCurrency(inv.outstandingAmount)}</span>
                    <span className="text-xs text-rose-500 block font-semibold">Due: {inv.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
