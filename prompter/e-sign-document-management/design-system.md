# E-Sign Design System

A comprehensive design system for the E-Sign Document Management application, built with modern CSS tokens and shadcn/ui components.

---

## Overview

This design system provides the foundation for building consistent, accessible, and visually cohesive interfaces across the E-Sign platform. It uses oklch color space for perceptually uniform colors and follows shadcn/ui conventions.

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Clarity** | Clear visual hierarchy guides users through signing workflows |
| **Trust** | Professional aesthetics convey security and reliability |
| **Efficiency** | Minimal friction for common actions like signing |
| **Accessibility** | WCAG 2.1 AA compliant with full keyboard support |

---

## Design Tokens

### Color Tokens

#### Light Theme

```css
:root {
  /* Base */
  --background: oklch(0.9383 0.0042 236.4993);
  --foreground: oklch(0.3211 0 0);
  
  /* Cards & Surfaces */
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.3211 0 0);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.3211 0 0);
  
  /* Primary (Warm Orange) */
  --primary: oklch(0.6397 0.1720 36.4421);
  --primary-foreground: oklch(1.0000 0 0);
  
  /* Secondary */
  --secondary: oklch(0.9670 0.0029 264.5419);
  --secondary-foreground: oklch(0.4461 0.0263 256.8018);
  
  /* Muted */
  --muted: oklch(0.9846 0.0017 247.8389);
  --muted-foreground: oklch(0.5510 0.0234 264.3637);
  
  /* Accent */
  --accent: oklch(0.9119 0.0222 243.8174);
  --accent-foreground: oklch(0.3791 0.1378 265.5222);
  
  /* Destructive */
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1.0000 0 0);
  
  /* Borders & Inputs */
  --border: oklch(0.9022 0.0052 247.8822);
  --input: oklch(0.9700 0.0029 264.5420);
  --ring: oklch(0.6397 0.1720 36.4421);
  
  /* Sidebar */
  --sidebar: oklch(0.9030 0.0046 258.3257);
  --sidebar-foreground: oklch(0.3211 0 0);
  --sidebar-primary: oklch(0.6397 0.1720 36.4421);
  --sidebar-border: oklch(0.9276 0.0058 264.5313);
}
```

#### Dark Theme

```css
.dark {
  --background: oklch(0.2598 0.0306 262.6666);
  --foreground: oklch(0.9219 0 0);
  --card: oklch(0.3106 0.0301 268.6365);
  --card-foreground: oklch(0.9219 0 0);
  --popover: oklch(0.2900 0.0249 268.3986);
  --popover-foreground: oklch(0.9219 0 0);
  --primary: oklch(0.6397 0.1720 36.4421);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.3095 0.0266 266.7132);
  --secondary-foreground: oklch(0.9219 0 0);
  --muted: oklch(0.3095 0.0266 266.7132);
  --muted-foreground: oklch(0.7155 0 0);
  --accent: oklch(0.3380 0.0589 267.5867);
  --accent-foreground: oklch(0.8823 0.0571 254.1284);
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.3843 0.0301 269.7337);
  --input: oklch(0.3843 0.0301 269.7337);
  --ring: oklch(0.6397 0.1720 36.4421);
  --sidebar: oklch(0.3100 0.0283 267.7408);
  --sidebar-foreground: oklch(0.9219 0 0);
  --sidebar-border: oklch(0.3843 0.0301 269.7337);
}
```

#### Semantic Color Usage

| Token | Light Preview | Usage |
|-------|---------------|-------|
| `--primary` | 🟠 Warm Orange | CTAs, links, focus rings, brand elements |
| `--secondary` | ⬜ Light Gray | Secondary buttons, subtle backgrounds |
| `--destructive` | 🔴 Red | Delete, reject, error states |
| `--muted` | ⬜ Near White | Disabled states, subtle separators |
| `--accent` | 🔵 Light Blue | Highlights, selected items |

---

### Typography

#### Font Families

```css
:root {
  --font-sans: Inter, sans-serif;
  --font-serif: Source Serif 4, serif;
  --font-mono: JetBrains Mono, monospace;
}
```

