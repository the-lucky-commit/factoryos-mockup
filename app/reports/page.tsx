'use client';

import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockProducts } from '@/data/mock-products';
import { mockCustomers } from '@/data/mock-customers';
import { mockInvoices } from '@/data/mock-invoices';
import { mockMonthlyRevenue, mockCategorySales, mockTopProducts } from '@/data/mock-dashboard';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Download, 
  BarChart3, 
  Boxes, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'receivables'>('sales');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute stats for reports
  const lowStockItems = useMemo(() => {
    return mockProducts.filter(p => p.stock <= p.minStock);
  }, []);

  const totalOutstanding = useMemo(() => {
    return mockInvoices.reduce((sum, inv) => {
      return sum + (inv.status !== 'Paid' ? inv.outstandingAmount : 0);
    }, 0);
  }, []);

  const totalOverdue = useMemo(() => {
    return mockInvoices.reduce((sum, inv) => {
      return sum + (inv.status === 'Overdue' ? inv.outstandingAmount : 0);
    }, 0);
  }, []);

  // Customer sales summary for charts
  const customerSalesData = useMemo(() => {
    return mockCustomers.map(c => {
      // Find invoices of this customer
      const sales = mockInvoices
        .filter(inv => inv.customerId === c.id)
        .reduce((sum, inv) => sum + inv.amount, 0);
      return {
        name: c.companyName.substring(0, 15) + '...',
        sales
      };
    }).sort((a, b) => b.sales - a.sales);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Business Reports & Analytics" 
        description="Access financial statistics, stock valuation ledgers, and accounts receivable reporting."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <Download className="w-4 h-4" /> PDF Report
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'sales'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Sales Performance
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'inventory'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Boxes className="w-3.5 h-3.5" /> Inventory Valuation
        </button>
        <button
          onClick={() => setActiveTab('receivables')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'receivables'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Receivables Aging
        </button>
      </div>

      {/* Report Tab Contents */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Revenue YTD Growth</CardTitle>
                <CardDescription>Monthly billed volume analysis for fiscal year 2026.</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMonthlyRevenue} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v/1000}k`} />
                      <Tooltip formatter={(v) => formatCurrency(v as number)} />
                      <Line type="monotone" dataKey="revenue" name="Billed Sales (THB)" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Chart...</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Contribution by Customer</CardTitle>
                <CardDescription>Highest billing corporate clients based on invoice ledger.</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerSalesData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} height={40} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v/1000}k`} />
                      <Tooltip formatter={(v) => formatCurrency(v as number)} />
                      <Bar dataKey="sales" name="Sales YTD" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Chart...</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Products List */}
          <Card>
            <CardHeader>
              <CardTitle>Product Sales Performance Leaderboard</CardTitle>
              <CardDescription>Sales summary grouped by individual SKU and cable specifications.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-3">SKU</th>
                      <th className="px-6 py-3">Cable Type Name</th>
                      <th className="px-6 py-3 text-right">Sold Quantity</th>
                      <th className="px-6 py-3 text-right">Revenue Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockTopProducts.map((prod, idx) => (
                      <tr key={prod.sku} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-bold text-slate-900">{prod.sku}</td>
                        <td className="px-6 py-3.5 font-semibold text-slate-700">{prod.name}</td>
                        <td className="px-6 py-3.5 text-right font-semibold text-slate-700">
                          {formatNumber(prod.qty)} Meters
                        </td>
                        <td className="px-6 py-3.5 text-right font-bold text-blue-600">
                          {formatCurrency(prod.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Value by Product Category</CardTitle>
                <CardDescription>Allocation of raw capital asset locked in warehouse stock.</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockCategorySales} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v/1000}k`} />
                      <Tooltip formatter={(v) => formatCurrency(v as number)} />
                      <Bar dataKey="value" name="Asset Cost Value (THB)" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Chart...</div>
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Inventory Alert Summary</CardTitle>
                <CardDescription>Operational indicators for warehouse logistics planning.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-semibold block">Total Available Skus</span>
                    <span className="text-xl font-bold text-slate-900">{mockProducts.length} items</span>
                  </div>
                  <div className="p-2 rounded bg-slate-200 text-slate-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-amber-700 font-semibold block">Critical Low Stock Skus</span>
                    <span className="text-xl font-bold text-amber-600">{lowStockItems.length} items</span>
                  </div>
                  <div className="p-2 rounded bg-amber-100 text-amber-600">
                    <AlertTriangle className="w-5 h-5 animate-bounce" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Replenishment Report */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Low Stock Replenishment Sheet</CardTitle>
              <CardDescription>Products currently below safe minimum warehouse count threshold.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-3">SKU</th>
                      <th className="px-6 py-3">Cable Name</th>
                      <th className="px-6 py-3 text-right">Current Stock</th>
                      <th className="px-6 py-3 text-right">Min Threshold</th>
                      <th className="px-6 py-3 text-right">Deficit</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lowStockItems.map((prod) => (
                      <tr key={prod.sku} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-bold text-slate-900">{prod.sku}</td>
                        <td className="px-6 py-3.5 font-semibold text-slate-700">{prod.name}</td>
                        <td className="px-6 py-3.5 text-right font-bold text-rose-600">
                          {formatNumber(prod.stock)} {prod.unit}s
                        </td>
                        <td className="px-6 py-3.5 text-right font-semibold text-slate-400">
                          {formatNumber(prod.minStock)} {prod.unit}s
                        </td>
                        <td className="px-6 py-3.5 text-right font-black text-rose-700">
                          {formatNumber(prod.minStock - prod.stock)} {prod.unit}s
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <StatusBadge status={prod.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'receivables' && (
        <div className="space-y-6">
          {/* receivables stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-amber-50/30 border-amber-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase">Receivable Ledger Balance</CardTitle>
                <h2 className="text-2xl font-black text-amber-600 mt-1">{formatCurrency(totalOutstanding)}</h2>
              </CardHeader>
              <CardContent className="text-xs text-slate-500 font-medium">
                Outstanding funds across all active project accounts.
              </CardContent>
            </Card>

            <Card className="bg-rose-50/30 border-rose-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase">Overdue Collections</CardTitle>
                <h2 className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(totalOverdue)}</h2>
              </CardHeader>
              <CardContent className="text-xs text-slate-500 font-medium">
                Recovers past the contract credit-terms due date.
              </CardContent>
            </Card>
          </div>

          {/* Aging Receivables Table */}
          <Card>
            <CardHeader>
              <CardTitle>Accounts Receivable Ledger Details</CardTitle>
              <CardDescription>Invoices that remain unpaid or partially settled.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-3.5">Invoice No</th>
                      <th className="px-6 py-3.5">Client Customer</th>
                      <th className="px-6 py-3.5">Billing Date</th>
                      <th className="px-6 py-3.5">Due Date</th>
                      <th className="px-6 py-3.5 text-right">Invoice Total</th>
                      <th className="px-6 py-3.5 text-right">Outstanding</th>
                      <th className="px-6 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockInvoices
                      .filter(inv => inv.status !== 'Paid')
                      .map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-3.5 font-bold text-slate-900">{inv.invoiceNumber}</td>
                          <td className="px-6 py-3.5 font-semibold text-slate-700">{inv.customerName}</td>
                          <td className="px-6 py-3.5 text-xs text-slate-500">{formatDate(inv.date)}</td>
                          <td className="px-6 py-3.5 text-xs text-slate-500 font-semibold">{formatDate(inv.dueDate)}</td>
                          <td className="px-6 py-3.5 text-right font-semibold text-slate-700">
                            {formatCurrency(inv.amount)}
                          </td>
                          <td className="px-6 py-3.5 text-right font-black text-rose-600">
                            {formatCurrency(inv.outstandingAmount)}
                          </td>
                          <td className="px-6 py-3.5 text-center">
                            <StatusBadge status={inv.status} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
