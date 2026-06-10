'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockProducts } from '@/data/mock-products';
import { Product } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { 
  Search, 
  FileDown, 
  Edit2, 
  X, 
  Tag, 
  Layers, 
  Compass, 
  Gauge, 
  Info,
  DollarSign,
  Boxes,
  Plus
} from 'lucide-react';
import { useSecurity } from '@/lib/security-context';
import { useLanguage } from '@/lib/language-context';
import AccessDenied from '@/components/layout/access-denied';

export default function ProductMasterPage() {
  const { checkPermission } = useSecurity();
  const { t } = useLanguage();

  if (!checkPermission('manage_products')) {
    return <AccessDenied moduleNameTh="ข้อมูลสินค้า (Product Master)" moduleNameEn="Product Master" />;
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(mockProducts[0]);

  // Extract unique categories for filter tabs
  const categories = useMemo(() => {
    const list = new Set(mockProducts.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, []);

  // Filter products based on search term and category
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cableType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 relative h-full">
      <PageHeader 
        title={t('products.title')} 
        description={t('products.description')}
        actions={
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> {t('products.addProduct')}
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Section: Product Table */}
        <div className="flex-1 min-w-0 w-full space-y-4">

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('products.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              />
            </div>
            
            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {cat === 'All' ? (t('common.viewAll') === 'ดูทั้งหมด' ? 'ทั้งหมด' : t('common.viewAll')) : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table Card */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-3.5">{t('products.sku')}</th>
                    <th className="px-6 py-3.5">{t('products.productName')}</th>
                    <th className="px-6 py-3.5">{t('products.category')}</th>
                    <th className="px-6 py-3.5 text-right">{t('products.sellingPrice')}</th>
                    <th className="px-6 py-3.5 text-center">{t('products.unit')}</th>
                    <th className="px-6 py-3.5 text-right">{t('products.stock')}</th>
                    <th className="px-6 py-3.5 text-center">{t('products.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <tr 
                        key={p.sku} 
                        onClick={() => setSelectedProduct(p)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          selectedProduct?.sku === p.sku ? "bg-blue-50/40 font-medium" : ""
                        }`}
                      >
                        <td className="px-6 py-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            {p.image ? (
                              <img 
                                src={p.image} 
                                alt={p.sku} 
                                className="w-10 h-10 object-cover rounded-md border border-slate-200 shrink-0" 
                              />
                            ) : (
                              <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-[10px] shrink-0">
                                NO IMG
                              </div>
                            )}
                            <span>{p.sku}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div>
                            <span className="text-slate-900 block font-semibold">{p.name}</span>
                            <span className="text-xs text-slate-400 block max-w-sm truncate">{p.cableType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/40">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right font-bold text-slate-900">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="px-6 py-3.5 text-center text-slate-500 font-semibold">{p.unit}</td>
                        <td className="px-6 py-3.5 text-right font-bold text-slate-700">
                          {formatNumber(p.stock)}
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                        {t('products.noProducts')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Section: Details Panel */}
        {selectedProduct && (
          <Card className="w-full lg:w-96 shrink-0 shadow-lg border-blue-100/60 sticky top-20">
            <CardHeader className="border-b border-slate-100 pb-4 flex flex-row justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">{t('products.productDetails')}</span>
                <CardTitle className="text-lg mt-1 font-bold text-slate-900">{selectedProduct.sku}</CardTitle>
                <CardDescription className="text-xs mt-1 leading-normal font-medium">{selectedProduct.name}</CardDescription>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Product Mock Image */}
              {selectedProduct.image && (
                <div className="w-full h-40 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('products.sellingPrice')}</span>
                  <span className="text-md font-bold text-slate-900 block mt-1">{formatCurrency(selectedProduct.price)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('products.unitCost')}</span>
                  <span className="text-md font-bold text-slate-900 block mt-1">{formatCurrency(selectedProduct.cost)}</span>
                </div>
              </div>

              {/* Profit Margin helper */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-800">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">{t('products.grossProfitMargin')}:</span>
                </div>
                <span className="font-bold text-blue-900">
                  {((selectedProduct.price - selectedProduct.cost) / selectedProduct.price * 100).toFixed(1)}% 
                  ({formatCurrency(selectedProduct.price - selectedProduct.cost)})
                </span>
              </div>

              {/* Specifications List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('products.specifications')}</h4>
                
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg bg-slate-50/30 overflow-hidden text-xs">
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-slate-400" /> {t('products.category')}</span>
                    <span className="font-bold text-slate-900">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-slate-400" /> {t('products.noOfCores')}</span>
                    <span className="font-bold text-slate-900">{selectedProduct.core} Core</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-slate-400" /> {t('products.size')}</span>
                    <span className="font-bold text-slate-900">{selectedProduct.size} sq.mm</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-slate-400" /> {t('products.voltageRating')}</span>
                    <span className="font-bold text-slate-900">{selectedProduct.voltage}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-slate-400" /> {t('products.color')}</span>
                    <span className="font-bold text-slate-900">{selectedProduct.color}</span>
                  </div>
                </div>
              </div>

              {/* Stock and Status */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('products.inventoryAndStatus')}</h4>
                
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg bg-slate-50/30 overflow-hidden text-xs">
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Boxes className="w-3.5 h-3.5 text-slate-400" /> {t('products.availableStock')}</span>
                    <span className="font-bold text-slate-900">{formatNumber(selectedProduct.stock)} {selectedProduct.unit}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold">{t('products.minAlertStock')}</span>
                    <span className="font-bold text-slate-900">{formatNumber(selectedProduct.minStock)} {selectedProduct.unit}</span>
                  </div>
                  <div className="flex justify-between p-2.5 items-center">
                    <span className="text-slate-500 font-semibold">{t('products.systemStatus')}</span>
                    <StatusBadge status={selectedProduct.status} />
                  </div>
                </div>
              </div>

              {/* Datasheet availability and buttons */}
              <div className="pt-2 flex flex-col gap-2">
                {selectedProduct.datasheet ? (
                  <Button variant="outline" className="w-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50">
                    <FileDown className="w-4 h-4 text-blue-600" /> {t('products.downloadDatasheet')}
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full text-xs font-semibold flex items-center justify-center gap-2 opacity-50">
                    {t('products.noDatasheet')}
                  </Button>
                )}
                
                <Button className="w-full text-xs font-semibold flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white">
                  <Edit2 className="w-3.5 h-3.5" /> {t('products.editSpecs')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
