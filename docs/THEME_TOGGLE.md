# Theme Toggle Feature Documentation

## Overview

The theme toggle feature allows users to manually switch between light, dark, and system themes in the Maya Platform frontend application. The implementation provides a comprehensive theming system with persistent storage and smooth transitions.

## Features

### 🌟 Key Features

- **Three Theme Modes**: Light, Dark, and System (follows OS preference)
- **Persistent Storage**: User preferences saved to localStorage
- **Smooth Transitions**: CSS transitions for seamless theme switching
- **Multiple UI Variants**: Button, dropdown, and switch components
- **Responsive Design**: Optimized for both desktop and mobile
- **Accessibility**: Full ARIA support and keyboard navigation
- **System Integration**: Automatic detection of OS theme preference changes

### 🎨 Component Variants

#### 1. Button Variant (Primary)
```vue
<ThemeToggle variant="button" size="md" />
```
- Compact icon button that cycles through themes
- Perfect for navbar integration
- Shows current theme icon (sun/moon/computer)

#### 2. Dropdown Variant
```vue
<ThemeToggle variant="dropdown" show-label position="right" />
```
- Full dropdown menu with all theme options
- Explicit selection with visual confirmation
- Better for mobile or settings pages

#### 3. Switch Variant
```vue
<ThemeToggle variant="switch" show-label />
```
- Simple toggle between light and dark
- No system option
- Minimal UI footprint

## Installation & Usage

### 1. Core Components

The theme system consists of several key components:

```
src/
├── stores/theme.ts              # Pinia store for theme management
├── types/theme.ts               # TypeScript type definitions
├── components/ui/ThemeToggle.vue # Main theme toggle component
└── assets/base.css              # Theme transition styles
```

### 2. Integration

The theme toggle is automatically integrated into:

- **TopNavbar**: Desktop theme toggle button
- **MobileNavigationMenu**: Mobile theme dropdown

### 3. Store Usage

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Get current state
console.log(themeStore.currentTheme) // 'light' | 'dark' | 'system'
console.log(themeStore.isDarkMode)   // boolean

// Change themes
themeStore.setTheme('dark')
themeStore.toggleTheme()      // Toggle between light/dark
themeStore.cycleTheme()       // Cycle through all options
```

### 4. Theme Selector in Profile Settings

```vue
<ThemeSelector @theme-changed="handleThemeChange" />
```

- Complete theme selection interface with preview cards
- Shows visual preview of each theme
- Integrated into profile settings page
- Emits events when theme changes

### Component Props

```typescript
interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'switch'  // Default: 'button'
  size?: 'sm' | 'md' | 'lg'                   // Default: 'md'
  showLabel?: boolean                         // Default: false
  position?: 'left' | 'right'                // Default: 'right'
}

// ThemeSelector has no props but emits events
interface ThemeSelectorEmits {
  themeChanged: [theme: ThemeMode]
}
```

## Styling & Customization

### CSS Classes and Theme Detection

The theme system uses the following approach for theme detection:

1. **CSS Class Method**: The primary method for theme switching
   - `.light` class applied to `<html>` for light theme
   - `.dark` class applied to `<html>` for dark theme
   - These classes override any system preferences

2. **System Preference Fallback**: When no manual theme is selected
   - Uses `:root:not(.light):not(.dark)` selector
   - Respects `prefers-color-scheme: dark` media query
   - Only applies when neither `.light` nor `.dark` classes are present

### CSS Classes

The theme system adds the following CSS classes:

```css
/* Applied to <html> element */
.dark { /* Dark theme styles */ }
.light { /* Light theme styles */ }

/* Component classes */
.theme-toggle { /* Base component */ }
.theme-toggle--button { /* Button variant */ }
.theme-toggle--dropdown { /* Dropdown variant */ }
.theme-toggle--switch { /* Switch variant */ }
.theme-toggle--sm { /* Small size */ }
.theme-toggle--md { /* Medium size */ }
.theme-toggle--lg { /* Large size */ }
```

### CSS Variables

The theme system uses CSS custom properties that automatically update based on the active theme:

```css
/* Light theme (default) */
:root,
.light {
  --color-background: #ffffff;
  --color-text: #2c3e50;
  /* other light theme variables */
}

