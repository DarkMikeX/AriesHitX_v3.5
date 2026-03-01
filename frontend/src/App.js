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
  X,
  Lock,
  CreditCard,
  Globe,
  RefreshCw,
  Check,
  Volume2,
  Camera,
  Mouse,
  Bell,
  Palette,
  Crown,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";

// Custom Toggle Component
const Toggle = ({ checked, onChange, disabled = false }) => (
  <motion.div 
    onClick={() => !disabled && onChange(!checked)}
    whileTap={{ scale: 0.95 }}
    className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${
      checked ? 'bg-[#8b5cf6]' : 'bg-[#1a1a1a] border border-[#333]'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <motion.div 
      className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-lg"
      animate={{ left: checked ? '22px' : '2px' }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </motion.div>
);

// Icon Button Component
const IconButton = ({ icon: Icon, label, onClick, className = "" }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    data-testid={`btn-${label?.toLowerCase().replace(/\s+/g, '-')}`}
    className={`p-3 rounded-2xl bg-[#151515] border border-[#252525] hover:bg-[#1a1a1a] hover:border-[#8b5cf6]/30 transition-all duration-300 ${className}`}
    title={label}
  >
    <Icon className="w-5 h-5 text-white" />
  </motion.button>
);

// Log Entry Component
const LogEntry = ({ type, message, timestamp, index }) => {
  const typeColors = {
    success: "text-emerald-400",
    error: "text-red-400",
    warning: "text-amber-400",
    info: "text-blue-400"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="font-mono text-xs py-1 hover:bg-white/5 px-2 rounded transition-colors"
    >
      <span className="text-[#555]">[{timestamp}]</span>{" "}
      <span className={typeColors[type] || "text-gray-400"}>[{type.toUpperCase()}]</span>:{" "}
      <span className="text-gray-300">{message}</span>
    </motion.div>
  );
};

// Custom Toast Function
const showToast = (message) => {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#1a1a1a] border border-[#252525] shadow-xl"
    >
      <div className="w-6 h-6 rounded-full bg-[#8b5cf6] flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm text-white">{message}</span>
    </motion.div>
  ), { duration: 2000 });
};

