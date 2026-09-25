import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  Sparkles,
  Send,
  Clock,
  Settings,
  History,
  CheckCircle2,
  AlertCircle,
  Zap,
  Plus,
  Trash2,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { BusinessProfile, WhatsAppAutomationConfig, WhatsAppDispatchLog } from '../types';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  business: BusinessProfile;
  onBusinessUpdated?: (updated: BusinessProfile) => void;
  onShowToast: (msg: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  business,
  onBusinessUpdated,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'automation' | 'history'>('preview');
  const [summaryText, setSummaryText] = useState('');
  const [whatsAppLink, setWhatsAppLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-send action states
  const [isSendingAuto, setIsSendingAuto] = useState(false);
  const [autoSendReceipt, setAutoSendReceipt] = useState<{
    messageId: string;
    timestamp: string;
    recipients: string[];
  } | null>(null);

  // Automation settings state
  const [autoConfig, setAutoConfig] = useState<WhatsAppAutomationConfig>({
    enabled: true,
    autoSendOnReconciliation: true,
    autoSendAtScheduledTime: true,
    scheduledTime: '20:00',
    recipients: [business.whatsAppNumber || '+233244567890'],
    gatewayMode: 'VPS_GATEWAY_SERVICE',
    lastDispatchedAt: business.whatsAppAutomation?.lastDispatchedAt,
    lastDispatchStatus: business.whatsAppAutomation?.lastDispatchStatus || 'DELIVERED',
    lastDispatchMessageId: business.whatsAppAutomation?.lastDispatchMessageId,
  });

  const [logs, setLogs] = useState<WhatsAppDispatchLog[]>([]);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [newRecipientInput, setNewRecipientInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSummary();
      fetchAutomationConfig();
    }
  }, [isOpen, selectedDate]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/whatsapp-summary?date=${selectedDate}`);
      if (!res.ok) throw new Error('Failed to load report');
      const data = await res.json();
      setSummaryText(data.summaryText);
      setWhatsAppLink(data.whatsAppLink);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to generate WhatsApp report.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAutomationConfig = async () => {
    try {
      const res = await fetch('/api/reports/whatsapp-auto-config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) setAutoConfig(data.config);
        if (data.logs) setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to load WhatsApp automation config:', err);
    }
  };

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    onShowToast('Report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger automated dispatch immediately
  const handleTriggerAutoSend = async () => {
    setIsSendingAuto(true);
    setAutoSendReceipt(null);
    try {
      const res = await fetch('/api/reports/whatsapp-send-auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          trigger: 'INSTANT_AUTO_TRIGGER',
        }),
      });

      if (!res.ok) throw new Error('Automated send failed');

      const data = await res.json();
      setAutoSendReceipt({
        messageId: data.log?.messageId || `WAX-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString(),
        recipients: data.recipients || autoConfig.recipients,
      });

      onShowToast(`Report automatically sent to WhatsApp (${(data.recipients || autoConfig.recipients).join(', ')})!`);
      // Refresh logs
      fetchAutomationConfig();
    } catch (err) {
      console.error(err);
      onShowToast('Error sending report automatically via WhatsApp Gateway.');
    } finally {
      setIsSendingAuto(false);
    }
  };

  // Save automation settings
  const handleSaveAutomation = async () => {
    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/reports/whatsapp-auto-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoConfig),
      });

      if (!res.ok) throw new Error('Failed to update automation configuration');

      const data = await res.json();
      setAutoConfig(data.config);
      if (onBusinessUpdated) {
        onBusinessUpdated({
          ...business,
          whatsAppAutomation: data.config,
        });
      }
      onShowToast('WhatsApp auto-send configuration updated successfully.');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to save WhatsApp automation settings.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleAddRecipient = () => {
    if (!newRecipientInput.trim()) return;
    const cleaned = newRecipientInput.trim();
    if (!autoConfig.recipients.includes(cleaned)) {
      setAutoConfig({
        ...autoConfig,
        recipients: [...autoConfig.recipients, cleaned],
      });
    }
    setNewRecipientInput('');
  };

  const handleRemoveRecipient = (phoneToRemove: string) => {
    if (autoConfig.recipients.length <= 1) {
      onShowToast('At least one WhatsApp recipient number is required.');
      return;
    }
    setAutoConfig({
      ...autoConfig,
      recipients: autoConfig.recipients.filter((p) => p !== phoneToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00a884] text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  WhatsApp Business Close Report
                </h3>
                {autoConfig.enabled ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Auto-Send Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    Auto-Send Off
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Automated daily closing summaries & manual 1-click dispatch for {business.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Close Report Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'automation'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>⚙️ Auto-Dispatch Setup</span>
            {autoConfig.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>📋 Dispatch Logs ({logs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Auto-Dispatch Status Notification Bar */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950">
                      Automatic WhatsApp Delivery: {autoConfig.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                    <p className="text-[11px] text-emerald-800">
                      {autoConfig.enabled
                        ? `Triggers on daily close reconciliation & daily at ${autoConfig.scheduledTime} GMT to ${autoConfig.recipients.join(', ')}.`
                        : 'Currently set to manual. Turn on automatic dispatch to send hands-free every night.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('automation')}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100/50 transition-colors"
                >
                  Configure
                </button>
              </div>

              {/* Instant Auto-Send Confirmation Receipt */}
              {autoSendReceipt && (
                <div className="bg-emerald-500 text-white rounded-xl p-3 text-xs flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>Delivered via WhatsApp Gateway!</strong> Message ID: <code className="font-mono text-[11px] bg-emerald-600 px-1 py-0.5 rounded">{autoSendReceipt.messageId}</code> to {autoSendReceipt.recipients.join(', ')} at {autoSendReceipt.timestamp}.
                    </span>
                  </div>
                  <button 
                    onClick={() => setAutoSendReceipt(null)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Message Preview Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span>Message Preview ({selectedDate}):</span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span>Recipients:</span>
                    <strong className="text-emerald-700">
                      {autoConfig.recipients.join(', ')}
                    </strong>
                  </div>
                </div>

                <div className="bg-[#e7fedb]/35 border border-emerald-200 rounded-xl p-4 text-xs text-slate-800 font-mono whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed shadow-inner">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 text-slate-400 gap-2 font-sans text-xs">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Compiling real-time close numbers...</span>
                    </div>
                  ) : (
                    summaryText
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="pt-2 space-y-2.5">
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  {/* Primary Feature: Send Automatically Now */}
                  <button
                    onClick={handleTriggerAutoSend}
                    disabled={isSendingAuto || loading}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSendingAuto ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending via WhatsApp Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Send Automatically Now (Direct Server Gateway)</span>
                      </>
                    )}
                  </button>

                  {/* Manual fallback: Open WhatsApp Web/App */}
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                    title="Open chat in WhatsApp Web or native app"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in WhatsApp</span>
                  </a>

                  {/* Copy Text */}
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 text-center">
                  💡 <strong>Automatic dispatch:</strong> Sends background HTTP requests through your VPS server gateway directly to WhatsApp without opening WhatsApp Web.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-5 text-xs">
              {/* Master Automation Toggle */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Enable Automatic WhatsApp Close Report</span>
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Automatically compile and send the complete close report to WhatsApp without requiring manual copying or sending.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoConfig.enabled}
                    onChange={(e) =>
                      setAutoConfig({ ...autoConfig, enabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884]"></div>
                </label>
              </div>

              {/* Automation Triggers */}
              <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500 mb-2">
                  When Should the Report Automatically Send?
                </h4>

                <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoConfig.autoSendOnReconciliation}
                    onChange={(e) =>
                      setAutoConfig({
                        ...autoConfig,
                        autoSendOnReconciliation: e.target.checked,
                      })
                    }
                    className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800">
                      ⚡ On Daily Register Reconciliation & Close
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Immediately triggers whenever the cashier or manager balances the cash drawer and clicks "Save & Close Register".
                    </p>
                  </div>
                </label>

                <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                  <input
                    type="checkbox"
                    checked={autoConfig.autoSendAtScheduledTime}
                    onChange={(e) =>
                      setAutoConfig({
                        ...autoConfig,
                        autoSendAtScheduledTime: e.target.checked,
                      })
                    }
                    className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-slate-800">
                        ⏰ Daily Scheduled Closing Time
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="time"
                          value={autoConfig.scheduledTime}
                          onChange={(e) =>
                            setAutoConfig({ ...autoConfig, scheduledTime: e.target.value })
                          }
                          className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-slate-900 font-mono font-bold text-xs focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 font-semibold">GMT</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      The VPS server's automated cron job compiles and sends today's numbers every day at this exact time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Target WhatsApp Recipients */}
              <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                    WhatsApp Recipients (Owner, Managers, Group)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {autoConfig.recipients.length} configured
                  </span>
                </div>

                <div className="space-y-2">
                  {autoConfig.recipients.map((phone, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-mono font-semibold text-slate-800 text-xs">
                          {phone}
                        </span>
                        {idx === 0 && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            Primary (Owner)
                          </span>
                        )}
                      </div>

                      {autoConfig.recipients.length > 1 && (
                        <button
                          onClick={() => handleRemoveRecipient(phone)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove recipient"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new recipient input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="+233501234567 or WhatsApp group ID"
                    value={newRecipientInput}
                    onChange={(e) => setNewRecipientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRecipient();
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddRecipient}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Delivery Gateway Channel */}
              <div className="space-y-2 bg-white border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  Delivery Channel / Gateway Service
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      autoConfig.gatewayMode === 'VPS_GATEWAY_SERVICE'
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gatewayMode"
                      checked={autoConfig.gatewayMode === 'VPS_GATEWAY_SERVICE'}
                      onChange={() =>
                        setAutoConfig({ ...autoConfig, gatewayMode: 'VPS_GATEWAY_SERVICE' })
                      }
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <strong className="block text-slate-900 text-xs">
                        VPS Gateway Service
                      </strong>
                      <span className="text-[11px] text-slate-500 leading-tight block">
                        Server-authoritative HTTP gateway pre-configured on your VPS instance.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      autoConfig.gatewayMode === 'WEBHOOK'
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gatewayMode"
                      checked={autoConfig.gatewayMode === 'WEBHOOK'}
                      onChange={() =>
                        setAutoConfig({ ...autoConfig, gatewayMode: 'WEBHOOK' })
                      }
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <strong className="block text-slate-900 text-xs">
                        Custom Webhook / WhatsApp API
                      </strong>
                      <span className="text-[11px] text-slate-500 leading-tight block">
                        Direct forward to Zapier, Make, Twilio, or Green API.
                      </span>
                    </div>
                  </label>
                </div>

                {autoConfig.gatewayMode === 'WEBHOOK' && (
                  <div className="pt-2">
                    <label className="font-bold text-slate-700 block mb-1">
                      Webhook Destination URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://api.your-vps.com/webhook/whatsapp or https://hooks.zapier.com/..."
                      value={autoConfig.webhookUrl || ''}
                      onChange={(e) =>
                        setAutoConfig({ ...autoConfig, webhookUrl: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveAutomation}
                  disabled={isSavingConfig}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingConfig ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Save Automation Settings</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Recent automated transmission log from VPS background service:</span>
                <button
                  onClick={fetchAutomationConfig}
                  className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl p-6 text-slate-400 text-xs">
                  <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No automated dispatches yet today.</p>
                  <p className="text-[11px] mt-1">
                    Dispatches will appear here automatically as scheduled reports or daily register reconciliations occur.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{log.status}</span>
                          </span>
                          <span className="font-bold text-slate-800">
                            {log.trigger === 'RECONCILIATION_CLOSE'
                              ? '⚡ Daily Reconciliation Close'
                              : log.trigger === 'SCHEDULED_CRON'
                              ? '⏰ Scheduled 20:00 Cron'
                              : '⚡ Manual Instant Auto-Trigger'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                          <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                            {log.latencyMs}ms
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Recipients: <strong className="font-mono text-slate-800">{log.recipients.join(', ')}</strong></span>
                        <span className="font-mono text-[10px] text-slate-400">ID: {log.messageId}</span>
                      </div>

                      <p className="text-[11px] font-mono text-slate-600 bg-white/70 rounded p-1.5 border border-slate-200/60 truncate">
                        {log.summaryPreview}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Target: <strong>{business.whatsAppNumber}</strong> ({business.city}, {business.country})</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-200/50 font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
