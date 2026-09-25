import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Package, 
  CheckCircle2,
  Download
} from 'lucide-react';
import { StockItem, BusinessProfile } from '../types';
import { exportToCsv } from '../utils/exportCsv';

interface StockTabProps {
  stock: StockItem[];
  business: BusinessProfile;
  onStockUpdated: () => void;
  onShowToast: (msg: string) => void;
}

export const StockTab: React.FC<StockTabProps> = ({
  stock,
  business,
  onStockUpdated,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [restockThreshold, setRestockThreshold] = useState('5');
  const [unit, setUnit] = useState('pcs');
  const [supplier, setSupplier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = stock.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.sku.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = stock.filter((s) => s.currentQuantity <= s.restockThreshold).length;
  const totalStockValue = stock.reduce((acc, s) => acc + s.costPrice * s.currentQuantity, 0);
  const totalRetailValue = stock.reduce((acc, s) => acc + s.sellingPrice * s.currentQuantity, 0);

  const resetForm = () => {
    setName('');
    setSku('');
    setCategory('Electronics');
    setCostPrice('');
    setSellingPrice('');
    setCurrentQuantity('');
    setRestockThreshold('5');
    setUnit('pcs');
    setSupplier('');
    setEditingItem(null);
  };

  const handleOpenEdit = (item: StockItem) => {
    setEditingItem(item);
    setName(item.name);
    setSku(item.sku);
    setCategory(item.category);
    setCostPrice(item.costPrice.toString());
    setSellingPrice(item.sellingPrice.toString());
    setCurrentQuantity(item.currentQuantity.toString());
    setRestockThreshold(item.restockThreshold.toString());
    setUnit(item.unit);
    setSupplier(item.supplier || '');
    setShowAddModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
        category,
        costPrice: parseFloat(costPrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        currentQuantity: parseInt(currentQuantity, 10) || 0,
        restockThreshold: parseInt(restockThreshold, 10) || 5,
        unit,
        supplier,
      };

      const url = editingItem ? `/api/stock/${editingItem.id}` : '/api/stock';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save product');

      setShowAddModal(false);
      resetForm();
      onStockUpdated();
      onShowToast(editingItem ? 'Product updated successfully.' : 'New product added to inventory.');
    } catch (err) {
      console.error('Stock error:', err);
      onShowToast('Failed to save inventory item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!confirm(`Are you sure you want to remove "${itemName}" from tracked stock?`)) return;
    try {
      const res = await fetch(`/api/stock/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      onStockUpdated();
      onShowToast(`Removed ${itemName} from stock.`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to delete stock item.');
    }
  };

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      onShowToast('No stock items to export.');
      return;
    }

    const headers = [
      'Product Name',
      'SKU',
      'Category',
      'Cost Price (GHS)',
      'Selling Price (GHS)',
      'Unit Profit (GHS)',
      'Margin (%)',
      'Current Quantity',
      'Unit',
      'Restock Threshold',
      'Stock Status',
      'Supplier',
      'Last Updated',
    ];

    const rows = filtered.map((s) => {
      const margin = s.sellingPrice > 0 ? (((s.sellingPrice - s.costPrice) / s.sellingPrice) * 100).toFixed(1) : '0';
      const status = s.currentQuantity === 0 ? 'Out of Stock' : s.currentQuantity <= s.restockThreshold ? 'Low Stock' : 'In Stock';
      return [
        s.name,
        s.sku,
        s.category,
        s.costPrice.toFixed(2),
        s.sellingPrice.toFixed(2),
        (s.sellingPrice - s.costPrice).toFixed(2),
        `${margin}%`,
        s.currentQuantity,
        s.unit,
        s.restockThreshold,
        status,
        s.supplier || 'N/A',
        s.updatedAt,
      ];
    });

    const filename = `${business.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_inventory_${new Date().toISOString().split('T')[0]}`;
    exportToCsv(filename, headers, rows);
    onShowToast(`Exported ${filtered.length} inventory items to CSV!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-emerald-600" />
            <span>Stock & Inventory Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time catalog, reorder threshold alerts, profit margin analytics, and automatic unit deduction on sale.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            title="Download full inventory to CSV for accounting"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Stock summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">Total Items</span>
          <span className="text-2xl font-extrabold text-slate-900 font-sans block mt-1">
            {stock.length} products
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">Restock Warnings</span>
          <span className={`text-2xl font-extrabold font-sans block mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {lowStockCount} {lowStockCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">Inventory Valuation (Cost)</span>
          <span className="text-2xl font-extrabold text-slate-800 font-sans block mt-1">
            {business.currency} {totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">Potential Retail Value</span>
          <span className="text-2xl font-extrabold text-emerald-700 font-sans block mt-1">
            {business.currency} {totalRetailValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product by name, SKU, or category..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Showing {filtered.length} of {stock.length} products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Product / SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Available Quantity</th>
                <th className="px-6 py-3">Cost Price</th>
                <th className="px-6 py-3">Selling Price</th>
                <th className="px-6 py-3">Gross Margin</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isLow = item.currentQuantity <= item.restockThreshold;
                const margin = item.sellingPrice > 0 
                  ? (((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100).toFixed(0) 
                  : '0';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.sku}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 font-sans text-sm">
                          {item.currentQuantity} {item.unit}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Low (≤{item.restockThreshold})</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">
                      {business.currency} {item.costPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 text-slate-900 font-bold text-sm">
                      {business.currency} {item.sellingPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-emerald-700 font-bold font-mono">
                        +{margin}%
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingItem ? 'Edit Product' : 'Add New Inventory Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. TWX-HEAD-01"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Electronics, Accessories..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Cost Price ({business.currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Selling Price ({business.currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Current Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Restock Threshold
                  </label>
                  <input
                    type="number"
                    required
                    value={restockThreshold}
                    onChange={(e) => setRestockThreshold(e.target.value)}
                    placeholder="5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="pcs"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
                >
                  {editingItem ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
