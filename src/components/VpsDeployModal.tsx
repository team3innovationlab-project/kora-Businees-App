import React, { useState, useEffect } from 'react';
import { 
  X, 
  Server, 
  Copy, 
  Check, 
  Terminal, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface VpsDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const VpsDeployModal: React.FC<VpsDeployModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'DOCKER' | 'PM2' | 'SYSTEMD'>('DOCKER');
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/vps-info')
        .then((res) => res.json())
        .then((data) => setServerInfo(data))
        .catch((err) => console.error('VPS info error:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast('Copied shell command to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const dockerCommand = `# 1. Clone repository on your VPS
git clone <YOUR_REPO_URL> /var/www/wing-ai-pos
cd /var/www/wing-ai-pos

# 2. Build and launch container in background
docker compose up -d --build

# 3. Check live logs
docker logs -f wing-ai-pos`;

  const pm2Command = `# 1. Install Node.js 20, tsx & PM2 globally
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2 tsx

# 2. Install dependencies & build
cd /var/www/wing-ai-pos
npm install
npm run build

# 3. Launch application with PM2 process manager
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup`;

  const nginxConfig = `server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                VPS Server Deployment & Backend Guide
              </h3>
              <p className="text-[11px] text-slate-500">
                Deploy Wing AI POS to Ubuntu/Debian/Linux VPS with Docker or PM2
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Status Badge */}
        {serverInfo && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">Server Backend: ONLINE</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-mono">Port {serverInfo.port}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-mono">Node {serverInfo.nodeVersion}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              DB: {serverInfo.databasePath}
            </span>
          </div>
        )}

        {/* Method selector */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('DOCKER')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'DOCKER'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Option A: Docker (Recommended)
          </button>
          <button
            onClick={() => setActiveTab('PM2')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'PM2'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Option B: PM2 + Nginx
          </button>
        </div>

        {/* Code Snippets */}
        {activeTab === 'DOCKER' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Docker Compose Launch:</span>
              <button
                onClick={() => copyCode(dockerCommand, 'docker')}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'docker' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
              {dockerCommand}
            </pre>
            <p className="text-[11px] text-slate-500">
              ✓ Database volume is mapped to <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">./data</code> for automatic persistent backups.
            </p>
          </div>
        )}

        {activeTab === 'PM2' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">PM2 Setup on Ubuntu/Debian VPS:</span>
              <button
                onClick={() => copyCode(pm2Command, 'pm2')}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'pm2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'pm2' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
              {pm2Command}
            </pre>

            <div className="pt-2">
              <span className="font-bold text-slate-700 text-xs block mb-1">
                Nginx Reverse Proxy Configuration (/etc/nginx/sites-available/wing-ai):
              </span>
              <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs font-mono overflow-x-auto">
                {nginxConfig}
              </pre>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
