# I AM MAIL - Screen-by-Screen Design Reference

## 📱 **COMPLETE SCREEN DESCRIPTIONS FOR DESIGNER**

Use this document to understand each screen's layout, components, and interactions.

---

## **SCREEN 1: LOGIN / BIOMETRIC AUTH**

### **Visual Description**

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║         [Animated Mesh Gradient Background]       ║
║         Purple → Blue → Green waves               ║
║                                                   ║
║              ┌─────────────────┐                  ║
║              │   I AM MAIL     │                  ║
║              │   ───────────   │                  ║
║              │ Intelligent AI  │                  ║
║              │  Email Client   │                  ║
║              └─────────────────┘                  ║
║                                                   ║
║         ┌───────────────────────────┐             ║
║         │                           │             ║
║         │    [Glass Card Effect]    │             ║
║         │                           │             ║
║         │      🛡️ [Shield Icon]     │             ║
║         │                           │             ║
║         │   BIOMETRIC LOGIN         │             ║
║         │   ─────────────────       │             ║
║         │                           │             ║
║         │  Secure Authentication    │             ║
║         │                           │             ║
║         │   ┌─────────────────┐     │             ║
║         │   │  AUTHENTICATE   │     │             ║
║         │   └─────────────────┘     │             ║
║         │                           │             ║
║         └───────────────────────────┘             ║
║                                                   ║
║              [🌙 Dark Mode Toggle]                ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

### **Components**

