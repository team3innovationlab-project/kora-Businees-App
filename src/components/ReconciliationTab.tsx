import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Calendar, 
  Banknote, 
  Smartphone, 
  CreditCard, 
  History,
  Share2,
  Zap,
  RefreshCw,
  Camera,
  Printer
} from 'lucide-react';
import { DailyReconciliation, BusinessProfile, User } from '../types';
import { ScanReconciliationModal, ScanResult } from './ScanReconciliationModal';
import { printerManager } from '../utils/printerService';

interface ReconciliationTabProps {
  business: BusinessProfile;
  selectedDate: string;
  currentUser: User | null;
  onReconciliationSaved: () => void;
  onShowToast: (msg: string) => void;
  onOpenWhatsAppModal?: () => void;
  onOpenPrinterModal?: () => void;
}

export const ReconciliationTab: React.FC<ReconciliationTabProps> = ({
  business,
  selectedDate,
  currentUser,
  onReconciliationSaved,
  onShowToast,
  onOpenWhatsAppModal,
  onOpenPrinterModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [reconciliation, setReconciliation] = useState<DailyReconciliation | null>(null);

  // Form input states
  const [countedCash, setCountedCash] = useState<number>(0);
  const [countedMomo, setCountedMomo] = useState<number>(0);
  const [countedCard, setCountedCard] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    messageId: string;
    recipients: string[];
    timestamp: string;
  } | null>(null);
  const [isQuickSending, setIsQuickSending] = useState(false);

  const handleScanExtracted = (scan: ScanResult) => {
    if (scan.type === 'momo') {
      setCountedMomo(prev => +(prev + scan.amount).toFixed(2));
      setNotes(prev => {
        const entry = `[Scanned ${scan.provider} ${business.currency} ${scan.amount.toFixed(2)} Ref: ${scan.reference}]`;
        return prev ? `${prev}\n${entry}` : entry;
      });
      onShowToast(`Scanned ${scan.provider} alert of ${business.currency} ${scan.amount.toFixed(2)} applied to Mobile Money!`);
    } else {
      setCountedCash(prev => +(prev + scan.amount).toFixed(2));
      setNotes(prev => {
        const entry = `[Scanned Receipt/Slip ${business.currency} ${scan.amount.toFixed(2)} Ref: ${scan.reference}]`;
        return prev ? `${prev}\n${entry}` : entry;
      });
      onShowToast(`Scanned Cash Receipt of ${business.currency} ${scan.amount.toFixed(2)} applied to Physical Cash!`);
    }
  };

  useEffect(() => {
    fetchReconciliation();
  }, [selectedDate]);

  const fetchReconciliation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reconciliation?date=${selectedDate}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: DailyReconciliation = await res.json();
      setReconciliation(data);
      setCountedCash(data.countedCash);
      setCountedMomo(data.countedMomo);
      setCountedCard(data.countedCard);
      setNotes(data.notes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const countedTotal = (Number(countedCash) || 0) + (Number(countedMomo) || 0) + (Number(countedCard) || 0);
  const expectedTotal = reconciliation ? reconciliation.expectedTotal : 0;
  const variance = countedTotal - expectedTotal;
  const isBalanced = Math.abs(variance) < 0.01;

  const handleSaveReconciliation = async () => {
    if (!reconciliation) return;
    setIsSaving(true);
    try {
      const payload = {
        ...reconciliation,
        countedCash: Number(countedCash) || 0,
        countedMomo: Number(countedMomo) || 0,
        countedCard: Number(countedCard) || 0,
        countedTotal,
        variance,
        notes,
        reconciledBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'George J (Owner)',
        autoSendWhatsApp,
      };

      const res = await fetch('/api/reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');

      const data = await res.json();
      setReconciliation(data.reconciliation);
      onReconciliationSaved();

      if (data.whatsAppDispatched && data.dispatchLog) {
        setDispatchResult({
          messageId: data.dispatchLog.messageId,
          recipients: data.dispatchLog.recipients,
          timestamp: new Date().toLocaleTimeString(),
        });
        onShowToast(`Register closed & Close Report automatically sent to WhatsApp (${data.dispatchLog.recipients.join(', ')})!`);
      } else {
        onShowToast(isBalanced ? 'Reconciliation balanced: zero leakage!' : `Reconciliation saved with variance of ${business.currency} ${variance.toFixed(2)}`);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Failed to save reconciliation.');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick direct WhatsApp auto-dispatch
  const handleQuickAutoSend = async () => {
    setIsQuickSending(true);
    try {
      const res = await fetch('/api/reports/whatsapp-send-auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          trigger: 'INSTANT_AUTO_TRIGGER',
        }),
      });
      if (!res.ok) throw new Error('Quick auto-send failed');
      const data = await res.json();
      setDispatchResult({
        messageId: data.log?.messageId || 'WAX-INSTANT',
        recipients: data.recipients || [business.whatsAppNumber],
        timestamp: new Date().toLocaleTimeString(),
      });
      onShowToast(`Close Report automatically sent to WhatsApp (${(data.recipients || [business.whatsAppNumber]).join(', ')})!`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to trigger WhatsApp auto-send.');
    } finally {
      setIsQuickSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Scale className="w-6 h-6 text-emerald-600" />
            <span>End-of-Day Cash & Channel Reconciliation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare registered sales on system against physical cash drawer count and Mobile Money statement balances.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              isBalanced
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {isBalanced ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>
              {isBalanced
                ? 'Balanced (Zero Leakage)'
                : `Discrepancy: ${business.currency} ${variance.toFixed(2)}`}
            </span>
          </span>

          <button
            onClick={async () => {
              try {
                const salesRes = await fetch(`/api/sales?date=${selectedDate}`);
                const sales = salesRes.ok ? await salesRes.json() : [];
                const slip = printerManager.formatAccountingSalesSlip(business, sales, selectedDate, reconciliation);
                printerManager.printToThermalWindow(slip, `${business.name} Daily Reconciliation Slip`);
                onShowToast('Dispatched reconciliation accounting slip to receipt printer!');
              } catch (e) {
                onShowToast('Failed to print reconciliation slip.');
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
            title="Print daily cash reconciliation slip to Bluetooth / Wi-Fi receipt printer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print to Thermal Printer</span>
          </button>

          <button
            onClick={handleQuickAutoSend}
            disabled={isQuickSending}
            className="px-3 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Send formatted close report to WhatsApp automatically right now"
          >
            {isQuickSending ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 fill-white" />
            )}
            <span>Auto-Send to WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Auto-dispatch confirmation receipt banner */}
      {dispatchResult && (
        <div className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <strong className="block font-bold text-white text-sm">
                WhatsApp Close Report Automatically Dispatched!
              </strong>
              <span className="text-emerald-100">
                Delivered to {dispatchResult.recipients.join(', ')} at {dispatchResult.timestamp} (Message ID: <code className="font-mono bg-emerald-700/80 px-1 py-0.5 rounded">{dispatchResult.messageId}</code>)
              </span>
            </div>
          </div>

          <button
            onClick={() => setDispatchResult(null)}
            className="text-emerald-200 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Expected from recorded system sales (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              1. System Expected Totals ({selectedDate})
            </h2>
            <span className="text-xs text-slate-400">Auto-calculated from recorded sales</span>
          </div>

          <div className="space-y-3">
            {/* Cash */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Expected Cash</span>
                  <span className="text-[11px] text-slate-400">Total cash transactions today</span>
                </div>
              </div>
              <span className="text-base font-extrabold text-slate-900 font-sans">
                {business.currency} {(reconciliation?.expectedSalesCash || 0).toFixed(2)}
              </span>
            </div>

            {/* MoMo */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Expected Mobile Money (MoMo)</span>
                  <span className="text-[11px] text-slate-400">MTN / Telecel / AT wallet payments</span>
                </div>
              </div>
              <span className="text-base font-extrabold text-slate-900 font-sans">
                {business.currency} {(reconciliation?.expectedSalesMomo || 0).toFixed(2)}
              </span>
            </div>

            {/* Card */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Expected Card Settlements</span>
                  <span className="text-[11px] text-slate-400">POS terminal card payments</span>
                </div>
              </div>
              <span className="text-base font-extrabold text-slate-900 font-sans">
                {business.currency} {(reconciliation?.expectedSalesCard || 0).toFixed(2)}
              </span>
            </div>

            {/* Total Expected */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Total Expected Revenue:
              </span>
              <span className="text-xl font-extrabold font-sans text-emerald-400">
                {business.currency} {expectedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actual Counted Input (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                2. Actual Physical Counts ({selectedDate})
              </h2>
              <span className="text-xs text-slate-400">Counted by cashier / manager</span>
            </div>

            <button
              type="button"
              onClick={() => setIsScanModalOpen(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>Scan MoMo SMS / Receipt</span>
            </button>
          </div>

          <div className="space-y-3">
            {/* Input Cash */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Counted Physical Cash in Drawer ({business.currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={countedCash}
                onChange={(e) => setCountedCash(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Input MoMo */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Counted Mobile Money Wallet Statement Balance ({business.currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={countedMomo}
                onChange={(e) => setCountedMomo(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Input Card */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Counted POS Card Terminal Batch Total ({business.currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={countedCard}
                onChange={(e) => setCountedCard(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Total Actual */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Total Actual Counted:
              </span>
              <span className="text-xl font-extrabold font-sans text-slate-900">
                {business.currency} {countedTotal.toFixed(2)}
              </span>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Auditor Notes / Reason for Discrepancy
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 5 GHS tip left in drawer, or change rounded on order #2..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
              />
            </div>

            {/* Automatic WhatsApp Dispatch Option */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSendWhatsApp}
                  onChange={(e) => setAutoSendWhatsApp(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold flex items-center gap-1.5 text-emerald-950">
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Automatically send Close Report to WhatsApp on Save</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Dispatches formatted numbers to {business.whatsAppNumber} immediately upon closing
                  </span>
                </div>
              </label>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                Auto-Send
              </span>
            </div>

            {/* Variance indicator & Save button */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs">
                <span className="text-slate-500">Net Calculated Variance: </span>
                <strong
                  className={`font-mono text-sm ${
                    isBalanced
                      ? 'text-emerald-600'
                      : variance < 0
                      ? 'text-red-600'
                      : 'text-amber-600'
                  }`}
                >
                  {business.currency} {variance.toFixed(2)}
                </strong>
              </div>

              <button
                onClick={handleSaveReconciliation}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Close Register</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Camera MoMo & Receipt Reconciliation Scanner Modal */}
      <ScanReconciliationModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanExtracted={handleScanExtracted}
        currency={business.currency}
      />
    </div>
  );
};
