# AriesHitX v3.5 Dashboard - PRD

## Original Problem Statement
Build a payment automation tool dashboard called "AriesHitX v3.5" with a dark glass theme similar to reference screenshots. No neon colors - clean dark theme with subtle glass effects.

## Core Requirements
- **Name**: AriesHitX v3.5 (By Aries)
- **Theme**: Dark (#0a0a0a, #111, #1a1a1a) with muted purple accent (#8b5cf6)
- **Style**: Simple glass/glassmorphism without neon glow effects

## Features Implemented

### Header
- AriesHitX v3.5 logo and branding
- Telegram buttons: Main Channel (t.me/ariesxhit), Charity (t.me/AriesCharity)
- Icon buttons: Fingerprint, Gateway, Bin Library, Settings

### Status Section
- Toggle switch for ACTIVE/INACTIVE status
- Logs activity when status is ON

### Configuration Section
- BIN entry input field
- Expandable Advanced section with:
  - "Current proxy: Not set!" indicator
  - Proxy list textarea

### Gateway Modal
- List of payment gateways (Stripe, Braintree, Adyen, PayPal, Square, Worldpay, Checkout.com, CyberSource)
- ON/OFF toggle for each gateway
- Custom and Reset buttons

### Bin Library Modal
- Pre-loaded BIN database with bank names, types (VISA, MC, AMEX, DISC), countries
- "Use" button that auto-fills the BIN input field

### Settings Modal
- Premium: License Key
- Interface: Accent Color with Generate button
- Proxy: Dismiss After (ms), Proxy Interval (mins)
- Autofill: Toggle, Timeout, Enable Interval, Name, Email, Card fields
- Telegram Hit Sender: Toggle, Bot Token, Chat ID
- Features: Block analytics toggle
- Sounds: Enable sounds toggle
- Reset button

### Logs Panel
- Real-time log entries with timestamps
- Color-coded log types (INFO, SUCCESS, WARNING, ERROR)
- Copy and Clear buttons

## Tech Stack
- React 19
- Framer Motion for animations
- Tailwind CSS
- Shadcn UI components
- Sonner for toasts

## What's Implemented
- [x] Dark theme with no neon colors
- [x] Status toggle with logging
- [x] BIN entry and auto-fill from library
- [x] Gateway modal with ON/OFF toggles
- [x] Bin Library with Use buttons
- [x] Settings modal matching reference
- [x] Advanced expandable section
- [x] Telegram channel links
- [x] Logs panel with copy/clear
- [x] Fingerprint generator

## Next Action Items
1. Add actual payment gateway integrations
2. Implement real proxy rotation logic
3. Add database storage for configurations
4. Implement actual card processing logic
5. Add user authentication system

## Date
January 2026