// Settings Modal - BIG with proper scroll
const SettingsModal = ({ open, onClose }) => {
  const [settings, setSettings] = useState({
    licenseKey: "",
    accentColor: "#8b5cf6",
    blurGuiEffect: true,
    blurInput: false,
    cvcModifier: false,
    removePaymentAgent: false,
    threeDBypass: true,
    removeZipCode: false,
    blockAnalytics: false,
    hitSound: true,
    hitSoundUrl: "",
    hitScreenshot: false,
    clickHcaptcha: true,
    clickOnLoad: false,
    clickerPath: "",
    clickerInterval: "5000",
    ignoreDisabled: false,
    notifyEnable: true,
    dismissAfter: "2000",
    proxyInterval: "0.5",
    autofillEnable: true,
    timeout: "5000",
    intervalEnable: true,
    interval: "1000",
    name: "",
    email: "",
    cardNumber: "",
    cardMonth: "",
    cardYear: "",
    cardCvc: "",
    address1: "",
    buildingNumber: "",
    city: "",
    state: "",
    country: "",
    phoneNumber: "",
    zip: "",
    telegramEnable: false,
    botToken: "",
    chatId: ""
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const SettingRow = ({ label, children, locked = false }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
      <span className="text-sm text-[#888] flex items-center gap-2">
        {locked && <Lock className="w-3 h-3 text-[#555]" />}
        {label}
      </span>
      {children}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[50vw] h-[75vh] max-w-none bg-[#0a0a0a] border border-[#1a1a1a] text-white p-0 rounded-2xl" data-testid="settings-modal">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a] shrink-0">
            <h2 className="text-xl font-semibold">Settings</h2>
            <motion.button 
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#1a1a1a] transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* Premium */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                <Crown className="w-4 h-4" /> Premium
              </h3>
              <div className="bg-[#111] rounded-2xl p-4">
                <label className="text-xs text-[#555] mb-2 block">License Key:</label>
                <input
                  type="text"
                  placeholder="Enter license key"
                  value={settings.licenseKey}
                  onChange={(e) => handleChange('licenseKey', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-3 text-sm focus:border-[#8b5cf6] transition-colors outline-none"
                />
              </div>
            </div>

            {/* Interface */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                <Palette className="w-4 h-4" /> Interface
              </h3>
              <div className="bg-[#111] rounded-2xl p-4 space-y-3">
                <div>
                  <label className="text-xs text-[#555] mb-2 block">Accent:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="flex-1 bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-[#1a1a1a] border border-[#252525] rounded-xl text-sm hover:bg-[#252525]"
                    >
                      Generate
                    </motion.button>
                  </div>
                </div>
                <SettingRow label="Blur GUI Effect">
                  <Toggle checked={settings.blurGuiEffect} onChange={(v) => handleChange('blurGuiEffect', v)} />
                </SettingRow>
                <SettingRow label="Blur Input">
                  <Toggle checked={settings.blurInput} onChange={(v) => handleChange('blurInput', v)} />
                </SettingRow>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                <Zap className="w-4 h-4" /> Features
              </h3>
              <div className="bg-[#111] rounded-2xl p-4 space-y-1">
                <SettingRow label="CVC Modifier" locked>
                  <Toggle checked={settings.cvcModifier} onChange={(v) => handleChange('cvcModifier', v)} />
                </SettingRow>
                <SettingRow label="Remove Payment Agent (Stripe)" locked>
                  <Toggle checked={settings.removePaymentAgent} onChange={(v) => handleChange('removePaymentAgent', v)} />
                </SettingRow>
                <SettingRow label="3D Bypass (Stripe)" locked>
                  <Toggle checked={settings.threeDBypass} onChange={(v) => handleChange('threeDBypass', v)} />
                </SettingRow>
                <SettingRow label="Remove Zip Code" locked>
                  <Toggle checked={settings.removeZipCode} onChange={(v) => handleChange('removeZipCode', v)} />
                </SettingRow>
                <SettingRow label="Block analytics" locked>
                  <Toggle checked={settings.blockAnalytics} onChange={(v) => handleChange('blockAnalytics', v)} />
                </SettingRow>
              </div>
            </div>

            {/* Sounds */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Sounds
              </h3>
              <div className="bg-[#111] rounded-2xl p-4 space-y-3">
                <SettingRow label="Hit Sound" locked>
                  <Toggle checked={settings.hitSound} onChange={(v) => handleChange('hitSound', v)} />
                </SettingRow>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Hit Sound Url:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter sound URL"
                    value={settings.hitSoundUrl}
                    onChange={(e) => handleChange('hitSoundUrl', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Screenshot */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                <Camera className="w-4 h-4" /> Screenshot
              </h3>
              <div className="bg-[#111] rounded-2xl p-4">
                <SettingRow label="Hit Screenshot" locked>
                  <Toggle checked={settings.hitScreenshot} onChange={(v) => handleChange('hitScreenshot', v)} />
                </SettingRow>
              </div>
            </div>

            {/* Auto Clicker */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                <Mouse className="w-4 h-4" /> Auto Clicker
              </h3>
              <div className="bg-[#111] rounded-2xl p-4 space-y-3">
                <SettingRow label="Click hCaptcha" locked>
                  <Toggle checked={settings.clickHcaptcha} onChange={(v) => handleChange('clickHcaptcha', v)} />
                </SettingRow>
                <SettingRow label="Click on Load" locked>
                  <Toggle checked={settings.clickOnLoad} onChange={(v) => handleChange('clickOnLoad', v)} />
                </SettingRow>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Clicker Path:
                  </label>
                  <input type="text" placeholder="Enter path or use elementor" value={settings.clickerPath} onChange={(e) => handleChange('clickerPath', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Clicker Interval (ms):
                  </label>
                  <input type="text" value={settings.clickerInterval} onChange={(e) => handleChange('clickerInterval', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <SettingRow label="Ignore Disabled" locked>
                  <Toggle checked={settings.ignoreDisabled} onChange={(v) => handleChange('ignoreDisabled', v)} />
                </SettingRow>
              </div>
            </div>

            {/* Notification */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                <Bell className="w-4 h-4" /> Notification
              </h3>
              <div className="bg-[#111] rounded-2xl p-4 space-y-3">
                <SettingRow label="Enable" locked>
                  <Toggle checked={settings.notifyEnable} onChange={(v) => handleChange('notifyEnable', v)} />
                </SettingRow>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Dismiss After (ms):
                  </label>
                  <input type="text" value={settings.dismissAfter} onChange={(e) => handleChange('dismissAfter', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
              </div>
            </div>

            {/* Proxy */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                <Globe className="w-4 h-4" /> Proxy
              </h3>
              <div className="bg-[#111] rounded-2xl p-4">
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Proxy Interval (mins):
                  </label>
                  <input type="text" value={settings.proxyInterval} onChange={(e) => handleChange('proxyInterval', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
              </div>
            </div>

            {/* Autofill */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Autofill
                </h3>
                <Toggle checked={settings.autofillEnable} onChange={(v) => handleChange('autofillEnable', v)} />
              </div>
              <div className="bg-[#111] rounded-2xl p-4 space-y-3">
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Timeout (ms):</label>
                  <input type="text" value={settings.timeout} onChange={(e) => handleChange('timeout', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <SettingRow label="Enable Interval" locked>
                  <Toggle checked={settings.intervalEnable} onChange={(v) => handleChange('intervalEnable', v)} />
                </SettingRow>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Interval (ms):</label>
                  <input type="text" placeholder="Enter interval" value={settings.interval} onChange={(e) => handleChange('interval', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Name:</label>
                  <input type="text" placeholder="Enter name" value={settings.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Email:</label>
                  <input type="email" placeholder="Enter email" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Card Number:</label>
                  <input type="text" placeholder="Enter number" value={settings.cardNumber} onChange={(e) => handleChange('cardNumber', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Card Month:</label>
                  <input type="text" placeholder="Enter month" value={settings.cardMonth} onChange={(e) => handleChange('cardMonth', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Card Year:</label>
                  <input type="text" placeholder="Enter year" value={settings.cardYear} onChange={(e) => handleChange('cardYear', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Card CVC:</label>
                  <input type="text" placeholder="Enter cvc" value={settings.cardCvc} onChange={(e) => handleChange('cardCvc', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Address 1:</label>
                  <input type="text" placeholder="Enter address 1" value={settings.address1} onChange={(e) => handleChange('address1', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Building Number:</label>
                  <input type="text" placeholder="Enter building number" value={settings.buildingNumber} onChange={(e) => handleChange('buildingNumber', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> City:</label>
                  <input type="text" placeholder="Enter city" value={settings.city} onChange={(e) => handleChange('city', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> State:</label>
                  <input type="text" placeholder="Enter state" value={settings.state} onChange={(e) => handleChange('state', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Country:</label>
                  <input type="text" placeholder="Enter country" value={settings.country} onChange={(e) => handleChange('country', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Phone Number:</label>
                  <input type="text" placeholder="Enter phone number" value={settings.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Zip:</label>
                  <input type="text" placeholder="Enter zip" value={settings.zip} onChange={(e) => handleChange('zip', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
              </div>
            </div>

            {/* Telegram Hit Sender */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#8b5cf6] flex items-center gap-2">
                  <Send className="w-4 h-4" /> Telegram Hit Sender
                </h3>
                <Toggle checked={settings.telegramEnable} onChange={(v) => handleChange('telegramEnable', v)} />
              </div>
              <div className="bg-[#111] rounded-2xl p-4 space-y-3">
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Bot Token:</label>
                  <input type="text" placeholder="Enter bot token" value={settings.botToken} onChange={(e) => handleChange('botToken', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#555] mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Chat Id:</label>
                  <input type="text" placeholder="Enter chat id" value={settings.chatId} onChange={(e) => handleChange('chatId', e.target.value)} className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-2 text-sm outline-none" />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast("Settings reset to defaults")}
              className="w-full py-4 rounded-2xl bg-[#8b5cf6] hover:bg-[#7c4fe0] font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Gateway Modal - BIG
const GatewayModal = ({ open, onClose }) => {
  const [gateways, setGateways] = useState([
    { id: "stripe", name: "Stripe", enabled: true },
    { id: "braintree", name: "Braintree", enabled: true },
    { id: "adyen", name: "Adyen", enabled: false },
    { id: "paypal", name: "PayPal", enabled: true },
    { id: "square", name: "Square", enabled: false },
    { id: "worldpay", name: "Worldpay", enabled: true },
    { id: "checkout", name: "Checkout.com", enabled: false },
    { id: "cybersource", name: "CyberSource", enabled: false },
    { id: "authorize", name: "Authorize.net", enabled: false },
    { id: "nmi", name: "NMI", enabled: true }
  ]);

  const toggleGateway = (id) => {
    setGateways(prev => prev.map(gw => 
      gw.id === id ? { ...gw, enabled: !gw.enabled } : gw
    ));
    const gateway = gateways.find(g => g.id === id);
    showToast(gateway?.enabled ? `${gateway?.name} disabled` : `${gateway?.name} enabled`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[50vw] h-[75vh] max-w-none bg-[#0a0a0a] border border-[#1a1a1a] text-white p-0 rounded-2xl" data-testid="gateway-modal">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a] shrink-0">
            <h2 className="text-xl font-semibold">Gateways</h2>
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-[#8b5cf6] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20"
              >
                <Lock className="w-3 h-3" /> Custom
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setGateways(prev => prev.map(gw => ({ ...gw, enabled: false })));
                  showToast("All gateways reset");
                }}
                className="text-xs text-[#8b5cf6] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[#1a1a1a] transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {gateways.map((gateway, index) => (
              <motion.div 
                key={gateway.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between py-4 px-4 rounded-2xl bg-[#111] border border-[#1a1a1a] hover:border-[#252525] transition-all"
                data-testid={`gateway-${gateway.id}`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-[#444]" />
                  <span className="text-sm font-medium">{gateway.name}</span>
                </div>
                <Toggle 
                  checked={gateway.enabled} 
                  onChange={() => toggleGateway(gateway.id)} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Bin Library Modal - BIG
const BinLibraryModal = ({ open, onClose, onUseBin }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const binCategories = [
    {
      site: "Amazon",
      providers: [
        { type: "VISA", bins: ["414720", "424242", "453275"] },
        { type: "MC", bins: ["512345", "541234"] },
        { type: "AMEX", bins: ["378282"] }
      ]
    },
    {
      site: "Shopify",
      providers: [
        { type: "VISA", bins: ["471627", "486200"] },
        { type: "MC", bins: ["556677", "522233"] }
      ]
    },
    {
      site: "Stripe",
      providers: [
        { type: "VISA", bins: ["400000", "411111"] },
        { type: "MC", bins: ["555555", "510510"] },
        { type: "AMEX", bins: ["340000", "370000"] },
        { type: "DISC", bins: ["601100", "601111"] }
      ]
    },
    {
      site: "PayPal",
      providers: [
        { type: "VISA", bins: ["422222", "433333"] },
        { type: "MC", bins: ["544444"] }
      ]
    },
    {
      site: "Braintree",
      providers: [
        { type: "VISA", bins: ["455555", "466666"] },
        { type: "MC", bins: ["577777"] },
        { type: "AMEX", bins: ["388888"] }
      ]
    }
  ];

  const toggleCategory = (site) => {
    setExpandedCategories(prev => ({
      ...prev,
      [site]: !prev[site]
    }));
  };

  const handleUseBin = (bin) => {
    onUseBin(bin);
    onClose();
    showToast(`BIN ${bin} applied`);
  };

  const getProviderColor = (type) => {
    switch(type) {
      case "VISA": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "MC": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "AMEX": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "DISC": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[50vw] h-[75vh] max-w-none bg-[#0a0a0a] border border-[#1a1a1a] text-white p-0 rounded-2xl" data-testid="bin-library-modal">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a] shrink-0">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <Library className="w-6 h-6 text-[#8b5cf6]" />
              Bin Library
            </h2>
            <motion.button 
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#1a1a1a] transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {binCategories.map((category, catIndex) => (
              <motion.div 
                key={category.site}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.05 }}
                className="bg-[#111] rounded-2xl border border-[#1a1a1a] overflow-hidden"
              >
                {/* Category Header */}
                <motion.button
                  onClick={() => toggleCategory(category.site)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  className="w-full flex items-center justify-between p-4 transition-colors"
                  data-testid={`category-${category.site.toLowerCase()}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-white">{category.site}</span>
                    <div className="flex gap-1">
                      {category.providers.map(p => (
                        <span key={p.type} className={`text-[10px] px-2 py-0.5 rounded-full border ${getProviderColor(p.type)}`}>
                          {p.type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCategories[category.site] ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-[#555]" />
                  </motion.div>
                </motion.button>

                {/* Expanded BINs */}
                <AnimatePresence>
                  {expandedCategories[category.site] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-3">
                        {category.providers.map((provider, pIndex) => (
                          <motion.div 
                            key={provider.type}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: pIndex * 0.05 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-lg border ${getProviderColor(provider.type)}`}>
                                {provider.type}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {provider.bins.map((bin, binIndex) => (
                                <motion.div
                                  key={bin}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: binIndex * 0.03 }}
                                  whileHover={{ scale: 1.02 }}
                                  className="flex items-center justify-between bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a] hover:border-[#8b5cf6]/30"
                                >
                                  <span className="font-mono text-sm text-white">{bin}</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleUseBin(bin)}
                                    className="px-3 py-1 text-xs font-medium rounded-lg bg-[#8b5cf6] hover:bg-[#7c4fe0] transition-colors"
                                    data-testid={`use-bin-${bin}`}
                                  >
                                    Use
                                  </motion.button>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
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
  const [ccList, setCcList] = useState("");
  const [emailList, setEmailList] = useState("");
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
    showToast("Fingerprint generated!");
  };

  const toggleStatus = () => {
    setStatus(!status);
    if (!status) {
      addLog("success", "AriesHitX ACTIVATED");
      showToast("Turned on bypasser!");
    } else {
      addLog("warning", "AriesHitX DEACTIVATED");
      showToast("Turned off bypasser!");
    }
  };

  const clearLogs = () => {
    setLogs([{ type: "info", message: "Logs cleared", timestamp: getTimestamp() }]);
    showToast("Logs cleared");
  };

  const copyLogs = () => {
    const logText = logs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}]: ${l.message}`).join('\n');
    navigator.clipboard.writeText(logText);
    showToast("Logs copied");
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center" data-testid="arieshitx-dashboard">
      <Toaster position="bottom-center" />
      
      {/* Subtle Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3b82f6]/5 rounded-full blur-[100px]" />
      </div>

      {/* Main Container - Centered */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-2xl bg-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="app-title">AriesHitX</h1>
              <p className="text-xs text-[#555]">v3.5 • By Aries</p>
            </div>
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-3">
            <motion.a 
              href="https://t.me/ariesxhit" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#151515] border border-[#252525] hover:border-[#8b5cf6]/30 transition-all text-sm"
              data-testid="telegram-main"
            >
              <Send className="w-4 h-4" />
              Main
            </motion.a>
            <motion.a 
              href="https://t.me/AriesCharity" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#151515] border border-[#252525] hover:border-[#8b5cf6]/30 transition-all text-sm"
              data-testid="telegram-charity"
            >
              <Heart className="w-4 h-4" />
              Charity
            </motion.a>
            
            <div className="w-px h-8 bg-[#252525] mx-1" />
            
            <IconButton icon={Fingerprint} label="Fingerprint" onClick={generateFingerprint} />
            <IconButton icon={Zap} label="Gateway" onClick={() => setGatewayOpen(true)} />
            <IconButton icon={Library} label="Bin Library" onClick={() => setBinLibraryOpen(true)} />
            <IconButton icon={Settings} label="Settings" onClick={() => setSettingsOpen(true)} />
          </div>
        </motion.header>

        {/* Main Grid - Centered */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            
            {/* Status */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-[#111] rounded-2xl border border-[#1a1a1a] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Toggle checked={status} onChange={toggleStatus} />
              </div>
            </motion.div>

            {/* Configuration */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-[#111] rounded-2xl border border-[#1a1a1a] p-5 space-y-4"
            >
              <span className="text-sm font-medium">Configuration</span>
              
              <input
                type="text"
                placeholder="Enter BIN (e.g., 414720)"
                value={binValue}
                onChange={(e) => setBinValue(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-3 text-sm focus:border-[#8b5cf6] transition-colors outline-none"
                data-testid="bin-input"
              />
              
              {/* Advanced Section */}
              <div className="border-t border-[#1a1a1a] pt-4">
                <motion.button
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between w-full text-sm"
                  data-testid="advanced-toggle"
                >
                  <span>Advanced</span>
                  <motion.div animate={{ rotate: advancedOpen ? 90 : 0 }}>
                    <ChevronRight className="w-4 h-4 text-[#555]" />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {advancedOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-3">
                        {/* Proxy List */}
                        <div>
                          <p className="text-xs text-[#8b5cf6] mb-2">
                            Current proxy: {proxyList ? "Set" : "Not set!"}
                          </p>
                          <textarea
                            placeholder="Enter Proxies (optional)"
                            value={proxyList}
                            onChange={(e) => setProxyList(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-3 min-h-[60px] resize-none text-sm focus:border-[#8b5cf6] transition-colors outline-none"
                            data-testid="proxy-input"
                          />
                        </div>

                        {/* CC List */}
                        <div>
                          <p className="text-xs text-[#8b5cf6] mb-2">
                            CC List: {ccList ? "Set" : "Not set!"}
                          </p>
                          <textarea
                            placeholder="Enter CC List (optional)"
                            value={ccList}
                            onChange={(e) => setCcList(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-3 min-h-[60px] resize-none text-sm focus:border-[#8b5cf6] transition-colors outline-none"
                            data-testid="cc-input"
                          />
                        </div>

                        {/* Email List */}
                        <div>
                          <p className="text-xs text-[#8b5cf6] mb-2">
                            Email List: {emailList ? "Set" : "Not set!"}
                          </p>
                          <textarea
                            placeholder="Enter Email List (optional)"
                            value={emailList}
                            onChange={(e) => setEmailList(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-3 min-h-[60px] resize-none text-sm focus:border-[#8b5cf6] transition-colors outline-none"
                            data-testid="email-input"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                addLog("success", "Configuration saved");
                showToast("Configuration saved!");
              }}
              className="w-full py-4 rounded-2xl bg-[#8b5cf6] hover:bg-[#7c4fe0] font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#8b5cf6]/20"
              data-testid="btn-save-config"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Configuration
            </motion.button>
          </motion.div>

          {/* Right Column - Logs */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#111] rounded-2xl border border-[#1a1a1a] h-full flex flex-col">
              {/* Logs Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
                <span className="text-sm font-medium">Logs</span>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyLogs}
                    className="p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors"
                    data-testid="btn-copy-logs"
                  >
                    <Copy className="w-4 h-4 text-[#555]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearLogs}
                    className="p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors"
                    data-testid="btn-clear-logs"
                  >
                    <Trash2 className="w-4 h-4 text-[#555]" />
                  </motion.button>
                </div>
              </div>

              {/* Logs Content */}
              <div className="flex-1 overflow-y-auto p-4 min-h-[400px]">
                <div className="space-y-0.5">
                  {logs.map((log, index) => (
                    <LogEntry 
                      key={index} 
                      type={log.type} 
                      message={log.message} 
                      timestamp={log.timestamp}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
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