| Family | Usage |
|--------|-------|
| **Inter** | UI text, labels, body copy |
| **Source Serif 4** | Document titles, formal content |
| **JetBrains Mono** | Code, technical data, audit logs |

#### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `text-xs` | 12px | 400 | 1.5 | Helper text, timestamps |
| `text-sm` | 14px | 400 | 1.5 | Body text, form labels |
| `text-base` | 16px | 400 | 1.5 | Default body text |
| `text-lg` | 18px | 500 | 1.4 | Subheadings, card titles |
| `text-xl` | 20px | 600 | 1.3 | Section headers |
| `text-2xl` | 24px | 600 | 1.2 | Page titles |
| `text-3xl` | 30px | 700 | 1.2 | Hero text |

---

### Spacing & Layout

#### Spacing Scale

```css
:root {
  --spacing: 0.25rem; /* 4px base unit */
}
```

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-1` | 4px | Tight gaps, icon padding |
| `spacing-2` | 8px | Input padding, small gaps |
| `spacing-3` | 12px | Card padding, button padding |
| `spacing-4` | 16px | Section gaps, form spacing |
| `spacing-6` | 24px | Component separation |
| `spacing-8` | 32px | Page section gaps |
| `spacing-12` | 48px | Major section separation |

#### Border Radius

```css
:root {
  --radius: 0.75rem; /* 12px */
  --radius-sm: calc(var(--radius) - 4px);  /* 8px */
  --radius-md: calc(var(--radius) - 2px);  /* 10px */
  --radius-lg: var(--radius);               /* 12px */
  --radius-xl: calc(var(--radius) + 4px);  /* 16px */
}
```

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 8px | Badges, small buttons |
| `radius-md` | 10px | Buttons, inputs |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Large containers |

---

### Shadows

```css
:root {
  --shadow-2xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0px 1px 3px 0px hsl(0 0% 0% / 0.10), 
               0px 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0px 1px 3px 0px hsl(0 0% 0% / 0.10), 
               0px 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0px 1px 3px 0px hsl(0 0% 0% / 0.10), 
               0px 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0px 1px 3px 0px hsl(0 0% 0% / 0.10), 
               0px 8px 10px -1px hsl(0 0% 0% / 0.10);
}
```

| Token | Usage |
|-------|-------|
| `shadow-sm` | Cards, dropdowns |
| `shadow-md` | Elevated cards, popovers |
| `shadow-lg` | Modals, overlays |
| `shadow-xl` | Floating action buttons |

---

## Components

### Button

Primary interactive element for actions.

#### Variants

| Variant | Usage | Background | Text |
|---------|-------|------------|------|
| **Primary** | Main CTAs (Sign Now, Submit) | `--primary` | `--primary-foreground` |
| **Secondary** | Cancel, Back actions | `--secondary` | `--secondary-foreground` |
| **Destructive** | Delete, Reject | `--destructive` | `--destructive-foreground` |
| **Ghost** | Tertiary actions, links | Transparent | `--primary` |
| **Outline** | Alternative CTAs | Transparent | `--foreground` |

#### Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 32px | 12px 16px | 14px |
| `default` | 40px | 16px 24px | 14px |
| `lg` | 48px | 20px 32px | 16px |

#### States

| State | Visual Change |
|-------|---------------|
| Default | Base styles |
| Hover | Brightness +10% |
| Active | Brightness -5% |
| Focus | Ring 2px offset, `--ring` color |
| Disabled | Opacity 50%, cursor not-allowed |
| Loading | Spinner icon, text hidden |

#### Code Example

```tsx
import { Button } from "@/components/ui/button"

// Primary action
<Button>Sign Now</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Destructive action
<Button variant="destructive">Reject Document</Button>

