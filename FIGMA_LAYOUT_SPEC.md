# i.AM Mail - Figma Master Layout Specification
> Last Updated: January 1, 2026
> Version: 1.0

---

## 📐 Screen Breakpoints

| Breakpoint | Min Width | Tailwind Class | Behavior |
|------------|-----------|----------------|----------|
| Mobile | 0px | `default` | Single pane, sidebar hidden |
| Tablet | 768px | `md:` | Left sidebar + Center visible |
| Desktop | 1024px | `lg:` | All three panes visible |

---

## 🏗️ Three-Pane Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        FULL VIEWPORT                             │
├────────────┬───────────────────────────────┬────────────────────┤
│            │                               │                    │
│   LEFT     │         CENTER                │      RIGHT         │
│  SIDEBAR   │        CONTENT                │     SIDEBAR        │
│            │                               │                    │
│   22%      │      flex-1 (remaining)       │       24%          │
│ (200-320px)│                               │   (220-360px)      │
│            │                               │                    │
├────────────┴───────────────────────────────┴────────────────────┤
│                          DOCK (BOTTOM)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📏 Left Sidebar (Navigation)

### Container
| Property | Value | CSS/Tailwind |
|----------|-------|--------------|
| Width | 22% of viewport | `w-[22%]` |
| Min Width | 200px | `min-w-[200px]` |
| Max Width | 320px | `max-w-[320px]` |
| Background | Sidebar theme | `bg-sidebar` |
| Border Right | 1px | `border-r border-sidebar-border` |

### Module Cards Grid
| Property | Value |
|----------|-------|
| Columns | 2 |
| Gap | 8px |
| Padding | 16px |

### ALL 8 MODULES (Add these to Figma)
| # | Module ID | Label | Sublabel | Icon |
|---|-----------|-------|----------|------|
| 1 | inbox | INBOX | PRIMARY | Mail envelope |
| 2 | drafts | DRAFTS | PENDING | Document |
| 3 | sent | SENT | OUTBOUND | Send arrow |
| 4 | archive | ARCHIVE | STORAGE | Archive box |
| 5 | trash | TRASH | PURGE | Trash bin |
| 6 | contacts | CONTACTS | DIRECTORY | People icon |
| 7 | calendar | CALENDAR | SCHEDULE | Calendar icon |
| 8 | settings | SETTINGS | CONFIG | Gear icon |

### Individual Module Card
| Property | Value |
|----------|-------|
| Aspect Ratio | 0.85:1 |
| Padding | 16px |
| Border Radius | 8px |
| Icon Size | 28px × 28px |
| Icon Margin Bottom | 16px |
| Label Font Size | 10px |
| Name Font Size | 11px |

---

## 📧 Center Content Area

### Container
| Property | Value |
|----------|-------|
| Width | Flex 1 (remaining space) |
| Padding (Mobile) | 24px |
| Padding (Tablet) | 40px |
| Padding (Desktop) | 48px |
| Padding Bottom | 160px (for dock) |

### Email Cards Container
| Property | Value |
|----------|-------|
| Max Width | 672px |
| Alignment | Centered |
| Spacing | 12px between cards |

### Email Card
| Property | Value |
|----------|-------|
| Padding | 24px |
| Border Radius | 8px |
| Avatar Size | 48px |
| Sender Font Size | 14px Bold |
| Subject Font Size | 12px |
| Time Font Size | 10px |

---

## 📅 Right Sidebar (Widgets)

### Container
| Property | Value |
|----------|-------|
| Width | 24% of viewport |
| Min Width | 220px |
| Max Width | 360px |
| Padding | 16-24px |
| Visibility | Hidden < 1024px |

### Calendar Widget
| Property | Value |
|----------|-------|
| Grid | 7 columns (M T W T F S S) |
| Cell Height | 24px |
| Cell Font Size | 9px |
| Today indicator | Crimson dot |

### ALL RIGHT SIDEBAR WIDGETS (Add these to Figma)

#### 1. Calendar Widget
- Month/Year header
- 7-column day grid (M T W T F S S)
- Current day highlighted with crimson accent
- Upcoming events list (2 items)

#### 2. Board Review Card
- Title: "Board Review"
- Time badge: Crimson pill (e.g., "10:00 AM")

#### 3. Team Sync Card
- Title: "Team Sync"
- Time badge: Blue pill (e.g., "02:00 PM")

#### 4. System Status Widget
- Title: "SYSTEM STATUS" with green "ONLINE" badge
- Unread count: Large number (0)
- Health percentage: "98%" with label

#### 5. Quick Actions
- Button 1: "Template: Weekly Report"
- Button 2: "Schedule: Next Week"
- Button 3: "AI: Draft Response"

---

## 🚀 Bottom Dock (Add to Figma)

### Dock Container
| Property | Value |
|----------|-------|
| Position | Fixed bottom |
| Width | Auto (centered) |
| Padding | 16px |
| Background | Glass blur |
| Border Radius | 24px |

### Dock Chips (Row 1)
| Chip | Icon | Label |
|------|------|-------|
| 1 | Mail icon | INBOX |
| 2 | Document icon | DRAFTS |
| 3 | Calendar icon | CALENDAR |
| 4 | Pen icon | COMPOSE |

### AI Chip (Row 2)
| Property | Value |
|----------|-------|
| Background | Crimson gradient |
| Icon | Sparkle ✨ |
| Label | AI |

### AI Command Bar
| Property | Value |
|----------|-------|
| Width | 100% of dock |
| Placeholder | "Inquire with AI Command..." |
| Left Icon | Home 🏠 |
| Right Icon | Send arrow |

---

## 📱 Responsive Widths

### MacBook 13.6" (~1470px)
- Left: ~270px | Center: ~580px | Right: ~320px

### 24" Monitor (~1920px)
- Left: ~320px | Center: ~780px | Right: ~360px

### 27" Monitor (~2560px)
- Left: ~320px | Center: ~1240px | Right: ~360px

---

## 🎨 Colors (Dark Mode)

| Token | Value |
|-------|-------|
| Background | #050505 |
| Foreground | #F2F2F2 |
| Sidebar | #080808 |
| Card | #0A0A0A |
| Border | rgba(255,255,255,0.08) |
| Accent (Crimson) | #E11D48 |
| Muted | rgba(255,255,255,0.4) |

---

## 🎨 Colors (Light Mode)

| Token | Value |
|-------|-------|
| Background | #F8F8F8 |
| Foreground | #1A1A1A |
| Sidebar | #FFFFFF |
| Card | #FFFFFF |
| Border | rgba(0,0,0,0.08) |
| Accent (Crimson) | #E11D48 |
| Muted | rgba(0,0,0,0.4) |

---

## 🔤 Typography

| Font | Usage |
|------|-------|
| Inter | UI, buttons, body |
| JetBrains Mono | Labels, timestamps, numbers |

---

*This spec matches `/client/src/PlatinumOS.tsx`*
