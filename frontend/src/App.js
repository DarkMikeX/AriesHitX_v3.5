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
  ChevronDown,
  X,
  Lock,
  CreditCard,
  Globe,
  Shield,
  Key,
  ToggleLeft,
  Clock,
  User,
  Mail,
  Calendar,
  Building
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster, toast } from "sonner";

// Glass Card Component
const GlassCard = ({ children, className = "", animate = true, onClick }) => (
  <motion.div
    initial={animate ? { opacity: 0, y: 20 } : false}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    onClick={onClick}
    className={`glass-panel ${className}`}
  >
    {children}
  </motion.div>
);

// Icon Button Component
const IconButton = ({ icon: Icon, label, onClick, active, className = "", badge }) => (
  <motion.button
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    data-testid={`btn-${label?.toLowerCase().replace(/\s+/g, '-')}`}
    className={`relative p-3 rounded-xl glass-button ${active ? 'neon-glow-purple' : ''} ${className}`}
    title={label}
  >
    <Icon className="w-5 h-5 text-purple-300" />
    {badge && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] flex items-center justify-center">
        {badge}
      </span>
    )}
  </motion.button>
);

// Telegram Button Component
const TelegramButton = ({ label, url, icon: Icon, variant = "primary" }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05, x: 5 }}
    whileTap={{ scale: 0.95 }}
    data-testid={`telegram-${label?.toLowerCase().replace(/\s+/g, '-')}`}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
      variant === "primary" 
        ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 neon-glow-purple" 
        : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </motion.a>
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="log-entry py-1"
    >
      <span className="log-timestamp">[{timestamp}]</span>{" "}
      <span className={typeColors[type] || "text-gray-300"}>[{type.toUpperCase()}]</span>:{" "}
      <span className="text-gray-300">{message}</span>
    </motion.div>
  );
};

