# AriesHitX v3.5 Dashboard - PRD

## Original Problem Statement
Build a payment automation tool dashboard called "AriesHitX v3.5" with dark glass theme, big modals, expandable Bin Library, tons of animations, and grey toast notifications.

## What's Implemented (v2 - Enhanced)

### Main Dashboard
- Dark theme (#0a0a0a, #111, #1a1a1a)
- More rounded buttons (rounded-2xl)
- Framer Motion animations throughout
- Status toggle with toast notification
- BIN entry input
- Expandable Advanced section with proxy input
- Save Configuration button with shadow

### Settings Modal (Big - 90vw x 85vh)
Two-column layout with all sections:
- **Left Column**: Premium, Interface (Accent color, Blur settings), Features (CVC Modifier, 3D Bypass, etc.), Sounds, Screenshot, Auto Clicker, Notification, Proxy
- **Right Column**: Autofill (Timeout, Interval, Personal info, Card info, Address), Telegram Hit Sender

### Gateway Modal
- List of 10 gateways (Stripe, Braintree, Adyen, PayPal, Square, Worldpay, Checkout.com, CyberSource, Authorize.net, NMI)
- ON/OFF toggle for each gateway
- Custom and Reset buttons
- Lock icons for premium features

### Bin Library Modal (Big with Expandable Categories)
- Categories: Amazon, Shopify, Stripe, PayPal, Braintree
- Each category shows supported providers (VISA, MC, AMEX, DISC) as colored badges
- Click to expand reveals BINs grouped by provider
- "Use" button auto-fills the main BIN input
- Smooth expand/collapse animations

### Toast Notifications
- Grey background (#1a1a1a) with border
- Purple checkmark icon
- Appears at bottom center
- Smooth animations

## Tech Stack
- React 19
- Framer Motion
- Tailwind CSS
- Shadcn UI (Dialog, ScrollArea)
- Sonner (toast)

## Date: January 2026

## Next Action Items
1. Add actual payment gateway API integrations
2. Implement proxy rotation logic
3. Database storage for configurations
4. User authentication
