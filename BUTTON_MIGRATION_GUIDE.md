# 🔄 Button Migration Guide

This guide will help you migrate from inline button styles to the new standardized button system.

---

## 📚 Quick Reference

### Before (Inline Styles)
```tsx
<button 
  onClick={handleClick}
  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
>
  <Filter className="w-5 h-5" />
  Update Preferences
</button>
```

### After (Using Button Component)
```tsx
<Button 
  variant="primary-teal" 
  fullWidth 
  icon={<Filter className="w-5 h-5" />}
  onClick={handleClick}
>
  Update Preferences
</Button>
```

### Or (Using CSS Classes)
```tsx
<button 
  onClick={handleClick}
  className="btn-primary-teal btn-full btn-icon-left"
>
  <Filter className="w-5 h-5" />
  Update Preferences
</button>
```

---

## 🎨 Button Variant Mappings

### Primary Action Buttons

| Old Pattern | New Component | New Class |
|------------|---------------|-----------|
| `bg-gradient-to-r from-orange-500 to-teal-500...` | `variant="primary"` | `btn-primary` |
| `bg-gradient-to-r from-teal-500 to-teal-600...` | `variant="primary-teal"` | `btn-primary-teal` |
| `bg-gradient-to-r from-orange-500 to-orange-600...` | `variant="primary-orange"` | `btn-primary-orange` |

### Secondary Buttons

| Old Pattern | New Component | New Class |
|------------|---------------|-----------|
| `bg-gradient-to-r from-earth-500 to-earth-600...` | `variant="secondary"` | `btn-secondary` |
| `bg-gray-200 hover:bg-gray-300...` | `variant="secondary-gray"` | `btn-secondary-gray` |

### Outline Buttons

| Old Pattern | New Component | New Class |
|------------|---------------|-----------|
| `border-2 border-teal-500 text-teal-600...` | `variant="outline"` | `btn-outline` |
| `border-2 border-orange-500 text-orange-600...` | `variant="outline-orange"` | `btn-outline-orange` |

### Special Buttons

| Old Pattern | New Component | New Class |
|------------|---------------|-----------|
| `bg-gradient-to-r from-red-500 to-red-600...` | `variant="danger"` | `btn-danger` |
| `bg-transparent hover:bg-earth-100...` | `variant="ghost"` | `btn-ghost` |
| `p-2 hover:bg-teal-100 rounded-full...` | `variant="icon"` or `variant="icon-sm"` | `btn-icon` or `btn-icon-sm` |

### Toggle/Pill Buttons

| Old Pattern | New Class |
|------------|-----------|
| Active: `bg-teal-500 text-white` | `btn-pill-active` |
| Inactive: `bg-earth-100 text-earth-600...` | `btn-pill-inactive` |
| Active Orange: `bg-orange-500 text-white` | `btn-pill-orange-active` |

---

## 🔧 Common Migration Patterns

### 1. Full-Width Primary Button with Icon

**Before:**
```tsx
<button 
  onClick={() => navigate('/matches')}
  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
>
  <Heart className="w-5 h-5" />
  View Matches
</button>
```

**After (Component):**
```tsx
<Button 
  variant="primary-orange" 
  fullWidth 
  icon={<Heart className="w-5 h-5" />}
  onClick={() => navigate('/matches')}
>
  View Matches
</Button>
```

**After (Classes):**
```tsx
<button 
  onClick={() => navigate('/matches')}
  className="btn-primary-orange btn-full btn-icon-left"
>
  <Heart className="w-5 h-5" />
  View Matches
</button>
```

---

### 2. Icon-Only Button (Filter, Close, etc.)

**Before:**
```tsx
<button 
  onClick={() => setShowPreferencesModal(true)}
  className="p-2 hover:bg-teal-100 rounded-full transition-colors"
  title="Filter options"
  aria-label="Filter options"
>
  <Filter className="w-5 h-5 text-teal-600" />
</button>
```

**After (Component):**
```tsx
<Button 
  variant="icon" 
  onClick={() => setShowPreferencesModal(true)}
  title="Filter options"
  aria-label="Filter options"
>
  <Filter className="w-5 h-5 text-teal-600" />
</Button>
```

