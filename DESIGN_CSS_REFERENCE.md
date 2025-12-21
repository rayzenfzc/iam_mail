# I AM MAIL - Complete CSS & Styling Reference

## 🎨 **FULL DESIGN SYSTEM CSS**

This file contains all the actual CSS used in I AM MAIL for your designer to reference.

---

## **FONTS**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Inter+Tight:wght@100..900&display=swap');

--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-tight: 'Inter Tight', sans-serif;
--font-mono: 'SF Mono', Menlo, monospace;
```

**Download Fonts**:
- Inter: https://fonts.google.com/specimen/Inter
- Inter Tight: https://fonts.google.com/specimen/Inter+Tight

---

## **COLOR SYSTEM**

### **Light Mode**

```css
/* Background */
--background: hsl(210, 40%, 98%);        /* #f8fafc - Very light slate */
--foreground: hsl(222, 47%, 11%);        /* #0f172a - Dark slate */

/* Card */
--card: hsl(0, 0%, 100%);                /* #ffffff - Pure white */
--card-foreground: hsl(222, 47%, 11%);   /* #0f172a - Dark slate */
--card-border: hsl(214, 32%, 91%);       /* #e2e8f0 - Light slate */

/* Sidebar */
--sidebar: hsl(210, 40%, 96%);           /* #f1f5f9 - Light slate */
--sidebar-foreground: hsl(215, 16%, 47%); /* #64748b - Medium slate */
--sidebar-border: hsl(214, 32%, 91%);    /* #e2e8f0 - Light slate */

/* Accent - Violet/Purple */
--primary: hsl(262, 83%, 58%);           /* #8b5cf6 - Vibrant violet */
--primary-foreground: hsl(0, 0%, 100%);  /* #ffffff - White */

/* Muted */
--muted: hsl(210, 40%, 96%);             /* #f1f5f9 - Light slate */
--muted-foreground: hsl(215, 16%, 47%);  /* #64748b - Medium slate */

/* Destructive */
--destructive: hsl(0, 84%, 60%);         /* #ef4444 - Red */
--destructive-foreground: hsl(0, 0%, 100%); /* #ffffff - White */
```

### **Dark Mode**

```css
/* Background */
--background: hsl(222, 47%, 2%);         /* #020617 - Almost black */
--foreground: hsl(210, 40%, 98%);        /* #f8fafc - Very light */

/* Card */
--card: hsl(222, 47%, 5%);               /* #0a0f1e - Very dark slate */
--card-foreground: hsl(210, 40%, 98%);   /* #f8fafc - Very light */
--card-border: hsl(217, 33%, 17%, 0.5);  /* Semi-transparent border */

/* Sidebar */
--sidebar: hsl(222, 47%, 4%);            /* #070b14 - Darker than card */
--sidebar-foreground: hsl(215, 20%, 65%); /* #94a3b8 - Light slate */
--sidebar-border: hsl(217, 33%, 17%, 0.3); /* Semi-transparent */

/* Accent - Same violet */
--primary: hsl(262, 83%, 58%);           /* #8b5cf6 - Vibrant violet */
--primary-foreground: hsl(0, 0%, 100%);  /* #ffffff - White */

/* Muted */
--muted: hsl(217, 33%, 17%);             /* #1e293b - Dark slate */
--muted-foreground: hsl(215, 20%, 65%);  /* #94a3b8 - Light slate */
```

---

## **SHADOWS**

### **Light Mode Shadows**

```css
--shadow-2xs: 0 1px 2px rgba(0,0,0,0.05);
--shadow-xs: 0 1px 3px rgba(0,0,0,0.08);
--shadow-sm: 0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
--shadow-md: 0 6px 12px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05);
--shadow-lg: 0 10px 20px rgba(0,0,0,0.1), 0 6px 10px rgba(0,0,0,0.06);
--shadow-xl: 0 20px 40px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.08);
--shadow-2xl: 0 30px 60px rgba(0,0,0,0.15);
```

### **Dark Mode Shadows**

```css
--shadow-2xs: 0 1px 2px rgba(0,0,0,0.3);
--shadow-xs: 0 1px 3px rgba(0,0,0,0.4);
--shadow-sm: 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
--shadow: 0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2);
--shadow-md: 0 6px 12px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3);
--shadow-lg: 0 10px 20px rgba(0,0,0,0.6), 0 6px 10px rgba(0,0,0,0.4);
--shadow-xl: 0 20px 40px rgba(0,0,0,0.7), 0 10px 20px rgba(0,0,0,0.5);
--shadow-2xl: 0 30px 60px rgba(0,0,0,0.8);
```

---

## **GLOW EFFECTS**

```css
/* Accent Glow */
--glow-accent: 0 0 30px rgba(139, 92, 246, 0.2);
--glow-accent-intense: 0 0 50px rgba(139, 92, 246, 0.3), 
                       0 0 100px rgba(139, 92, 246, 0.15);

/* Usage */
.glow-accent {
  box-shadow: var(--glow-accent);
}

