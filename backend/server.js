const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 8001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'arieshitx';

mongoose.connect(`${MONGO_URL}/${DB_NAME}`)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const settingsSchema = new mongoose.Schema({
  licenseKey: { type: String, default: '' },
  accentColor: { type: String, default: '#8b5cf6' },
  blurGuiEffect: { type: Boolean, default: true },
  blurInput: { type: Boolean, default: false },
  cvcModifier: { type: Boolean, default: false },
  removePaymentAgent: { type: Boolean, default: false },
  threeDBypass: { type: Boolean, default: true },
  removeZipCode: { type: Boolean, default: false },
  blockAnalytics: { type: Boolean, default: false },
  hitSound: { type: Boolean, default: true },
  hitSoundUrl: { type: String, default: '' },
  hitScreenshot: { type: Boolean, default: false },
  clickHcaptcha: { type: Boolean, default: true },
  clickOnLoad: { type: Boolean, default: false },
  clickerPath: { type: String, default: '' },
  clickerInterval: { type: String, default: '5000' },
  ignoreDisabled: { type: Boolean, default: false },
  notifyEnable: { type: Boolean, default: true },
  dismissAfter: { type: String, default: '2000' },
  proxyInterval: { type: String, default: '0.5' },
  autofillEnable: { type: Boolean, default: true },
  timeout: { type: String, default: '5000' },
  intervalEnable: { type: Boolean, default: true },
  interval: { type: String, default: '1000' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  cardNumber: { type: String, default: '' },
  cardMonth: { type: String, default: '' },
  cardYear: { type: String, default: '' },
  cardCvc: { type: String, default: '' },
  address1: { type: String, default: '' },
  buildingNumber: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  zip: { type: String, default: '' },
  telegramEnable: { type: Boolean, default: false },
  botToken: { type: String, default: '' },
  chatId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const gatewaySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  enabled: { type: Boolean, default: false }
});

const binSchema = new mongoose.Schema({
  site: { type: String, required: true },
  provider: { type: String, required: true },
  bin: { type: String, required: true },
  bank: { type: String, default: '' },
  level: { type: String, default: '' }
});

const configSchema = new mongoose.Schema({
  bin: { type: String, default: '' },
  proxyList: { type: String, default: '' },
  ccList: { type: String, default: '' },
  emailList: { type: String, default: '' },
  status: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

const logSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Settings = mongoose.model('Settings', settingsSchema);
const Gateway = mongoose.model('Gateway', gatewaySchema);
const Bin = mongoose.model('Bin', binSchema);
const Config = mongoose.model('Config', configSchema);
const Log = mongoose.model('Log', logSchema);

// Default gateways
const defaultGateways = [
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

// Default bins
const defaultBins = [
  { site: 'Amazon', provider: 'VISA', bin: '414720', bank: 'Chase', level: 'Platinum' },
  { site: 'Amazon', provider: 'VISA', bin: '424242', bank: 'Test Bank', level: 'Classic' },
  { site: 'Amazon', provider: 'VISA', bin: '453275', bank: 'HSBC', level: 'Infinite' },
  { site: 'Amazon', provider: 'MC', bin: '512345', bank: 'Mastercard Test', level: 'World' },
  { site: 'Amazon', provider: 'MC', bin: '541234', bank: 'Barclays', level: 'World Elite' },
  { site: 'Amazon', provider: 'AMEX', bin: '378282', bank: 'American Express', level: 'Gold' },
  { site: 'Shopify', provider: 'VISA', bin: '471627', bank: 'Capital One', level: 'Signature' },
  { site: 'Shopify', provider: 'VISA', bin: '486200', bank: 'Wells Fargo', level: 'Platinum' },
  { site: 'Shopify', provider: 'MC', bin: '556677', bank: 'Citi', level: 'World' },
  { site: 'Shopify', provider: 'MC', bin: '522233', bank: 'BOA', level: 'Standard' },
  { site: 'Stripe', provider: 'VISA', bin: '400000', bank: 'Test Bank', level: 'Classic' },
  { site: 'Stripe', provider: 'VISA', bin: '411111', bank: 'Test Bank', level: 'Classic' },
  { site: 'Stripe', provider: 'MC', bin: '555555', bank: 'Test Bank', level: 'Standard' },
  { site: 'Stripe', provider: 'MC', bin: '510510', bank: 'Test Bank', level: 'Standard' },
  { site: 'Stripe', provider: 'AMEX', bin: '340000', bank: 'Test Bank', level: 'Green' },
  { site: 'Stripe', provider: 'AMEX', bin: '370000', bank: 'Test Bank', level: 'Gold' },
  { site: 'Stripe', provider: 'DISC', bin: '601100', bank: 'Test Bank', level: 'Standard' },
  { site: 'Stripe', provider: 'DISC', bin: '601111', bank: 'Test Bank', level: 'Standard' },
  { site: 'PayPal', provider: 'VISA', bin: '422222', bank: 'PayPal Bank', level: 'Classic' },
  { site: 'PayPal', provider: 'VISA', bin: '433333', bank: 'PayPal Bank', level: 'Gold' },
  { site: 'PayPal', provider: 'MC', bin: '544444', bank: 'PayPal Bank', level: 'World' },
  { site: 'Braintree', provider: 'VISA', bin: '455555', bank: 'Braintree Bank', level: 'Platinum' },
  { site: 'Braintree', provider: 'VISA', bin: '466666', bank: 'Braintree Bank', level: 'Signature' },
  { site: 'Braintree', provider: 'MC', bin: '577777', bank: 'Braintree Bank', level: 'World Elite' },
  { site: 'Braintree', provider: 'AMEX', bin: '388888', bank: 'Braintree Bank', level: 'Platinum' }
];

// Initialize default data
async function initializeDefaults() {
  try {
    // Initialize gateways
    for (const gateway of defaultGateways) {
      await Gateway.findOneAndUpdate(
        { id: gateway.id },
        gateway,
        { upsert: true, new: true }
      );
    }
    console.log('Default gateways initialized');

    // Initialize bins
    for (const bin of defaultBins) {
      await Bin.findOneAndUpdate(
        { site: bin.site, provider: bin.provider, bin: bin.bin },
        bin,
        { upsert: true, new: true }
      );
    }
    console.log('Default bins initialized');

    // Initialize settings if not exists
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({});
      console.log('Default settings initialized');
    }

    // Initialize config if not exists
    const configCount = await Config.countDocuments();
    if (configCount === 0) {
      await Config.create({});
      console.log('Default config initialized');
    }
  } catch (error) {
    console.error('Error initializing defaults:', error);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AriesHitX Backend v3.5' });
});

// Settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne().select('-_id -__v');
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    ).select('-_id -__v');
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings/reset', async (req, res) => {
  try {
    await Settings.deleteMany({});
    const settings = await Settings.create({});
    res.json({ message: 'Settings reset', settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gateways
app.get('/api/gateways', async (req, res) => {
  try {
    const gateways = await Gateway.find().select('-_id -__v');
    res.json(gateways);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gateways/:id/toggle', async (req, res) => {
  try {
    const gateway = await Gateway.findOne({ id: req.params.id });
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    gateway.enabled = !gateway.enabled;
    await gateway.save();
    res.json({ id: gateway.id, name: gateway.name, enabled: gateway.enabled });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gateways/reset', async (req, res) => {
  try {
    await Gateway.updateMany({}, { enabled: false });
    const gateways = await Gateway.find().select('-_id -__v');
    res.json({ message: 'All gateways reset', gateways });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bins
app.get('/api/bins', async (req, res) => {
  try {
    const bins = await Bin.find().select('-_id -__v');
    
    // Group by site and provider
    const grouped = bins.reduce((acc, bin) => {
      const siteIndex = acc.findIndex(s => s.site === bin.site);
      if (siteIndex === -1) {
        acc.push({
          site: bin.site,
          providers: [{
            type: bin.provider,
            bins: [bin.bin]
          }]
        });
      } else {
        const providerIndex = acc[siteIndex].providers.findIndex(p => p.type === bin.provider);
        if (providerIndex === -1) {
          acc[siteIndex].providers.push({
            type: bin.provider,
            bins: [bin.bin]
          });
        } else {
          acc[siteIndex].providers[providerIndex].bins.push(bin.bin);
        }
      }
      return acc;
    }, []);
    
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bins', async (req, res) => {
  try {
    const { site, provider, bin, bank, level } = req.body;
    const newBin = await Bin.create({ site, provider, bin, bank, level });
    res.json({ message: 'Bin added', bin: newBin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Config
app.get('/api/config', async (req, res) => {
  try {
    let config = await Config.findOne().select('-_id -__v');
    if (!config) {
      config = await Config.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const config = await Config.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    ).select('-_id -__v');
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select('-_id -__v');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const { type, message, timestamp } = req.body;
    const log = await Log.create({ type, message, timestamp });
    res.json({ message: 'Log added', log });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/logs', async (req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ message: 'Logs cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fingerprint generator
app.get('/api/fingerprint', (req, res) => {
  const fingerprint = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
  res.json({ fingerprint: fingerprint.toUpperCase() });
});

// Status toggle
app.post('/api/status/toggle', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({ status: true });
    } else {
      config.status = !config.status;
      await config.save();
    }
    res.json({ status: config.status, message: config.status ? 'Activated' : 'Deactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`AriesHitX Backend running on port ${PORT}`);
  await initializeDefaults();
});

module.exports = app;
