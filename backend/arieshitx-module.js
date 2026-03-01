/**
 * AriesHitX v3.5 Backend Module
 * Use this in your browser extension
 */

// Storage Keys
const STORAGE_KEYS = {
  SETTINGS: 'arieshitx_settings',
  GATEWAYS: 'arieshitx_gateways',
  BINS: 'arieshitx_bins',
  CONFIG: 'arieshitx_config',
  LOGS: 'arieshitx_logs'
};

// Default Settings
const DEFAULT_SETTINGS = {
  licenseKey: '',
  accentColor: '#8b5cf6',
  blurGuiEffect: true,
  blurInput: false,
  cvcModifier: false,
  removePaymentAgent: false,
  threeDBypass: true,
  removeZipCode: false,
  blockAnalytics: false,
  hitSound: true,
  hitSoundUrl: '',
  hitScreenshot: false,
  clickHcaptcha: true,
  clickOnLoad: false,
  clickerPath: '',
  clickerInterval: '5000',
  ignoreDisabled: false,
  notifyEnable: true,
  dismissAfter: '2000',
  proxyInterval: '0.5',
  autofillEnable: true,
  timeout: '5000',
  intervalEnable: true,
  interval: '1000',
  name: '',
  email: '',
  cardNumber: '',
  cardMonth: '',
  cardYear: '',
  cardCvc: '',
  address1: '',
  buildingNumber: '',
  city: '',
  state: '',
  country: '',
  phoneNumber: '',
  zip: '',
  telegramEnable: false,
  botToken: '',
  chatId: ''
};

// Default Gateways
const DEFAULT_GATEWAYS = [
  { id: 'stripe', name: 'Stripe', enabled: true },
  { id: 'braintree', name: 'Braintree', enabled: true },
  { id: 'adyen', name: 'Adyen', enabled: false },
  { id: 'paypal', name: 'PayPal', enabled: true },
  { id: 'square', name: 'Square', enabled: false },
  { id: 'worldpay', name: 'Worldpay', enabled: true },
  { id: 'checkout', name: 'Checkout.com', enabled: false },
  { id: 'cybersource', name: 'CyberSource', enabled: false },
  { id: 'authorize', name: 'Authorize.net', enabled: false },
  { id: 'nmi', name: 'NMI', enabled: true }
];

// Default Bins (grouped by site)
const DEFAULT_BINS = [
  {
    site: 'Amazon',
    providers: [
      { type: 'VISA', bins: ['414720', '424242', '453275'] },
      { type: 'MC', bins: ['512345', '541234'] },
      { type: 'AMEX', bins: ['378282'] }
    ]
  },
  {
    site: 'Shopify',
    providers: [
      { type: 'VISA', bins: ['471627', '486200'] },
      { type: 'MC', bins: ['556677', '522233'] }
    ]
  },
  {
    site: 'Stripe',
    providers: [
      { type: 'VISA', bins: ['400000', '411111'] },
      { type: 'MC', bins: ['555555', '510510'] },
      { type: 'AMEX', bins: ['340000', '370000'] },
      { type: 'DISC', bins: ['601100', '601111'] }
    ]
  },
  {
    site: 'PayPal',
    providers: [
      { type: 'VISA', bins: ['422222', '433333'] },
      { type: 'MC', bins: ['544444'] }
    ]
  },
  {
    site: 'Braintree',
    providers: [
      { type: 'VISA', bins: ['455555', '466666'] },
      { type: 'MC', bins: ['577777'] },
      { type: 'AMEX', bins: ['388888'] }
    ]
  }
];

// Default Config
const DEFAULT_CONFIG = {
  bin: '',
  proxyList: '',
  ccList: '',
  emailList: '',
  status: false
};

/**
 * AriesHitX Storage Manager
 * Handles all data persistence using chrome.storage or localStorage
 */
class AriesHitXStorage {
  constructor() {
    this.useChrome = typeof chrome !== 'undefined' && chrome.storage;
  }

  // Get data from storage
  async get(key, defaultValue = null) {
    if (this.useChrome) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] || defaultValue);
        });
      });
    } else {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    }
  }

  // Set data to storage
  async set(key, value) {
    if (this.useChrome) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    }
  }

  // Remove data from storage
  async remove(key) {
    if (this.useChrome) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], resolve);
      });
    } else {
      localStorage.removeItem(key);
    }
  }
}

/**
 * AriesHitX API
 * Main API class for all operations
 */
class AriesHitXAPI {
  constructor() {
    this.storage = new AriesHitXStorage();
    this.init();
  }