.active-press {
  box-shadow: var(--glow-accent-intense);
}
```

---

## **GLASSMORPHISM**

```css
.glass-sexy {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Light mode glass */
.light .glass-sexy {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
}
```

---

## **BORDER RADIUS**

```css
--radius: 0.5rem;              /* 8px - Default */
--radius-sm: 0.375rem;         /* 6px - Small */
--radius-md: 0.75rem;          /* 12px - Medium */
--radius-lg: 1rem;             /* 16px - Large */
--radius-xl: 1.5rem;           /* 24px - Extra large */
--radius-2xl: 2rem;            /* 32px - 2X large */
--radius-full: 9999px;         /* Full circle */
```

---

## **ANIMATIONS**

### **Fade In**

```css
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(-5px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

### **Slide Up**

```css
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px); 
  }
  to { 
    opacity: 1;
    transform: translateY(0); 
  }
}

.slide-up {
  animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### **Neural Pulse**

```css
@keyframes neuralPulse {
  0%, 100% { 
    opacity: 0.3; 
  }
  50% { 
    opacity: 1; 
  }
}

.animate-neural {
  animation: neuralPulse 2s ease-in-out infinite;
}
```

### **Spin**

```css
@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

---

## **COMPONENT STYLES**

### **Buttons**

```css
/* Primary Button */
.btn-primary {
  background: hsl(262, 83%, 58%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  border: 1px solid hsl(262, 83%, 58%, 0.3);
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2);
}

.btn-primary:hover {
  background: hsl(262, 83%, 52%);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: hsl(215, 16%, 47%);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  border: 1px solid hsl(214, 32%, 91%);
}

.btn-secondary:hover {
  background: hsl(210, 40%, 96%);
  border-color: hsl(262, 83%, 58%);
}
```

### **Inputs**

```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: hsl(210, 40%, 96%);
  border: 1px solid hsl(214, 32%, 91%);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: hsl(222, 47%, 11%);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: hsl(262, 83%, 58%);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.input::placeholder {
  color: hsl(215, 16%, 47%);
  opacity: 0.6;
}

/* Dark mode */
.dark .input {
  background: hsl(222, 47%, 5%);
  border-color: hsl(217, 33%, 17%, 0.5);
  color: hsl(210, 40%, 98%);
}
```

### **Cards**

```css
.card {
  background: white;
  border: 1px solid hsl(214, 32%, 91%);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
  transform: translateY(-1px);
}

/* Dark mode */
.dark .card {
  background: hsl(222, 47%, 5%);
  border-color: hsl(217, 33%, 17%, 0.5);
}
```

---

## **SNIPPET MENU STYLES**

```css
.snippet-menu {
  position: fixed;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 6px;
  min-width: 320px;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.6);
  z-index: 10000;
  backdrop-filter: blur(20px);
  animation: fadeIn 0.1s ease-out;
}

.light .snippet-menu {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
}

.snippet-item {
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.1s;
  color: #e2e8f0;
}

.snippet-item:hover,
.snippet-item.active {
  background: #333;
}

.snippet-trigger {
  color: #8b5cf6;
  font-family: 'Inter Tight', sans-serif;
  font-weight: 700;
  font-size: 13px;
  background: rgba(139, 92, 246, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}
```

---

## **UTILITY CLASSES**

### **Text Styles**

```css
.text-xs { font-size: 0.75rem; }      /* 12px */
.text-sm { font-size: 0.875rem; }     /* 14px */
.text-base { font-size: 1rem; }       /* 16px */
.text-lg { font-size: 1.125rem; }     /* 18px */
.text-xl { font-size: 1.25rem; }      /* 20px */
.text-2xl { font-size: 1.5rem; }      /* 24px */
.text-3xl { font-size: 1.875rem; }    /* 30px */

.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.uppercase { text-transform: uppercase; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-normal { letter-spacing: 0; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }
```

### **Spacing**

```css
.p-1 { padding: 0.25rem; }    /* 4px */
.p-2 { padding: 0.5rem; }     /* 8px */
.p-3 { padding: 0.75rem; }    /* 12px */
.p-4 { padding: 1rem; }       /* 16px */
.p-5 { padding: 1.25rem; }    /* 20px */
.p-6 { padding: 1.5rem; }     /* 24px */
.p-8 { padding: 2rem; }       /* 32px */
.p-10 { padding: 2.5rem; }    /* 40px */

.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 0.75rem; }
.m-4 { margin: 1rem; }
.m-5 { margin: 1.25rem; }
.m-6 { margin: 1.5rem; }
.m-8 { margin: 2rem; }
.m-10 { margin: 2.5rem; }
```

---

## **RESPONSIVE BREAKPOINTS**

```css
/* Mobile First */
@media (min-width: 640px) {  /* sm */
  /* Tablet styles */
}

@media (min-width: 768px) {  /* md */
  /* Small desktop styles */
}

@media (min-width: 1024px) { /* lg */
  /* Desktop styles */
}

@media (min-width: 1280px) { /* xl */
  /* Large desktop styles */
}

@media (min-width: 1536px) { /* 2xl */
  /* Extra large desktop styles */
}
```

---

## **SCROLLBAR STYLING**

```css
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: hsl(210, 40%, 96%);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(215, 16%, 47%);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(262, 83%, 58%);
}
```

---

## **PANE BORDERS**

```css
.pane-border {
  border-color: hsl(214, 32%, 91%);
}

.dark .pane-border {
  border-color: hsl(217, 33%, 17%, 0.5);
}
```

---

## **GRADIENT BACKGROUNDS**

```css
/* Mesh Gradient (Login Screen) */
.gradient-mesh {
  background: linear-gradient(135deg, 
    hsl(262, 83%, 58%) 0%, 
    hsl(217, 91%, 60%) 50%, 
    hsl(142, 76%, 36%) 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Subtle Gradient */
.gradient-subtle {
  background: linear-gradient(180deg, 
    hsl(210, 40%, 98%) 0%, 
    hsl(210, 40%, 96%) 100%
  );
}

.dark .gradient-subtle {
  background: linear-gradient(180deg, 
    hsl(222, 47%, 2%) 0%, 
    hsl(222, 47%, 4%) 100%
  );
}
```

---

## **AVATAR GRADIENTS**

```css
.gradient-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-avatar-alt {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-avatar-green {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
```

---

**Copy this entire file to your designer for complete styling reference!** 🎨