**After (Classes):**
```tsx
<button 
  onClick={() => setShowPreferencesModal(true)}
  className="btn-icon"
  title="Filter options"
  aria-label="Filter options"
>
  <Filter className="w-5 h-5 text-teal-600" />
</button>
```

---

### 3. Toggle/Filter Pill Buttons

**Before:**
```tsx
<button
  onClick={() => handleToggle(size)}
  className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
    isActive ? 'bg-teal-500 text-white' : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
  }`}
>
  {size}
</button>
```

**After (Classes):**
```tsx
<button
  onClick={() => handleToggle(size)}
  className={isActive ? 'btn-pill-active' : 'btn-pill-inactive'}
>
  {size}
</button>
```

---

### 4. Modal Close Button

**Before:**
```tsx
<button 
  onClick={() => setShowModal(false)}
  className="p-2 hover:bg-white/20 rounded-full transition-colors"
>
  <X className="w-5 h-5" />
</button>
```

**After (Component):**
```tsx
<Button 
  variant="icon" 
  onClick={() => setShowModal(false)}
  aria-label="Close modal"
>
  <X className="w-5 h-5" />
</Button>
```

---

### 5. Danger/Delete Button

**Before:**
```tsx
<button 
  onClick={handleDelete}
  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
>
  Delete Event
</button>
```

**After (Component):**
```tsx
<Button 
  variant="danger" 
  fullWidth 
  onClick={handleDelete}
>
  Delete Event
</Button>
```

---

### 6. Loading State Button

**Before:**
```tsx
<button 
  disabled={isSubmitting}
  className="btn-primary"
>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
</button>
```

**After (Component):**
```tsx
<Button 
  variant="primary" 
  loading={isSubmitting}
>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
</Button>
```

---

## 📋 Migration Checklist

For each button you migrate:

- [ ] Replace inline Tailwind classes with button component or CSS classes
- [ ] Add `aria-label` to icon-only buttons if missing
- [ ] Verify button size meets minimum 44x44px for touch targets
- [ ] Test hover, active, focus, and disabled states
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Verify loading state behavior (if applicable)
- [ ] Check mobile/touch interactions

---

## 🎯 Priority Files to Migrate

Based on the audit, focus on these high-traffic files first:

1. **DiscoverPage.tsx** (39 buttons)
2. **ProfilePage.tsx** (35 buttons)
3. **EventsPage.tsx** (21 buttons)
4. **CommunityPage.tsx** (21 buttons)
5. **SwipeInterface.tsx** (18 buttons)
6. **MatchesPage.tsx** (16 buttons)
7. **ChatPage.tsx** (16 buttons)
8. **OnboardingFlow.tsx** (10 buttons)
9. **HealthPage.tsx** (10 buttons)

---

## 🚀 Automated Migration Script

You can use this find-and-replace pattern for common cases:

### Find:
```regex
className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg([^"]*)"
```

### Replace:
```
className="btn-primary-teal btn-full$1"
```

**⚠️ Warning:** Always review automated replacements manually!

---

## ✅ Testing Checklist

After migration, test these scenarios:

### Visual Testing:
- [ ] All buttons render with correct colors
- [ ] Gradients display properly
- [ ] Hover states work on desktop
- [ ] Active/pressed states work on mobile
- [ ] Icons align correctly with text
- [ ] Loading spinners center properly

### Functional Testing:
- [ ] Click handlers still work
- [ ] Form submissions work
- [ ] Modal open/close works
- [ ] Navigation works
- [ ] Disabled buttons can't be clicked
- [ ] Loading buttons can't be clicked

### Accessibility Testing:
- [ ] Screen reader announces button labels
- [ ] Tab navigation works in logical order
- [ ] Enter/Space keys activate buttons
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] Touch targets ≥ 44x44px

### Browser Testing:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (desktop)
- [ ] Safari (mobile)
- [ ] Chrome (mobile)

---

## 📞 Need Help?

Refer to:
- **BUTTON_AUDIT_REPORT.md** - Full audit findings
- **src/components/ui/Button.tsx** - Component source code
- **src/index.css** - CSS class definitions

---

**Happy Migrating! 🎉**