  // Initialize with defaults
  async init() {
    const settings = await this.storage.get(STORAGE_KEYS.SETTINGS);
    if (!settings) {
      await this.storage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }

    const gateways = await this.storage.get(STORAGE_KEYS.GATEWAYS);
    if (!gateways) {
      await this.storage.set(STORAGE_KEYS.GATEWAYS, DEFAULT_GATEWAYS);
    }

    const bins = await this.storage.get(STORAGE_KEYS.BINS);
    if (!bins) {
      await this.storage.set(STORAGE_KEYS.BINS, DEFAULT_BINS);
    }

    const config = await this.storage.get(STORAGE_KEYS.CONFIG);
    if (!config) {
      await this.storage.set(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
    }

    const logs = await this.storage.get(STORAGE_KEYS.LOGS);
    if (!logs) {
      await this.storage.set(STORAGE_KEYS.LOGS, []);
    }

    console.log('AriesHitX v3.5 initialized');
  }

  // ===== SETTINGS =====
  async getSettings() {
    return await this.storage.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  async saveSettings(settings) {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    await this.storage.set(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  async resetSettings() {
    await this.storage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  // ===== GATEWAYS =====
  async getGateways() {
    return await this.storage.get(STORAGE_KEYS.GATEWAYS, DEFAULT_GATEWAYS);
  }

  async toggleGateway(gatewayId) {
    const gateways = await this.getGateways();
    const index = gateways.findIndex(g => g.id === gatewayId);
    if (index !== -1) {
      gateways[index].enabled = !gateways[index].enabled;
      await this.storage.set(STORAGE_KEYS.GATEWAYS, gateways);
    }
    return gateways;
  }

  async resetGateways() {
    const gateways = await this.getGateways();
    gateways.forEach(g => g.enabled = false);
    await this.storage.set(STORAGE_KEYS.GATEWAYS, gateways);
    return gateways;
  }

  // ===== BINS =====
  async getBins() {
    return await this.storage.get(STORAGE_KEYS.BINS, DEFAULT_BINS);
  }

  async addBin(site, provider, bin) {
    const bins = await this.getBins();
    const siteIndex = bins.findIndex(b => b.site === site);
    
    if (siteIndex === -1) {
      bins.push({
        site,
        providers: [{ type: provider, bins: [bin] }]
      });
    } else {
      const providerIndex = bins[siteIndex].providers.findIndex(p => p.type === provider);
      if (providerIndex === -1) {
        bins[siteIndex].providers.push({ type: provider, bins: [bin] });
      } else {
        if (!bins[siteIndex].providers[providerIndex].bins.includes(bin)) {
          bins[siteIndex].providers[providerIndex].bins.push(bin);
        }
      }
    }
    
    await this.storage.set(STORAGE_KEYS.BINS, bins);
    return bins;
  }

  // ===== CONFIG =====
  async getConfig() {
    return await this.storage.get(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
  }

  async saveConfig(config) {
    const current = await this.getConfig();
    const updated = { ...current, ...config };
    await this.storage.set(STORAGE_KEYS.CONFIG, updated);
    return updated;
  }

  async toggleStatus() {
    const config = await this.getConfig();
    config.status = !config.status;
    await this.storage.set(STORAGE_KEYS.CONFIG, config);
    
    // Add log
    await this.addLog(
      config.status ? 'success' : 'warning',
      config.status ? 'AriesHitX ACTIVATED' : 'AriesHitX DEACTIVATED'
    );
    
    return config;
  }

  // ===== LOGS =====
  async getLogs() {
    return await this.storage.get(STORAGE_KEYS.LOGS, []);
  }

  async addLog(type, message) {
    const logs = await this.getLogs();
    const timestamp = new Date().toTimeString().split(' ')[0];
    logs.push({ type, message, timestamp });
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.shift();
    }
    
    await this.storage.set(STORAGE_KEYS.LOGS, logs);
    return logs;
  }

  async clearLogs() {
    const timestamp = new Date().toTimeString().split(' ')[0];
    await this.storage.set(STORAGE_KEYS.LOGS, [
      { type: 'info', message: 'Logs cleared', timestamp }
    ]);
    return await this.getLogs();
  }

  // ===== UTILITIES =====
  generateFingerprint() {
    const fp = Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    return fp.toUpperCase();
  }

  // Autofill card data
  async autofillCard(cardData) {
    const settings = await this.getSettings();
    if (!settings.autofillEnable) {
      return { success: false, message: 'Autofill disabled' };
    }

    // Merge with saved settings
    const data = {
      name: cardData.name || settings.name,
      email: cardData.email || settings.email,
      cardNumber: cardData.cardNumber || settings.cardNumber,
      cardMonth: cardData.cardMonth || settings.cardMonth,
      cardYear: cardData.cardYear || settings.cardYear,
      cardCvc: cardData.cardCvc || settings.cardCvc,
      address1: cardData.address1 || settings.address1,
      city: cardData.city || settings.city,
      state: cardData.state || settings.state,
      country: cardData.country || settings.country,
      zip: cardData.zip || settings.zip,
      phoneNumber: cardData.phoneNumber || settings.phoneNumber
    };

    return { success: true, data };
  }

  // Check if gateway is enabled
  async isGatewayEnabled(gatewayId) {
    const gateways = await this.getGateways();
    const gateway = gateways.find(g => g.id === gatewayId);
    return gateway ? gateway.enabled : false;
  }

  // Get enabled gateways
  async getEnabledGateways() {
    const gateways = await this.getGateways();
    return gateways.filter(g => g.enabled);
  }

  // Search bins
  async searchBins(query) {
    const bins = await this.getBins();
    const results = [];
    
    bins.forEach(site => {
      site.providers.forEach(provider => {
        provider.bins.forEach(bin => {
          if (bin.includes(query) || site.site.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              site: site.site,
              provider: provider.type,
              bin
            });
          }
        });
      });
    });
    
    return results;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AriesHitXAPI, AriesHitXStorage, STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_GATEWAYS, DEFAULT_BINS, DEFAULT_CONFIG };
} else if (typeof window !== 'undefined') {
  window.AriesHitXAPI = AriesHitXAPI;
  window.AriesHitXStorage = AriesHitXStorage;
}

// Create global instance
const arieshitx = new AriesHitXAPI();
