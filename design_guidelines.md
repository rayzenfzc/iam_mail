# I AM MAIL - Design Guidelines

## Design System (Strict Slate Theme)

**Color Palette:**
- Background Main: `bg-slate-50` (#f8fafc)
- Background Surface: `bg-white` (#ffffff)
- Text Primary: `text-slate-900` (#0f172a)
- Text Secondary: `text-slate-500` (#64748b)
- Borders: `border-slate-200` (#e2e8f0)
- Accent/Buttons: `bg-slate-900` (#0f172a)

**Typography:**
- Body: Inter font family
- Headings: Inter Tight font family
- Style: Minimalist, dense, high-end
- No border radius exceeding 12px

## Layout Architecture: 3-Pane System

**A. Left Sidebar (Navigation)**
- Fixed width: 260px
- Background: White
- Navigation items: Inbox, Sent, Drafts, "The Shield" (Spam/Gatekeeper)
- Bottom element: "Video Room" Status with Online/Offline toggle switch

**B. Middle Pane (Inbox List)**
- Scrollable email list
- Card elements display: Sender (bold), Subject, Timestamp
- AI Triage tabs: [Focus] [Other]
- Status indicators: Green dot for online clients, "Quote Open" icon
- Dense, list-based layout

**C. Right Pane (Reading View + AI Tools)**
- Header: Email subject + action buttons [Reply] [Forward] [📞 Video Call]
- Main body: Email content display
- "The Whisper" layer: Side-drawer/overlay for internal team comments
- AI "Analyst" Bar: Collapsible top bar with [Summarize] [Extract Tasks] actions

## Key Components

**The Composer (Modal)**
- Modal overlay for email composition
- Bottom toolbar featuring:
  - [✨ AI Draft] for tone/grammar assistance
  - [📅 Insert Calendar] to embed calendar grids
  - [💰 Insert Quote] to embed dynamic quote cards

**The Floating Command Bar**
- Position: Bottom center of viewport
- Shape: Pill-shaped with shadow-xl
- Background: White
- Contains: "Search with AI..." semantic search input
- Compose button: Slate-900 circular button

## Feature Integrations

**The War Room:** Green dot indicators next to active clients for 1-click WebRTC calls

**The Time Traveler:** Embedded live calendar grids within emails for direct time slot booking

**The Deal Room:** Live quote cards that update dynamically if CRM prices change

**The Whisper:** Internal comment layer overlaid on email threads (invisible to clients)

**The VIP Shield:** AI challenge system for unknown senders with auto-reply categorization

## Spacing & Density
- Tailwind spacing primitives: 2, 4, 8, 12, 16 units
- Dense information layout prioritizing screen real estate
- Consistent padding within cards and containers
- Minimal whitespace - focus on information density

## Visual Hierarchy
- Bold weights for primary information (sender names, headings)
- Secondary text at slate-500 for supporting details
- Clear visual separation between panes using slate-200 borders
- Status indicators (dots, icons) for at-a-glance information