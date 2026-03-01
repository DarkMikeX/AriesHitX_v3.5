import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Fingerprint, 
  Library, 
  Send, 
  Heart, 
  Zap, 
  Copy, 
  Trash2,
  ChevronRight,
  ChevronDown,
  X,
  Lock,
  CreditCard,
  Globe,
  Key,
  RefreshCw
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster, toast } from "sonner";

// Custom Toggle Component
const Toggle = ({ checked, onChange, disabled = false }) => (
  <div 
    onClick={() => !disabled && onChange(!checked)}
    className={`toggle-track ${checked ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    data-testid="toggle"
  >
    <div className="toggle-knob" />
  </div>
);

// Icon Button Component - Simple Dark Style
const IconButton = ({ icon: Icon, label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    data-testid={`btn-${label?.toLowerCase().replace(/\s+/g, '-')}`}
    className={`p-2.5 rounded-lg bg-[#1a1a1a] border border-[#252525] hover:bg-[#252525] hover:border-[#333] transition-all duration-200 ${className}`}
    title={label}
  >
    <Icon className="w-4 h-4 text-white" />
  </button>
);

// Log Entry Component
const LogEntry = ({ type, message, timestamp }) => {
  const typeColors = {
    success: "log-success",
    error: "log-error",
    warning: "log-warning",
    info: "log-info"
  };

  return (
    <div className="font-mono text-xs py-0.5">
      <span className="log-timestamp">[{timestamp}]</span>{" "}
      <span className={typeColors[type] || "text-gray-400"}>[{type.toUpperCase()}]</span>:{" "}
      <span className="text-gray-300">{message}</span>
    </div>
  );
};

// Settings Modal - Dark Theme
const SettingsModal = ({ open, onClose }) => {
  const [settings, setSettings] = useState({
    licenseKey: "",
    accentColor: "#8b5cf6",
    dismissAfterMs: "2000",
    proxyIntervalMins: "0.5",
    autofillEnabled: true,
    timeoutMs: "5000",
    intervalEnabled: true,
    intervalMs: "1000",
    name: "",
    email: "",
    cardNumber: "",
    cardMonth: "",
    cardYear: "",
    telegramEnabled: false,
    botToken: "",
    chatId: "",
    blockAnalytics: false,
    soundEnabled: true
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#0a0a0a] border border-[#252525] text-white p-0 overflow-hidden" data-testid="settings-modal">
        <DialogHeader className="p-4 border-b border-[#252525]">
          <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-6">
            {/* Premium Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Premium</h3>
              <div>
                <label className="text-xs text-[#666] mb-1.5 block">License Key</label>
                <input
                  type="text"
                  placeholder="Enter license key"
                  value={settings.licenseKey}
                  onChange={(e) => handleChange('licenseKey', e.target.value)}
                  className="dark-input text-sm"
                  data-testid="input-license"
                />
              </div>
            </div>

            {/* Interface Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Interface</h3>
              <div>
                <label className="text-xs text-[#666] mb-1.5 block">Accent Color</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="dark-input text-sm flex-1"
                  />
                  <button className="btn-secondary text-sm">Generate</button>
                </div>
              </div>
            </div>

            {/* Proxy Settings */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Proxy</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#666] mb-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Dismiss After (ms)
                  </label>
                  <input
                    type="text"
                    value={settings.dismissAfterMs}
                    onChange={(e) => handleChange('dismissAfterMs', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#666] mb-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Proxy Interval (mins)
                  </label>
                  <input
                    type="text"
                    value={settings.proxyIntervalMins}
                    onChange={(e) => handleChange('proxyIntervalMins', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Autofill Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Autofill</h3>
                <Toggle 
                  checked={settings.autofillEnabled} 
                  onChange={(v) => handleChange('autofillEnabled', v)} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Timeout (ms)</label>
                  <input
                    type="text"
                    value={settings.timeoutMs}
                    onChange={(e) => handleChange('timeoutMs', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <span className="text-xs text-[#666]">Enable Interval</span>
                  <Toggle 
                    checked={settings.intervalEnabled} 
                    onChange={(v) => handleChange('intervalEnabled', v)} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={settings.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Card Number</label>
                  <input
                    type="text"
                    placeholder="Enter number"
                    value={settings.cardNumber}
                    onChange={(e) => handleChange('cardNumber', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Month</label>
                  <input
                    type="text"
                    placeholder="MM"
                    value={settings.cardMonth}
                    onChange={(e) => handleChange('cardMonth', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Year</label>
                  <input
                    type="text"
                    placeholder="YYYY"
                    value={settings.cardYear}
                    onChange={(e) => handleChange('cardYear', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Telegram Hit Sender */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Telegram Hit Sender</h3>
                <Toggle 
                  checked={settings.telegramEnabled} 
                  onChange={(v) => handleChange('telegramEnabled', v)} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Bot Token</label>
                  <input
                    type="text"
                    placeholder="Enter bot token"
                    value={settings.botToken}
                    onChange={(e) => handleChange('botToken', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#666] mb-1.5 block">Chat ID</label>
                  <input
                    type="text"
                    placeholder="Enter chat ID"
                    value={settings.chatId}
                    onChange={(e) => handleChange('chatId', e.target.value)}
                    className="dark-input text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Features</h3>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#a0a0a0] flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Block analytics
                </span>
                <Toggle 
                  checked={settings.blockAnalytics} 
                  onChange={(v) => handleChange('blockAnalytics', v)} 
                />
              </div>
            </div>

            {/* Sounds */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Sounds</h3>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#a0a0a0]">Enable sounds</span>
                <Toggle 
                  checked={settings.soundEnabled} 
                  onChange={(v) => handleChange('soundEnabled', v)} 
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => toast.success("Settings reset")}
              className="w-full py-3 rounded-lg bg-[#8b5cf6] hover:bg-[#7c4fe0] font-medium flex items-center justify-center gap-2 transition-colors"
              data-testid="btn-reset-settings"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Gateway Modal - With Toggle for each
const GatewayModal = ({ open, onClose }) => {
  const [gateways, setGateways] = useState([
    { id: "stripe", name: "Stripe", enabled: true },
    { id: "braintree", name: "Braintree", enabled: true },
    { id: "adyen", name: "Adyen", enabled: false },
    { id: "paypal", name: "PayPal", enabled: true },
    { id: "square", name: "Square", enabled: false },
    { id: "worldpay", name: "Worldpay", enabled: true },
    { id: "checkout", name: "Checkout.com", enabled: false },
    { id: "cybersource", name: "CyberSource", enabled: false }
  ]);

  const toggleGateway = (id) => {
    setGateways(prev => prev.map(gw => 
      gw.id === id ? { ...gw, enabled: !gw.enabled } : gw
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-[#0a0a0a] border border-[#252525] text-white p-0" data-testid="gateway-modal">
        <DialogHeader className="p-4 border-b border-[#252525] flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Gateways</DialogTitle>
          <div className="flex items-center gap-2">
            <button className="text-xs text-[#8b5cf6] flex items-center gap-1 hover:text-[#a78bfa]">
              <Lock className="w-3 h-3" /> Custom
            </button>
            <button 
              onClick={() => {
                setGateways(prev => prev.map(gw => ({ ...gw, enabled: false })));
                toast.info("All gateways reset");
              }}
              className="text-xs text-[#8b5cf6] flex items-center gap-1 hover:text-[#a78bfa]"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-2">
          {gateways.map((gateway) => (
            <div 
              key={gateway.id}
              className="flex items-center justify-between py-3 px-3 rounded-lg bg-[#111] border border-[#1a1a1a] hover:border-[#252525] transition-colors"
              data-testid={`gateway-${gateway.id}`}
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#666]" />
                <span className="text-sm">{gateway.name}</span>
              </div>
              <Toggle 
                checked={gateway.enabled} 
                onChange={() => toggleGateway(gateway.id)} 
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Bin Library Modal - With Use Button
const BinLibraryModal = ({ open, onClose, onUseBin }) => {
  const bins = [
    { bin: "414720", bank: "Chase", country: "USA", type: "VISA", level: "Platinum" },
    { bin: "424242", bank: "Test Bank", country: "USA", type: "VISA", level: "Classic" },
    { bin: "512345", bank: "Mastercard Test", country: "UK", type: "MC", level: "World" },
    { bin: "378282", bank: "American Express", country: "USA", type: "AMEX", level: "Gold" },
    { bin: "601111", bank: "Discover", country: "USA", type: "DISC", level: "It" },
    { bin: "453275", bank: "HSBC", country: "UK", type: "VISA", level: "Infinite" },
    { bin: "541234", bank: "Barclays", country: "UK", type: "MC", level: "World Elite" },
    { bin: "471627", bank: "Capital One", country: "USA", type: "VISA", level: "Signature" }
  ];

  const handleUseBin = (bin) => {
    onUseBin(bin);
    onClose();
    toast.success(`BIN ${bin} applied`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#0a0a0a] border border-[#252525] text-white p-0" data-testid="bin-library-modal">
        <DialogHeader className="p-4 border-b border-[#252525]">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Library className="w-5 h-5" />
            Bin Library
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-2">
            {bins.map((item) => (
              <div 
                key={item.bin}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#111] border border-[#1a1a1a] hover:border-[#252525] transition-colors"
                data-testid={`bin-${item.bin}`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-white">{item.bin}</span>
                  <span className="text-xs text-[#666]">{item.bank}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    item.type === 'VISA' ? 'bg-blue-900/30 text-blue-400' :
                    item.type === 'MC' ? 'bg-orange-900/30 text-orange-400' :
                    item.type === 'AMEX' ? 'bg-green-900/30 text-green-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-[#555]">{item.country}</span>
                </div>
                <button
                  onClick={() => handleUseBin(item.bin)}
                  className="px-3 py-1.5 text-xs font-medium rounded bg-[#8b5cf6] hover:bg-[#7c4fe0] transition-colors"
                  data-testid={`use-bin-${item.bin}`}
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Main App Component
function App() {
  const [status, setStatus] = useState(false);
  const [binValue, setBinValue] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [binLibraryOpen, setBinLibraryOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [proxyList, setProxyList] = useState("");
  const [logs, setLogs] = useState([
    { type: "info", message: "Welcome to AriesHitX v3.5!", timestamp: "00:00:00" },
    { type: "info", message: "System initialized successfully", timestamp: "00:00:01" }
  ]);

  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const addLog = useCallback((type, message) => {
    setLogs(prev => [...prev, { type, message, timestamp: getTimestamp() }]);
  }, []);

  const generateFingerprint = () => {
    const fp = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    addLog("success", `Fingerprint: ${fp.toUpperCase()}`);
    toast.success("Fingerprint Generated");
  };

  const toggleStatus = () => {
    setStatus(!status);
    if (!status) {
      addLog("success", "AriesHitX ACTIVATED");
    } else {
      addLog("warning", "AriesHitX DEACTIVATED");
    }
  };

  const clearLogs = () => {
    setLogs([{ type: "info", message: "Logs cleared", timestamp: getTimestamp() }]);
  };

  const copyLogs = () => {
    const logText = logs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}]: ${l.message}`).join('\n');
    navigator.clipboard.writeText(logText);
    toast.success("Logs copied");
  };

  const handleUseBin = (bin) => {
    setBinValue(bin);
  };

  useEffect(() => {
    if (status) {
      const interval = setInterval(() => {
        const messages = [
          { type: "info", msg: "Scanning targets..." },
          { type: "success", msg: "Connection established" },
          { type: "warning", msg: "Rate limit - switching proxy" },
          { type: "error", msg: "Card Declined: rate_limit_exceeded" },
          { type: "success", msg: "3D Bypass successful" }
        ];
        const random = messages[Math.floor(Math.random() * messages.length)];
        addLog(random.type, random.msg);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [status, addLog]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]" data-testid="arieshitx-dashboard">
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#151515',
            border: '1px solid #252525',
            color: '#fff'
          }
        }}
      />
      
      {/* Subtle Background */}
      <div className="bg-gradient" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8b5cf6] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold" data-testid="app-title">AriesHitX</h1>
              <p className="text-xs text-[#666]">v3.5 • By Aries</p>
            </div>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-2">
            <a 
              href="https://t.me/ariesxhit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#252525] hover:bg-[#252525] transition-colors text-sm"
              data-testid="telegram-main"
            >
              <Send className="w-4 h-4" />
              Main
            </a>
            <a 
              href="https://t.me/AriesCharity" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#252525] hover:bg-[#252525] transition-colors text-sm"
              data-testid="telegram-charity"
            >
              <Heart className="w-4 h-4" />
              Charity
            </a>
            
            <div className="w-px h-6 bg-[#252525] mx-1" />
            
            <IconButton icon={Fingerprint} label="Fingerprint" onClick={generateFingerprint} />
            <IconButton icon={Zap} label="Gateway" onClick={() => setGatewayOpen(true)} />
            <IconButton icon={Library} label="Bin Library" onClick={() => setBinLibraryOpen(true)} />
            <IconButton icon={Settings} label="Settings" onClick={() => setSettingsOpen(true)} />
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Status */}
            <div className="glass-panel-solid p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Toggle checked={status} onChange={toggleStatus} />
              </div>
            </div>

            {/* Configuration - Bin Entry */}
            <div className="glass-panel-solid p-4 space-y-4">
              <span className="text-sm font-medium">Configuration</span>
              
              <input
                type="text"
                placeholder="Enter BIN (e.g., 414720)"
                value={binValue}
                onChange={(e) => setBinValue(e.target.value)}
                className="dark-input"
                data-testid="bin-input"
              />
              
              {/* Advanced Section */}
              <div className="border-t border-[#252525] pt-4">
                <button
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="flex items-center justify-between w-full text-sm"
                  data-testid="advanced-toggle"
                >
                  <span>Advanced</span>
                  {advancedOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#666]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#666]" />
                  )}
                </button>
                
                <AnimatePresence>
                  {advancedOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-3">
                        <p className="text-xs text-[#8b5cf6]">
                          Current proxy: {proxyList ? "Set" : "Not set!"}
                        </p>
                        <textarea
                          placeholder="Enter Proxies (optional)"
                          value={proxyList}
                          onChange={(e) => setProxyList(e.target.value)}
                          className="dark-input min-h-[80px] resize-none text-sm"
                          data-testid="proxy-input"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                addLog("success", "Configuration saved");
                toast.success("Configuration Saved");
              }}
              className="w-full py-3 rounded-lg bg-[#8b5cf6] hover:bg-[#7c4fe0] font-medium flex items-center justify-center gap-2 transition-colors"
              data-testid="btn-save-config"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Configuration
            </button>
          </div>

          {/* Right Column - Logs */}
          <div className="lg:col-span-2">
            <div className="glass-panel-solid h-full flex flex-col">
              {/* Logs Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#252525]">
                <span className="text-sm font-medium">Logs</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={copyLogs}
                    className="p-2 rounded hover:bg-[#1a1a1a] transition-colors"
                    data-testid="btn-copy-logs"
                  >
                    <Copy className="w-4 h-4 text-[#666]" />
                  </button>
                  <button
                    onClick={clearLogs}
                    className="p-2 rounded hover:bg-[#1a1a1a] transition-colors"
                    data-testid="btn-clear-logs"
                  >
                    <Trash2 className="w-4 h-4 text-[#666]" />
                  </button>
                </div>
              </div>

              {/* Logs Content */}
              <ScrollArea className="flex-1 p-4 min-h-[400px]">
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <LogEntry 
                      key={index} 
                      type={log.type} 
                      message={log.message} 
                      timestamp={log.timestamp}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <GatewayModal open={gatewayOpen} onClose={() => setGatewayOpen(false)} />
      <BinLibraryModal 
        open={binLibraryOpen} 
        onClose={() => setBinLibraryOpen(false)} 
        onUseBin={handleUseBin}
      />
    </div>
  );
}

export default App;
