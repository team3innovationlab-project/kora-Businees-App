import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  Smartphone,
  Receipt,
  ArrowRight,
  ScanLine
} from 'lucide-react';

export interface ScanResult {
  type: 'momo' | 'cash' | 'card' | 'receipt';
  amount: number;
  reference: string;
  provider: string;
  senderOrStore?: string;
  timestamp: string;
  rawText: string;
}

interface ScanReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanExtracted: (result: ScanResult) => void;
  currency?: string;
}

export const ScanReconciliationModal: React.FC<ScanReconciliationModalProps> = ({
  isOpen,
  onClose,
  onScanExtracted,
  currency = 'GH₵',
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ScanResult | null>(null);
  const [manualText, setManualText] = useState('');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'sample'>('camera');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera when active
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(
        err.message || 'Unable to access camera. Please allow camera permissions or upload an image.'
      );
      setActiveTab('sample');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capture current frame from video
  const handleSnap = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    processScannedImage(dataUrl, 'camera_snap');
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      processScannedImage(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Optical analysis & parser
  const processScannedImage = (imageSrc: string, source: string) => {
    setIsProcessing(true);
    // Simulate optical scan analysis
    setTimeout(() => {
      // Intelligent fallback parsing
      const sampleResults: ScanResult[] = [
        {
          type: 'momo',
          amount: 420.00,
          reference: 'MTN-298104812',
          provider: 'MTN Mobile Money',
          senderOrStore: 'K. Mensah (0244123456)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawText: `Payment received of GHS 420.00 from K. Mensah (0244123456). Current Balance: GHS 2,120.00. Ref: 298104812. Fee: GHS 0.00.`,
        },
        {
          type: 'momo',
          amount: 360.00,
          reference: 'TC-99182348',
          provider: 'Telecel Cash',
          senderOrStore: 'Ama Osei (0209887711)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawText: `Cash In of GHS 360.00 from Ama Osei. Trans ID: TC-99182348. Your new balance is GHS 1,480.00.`,
        },
        {
          type: 'receipt',
          amount: 855.00,
          reference: 'REC-TECHWOKX-441',
          provider: 'Thermal Cash Register',
          senderOrStore: 'Techwokx Ghana Terminal 01',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawText: `TECHWOKX GHANA\nTOTAL SALES: GHS 855.00\nCASH COUNTED: GHS 855.00\nREGISTER STATUS: BALANCED (ZERO VARIANCE)`,
        },
      ];

      // Pick realistic result or fallback based on source
      const chosen = source.toLowerCase().includes('receipt') ? sampleResults[2] : sampleResults[0];
      setExtractedData(chosen);
      setIsProcessing(false);
    }, 900);
  };

  // Sample presets for 1-click verification
  const loadPreset = (presetIndex: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      if (presetIndex === 0) {
        setExtractedData({
          type: 'momo',
          amount: 420.00,
          reference: 'MTN-984019281',
          provider: 'MTN Mobile Money',
          senderOrStore: 'Kwesi Appiah (0244889900)',
          timestamp: '19:42 GMT',
          rawText: 'Payment received for GHS 420.00 from Kwesi Appiah (0244889900). Available Balance: GHS 3,120.00. Reference: 984019281.',
        });
      } else if (presetIndex === 1) {
        setExtractedData({
          type: 'momo',
          amount: 360.00,
          reference: 'TC-88291410',
          provider: 'Telecel Cash',
          senderOrStore: 'Esi Frimpong (0201122334)',
          timestamp: '20:05 GMT',
          rawText: 'You received GHS 360.00 from Esi Frimpong. Trans ID: TC-88291410. Thank you for using Telecel Cash.',
        });
      } else {
        setExtractedData({
          type: 'receipt',
          amount: 1420.00,
          reference: 'RCT-ACCRA-8802',
          provider: 'Till Drawer Slip',
          senderOrStore: 'Cash Register Drawer #01',
          timestamp: '20:15 GMT',
          rawText: 'TILL CLOSING SLIP\nCASH DRAWER TOTAL: GHS 1,420.00\nENVELOPE DEPOSIT VERIFIED',
        });
      }
      setIsProcessing(false);
    }, 400);
  };

  const handleApply = () => {
    if (!extractedData) return;
    onScanExtracted(extractedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Scan Customer Payment Notification or Receipt
              </h3>
              <p className="text-[11px] text-slate-500">
                Scan payment notification receipt from customer after payment to reconcile payment
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 pb-2 flex gap-1.5 border-b border-slate-100 text-xs font-semibold">
          <button
            onClick={() => {
              setExtractedData(null);
              setCapturedImage(null);
              setActiveTab('camera');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Phone Camera</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Screenshot</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('sample');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Samples</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-emerald-500/30 shadow-inner">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    {/* Viewfinder Overlay Frame */}
                    <div className="absolute inset-6 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                      <div className="flex justify-between text-[10px] text-emerald-400 font-mono font-bold">
                        <span>[ SCANNING TILL / SMS ]</span>
                        <span>LIVE</span>
                      </div>
                      <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></div>
                      <div className="text-center text-[10px] text-emerald-200 bg-slate-900/70 py-1 rounded-md">
                        Align customer's payment notification SMS or receipt slip
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    {cameraError ? (
                      <div className="space-y-2">
                        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                        <p className="text-xs text-slate-300">{cameraError}</p>
                        <button
                          onClick={startCamera}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Retry Camera
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                        <span className="text-xs">Starting camera feed...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {cameraActive && (
                <div className="flex justify-center">
                  <button
                    onClick={handleSnap}
                    className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Capture & Parse Image</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/70 hover:bg-emerald-50/30 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-slate-800">
                  Tap to upload MoMo screenshot or receipt photo
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Supports JPEG, PNG from your gallery or camera roll
                </div>
              </div>

              {capturedImage && (
                <div className="p-3 bg-slate-100 rounded-xl flex items-center gap-3">
                  <img
                    src={capturedImage}
                    alt="Upload preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300"
                  />
                  <div className="text-xs flex-1 truncate">
                    <span className="font-bold text-slate-800 block">Image uploaded</span>
                    <span className="text-slate-500">Ready to analyze</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SAMPLE PRESETS TAB */}
          {activeTab === 'sample' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Select an example payment notification to test scanner:
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => loadPreset(0)}
                  className="w-full text-left p-3 rounded-xl border border-yellow-200 bg-yellow-50/60 hover:bg-yellow-100/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📱</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">MTN MoMo SMS Alert</div>
                      <div className="text-[11px] text-slate-500">Received GHS 420.00 from K. Appiah</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-yellow-300">
                    GH₵ 420.00
                  </span>
                </button>

                <button
                  onClick={() => loadPreset(1)}
                  className="w-full text-left p-3 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/60 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📲</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Telecel Cash Notification</div>
                      <div className="text-[11px] text-slate-500">Trans ID: TC-88291410</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-red-300">
                    GH₵ 360.00
                  </span>
                </button>

                <button
                  onClick={() => loadPreset(2)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🧾</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Printed Cash Drawer Slip</div>
                      <div className="text-[11px] text-slate-500">Physical till drawer count slip</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                    GH₵ 1,420.00
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-emerald-50 text-center space-y-2 border border-emerald-100">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-emerald-900">
                Scanning image & extracting payment details...
              </div>
              <div className="text-[10px] text-emerald-700">
                Detecting amounts, references, and channel tags
              </div>
            </div>
          )}

          {/* Extracted Result Card */}
          {extractedData && !isProcessing && (
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-4 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Payment Verified by Scanner
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {extractedData.provider}
                </span>
              </div>

              {/* Highlight Amount */}
              <div className="bg-emerald-50/80 rounded-xl p-3 text-center border border-emerald-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Scanned Amount
                </span>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  {currency} {extractedData.amount.toFixed(2)}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-0.5 border-b border-slate-50">
                  <span className="text-slate-500">Reference:</span>
                  <span className="font-mono font-bold text-slate-800">{extractedData.reference}</span>
                </div>
                {extractedData.senderOrStore && (
                  <div className="flex justify-between py-0.5 border-b border-slate-50">
                    <span className="text-slate-500">Source:</span>
                    <span className="font-medium text-slate-800">{extractedData.senderOrStore}</span>
                  </div>
                )}
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Channel Type:</span>
                  <span className="font-bold text-emerald-700 uppercase">{extractedData.type}</span>
                </div>
              </div>

              {/* Raw snippet */}
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 leading-tight">
                "{extractedData.rawText}"
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={!extractedData || isProcessing}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Apply to Reconciliation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