// Settings Modal Component
const SettingsModal = ({ open, onClose }) => {
  const [proxySettings, setProxySettings] = useState({
    dismissAfter: "2000",
    proxyInterval: "0.5",
    timeout: "5000",
    interval: "",
    enableAutofill: true,
    enableInterval: true
  });

  const [autofillData, setAutofillData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    cardMonth: "",
    cardYear: "",
    address1: "",
    address2: "",
    city: "",
    zipCode: "",
    buildingNumber: ""
  });

  const [telegramSettings, setTelegramSettings] = useState({
    enabled: false,
    botToken: "",
    chatId: ""
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0a0a12]/95 backdrop-blur-2xl border border-white/10 text-white p-0 overflow-hidden" data-testid="settings-modal">
        <div className="relative">
          {/* Background Orbs */}
          <div className="bg-orb bg-orb-purple w-64 h-64 -top-32 -right-32 absolute" />
          <div className="bg-orb bg-orb-blue w-48 h-48 -bottom-24 -left-24 absolute" />
          
          <DialogHeader className="p-6 border-b border-white/10">
            <DialogTitle className="text-2xl font-bold font-['Space_Grotesk'] flex items-center gap-3">
              <Settings className="w-6 h-6 text-purple-400" />
              Settings
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-6">
              {/* Proxy Settings */}
              <div className="glass-panel p-4 space-y-4">
                <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                  <Globe className="w-5 h-5" /> Proxy Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Lock className="w-4 h-4" /> Dismiss After (ms)
                    </label>
                    <input
                      type="text"
                      value={proxySettings.dismissAfter}
                      onChange={(e) => setProxySettings({...proxySettings, dismissAfter: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 transition-colors"
                      data-testid="input-dismiss-after"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Lock className="w-4 h-4" /> Proxy Interval (mins)
                    </label>
                    <input
                      type="text"
                      value={proxySettings.proxyInterval}
                      onChange={(e) => setProxySettings({...proxySettings, proxyInterval: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 transition-colors"
                      data-testid="input-proxy-interval"
                    />
                  </div>
                </div>
              </div>

              {/* Autofill Settings */}
              <div className="glass-panel p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Autofill Settings
                  </h3>
                  <Switch
                    checked={proxySettings.enableAutofill}
                    onCheckedChange={(checked) => setProxySettings({...proxySettings, enableAutofill: checked})}
                    data-testid="switch-autofill"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Lock className="w-4 h-4" /> Timeout (ms)
                    </label>
                    <input
                      type="text"
                      value={proxySettings.timeout}
                      onChange={(e) => setProxySettings({...proxySettings, timeout: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 transition-colors"
                      data-testid="input-timeout"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <ToggleLeft className="w-4 h-4" /> Enable Interval
                    </label>
                    <Switch
                      checked={proxySettings.enableInterval}
                      onCheckedChange={(checked) => setProxySettings({...proxySettings, enableInterval: checked})}
                      data-testid="switch-interval"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <User className="w-4 h-4" /> Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={autofillData.name}
                      onChange={(e) => setAutofillData({...autofillData, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={autofillData.email}
                      onChange={(e) => setAutofillData({...autofillData, email: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <CreditCard className="w-4 h-4" /> Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter number"
                      value={autofillData.cardNumber}
                      onChange={(e) => setAutofillData({...autofillData, cardNumber: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-card-number"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" /> Month
                    </label>
                    <input
                      type="text"
                      placeholder="MM"
                      value={autofillData.cardMonth}
                      onChange={(e) => setAutofillData({...autofillData, cardMonth: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-card-month"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" /> Year
                    </label>
                    <input
                      type="text"
                      placeholder="YYYY"
                      value={autofillData.cardYear}
                      onChange={(e) => setAutofillData({...autofillData, cardYear: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-card-year"
                    />
                  </div>
                </div>
              </div>

              {/* Address Settings */}
              <div className="glass-panel p-4 space-y-4">
                <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                  <Building className="w-5 h-5" /> Address Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Lock className="w-4 h-4" /> Address 1
                    </label>
                    <input
                      type="text"
                      placeholder="Enter address 1"
                      value={autofillData.address1}
                      onChange={(e) => setAutofillData({...autofillData, address1: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-address1"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Lock className="w-4 h-4" /> Building Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter building number"
                      value={autofillData.buildingNumber}
                      onChange={(e) => setAutofillData({...autofillData, buildingNumber: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-building"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Lock className="w-4 h-4" /> City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={autofillData.city}
                      onChange={(e) => setAutofillData({...autofillData, city: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-city"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Lock className="w-4 h-4" /> Zip Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter zip code"
                      value={autofillData.zipCode}
                      onChange={(e) => setAutofillData({...autofillData, zipCode: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-zipcode"
                    />
                  </div>
                </div>
              </div>

              {/* Telegram Hit Sender */}
              <div className="glass-panel p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                    <Send className="w-5 h-5" /> Telegram Hit Sender
                  </h3>
                  <Switch
                    checked={telegramSettings.enabled}
                    onCheckedChange={(checked) => setTelegramSettings({...telegramSettings, enabled: checked})}
                    data-testid="switch-telegram"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Key className="w-4 h-4" /> Bot Token
                    </label>
                    <input
                      type="text"
                      placeholder="Enter bot token"
                      value={telegramSettings.botToken}
                      onChange={(e) => setTelegramSettings({...telegramSettings, botToken: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-bot-token"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Key className="w-4 h-4" /> Chat ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter chat ID"
                      value={telegramSettings.chatId}
                      onChange={(e) => setTelegramSettings({...telegramSettings, chatId: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-purple-500 transition-colors"
                      data-testid="input-chat-id"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  toast.success("Settings reset to defaults");
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-indigo-500 transition-all"
                data-testid="btn-reset-settings"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                Reset
              </motion.button>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Gateway Modal Component
const GatewayModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState(null);
  
  const gateways = [
    { id: "stripe", name: "Stripe", status: "active", color: "#6772E5" },
    { id: "braintree", name: "Braintree", status: "active", color: "#2E7D32" },
    { id: "adyen", name: "Adyen", status: "active", color: "#0ABF53" },
    { id: "paypal", name: "PayPal", status: "active", color: "#003087" },
    { id: "square", name: "Square", status: "inactive", color: "#006AFF" },
    { id: "worldpay", name: "Worldpay", status: "active", color: "#E91D32" },
    { id: "checkout", name: "Checkout.com", status: "active", color: "#0A0A0A" },
    { id: "cybersource", name: "CyberSource", status: "inactive", color: "#005587" }
  ];

  useEffect(() => {
    if (open) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0a0a12]/95 backdrop-blur-2xl border border-white/10 text-white" data-testid="gateway-modal">
        <div className="relative">
          <div className="bg-orb bg-orb-cyan w-48 h-48 -top-24 -right-24 absolute" />
          
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold font-['Space_Grotesk'] flex items-center gap-3">
              <Zap className="w-6 h-6 text-cyan-400" />
              Gateways
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-400">Fetching gateways!</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {gateways.map((gateway, index) => (
                  <motion.div
                    key={gateway.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedGateway(gateway.id);
                      toast.success(`${gateway.name} selected`);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedGateway === gateway.id 
                        ? 'bg-purple-500/20 border border-purple-500/50' 
                        : 'glass-panel glass-panel-hover'
                    }`}
                    data-testid={`gateway-${gateway.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: gateway.color }}
                      />
                      <span className="font-medium">{gateway.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      gateway.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {gateway.status}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Bin Library Modal
const BinLibraryModal = ({ open, onClose }) => {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0a0a12]/95 backdrop-blur-2xl border border-white/10 text-white" data-testid="bin-library-modal">
        <div className="relative">
          <div className="bg-orb bg-orb-purple w-64 h-64 -top-32 -left-32 absolute" />
          
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold font-['Space_Grotesk'] flex items-center gap-3">
              <Library className="w-6 h-6 text-purple-400" />
              Bin Library
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {bins.map((bin, index) => (
                <motion.div
                  key={bin.bin}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => {
                    navigator.clipboard.writeText(bin.bin);
                    toast.success(`BIN ${bin.bin} copied!`);
                  }}
                  className="glass-panel p-4 cursor-pointer hover:border-purple-500/50 transition-all"
                  data-testid={`bin-${bin.bin}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-lg text-purple-300">{bin.bin}</span>
                      <span className="text-sm text-gray-400">{bin.bank}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        bin.type === 'VISA' ? 'bg-blue-500/20 text-blue-400' :
                        bin.type === 'MC' ? 'bg-orange-500/20 text-orange-400' :
                        bin.type === 'AMEX' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {bin.type}
                      </span>
                      <span className="text-xs text-gray-500">{bin.country}</span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">{bin.level}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main App Component
function App() {
  const [status, setStatus] = useState(false);
  const [binValue, setBinValue] = useState("");
  const [showBinContent, setShowBinContent] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [binLibraryOpen, setBinLibraryOpen] = useState(false);
  const [logs, setLogs] = useState([
    { type: "info", message: "Welcome to AriesHitX v3.5!", timestamp: "00:00:00" },
    { type: "info", message: "System initialized successfully", timestamp: "00:00:01" }
  ]);

  const [proxyList, setProxyList] = useState("");
  const [ccList, setCcList] = useState("");

  // Generate timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  // Add log entry
  const addLog = useCallback((type, message) => {
    setLogs(prev => [...prev, { type, message, timestamp: getTimestamp() }]);
  }, []);

  // Generate fingerprint
  const generateFingerprint = () => {
    const fp = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    addLog("success", `Fingerprint generated: ${fp.toUpperCase()}`);
    toast.success("Fingerprint Generated!");
  };

  // Toggle status
  const toggleStatus = () => {
    setStatus(!status);
    if (!status) {
      addLog("success", "AriesHitX ACTIVATED - Ready to process");
    } else {
      addLog("warning", "AriesHitX DEACTIVATED - Standby mode");
    }
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([{ type: "info", message: "Logs cleared", timestamp: getTimestamp() }]);
    toast.info("Logs cleared");
  };

  // Copy logs
  const copyLogs = () => {
    const logText = logs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}]: ${l.message}`).join('\n');
    navigator.clipboard.writeText(logText);
    toast.success("Logs copied to clipboard");
  };

  // Simulate activity when status is on
  useEffect(() => {
    if (status) {
      const interval = setInterval(() => {
        const messages = [
          { type: "info", msg: "Scanning for targets..." },
          { type: "success", msg: "Connection established" },
          { type: "warning", msg: "Rate limit detected, switching proxy" },
          { type: "error", msg: "Card Declined: rate_limit_exceeded" },
          { type: "success", msg: "3D Bypass successful" },
          { type: "info", msg: "Processing transaction..." }
        ];
        const random = messages[Math.floor(Math.random() * messages.length)];
        addLog(random.type, random.msg);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [status, addLog]);

  return (
    <div className="min-h-screen bg-[#05050A] relative overflow-hidden" data-testid="arieshitx-dashboard">
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 15, 25, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(10px)',
          }
        }}
      />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="bg-orb bg-orb-purple w-[600px] h-[600px] -top-48 -left-48 animate-pulse-slow" />
        <div className="bg-orb bg-orb-blue w-[500px] h-[500px] top-1/2 -right-48 animate-float" />
        <div className="bg-orb bg-orb-cyan w-[400px] h-[400px] -bottom-32 left-1/4 animate-pulse-slow" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center neon-glow-purple"
            >
              <Shield className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] neon-text-purple" data-testid="app-title">
                AriesHitX
              </h1>
              <p className="text-sm text-gray-500">v3.5 • Payment Automation</p>
            </div>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-3">
            {/* Telegram Buttons */}
            <TelegramButton 
              label="Main Channel" 
              url="https://t.me/ariesxhit" 
              icon={Send}
              variant="primary"
            />
            <TelegramButton 
              label="Charity" 
              url="https://t.me/AriesCharity" 
              icon={Heart}
              variant="secondary"
            />

            <div className="w-px h-8 bg-white/10 mx-2" />

            {/* Icon Buttons */}
            <IconButton 
              icon={Fingerprint} 
              label="Generate Fingerprint" 
              onClick={generateFingerprint}
            />
            <IconButton 
              icon={Zap} 
              label="Gateway" 
              onClick={() => setGatewayOpen(true)}
            />
            <IconButton 
              icon={Library} 
              label="Bin Library" 
              onClick={() => setBinLibraryOpen(true)}
            />
            <IconButton 
              icon={Settings} 
              label="Settings" 
              onClick={() => setSettingsOpen(true)}
            />
          </div>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Status & Config */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Status Card */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className={`w-5 h-5 ${status ? 'text-green-400' : 'text-gray-400'}`} />
                Status
              </h3>
              <motion.div 
                className={`relative h-16 rounded-full flex items-center px-2 cursor-pointer transition-all duration-500 ${
                  status 
                    ? 'bg-green-500/20 border border-green-500/50 neon-glow-purple' 
                    : 'bg-gray-800/50 border border-gray-700'
                }`}
                onClick={toggleStatus}
                whileTap={{ scale: 0.98 }}
                data-testid="status-toggle"
              >
                <motion.div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    status ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                  animate={{ x: status ? 'calc(100% + 140px)' : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <span className={`absolute left-1/2 -translate-x-1/2 font-semibold text-lg ${
                  status ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {status ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </motion.div>
            </GlassCard>

            {/* Bin Entry Card */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Bin Entry
              </h3>
              <div 
                className="relative"
                onMouseEnter={() => setShowBinContent(true)}
                onMouseLeave={() => setShowBinContent(false)}
              >
                <input
                  type="text"
                  placeholder="Enter BIN (e.g., 414720)"
                  value={binValue}
                  onChange={(e) => setBinValue(e.target.value)}
                  className="w-full h-14 bg-blue-900/20 border-2 border-blue-500/30 rounded-xl px-4 text-lg text-white placeholder:text-blue-500/40 focus:border-blue-400 focus:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300"
                  data-testid="bin-input"
                />
                <AnimatePresence>
                  {showBinContent && binValue && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 p-4 glass-panel border-blue-500/30 z-50"
                      data-testid="bin-hover-content"
                    >
                      <div className="text-sm space-y-1">
                        <p className="text-blue-400">BIN: {binValue}</p>
                        <p className="text-gray-400">Bank: Checking...</p>
                        <p className="text-gray-400">Type: VISA/MC</p>
                        <p className="text-gray-400">Level: Checking...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>

            {/* Dropdown Menu Card */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ChevronDown className="w-5 h-5 text-purple-400" />
                Configuration
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-4 glass-button rounded-xl"
                    data-testid="config-dropdown-trigger"
                  >
                    <span className="text-gray-300">Select Configuration</span>
                    <ChevronDown className="w-5 h-5 text-purple-400" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-[#0a0a12]/95 backdrop-blur-xl border border-white/10 text-white" data-testid="config-dropdown-content">
                  <DropdownMenuLabel className="text-purple-400">Data Input</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="focus:bg-purple-500/20 cursor-pointer"
                    onClick={() => toast.info("Proxy List opened")}
                    data-testid="dropdown-proxy"
                  >
                    <Globe className="w-4 h-4 mr-2" /> Proxy List
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="focus:bg-purple-500/20 cursor-pointer"
                    onClick={() => toast.info("CC List opened")}
                    data-testid="dropdown-cc"
                  >
                    <CreditCard className="w-4 h-4 mr-2" /> CC List
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="focus:bg-purple-500/20 cursor-pointer"
                    onClick={() => toast.info("Email List opened")}
                    data-testid="dropdown-email"
                  >
                    <Mail className="w-4 h-4 mr-2" /> Email List
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuLabel className="text-purple-400">Advanced</DropdownMenuLabel>
                  <DropdownMenuItem 
                    className="focus:bg-purple-500/20 cursor-pointer"
                    onClick={() => toast.info("Custom Headers")}
                    data-testid="dropdown-headers"
                  >
                    <Key className="w-4 h-4 mr-2" /> Custom Headers
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="focus:bg-purple-500/20 cursor-pointer"
                    onClick={() => toast.info("User Agents")}
                    data-testid="dropdown-useragent"
                  >
                    <User className="w-4 h-4 mr-2" /> User Agents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Quick Input Areas */}
              <div className="mt-4 space-y-3">
                <textarea
                  placeholder="Enter proxy list (one per line)"
                  value={proxyList}
                  onChange={(e) => setProxyList(e.target.value)}
                  className="w-full h-20 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-purple-500 resize-none transition-colors"
                  data-testid="proxy-textarea"
                />
                <textarea
                  placeholder="Enter CC list (one per line)"
                  value={ccList}
                  onChange={(e) => setCcList(e.target.value)}
                  className="w-full h-20 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-purple-500 resize-none transition-colors"
                  data-testid="cc-textarea"
                />
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Logs */}
          <div className="lg:col-span-2">
            <GlassCard className="h-full flex flex-col">
              {/* Logs Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Logs
                </h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyLogs}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    data-testid="btn-copy-logs"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearLogs}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    data-testid="btn-clear-logs"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Logs Content */}
              <ScrollArea className="flex-1 p-4 bg-black/40 rounded-b-xl min-h-[500px]">
                <div className="font-mono text-xs space-y-1">
                  <AnimatePresence>
                    {logs.map((log, index) => (
                      <LogEntry 
                        key={index} 
                        type={log.type} 
                        message={log.message} 
                        timestamp={log.timestamp}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </GlassCard>
          </div>
        </div>

        {/* Save Configuration Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              addLog("success", "Configuration saved successfully!");
              toast.success("Configuration Saved!");
            }}
            className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-lg flex items-center justify-center gap-3 hover:from-violet-500 hover:to-indigo-500 transition-all neon-glow-purple"
            data-testid="btn-save-config"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save Configuration
          </motion.button>
        </motion.div>
      </div>

      {/* Modals */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <GatewayModal open={gatewayOpen} onClose={() => setGatewayOpen(false)} />
      <BinLibraryModal open={binLibraryOpen} onClose={() => setBinLibraryOpen(false)} />
    </div>
  );
}

export default App;