/* Dark theme */
.dark {
  --color-background: #181818;
  --color-text: #ffffff;
  /* other dark theme variables */
}
```

### Tailwind CSS Integration

Tailwind CSS is configured with `darkMode: 'class'` to work with our theme system:

```css
/* These classes will automatically switch based on .dark class */
.bg-white.dark:bg-gray-800
.text-black.dark:text-white
.border-gray-200.dark:border-gray-700
```

### Transition Classes

Smooth transitions are applied globally:

```css
/* Global theme transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

## Accessibility

### ARIA Support

- **Button variant**: `aria-label`, `title` attributes
- **Dropdown variant**: `aria-expanded`, `aria-haspopup`, `role="menu"`
- **Switch variant**: `aria-label` for checkbox input

### Keyboard Navigation

- **Tab**: Focus theme toggle
- **Enter/Space**: Activate theme toggle
- **Escape**: Close dropdown (dropdown variant)

### Screen Reader Support

- Announces current theme state
- Provides clear action descriptions
- Uses semantic HTML elements

## Browser Support

- **Modern Browsers**: Full support (Chrome 90+, Firefox 88+, Safari 14+)
- **localStorage**: Graceful fallback if unavailable
- **CSS Custom Properties**: Required for theme system
- **matchMedia API**: Required for system preference detection

## Performance

### Bundle Impact

- **Theme Store**: ~2KB
- **ThemeToggle Component**: ~4KB
- **Icons**: ~3KB (Heroicons)
- **Total**: ~9KB additional bundle size

### Optimization Features

- Lazy loading of theme icons
- Debounced theme switching
- Efficient CSS custom properties
- Memory cleanup on component unmount

## API Reference

### Theme Store Methods

```typescript
// Initialization
themeStore.initializeTheme(): void

// Theme Management
themeStore.setTheme(theme: ThemeMode): void
themeStore.toggleTheme(): void
themeStore.cycleTheme(): void

// Utilities
themeStore.getSystemPreference(): boolean
themeStore.cleanup(): void
```

### Theme Store State

```typescript
// Reactive state
currentTheme: Ref<ThemeMode>
isDarkMode: ComputedRef<boolean>
isSystemPreference: ComputedRef<boolean>
systemIsDark: Ref<boolean>
```

### Events

The ThemeToggle component doesn't emit custom events - it directly updates the store state, which triggers reactivity throughout the application.

## Testing

### Unit Tests

```bash
# Run theme-specific tests
pnpm test tests/stores/theme.test.ts
pnpm test tests/components/ui/ThemeToggle.test.ts

# Run integration tests
pnpm test tests/integration/theme-system.integration.test.ts
```

### Test Coverage

- ✅ Theme store functionality
- ✅ Component variants and props
- ✅ Accessibility features
- ✅ Keyboard navigation
- ✅ System preference detection
- ✅ localStorage persistence
- ✅ Error handling

## Troubleshooting

### Common Issues

1. **Theme not persisting**: Check localStorage support
2. **System theme not detected**: Verify matchMedia API support
3. **Transitions not smooth**: Check CSS loading order
4. **Icons not showing**: Verify Heroicons import

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('debug-theme', 'true')

// Check current state
console.log('Theme Store State:', {
  currentTheme: themeStore.currentTheme,
  isDarkMode: themeStore.isDarkMode,
  systemIsDark: themeStore.systemIsDark,
})
```

## Migration Guide

### From Automatic Theme Only

If upgrading from automatic theme detection only:

1. No breaking changes required
2. System theme remains default
3. User can now override with manual selection
4. Previous theme preference preserved

### Adding Custom Themes

To extend with custom themes:

1. Update `ThemeMode` type in `types/theme.ts`
2. Add new options to `THEME_OPTIONS`
3. Update icon mapping in `ThemeToggle.vue`
4. Add CSS variables for new theme

## Contributing

When contributing to the theme system:

1. Follow accessibility guidelines
2. Test across all variants
3. Verify mobile responsiveness
4. Update documentation
5. Add comprehensive tests

## License

This theme system is part of the Maya Platform frontend application and follows the project's license terms.