1. **Background**: Animated gradient mesh
   - Colors: Purple (#8b5cf6) → Blue (#3b82f6) → Green (#10b981)
   - Animation: Slow wave movement (15s loop)
   - Effect: Blur + grain texture

2. **Logo Section**:
   - Text: "I AM MAIL" (Inter Tight, 48px, Bold, Uppercase)
   - Divider: Horizontal line
   - Subtitle: "Intelligent AI Email Client" (Inter, 16px, Light)
   - Color: White with 90% opacity

3. **Login Card**:
   - Background: Glassmorphism (white 5% opacity, blur 40px)
   - Border: 1px white 10% opacity
   - Shadow: Large soft shadow
   - Padding: 60px
   - Border radius: 32px

4. **Shield Icon**:
   - Size: 80px
   - Color: White
   - Glow: Soft white glow effect

5. **Title**:
   - Text: "BIOMETRIC LOGIN"
   - Font: Inter Tight, 24px, Bold, Uppercase
   - Letter spacing: 0.3em
   - Color: White

6. **Subtitle**:
   - Text: "Secure Authentication"
   - Font: Inter, 14px, Regular
   - Color: White 70% opacity

7. **Button**:
   - Text: "AUTHENTICATE"
   - Background: Accent gradient
   - Padding: 16px 48px
   - Border radius: 16px
   - Shadow: Accent glow
   - Hover: Lift effect + brighter glow

8. **Theme Toggle**:
   - Position: Bottom center
   - Icon: Moon/Sun
   - Size: 40px
   - Background: Glass effect
   - Border radius: Full circle

### **Animations**

- Fade in on load (0.5s)
- Background gradient shift (15s loop)
- Button hover: Lift + glow
- Card entrance: Slide up + fade (0.7s)

---

## **SCREEN 2: MAIN INBOX (DESKTOP)**

### **Visual Description**

```
╔═══════╦═══════════════════╦═══════════════════════════╦═══════════════╗
║       ║                   ║                           ║               ║
║   S   ║   EMAIL LIST      ║   EMAIL DETAIL            ║ INTELLIGENCE  ║
║   I   ║   ┌───────────┐   ║   ┌─────────────────────┐ ║               ║
║   D   ║   │⚡ Focus  3│   ║   │ From: Arjun Mehta   │ ║ 🎙️ BRIEFING  ║
║   E   ║   │📦 Other  0│   ║   │ To: You             │ ║               ║
║   B   ║   └───────────┘   ║   │ Subject: Project... │ ║ [Play Audio]  ║
║   A   ║                   ║   │                     │ ║               ║
║   R   ║   [Search...]     ║   │ ─────────────────── │ ║ ───────────   ║
║       ║                   ║   │                     │ ║               ║
║   📧  ║   ┌─────────────┐ ║   │ Hey team,           │ ║ 📊 INSIGHTS   ║
║   📤  ║   │ [A] Arjun   │ ║   │                     │ ║               ║
║   🗑️  ║   │ Project...  │ ║   │ The integration is  │ ║ • 3 unread    ║
║   🔒  ║   │ 2h ago  ✓✓  │ ║   │ complete and ready  │ ║ • 1 quote     ║
║   ⚙️  ║   └─────────────┘ ║   │ for review.         │ ║ • 0 receipts  ║
║   🔔  ║                   ║   │                     │ ║               ║
║   🌙  ║   ┌─────────────┐ ║   │ Best regards,       │ ║ ───────────   ║
║       ║   │ [E] Elena   │ ║   │ Arjun               │ ║               ║
║       ║   │ Budget...   │ ║   │                     │ ║ ⚡ ACTIONS    ║
║       ║   │ 5h ago      │ ║   │ ─────────────────── │ ║               ║
║       ║   └─────────────┘ ║   │                     │ ║ [Reply]       ║
║       ║                   ║   │ [Reply] [Forward]   │ ║ [Forward]     ║
║       ║                   ║   │ [Archive]           │ ║ [Archive]     ║
║       ║                   ║   └─────────────────────┘ ║               ║
╚═══════╩═══════════════════╩═══════════════════════════╩═══════════════╝
```

### **Layout Dimensions**

- **Sidebar**: 80px fixed
- **Email List**: 380px fixed
- **Email Detail**: Flex (grows to fill)
- **Intelligence Panel**: 400px fixed (toggleable)

### **Components**

#### **Sidebar (Left)**

```
Width: 80px
Background: Slate 950 (dark) / Slate 50 (light)
Border: Right border, subtle

Icons (24px each):
├─ Logo (top, 40px)
├─ Inbox 📧
├─ Sent 📤
├─ Trash 🗑️
├─ Security 🔒
├─ Settings ⚙️
├─ Alerts 🔔
└─ Theme 🌙 (bottom)

Hover: Background highlight
Active: Accent color + left border
```

#### **Email List (Middle-Left)**

```
Width: 380px
Background: White (light) / Slate 900 (dark)
Border: Right border

Header:
├─ Tab Switcher
│  ├─ Focus ⚡ [Count: 3]
│  └─ Other 📦 [Count: 0]
└─ Search Bar

Email Items:
├─ Avatar (40px circle, gradient)
├─ Sender Name (14px, bold if unread)
├─ Subject (13px, truncated)
├─ Preview (12px, muted, truncated)
├─ Time (12px, right-aligned)
└─ Badges (Quote, Read receipts)

States:
- Unread: Bold, light background
- Read: Normal weight
- Selected: Accent left border
- Hover: Subtle background
```

#### **Email Detail (Center)**

```
Flex: Grows to fill
Background: White (light) / Slate 950 (dark)

Header:
├─ From: Name <email>
├─ To: Recipients
├─ Subject: Text
└─ Timestamp

Body:
├─ HTML content
├─ Proper formatting
└─ Link styling

Footer:
├─ Reply button
├─ Forward button
└─ Archive button
```

#### **Intelligence Panel (Right)**

```
Width: 400px (toggleable)
Background: Slate 50 (light) / Slate 900 (dark)
Border: Left border

Sections:
├─ Audio Briefing
│  ├─ Play button
│  └─ Waveform visual
├─ Insights
│  ├─ Unread count
│  ├─ Quote count
│  └─ Receipt count
└─ Quick Actions
   ├─ Reply
   ├─ Forward
   └─ Archive
```

---

## **SCREEN 3: SETTINGS MODAL**

### **Visual Description**

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║     [Dark overlay with blur - 70% opacity]        ║
║                                                   ║
║         ┌───────────────────────────────┐         ║
║         │ ⚙️ EMAIL SETTINGS        [X] │         ║
║         │ Connect your email account    │         ║
║         ├───────────────────────────────┤         ║
║         │                               │         ║
║         │ Email Provider                │         ║
║         │ [iCloud            ▼]         │         ║
║         │                               │         ║
║         │ Email Address                 │         ║
║         │ [sabique@rayzen.ae      ]     │         ║
║         │                               │         ║
║         │ App-Specific Password         │         ║
║         │ [••••••••••••••••••    ]      │         ║
║         │ Get password →                │         ║
║         │                               │         ║
║         │ IMAP Host      IMAP Port      │         ║
║         │ [imap.mail...] [993    ]      │         ║
║         │                               │         ║
║         │ SMTP Host      SMTP Port      │         ║
║         │ [smtp.mail...] [587    ]      │         ║
║         │                               │         ║
║         │ ┌───────────────────────────┐ │         ║
║         │ │ ✓ Connection successful!  │ │         ║
║         │ └───────────────────────────┘ │         ║
║         │                               │         ║
║         ├───────────────────────────────┤         ║
║         │ [Test Connection] [Save]      │         ║
║         └───────────────────────────────┘         ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

### **Components**

1. **Modal Overlay**:
   - Background: Black 70% opacity
   - Backdrop blur: 20px
   - Click to close

2. **Modal Card**:
   - Width: 600px max
   - Background: White (light) / Slate 900 (dark)
   - Border radius: 32px
   - Shadow: Extra large
   - Padding: 32px

3. **Header**:
   - Icon: Settings ⚙️ (24px)
   - Title: "EMAIL SETTINGS" (uppercase, bold)
   - Subtitle: "Connect your email account"
   - Close button: X (top right)

4. **Form Fields**:
   - Dropdown: Provider selection
   - Text inputs: Email, password, hosts, ports
   - Auto-fill on provider change
   - Password field: Masked with link to help

5. **Feedback**:
   - Success: Green background, checkmark
   - Error: Red background, alert icon

6. **Actions**:
   - Test Connection: Secondary button
   - Save & Connect: Primary button
   - Disabled until test passes

---

## **SCREEN 4: COMPOSER OVERLAY**

### **Visual Description**

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║              [Blurred inbox background]           ║
║                                                   ║
║    ┌──────────────────────────────────────────┐   ║
║    │ NEW MESSAGE                         [X] │   ║
║    ├──────────────────────────────────────────┤   ║
║    │ To: [                              ]    │   ║
║    │ Subject: [                         ]    │   ║
║    ├──────────────────────────────────────────┤   ║
║    │                                          │   ║
║    │ [Compose your message here...]           │   ║
║    │                                          │   ║
║    │ Type / for snippets                      │   ║
║    │                                          │   ║
║    │                                          │   ║
║    │                                          │   ║
║    │                                          │   ║
║    ├──────────────────────────────────────────┤   ║
║    │ [📎 Attach] [🎨 Format]      [SEND]     │   ║
║    └──────────────────────────────────────────┘   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

### **Snippet Menu (appears on `/`)**

```
    ┌─────────────────────────────┐
    │ ⚡ SYNTHESIS PATTERNS       │
    ├─────────────────────────────┤
    │ 📅 /meeting                 │
    │    Schedule Meeting         │
    ├─────────────────────────────┤
    │ 📧 /followup                │
    │    Follow Up                │
    ├─────────────────────────────┤
    │ 👋 /intro                   │
    │    Introduction             │
    ├─────────────────────────────┤
    │ 📹 /video                   │
    │    Video Call Room          │
    └─────────────────────────────┘
```

---

## **SCREEN 5: MOBILE VIEW**

### **Visual Description**

```
┌─────────────────────┐
│  I AM MAIL          │
│  ─────────────      │
│                     │
│  ┌───────────────┐  │
│  │⚡ Focus    3 │  │
│  │📦 Other    0 │  │
│  └───────────────┘  │
│                     │
│  [Search...]        │
│                     │
│  ┌───────────────┐  │
│  │ [A] Arjun     │  │
│  │ Project...    │  │
│  │ 2h ago    ✓✓  │  │
│  └───────────────┘  │
│  ← Swipe to archive │
│                     │
│  ┌───────────────┐  │
│  │ [E] Elena     │  │
│  │ Budget...     │  │
│  │ 5h ago        │  │
│  └───────────────┘  │
│  Swipe to read →    │
│                     │
│                     │
├─────────────────────┤
│ 📧 📤 🗑️ ⚙️ 🌙   │
└─────────────────────┘
```

### **Mobile Features**

1. **Single Column**: Email list only
2. **Bottom Nav**: Icon-only navigation
3. **Swipe Gestures**:
   - Left: Archive
   - Right: Mark read/unread
4. **Pull to Refresh**: At top of list
5. **Tap Email**: Opens detail (full screen)
6. **Back Button**: Returns to list

---

## **COLOR EXAMPLES**

### **Accent Color** (#8b5cf6 - Violet)
```
█████ Primary buttons
█████ Active states
█████ Links
█████ Focus rings
```

### **Background Light** (#f8fafc)
```
█████ Page background
█████ Card backgrounds
```

### **Background Dark** (#020617)
```
█████ Dark mode background
█████ Dark mode cards
```

### **Text Light** (#0f172a)
```
█████ Primary text (light mode)
```

### **Text Dark** (#f8fafc)
```
█████ Primary text (dark mode)
```

---

## **ICON SET NEEDED**

- 📧 Inbox
- 📤 Sent
- 🗑️ Trash
- 🔒 Security
- ⚙️ Settings
- 🔔 Alerts/Notifications
- 🌙 Dark Mode
- ☀️ Light Mode
- 🛡️ Shield (Biometric)
- ⚡ Focus/Lightning
- 📦 Other/Box
- 📎 Attach
- 🎨 Format
- 📅 Calendar
- 📧 Email
- 👋 Wave
- 📹 Video
- ✓ Checkmark
- ✗ Close
- ▼ Dropdown

---

**Give these files to your designer:**
1. `DESIGN_HANDOVER.md` - Complete specifications
2. `DESIGN_CSS_REFERENCE.md` - All CSS styles
3. This file - Screen descriptions

**They have everything needed to redesign I AM MAIL!** 🎨✨