// With loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processing...
</Button>
```

#### Accessibility

- Use semantic `<button>` element
- Include `aria-label` for icon-only buttons
- Ensure minimum 44x44px touch target on mobile
- Provide `aria-disabled="true"` instead of `disabled` when needed

---

### Input

Text input field for forms.

#### Anatomy

| Part | Token | Description |
|------|-------|-------------|
| Container | `--input` bg, `--border` | Input wrapper |
| Text | `--foreground` | User input text |
| Placeholder | `--muted-foreground` | Hint text |
| Label | `--foreground` | Field label |
| Helper | `--muted-foreground` | Additional guidance |
| Error | `--destructive` | Error message |

#### States

| State | Border | Background |
|-------|--------|------------|
| Default | `--border` | `--input` |
| Focus | `--ring` (2px) | `--input` |
| Error | `--destructive` | `--input` |
| Disabled | `--border` opacity 50% | `--muted` |

#### Code Example

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="john@example.com" 
  />
</div>

// With error state
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email"
    className="border-destructive" 
  />
  <p className="text-sm text-destructive">
    Please enter a valid email
  </p>
</div>
```

---

### Card

Container for grouping related content.

#### Variants

| Variant | Usage | Styles |
|---------|-------|--------|
| **Default** | Standard content | `--card` bg, `--shadow-sm` |
| **Highlighted** | Priority items (Pending signature) | `--primary` left border |
| **Interactive** | Clickable cards | Hover: `--shadow-md` |

#### Anatomy

```
┌──────────────────────────────────┐
│  [Header]                        │  <- CardHeader
│  Title / Action                  │  <- CardTitle
├──────────────────────────────────┤
│                                  │
│  [Content]                       │  <- CardContent
│  Main content area               │
│                                  │
├──────────────────────────────────┤
│  [Footer]                        │  <- CardFooter
│  Actions / Meta                  │
└──────────────────────────────────┘
```

#### Code Example

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Contract_v2.pdf</CardTitle>
    <p className="text-sm text-muted-foreground">From: HR Team</p>
  </CardHeader>
  <CardContent>
    <p>Sequential signing • Due: Feb 10, 2026</p>
  </CardContent>
  <CardFooter>
    <Button>Sign Now</Button>
  </CardFooter>
</Card>
```

---

### Badge

Status indicator for documents and workflows.

#### Variants

| Variant | Background | Text | Usage |
|---------|------------|------|-------|
| **Default** | `--secondary` | `--secondary-foreground` | Neutral status |
| **Success** | Green tint | Green | Completed, Signed |
| **Warning** | Yellow tint | Yellow | Pending, Partial |
| **Destructive** | `--destructive` | `--destructive-foreground` | Rejected, Cancelled |
| **Outline** | Transparent | `--foreground` | Subtle labels |

#### Document Status Badges

| Status | Badge | Color |
|--------|-------|-------|
| Draft | `Draft` | Outline |
| Pending | `Pending Signature` | Warning |
| Partial | `2/5 Signed` | Warning |
| Completed | `Completed` | Success |
| Cancelled | `Cancelled` | Destructive |

#### Code Example

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Draft</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Cancelled</Badge>
<Badge className="bg-green-100 text-green-800">Completed</Badge>
```

---

### Modal / Dialog

Overlay for focused interactions.

#### Sizes

| Size | Width | Usage |
|------|-------|-------|
| `sm` | 400px | Confirmations |
| `default` | 500px | Forms, signature |
| `lg` | 640px | Complex forms |
| `xl` | 800px | Previews |
| `full` | 100% - 48px | Document viewer |

#### Anatomy

```
┌─────────────────────────────────────────┐
│ [Title]                           [X]   │  <- DialogHeader
├─────────────────────────────────────────┤
│                                         │
│ [Content]                               │  <- DialogContent
│                                         │
├─────────────────────────────────────────┤
│           [Cancel]  [Confirm]           │  <- DialogFooter
└─────────────────────────────────────────┘
```

#### Code Example

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Apply Your Signature</DialogTitle>
    </DialogHeader>
    <SignatureCanvas />
    <DialogFooter>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleApply}>Apply Signature</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Accessibility

- Trap focus within modal
- Close on Escape key
- Return focus to trigger on close
- Use `aria-labelledby` for title
- Use `aria-describedby` for description

---

### Toast / Notification

Feedback messages for user actions.

#### Variants

