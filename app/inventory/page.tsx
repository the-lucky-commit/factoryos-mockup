'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockProducts } from '@/data/mock-products';
import { mockInventoryMovements } from '@/data/mock-inventory';
import { Product, InventoryMovement } from '@/lib/types';
import { calculateInventoryValue } from '@/lib/calculations';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  Sliders, 
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';

import { useSecurity } from '@/lib/security-context';
import { useLanguage } from '@/lib/language-context';
import AccessDenied from '@/components/layout/access-denied';

export default function InventoryPage() {
  const { checkPermission, logAction } = useSecurity();
  const { t } = useLanguage();

  if (!checkPermission('process_inventory')) {
    return <AccessDenied moduleNameTh="คลังสินค้า (Inventory)" moduleNameEn="Inventory" />;
  }

  // Local state to simulate live inventory operations
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<InventoryMovement[]>(mockInventoryMovements);
  
  // Modal State
  const [activeAction, setActiveAction] = useState<'Receive' | 'Issue' | 'Adjust' | null>(null);
  const [selectedSku, setSelectedSku] = useState(mockProducts[0]?.sku || '');
  const [qtyInput, setQtyInput] = useState<number>(100);
  const [notesInput, setNotesInput] = useState('');
  const [operatorInput, setOperatorInput] = useState('สมชาย ยิ่งเจริญ');

  // Summary Metrics based on state
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const warehouseValue = calculateInventoryValue(products);

  // Stock action execution
  const handleExecuteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSku || qtyInput === 0) return;

    // Find the product being updated
    const targetProduct = products.find(p => p.sku === selectedSku);
    if (!targetProduct) return;

    let qtyChange = qtyInput;
    let movementType: InventoryMovement['type'] = 'Receive Stock';

    if (activeAction === 'Receive') {
      qtyChange = Math.abs(qtyInput);
      movementType = 'Receive Stock';
    } else if (activeAction === 'Issue') {
      const issueQty = Math.abs(qtyInput);
      if (targetProduct.stock < issueQty) {
        alert("Error: Insufficient stock. Cannot issue more than available stock.");
        return;
      }
      qtyChange = -issueQty;
      movementType = 'Issue Stock';
    } else if (activeAction === 'Adjust') {
      qtyChange = qtyInput;
      movementType = 'Adjust Stock';
    }

    // Update Product list state
    const updatedProducts = products.map(p => {
      if (p.sku === selectedSku) {
        const newStock = Math.max(0, p.stock + qtyChange);
        let newStatus: Product['status'] = 'In Stock';
        if (newStock === 0) {
          newStatus = 'Out of Stock';
        } else if (newStock <= p.minStock) {
          newStatus = 'Low Stock';
        }
        return {
          ...p,
          stock: newStock,
          status: newStatus
        };
      }
      return p;
    });

    // Add movement log state
    const newMovement: InventoryMovement = {
      id: `MV-${100 + movements.length + 1}`,
      productSku: selectedSku,
      productName: targetProduct.name,
      type: movementType,
      quantity: Math.abs(qtyChange),
      date: new Date().toISOString(),
      notes: notesInput || `${activeAction} transaction mock`,
      operator: operatorInput
    };

    setProducts(updatedProducts);
    setMovements([newMovement, ...movements]);
    logAction(`Inventory: ${movementType} (${Math.abs(qtyChange)} units) for SKU ${selectedSku} - ${targetProduct.name}`, 'Success', operatorInput);
    
    // Close Modal and Reset Form
    setActiveAction(null);
    setNotesInput('');
  };

  return (
    <div className="space-y-6 relative">
      <PageHeader 
        title={t('inventory.title')} 
        description={t('inventory.description')}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => { setActiveAction('Receive'); setQtyInput(100); }} 
              className="flex items-center gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-500" /> {t('inventory.receiveStock')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setActiveAction('Issue'); setQtyInput(100); }} 
              className="flex items-center gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
            >
              <ArrowUpRight className="w-4 h-4 text-rose-500" /> {t('inventory.issueStock')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setActiveAction('Adjust'); setQtyInput(0); }} 
              className="flex items-center gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            >
              <Sliders className="w-4 h-4 text-amber-500" /> {t('inventory.adjustStock')}
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400">{t('inventory.totalStockItems')}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900">{formatNumber(totalStockItems)}</span>
              <span className="text-xs font-semibold text-slate-500">{t('inventory.metersRolls')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="hover:border-amber-300 transition-colors">
          <CardContent className="p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400">{t('inventory.lowStockAlert')}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-amber-600">{lowStockCount}</span>
              <span className="text-xs font-semibold text-slate-500">{t('inventory.itemsBelowMin')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="hover:border-rose-300 transition-colors">
          <CardContent className="p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400">{t('inventory.outOfStock')}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-rose-600">{outOfStockCount}</span>
              <span className="text-xs font-semibold text-slate-500">{t('inventory.emptySkuShelves')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="hover:border-emerald-300 transition-colors">
          <CardContent className="p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400">{t('inventory.warehouseValue')}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-emerald-600">{formatCurrency(warehouseValue)}</span>
              <span className="text-xs font-semibold text-slate-500">{t('inventory.totalAssetCost')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Stock Table */}
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row justify-between items-center">
              <div>
                <CardTitle>{t('inventory.physicalStockStatus')}</CardTitle>
                <CardDescription>{t('inventory.currentStockCompare')}</CardDescription>
              </div>
              {lowStockCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{lowStockCount} {t('inventory.needReplenishment')}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-3">{t('products.sku')}</th>
                      <th className="px-6 py-3">{t('products.productName')}</th>
                      <th className="px-6 py-3 text-right">{t('inventory.availableQty')}</th>
                      <th className="px-6 py-3 text-right">{t('inventory.minQty')}</th>
                      <th className="px-6 py-3 text-center">{t('products.unit')}</th>
                      <th className="px-6 py-3 text-center">{t('products.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {products.map((p) => (
                      <tr key={p.sku} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            {p.image ? (
                              <img 
                                src={p.image} 
                                alt={p.sku} 
                                className="w-10 h-10 object-cover rounded-md border border-slate-200" 
                              />
                            ) : (
                              <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                                NO IMG
                              </div>
                            )}
                            <span>{p.sku}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-slate-700">{p.name}</td>
                        <td className="px-6 py-3.5 text-right font-bold text-slate-900">
                          {formatNumber(p.stock)}
                        </td>
                        <td className="px-6 py-3.5 text-right font-medium text-slate-400">
                          {formatNumber(p.minStock)}
                        </td>
                        <td className="px-6 py-3.5 text-center font-semibold text-slate-500">{p.unit}</td>
                        <td className="px-6 py-3.5 text-center">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Movement History */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-600" />
                  {t('inventory.movementLog')}
                </CardTitle>
                <CardDescription>{t('inventory.ledgerDescription')}</CardDescription>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                {t('inventory.interactiveYtd')}
              </span>
            </CardHeader>
            <CardContent className="p-0 border-t border-slate-100 max-h-[500px] overflow-y-auto">
              <div className="divide-y divide-slate-100">
                {movements.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{log.id}</span>
                        <StatusBadge status={log.type} />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDate(log.date)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">{log.productName}</span>
                      <span className="text-xs text-slate-500 font-semibold block mt-0.5">
                        {t('inventory.quantity')}: {formatNumber(log.quantity)} units
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1 italic">
                        {t('inventory.note')}: {log.notes}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 border-t border-slate-100/65 pt-1">
                      <span className="font-medium">{t('inventory.operator')}:</span>
                      <span className="font-semibold text-slate-600">{log.operator}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stock Transaction Modal Mockup */}
      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            onClick={() => setActiveAction(null)}
          />
          
          {/* Content */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md p-6 z-50 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveAction(null)}
              className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded absolute right-4 top-4 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {activeAction === 'Receive' ? t('inventory.modalReceiveTitle') : activeAction === 'Issue' ? t('inventory.modalIssueTitle') : t('inventory.modalAdjustTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {t('inventory.modalDesc')}
            </p>

            <form onSubmit={handleExecuteAction} className="space-y-4 mt-6">
              {/* Product Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('inventory.selectSku')}</label>
                <select 
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-semibold"
                >
                  {products.map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.sku} - {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {t('inventory.enterQty')} {activeAction === 'Adjust' && t('inventory.adjustNegWarn')}
                </label>
                <input 
                  type="number"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-bold"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              {/* Operator */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('inventory.operatorProfile')}</label>
                <input 
                  type="text"
                  value={operatorInput}
                  onChange={(e) => setOperatorInput(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none text-slate-600 font-semibold"
                  placeholder="Operator name"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('inventory.internalNotes')}</label>
                <textarea 
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  placeholder={t('inventory.notesPlaceholder')}
                  rows={2}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveAction(null)}
                  className="text-xs font-semibold"
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  className={`text-xs font-semibold text-white ${
                    activeAction === 'Receive' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    activeAction === 'Issue' ? 'bg-rose-600 hover:bg-rose-700' :
                    'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {t('common.confirm')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
