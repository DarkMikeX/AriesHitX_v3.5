"""
AriesHitX v3.5 Backend API
FastAPI backend for the dashboard
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import random
import string
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="AriesHitX API", version="3.5.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "arieshitx")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
settings_col = db.settings
gateways_col = db.gateways
bins_col = db.bins
config_col = db.config
logs_col = db.logs

# Models
class Settings(BaseModel):
    licenseKey: str = ""
    accentColor: str = "#8b5cf6"
    blurGuiEffect: bool = True
    blurInput: bool = False
    cvcModifier: bool = False
    removePaymentAgent: bool = False
    threeDBypass: bool = True
    removeZipCode: bool = False
    blockAnalytics: bool = False
    hitSound: bool = True
    hitSoundUrl: str = ""
    hitScreenshot: bool = False
    clickHcaptcha: bool = True
    clickOnLoad: bool = False
    clickerPath: str = ""
    clickerInterval: str = "5000"
    ignoreDisabled: bool = False
    notifyEnable: bool = True
    dismissAfter: str = "2000"
    proxyInterval: str = "0.5"
    autofillEnable: bool = True
    timeout: str = "5000"
    intervalEnable: bool = True
    interval: str = "1000"
    name: str = ""
    email: str = ""
    cardNumber: str = ""
    cardMonth: str = ""
    cardYear: str = ""
    cardCvc: str = ""
    address1: str = ""
    buildingNumber: str = ""
    city: str = ""
    state: str = ""
    country: str = ""
    phoneNumber: str = ""
    zip: str = ""
    telegramEnable: bool = False
    botToken: str = ""
    chatId: str = ""

class Gateway(BaseModel):
    id: str
    name: str
    enabled: bool = False

class BinEntry(BaseModel):
    site: str
    provider: str
    bin: str
    bank: str = ""
    level: str = ""

class Config(BaseModel):
    bin: str = ""
    proxyList: str = ""
    ccList: str = ""
    emailList: str = ""
    status: bool = False

class LogEntry(BaseModel):
    type: str
    message: str
    timestamp: str

# Default data
DEFAULT_GATEWAYS = [
    {"id": "stripe", "name": "Stripe", "enabled": True},
    {"id": "braintree", "name": "Braintree", "enabled": True},
    {"id": "adyen", "name": "Adyen", "enabled": False},
    {"id": "paypal", "name": "PayPal", "enabled": True},
    {"id": "square", "name": "Square", "enabled": False},
    {"id": "worldpay", "name": "Worldpay", "enabled": True},
    {"id": "checkout", "name": "Checkout.com", "enabled": False},
    {"id": "cybersource", "name": "CyberSource", "enabled": False},
    {"id": "authorize", "name": "Authorize.net", "enabled": False},
    {"id": "nmi", "name": "NMI", "enabled": True}
]

DEFAULT_BINS = [
    {"site": "Amazon", "provider": "VISA", "bin": "414720"},
    {"site": "Amazon", "provider": "VISA", "bin": "424242"},
    {"site": "Amazon", "provider": "VISA", "bin": "453275"},
    {"site": "Amazon", "provider": "MC", "bin": "512345"},
    {"site": "Amazon", "provider": "MC", "bin": "541234"},
    {"site": "Amazon", "provider": "AMEX", "bin": "378282"},
    {"site": "Shopify", "provider": "VISA", "bin": "471627"},
    {"site": "Shopify", "provider": "VISA", "bin": "486200"},
    {"site": "Shopify", "provider": "MC", "bin": "556677"},
    {"site": "Shopify", "provider": "MC", "bin": "522233"},
    {"site": "Stripe", "provider": "VISA", "bin": "400000"},
    {"site": "Stripe", "provider": "VISA", "bin": "411111"},
    {"site": "Stripe", "provider": "MC", "bin": "555555"},
    {"site": "Stripe", "provider": "MC", "bin": "510510"},
    {"site": "Stripe", "provider": "AMEX", "bin": "340000"},
    {"site": "Stripe", "provider": "AMEX", "bin": "370000"},
    {"site": "Stripe", "provider": "DISC", "bin": "601100"},
    {"site": "Stripe", "provider": "DISC", "bin": "601111"},
    {"site": "PayPal", "provider": "VISA", "bin": "422222"},
    {"site": "PayPal", "provider": "VISA", "bin": "433333"},
    {"site": "PayPal", "provider": "MC", "bin": "544444"},
    {"site": "Braintree", "provider": "VISA", "bin": "455555"},
    {"site": "Braintree", "provider": "VISA", "bin": "466666"},
    {"site": "Braintree", "provider": "MC", "bin": "577777"},
    {"site": "Braintree", "provider": "AMEX", "bin": "388888"}
]

# Initialize defaults on startup
@app.on_event("startup")
async def startup():
    # Initialize gateways
    count = await gateways_col.count_documents({})
    if count == 0:
        await gateways_col.insert_many(DEFAULT_GATEWAYS)
    
    # Initialize bins
    count = await bins_col.count_documents({})
    if count == 0:
        await bins_col.insert_many(DEFAULT_BINS)
    
    print("AriesHitX Backend v3.5 started")

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "AriesHitX Backend v3.5"}

# Settings
@app.get("/api/settings")
async def get_settings():
    settings = await settings_col.find_one({})
    if not settings:
        default_settings = Settings().model_dump()
        await settings_col.insert_one(default_settings.copy())
        return default_settings
    # Remove _id before returning
    settings.pop("_id", None)
    return settings

@app.post("/api/settings")
async def save_settings(settings: Settings):
    await settings_col.update_one({}, {"$set": settings.model_dump()}, upsert=True)
    return settings.model_dump()

@app.post("/api/settings/reset")
async def reset_settings():
    await settings_col.delete_many({})
    settings = Settings().model_dump()
    await settings_col.insert_one(settings)
    return {"message": "Settings reset", "settings": settings}

# Gateways
@app.get("/api/gateways")
async def get_gateways():
    gateways = await gateways_col.find({}, {"_id": 0}).to_list(100)
    return gateways

@app.post("/api/gateways/{gateway_id}/toggle")
async def toggle_gateway(gateway_id: str):
    gateway = await gateways_col.find_one({"id": gateway_id})
    if not gateway:
        raise HTTPException(status_code=404, detail="Gateway not found")
    
    new_enabled = not gateway.get("enabled", False)
    await gateways_col.update_one({"id": gateway_id}, {"$set": {"enabled": new_enabled}})
    return {"id": gateway_id, "enabled": new_enabled}

@app.post("/api/gateways/reset")
async def reset_gateways():
    await gateways_col.update_many({}, {"$set": {"enabled": False}})
    gateways = await gateways_col.find({}, {"_id": 0}).to_list(100)
    return {"message": "All gateways reset", "gateways": gateways}

# Bins
@app.get("/api/bins")
async def get_bins():
    bins = await bins_col.find({}, {"_id": 0}).to_list(1000)
    
    # Group by site and provider
    grouped = {}
    for b in bins:
        site = b["site"]
        provider = b["provider"]
        bin_num = b["bin"]
        
        if site not in grouped:
            grouped[site] = {"site": site, "providers": []}
        
        site_data = grouped[site]
        provider_idx = next((i for i, p in enumerate(site_data["providers"]) if p["type"] == provider), -1)
        
        if provider_idx == -1:
            site_data["providers"].append({"type": provider, "bins": [bin_num]})
        else:
            if bin_num not in site_data["providers"][provider_idx]["bins"]:
                site_data["providers"][provider_idx]["bins"].append(bin_num)
    
    return list(grouped.values())

@app.post("/api/bins")
async def add_bin(bin_entry: BinEntry):
    await bins_col.insert_one(bin_entry.model_dump())
    return {"message": "Bin added"}

# Config
@app.get("/api/config")
async def get_config():
    config = await config_col.find_one({}, {"_id": 0})
    if not config:
        config = Config().model_dump()
        await config_col.insert_one(config)
    return config

@app.post("/api/config")
async def save_config(config: Config):
    await config_col.update_one({}, {"$set": config.model_dump()}, upsert=True)
    return config.model_dump()

@app.post("/api/status/toggle")
async def toggle_status():
    config = await config_col.find_one({})
    if not config:
        config = {"status": False}
        await config_col.insert_one(config)
    
    new_status = not config.get("status", False)
    await config_col.update_one({}, {"$set": {"status": new_status}})
    return {"status": new_status, "message": "Activated" if new_status else "Deactivated"}

# Logs
@app.get("/api/logs")
async def get_logs():
    logs = await logs_col.find({}, {"_id": 0}).sort("_id", -1).to_list(100)
    return logs

@app.post("/api/logs")
async def add_log(log: LogEntry):
    await logs_col.insert_one(log.model_dump())
    return {"message": "Log added"}

@app.delete("/api/logs")
async def clear_logs():
    await logs_col.delete_many({})
    return {"message": "Logs cleared"}

# Fingerprint
@app.get("/api/fingerprint")
async def generate_fingerprint():
    chars = string.ascii_lowercase + string.digits
    fp = ''.join(random.choice(chars) for _ in range(26))
    return {"fingerprint": fp.upper()}