| Variant | Icon | Usage |
|---------|------|-------|
| **Default** | Info | General notifications |
| **Success** | ✓ Checkmark | Action completed |
| **Error** | ✕ X | Action failed |
| **Warning** | ⚠ Warning | Important notice |

#### Behavior

- Auto-dismiss after 5 seconds
- Swipe to dismiss on mobile
- Stack from bottom-right (desktop)
- Stack from bottom (mobile)

#### Code Example

```tsx
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

// Success toast
toast({
  title: "Document Signed",
  description: "Your signature has been applied successfully.",
})

// Error toast
toast({
  variant: "destructive",
  title: "Upload Failed",
  description: "File size exceeds 25 MB limit.",
})
```

---

## Patterns

### Dashboard Section

Consistent structure for dashboard cards.

```tsx
<section className="space-y-4">
  {/* Section Header */}
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-destructive" />
      Waiting for Your Signature
      <Badge variant="secondary">3</Badge>
    </h2>
  </div>
  
  {/* Section Content */}
  <div className="space-y-3">
    {documents.map((doc) => (
      <DocumentCard key={doc.id} document={doc} />
    ))}
  </div>
</section>
```

### Form Layout

Standard form structure with validation.

```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  {/* Form Group */}
  <div className="space-y-2">
    <Label htmlFor="field">Field Label</Label>
    <Input id="field" {...register("field")} />
    {errors.field && (
      <p className="text-sm text-destructive">
        {errors.field.message}
      </p>
    )}
  </div>
  
  {/* Form Actions */}
  <div className="flex justify-end gap-3">
    <Button variant="secondary" type="button">Cancel</Button>
    <Button type="submit">Submit</Button>
  </div>
</form>
```

### Page Header

Consistent page title layout.

```tsx
<header className="flex items-center justify-between pb-6">
  <div>
    <h1 className="text-2xl font-semibold">Page Title</h1>
    <p className="text-muted-foreground">Page description</p>
  </div>
  <Button>Primary Action</Button>
</header>
```

---

## Icons

Use [Lucide Icons](https://lucide.dev/) for consistency with shadcn/ui.

### Common Icons

| Icon | Name | Usage |
|------|------|-------|
| 📄 | `FileText` | Document |
| ✍️ | `PenLine` | Signature |
| 📤 | `Upload` | Upload action |
| 📥 | `Download` | Download action |
| 🔔 | `Bell` | Notifications |
| ⚙️ | `Settings` | Settings |
| 👤 | `User` | Profile |
| ✅ | `Check` | Success, complete |
| ❌ | `X` | Close, error |
| ⚠️ | `AlertTriangle` | Warning |
| 🔍 | `Search` | Search |
| ➕ | `Plus` | Add new |

### Icon Sizing

| Size | Dimensions | Usage |
|------|------------|-------|
| `sm` | 16x16px | Inline with text |
| `default` | 20x20px | Buttons, inputs |
| `lg` | 24x24px | Standalone icons |
| `xl` | 32x32px | Empty states |

---

## Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640-1023px | Two columns, collapsible sidebar |
| Desktop | ≥ 1024px | Full layout, persistent sidebar |

---

## Accessibility Guidelines

### Focus Management

- All interactive elements must have visible focus indicators
- Focus ring: 2px offset, `--ring` color
- Keyboard navigation order follows visual order

### Color Contrast

- Text on backgrounds: minimum 4.5:1 (AA)
- Large text (18px+): minimum 3:1
- UI components: minimum 3:1

### Screen Readers

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Provide `aria-label` for icon-only buttons
- Announce status changes with `aria-live`
- Use heading hierarchy (h1 → h6)

### Motion

- Respect `prefers-reduced-motion`
- Provide static alternatives for animations
- Keep animations under 300ms

---

## File Structure

```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       ├── toast.tsx
│       └── ...
├── styles/
│   └── globals.css    # Token definitions
└── lib/
    └── utils.ts       # cn() helper
```

---

**Document Version:** 1.0  
**Created:** February 5, 2026  
**Framework:** React + shadcn/ui + Tailwind CSS
