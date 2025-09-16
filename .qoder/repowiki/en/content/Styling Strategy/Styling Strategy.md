# Styling Strategy

<cite>
**Referenced Files in This Document**   
- [main.ts](file://src/main.ts#L0-L14)
- [main.css](file://src/assets/main.css)
- [base.css](file://src/assets/base.css)
- [tailwind.config.js](file://tailwind.config.js)
- [postcss.config.js](file://postcss.config.js)
- [TopNavbar.vue](file://src/components/common/TopNavbar.vue)
- [UserProfileSection.vue](file://src/components/common/UserProfileSection.vue)
- [MobileNavigationMenu.vue](file://src/components/common/MobileNavigationMenu.vue)
- [PageHeader.vue](file://src/components/common/PageHeader.vue) - *Updated in recent commit*
- [BaseButton.vue](file://src/components/ui/BaseButton.vue) - *Updated in recent commit*
- [BaseModal.vue](file://src/components/ui/BaseModal.vue) - *Updated in recent commit*
- [LoginPage.vue](file://src/pages/LoginPage.vue) - *Updated in recent commit*
- [ProfilePage.vue](file://src/pages/ProfilePage.vue) - *Updated in recent commit*
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue) - *Updated in recent commit*
</cite>

## Update Summary
**Changes Made**   
- Updated component styling section to reflect enhancements in PageHeader.vue, BaseButton.vue, BaseModal.vue, and LoginPage.vue
- Added documentation on dark mode improvements in BaseModal and login components
- Enhanced utility classes section with details on BaseButton variant system and BaseModal styling
- Updated responsive design patterns with new examples from PageHeader.vue
- Added guidance on button and modal component usage and styling patterns
- Refreshed code examples to reflect current implementation in updated components
- Updated section sources to include newly analyzed files
- Incorporated responsive grid layout and dark theme support details from ProfilePage.vue and NeuralNetworkQuestionnaireForm.vue updates
- Added documentation on themed ActionCard component usage in ProfilePage.vue
- Updated profile page layout documentation to reflect flexbox redesign and avatar display enhancements in ProfilePage.vue

## Table of Contents
1. [Styling Architecture Overview](#styling-architecture-overview)
2. [CSS Entry Point and Structure](#css-entry-point-and-structure)
3. [Design Tokens and CSS Variables](#design-tokens-and-css-variables)
4. [Utility Classes and Tailwind Integration](#utility-classes-and-tailwind-integration)
5. [Tailwind Configuration and Customization](#tailwind-configuration-and-customization)
6. [Component Styling and Responsive Navigation](#component-styling-and-responsive-navigation)
7. [Responsive Design and Dark Mode](#responsive-design-and-dark-mode)
8. [Best Practices for Adding New Styles](#best-practices-for-adding-new-styles)

## Styling Architecture Overview

The maya-platform-frontend application implements a modern styling system based on Tailwind CSS with custom CSS variables for theming. The styling architecture has been updated to use a utility-first approach with Tailwind's atomic classes, replacing the previously documented SCSS-based system. This change enables rapid UI development while maintaining consistency across the application.

The current styling system is built on several key principles:
- **Utility-first approach**: Leveraging Tailwind's atomic classes for styling
- **Consistency**: Design tokens ensure uniform visual language
- **Maintainability**: Clear separation between structure and styling
- **Extensibility**: Configurable Tailwind theme with project-specific extensions
- **Performance**: Purgeable CSS that removes unused classes in production

**Section sources**
- [main.ts](file://src/main.ts#L0-L14)
- [tailwind.config.js](file://tailwind.config.js)

## CSS Entry Point and Structure

The styling system is initialized through the `main.css` file, which serves as the primary entry point for all application styles. This file is imported directly in the application's main entry file (`main.ts`), ensuring global styles are loaded before component rendering.

```typescript
// src/main.ts
import './assets/main.css'
```

The `main.css` file follows a structured approach that integrates Tailwind's directives with custom CSS variables:
1. Import of external fonts (Inter)
2. Tailwind base, components, and utilities directives
3. Custom CSS variables for theme
4. Base element styles

```css
/* src/assets/main.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS variables for theme */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
}

/* Base styles */
html {
  font-family: 'Inter', sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  @apply bg-gray-50 text-gray-900;
}

#app {
  min-height: 100vh;
}
```

This structure ensures that Tailwind's reset and base styles are applied first, followed by component and utility classes, with custom variables and overrides applied last in the cascade.

**Section sources**
- [main.ts](file://src/main.ts#L0-L14)
- [main.css](file://src/assets/main.css)

## Design Tokens and CSS Variables

The application implements a design token system through CSS custom properties defined in `main.css` and `base.css`. These variables serve as the foundation for the application's visual identity and enable theme consistency across components.

The design tokens are organized into logical categories:
- **Color palette**: Primary color variants for branding
- **Semantic colors**: Contextual colors for backgrounds, text, and borders
- **Typography**: Font family definitions
- **Layout**: Spacing and gap values

```css
/* Color tokens in main.css */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
}

/* Semantic colors in base.css */
:root {
  --color-background: var(--vt-c-white);
  --color-background-soft: var(--vt-c-white-soft);
  --color-background-mute: var(--vt-c-white-mute);
  --color-border: var(--vt-c-divider-light-2);
  --color-border-hover: var(--vt-c-divider-light-1);
  --color-heading: var(--vt-c-text-light-1);
  --color-text: var(--vt-c-text-light-1);
  --section-gap: 160px;
}
```

The dark mode implementation is handled through CSS variables in `base.css`, which redefines color values when the user's system preference is set to dark mode:

```css
/* src/assets/base.css */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--vt-c-black);
    --color-background-soft: var(--vt-c-black-soft);
    --color-background-mute: var(--vt-c-black-mute);
    --color-border: var(--vt-c-divider-dark-2);
    --color-border-hover: var(--vt-c-divider-dark-1);
    --color-heading: var(--vt-c-text-dark-1);
    --color-text: var(--vt-c-text-dark-2);
  }
}
```

**Section sources**
- [main.css](file://src/assets/main.css)
- [base.css](file://src/assets/base.css)

## Utility Classes and Tailwind Integration

The application has transitioned from custom utility classes to using Tailwind CSS's comprehensive utility system. This change provides a more robust and maintainable approach to styling with atomic classes that can be combined to create complex layouts and visual effects.

Tailwind's utility classes are organized into categories that correspond to CSS properties:
- **Layout utilities**: Flexbox, grid, and positioning classes
- **Spacing utilities**: Margin, padding, and gap classes
- **Typography utilities**: Font, text, and leading classes
- **Colors and backgrounds**: Text color and background color classes
- **Borders**: Border, radius, and divide classes
- **Effects**: Shadow and filter classes

```vue
<!-- Example of Tailwind utility classes in components -->
<template>
  <!-- Using Tailwind classes for layout and styling -->
  <div class="flex flex-col min-h-screen bg-gray-50 text-gray-900">
    <header class="flex items-center justify-between p-4 bg-white shadow-sm">
      <div class="flex items-center space-x-2">
        <Logo class="w-8 h-8" />
        <span class="text-xl font-semibold">Maya Platform</span>
      </div>
      <nav class="hidden md:flex space-x-6">
        <a href="#" class="text-gray-700 hover:text-primary-600 transition-colors">Home</a>
        <a href="#" class="text-gray-700 hover:text-primary-600 transition-colors">About</a>
      </nav>
    </header>
  </div>
</template>
```

The utility-first approach promotes the DRY principle by providing reusable classes that can be applied across components without duplicating CSS rules.

**Section sources**
- [main.css](file://src/assets/main.css)
- [tailwind.config.js](file://tailwind.config.js)

## Tailwind Configuration and Customization

The Tailwind CSS configuration is defined in `tailwind.config.js`, which extends the default theme with project-specific values. This configuration file controls how Tailwind generates its utility classes and ensures brand consistency across the application.

Key customization points include:
- **Color extension**: Primary color palette aligned with the application's branding
- **Font family extension**: Custom sans-serif font stack with Inter as the primary font
- **Content sources**: Configuration of file paths for Tailwind to scan for class usage
- **Plugins**: Integration of additional Tailwind plugins for forms and typography

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
```

The PostCSS configuration in `postcss.config.js` ensures proper processing of Tailwind directives and automatic vendor prefixing:

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Section sources**
- [tailwind.config.js](file://tailwind.config.js)
- [postcss.config.js](file://postcss.config.js)

## Component Styling and Responsive Navigation

Recent updates to the navigation components have implemented a responsive design using Tailwind CSS utility classes and dark mode variants. The `TopNavbar.vue`, `UserProfileSection.vue`, and `MobileNavigationMenu.vue` components have been redesigned to provide an optimal user experience across device sizes.

The responsive navigation pattern uses Tailwind's breakpoint system to adapt the layout:
- Mobile view: Collapsed menu with hamburger toggle
- Desktop view: Horizontal navigation with user profile

```vue
<!-- TopNavbar.vue - Responsive navigation example -->
<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex-shrink-0 flex items-center">
          <Logo class="h-8 w-auto" />
        </div>
        
        <!-- Desktop navigation -->
        <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
          <a 
            v-for="item in navigation" 
            :key="item.name"
            :href="item.href"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
            {{ item.name }}
          </a>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <!-- Hamburger icon -->
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <mobile-navigation-menu 
      v-if="mobileMenuOpen" 
      :navigation="navigation" 
      @close="mobileMenuOpen = false" 
    />
  </nav>
</template>
```

The component styling follows a clean, semantic approach with appropriate class organization and dark mode support through Tailwind's `dark:` variant.

**Section sources**
- [TopNavbar.vue](file://src/components/common/TopNavbar.vue)
- [UserProfileSection.vue](file://src/components/common/UserProfileSection.vue)
- [MobileNavigationMenu.vue](file://src/components/common/MobileNavigationMenu.vue)

## Responsive Design and Dark Mode

The styling system incorporates responsive design patterns and dark mode implementation to provide an optimal user experience across different devices and user preferences.

### Responsive Design Patterns

The application uses Tailwind CSS's mobile-first breakpoint system with the following responsive prefixes:
- No prefix: Mobile (applies to all screens)
- `sm:`: Small screens (640px and up)
- `md:`: Medium screens (768px and up)
- `lg:`: Large screens (1024px and up)
- `xl:`: Extra large screens (1280px and up)

```vue
<!-- Example of responsive classes -->
<div class="flex flex-col md:flex-row">
  <!-- Stacked on mobile, horizontal on medium screens and up -->
  <div class="w-full md:w-1/2 p-4">Content 1</div>
  <div class="w-full md:w-1/2 p-4">Content 2</div>
</div>

<!-- Conditional visibility -->
<div class="md:hidden">Mobile only content</div>
<div class="hidden md:block">Desktop only content</div>
```

### Dark Mode Implementation

Dark mode is implemented using CSS variables in `base.css` combined with the `prefers-color-scheme` media query. Tailwind's dark mode support is configured in `tailwind.config.js` (not explicitly shown but inferred from usage).

The application automatically respects the user's system preference for dark mode:

```css
/* src/assets/base.css */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--vt-c-black);
    --color-background-soft: var(--vt-c-black-soft);
    --color-background-mute: var(--vt-c-black-mute);
    --color-border: var(--vt-c-divider-dark-2);
    --color-border-hover: var(--vt-c-divider-dark-1);
    --color-heading: var(--vt-c-text-dark-1);
    --color-text: var(--vt-c-text-dark-2);
  }
}
```

Components can also use Tailwind's `dark:` variant to apply specific classes when dark mode is active:

```vue
<template>
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
      Page Title
    </h1>
    <p class="text-gray-600 dark:text-gray-300">
      Content with automatic dark mode adaptation.
    </p>
  </div>
</template>
```

**Section sources**
- [base.css](file://src/assets/base.css)
- [main.css](file://src/assets/main.css)
- [tailwind.config.js](file://tailwind.config.js)

## Best Practices for Adding New Styles

When adding new styles to the application, follow these guidelines to maintain consistency and code quality:

### 1. Use Tailwind Utility Classes
Leverage Tailwind's utility classes before creating custom CSS:

```vue
<!-- Good - using Tailwind classes -->
<div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
  <span class="text-lg font-semibold text-gray-900 dark:text-white">Content</span>
  <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors">
    Action
  </button>
</div>

<!-- Avoid - custom CSS for common styling -->
<div class="custom-container">
  <span class="title-text">Content</span>
  <button class="action-button">Action</button>
</div>
```

### 2. Extend Tailwind Theme for Repeated Values
When you need to add custom design tokens, extend the Tailwind theme in `tailwind.config.js`:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      // Add new custom colors as needed
      accent: '#8b5cf6',
    },
    spacing: {
      '128': '32rem',
      '144': '36rem',
    },
  },
}
```

### 3. Use Semantic HTML with Utility Classes
Structure components with semantic HTML elements and apply styling through utility classes:

```vue
<template>
  <!-- Good - semantic structure with utility classes -->
  <article class="prose prose-gray dark:prose-invert max-w-none">
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Article Title</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">Published on Date</p>
    </header>
    <section class="space-y-6">
      <p class="text-gray-800 dark:text-gray-200">Paragraph content...</p>
    </section>
  </article>
</template>
```

### 4. Implement Responsive Design
Ensure all new components are responsive by using Tailwind's responsive prefixes:

```vue
<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="item in items" :key="item.id" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <!-- Card content -->
    </div>
  </div>
</template>
```

### 5. Support Dark Mode
Verify that new components work correctly in both light and dark themes by using semantic color classes with dark variants:

```vue
<template>
  <!-- Using dark variant classes for theme support -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Section Title</h2>
    <p class="text-gray-600 dark:text-gray-300">Content with dark mode support</p>
  </div>
</template>
```

### 6. Apply Consistent Styling Patterns in Core Components
The recently updated `PageHeader.vue`, `BaseButton.vue`, `BaseModal.vue`, and `LoginPage.vue` components demonstrate consistent styling patterns that should be followed for new components:

```vue
<!-- PageHeader.vue - Consistent header pattern -->
<template>
  <header class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/10">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
          <p v-if="description" class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {{ description }}
          </p>
        </div>
        <div v-if="$slots.actions" class="flex items-center space-x-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>
```

```vue
<!-- BaseButton.vue - Variant-based styling system -->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800'

  const variantClasses = {
    primary: 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400',
    secondary: 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-gray-500 dark:focus:ring-gray-400',
    danger: 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500 dark:focus:ring-red-400',
    success: 'bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 focus:ring-green-500 dark:focus:ring-green-400',
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    (props.disabled || props.loading) && 'opacity-50 cursor-not-allowed',
  ]
    .filter(Boolean)
    .join(' ')
})
</script>
```

```vue
<!-- BaseModal.vue - Dark mode styling improvements -->
<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="handleBackdropClick"
  >
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          class="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          @click="handleBackdropClick"
        />
      </transition>

      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div 
          class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          :class="{ 'sm:max-w-sm': size === 'sm', 'sm:max-w-xl': size === 'lg' }"
        >
          <!-- Modal header -->
          <div class="flex items-start justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <button
              v-if="closable"
              type="button"
              class="text-gray-400 bg-transparent hover:text-gray-500 dark:hover:text-gray-300 rounded-md transition-colors"
              @click="handleClose"
            >
              <!-- Close icon -->
            </button>
          </div>

          <!-- Modal body -->
          <div class="mt-4">
            <slot />
          </div>

          <!-- Modal footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end mt-6 space-x-3">
            <slot name="footer" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
```

The core components use consistent patterns for:
- Semantic class organization with base, variant, and state classes
- Dark mode styling improvements with enhanced shadow and focus states
- Accessible interactive elements with proper focus rings and hover states
- Responsive layouts that adapt to screen size
- Component API design that supports slots and event handling

Additionally, the `ProfilePage.vue` component demonstrates the use of themed action cards with color-coded sections:

```vue
<!-- ProfilePage.vue - Themed action cards -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Questionnaire Access Card -->
    <ActionCard
      v-if="userStore.currentUser?.userType === 'specialist'"
      title="Specialist Questionnaire"
      description="Complete the neural network specialist questionnaire to attract clients"
      icon="cpu"
      route="/profile/neural-network"
      color="purple"
      :moderation-status="questionnaireStatus"
      :completion-percentage="questionnaireCompletion"
      :show-progress="true"
      :action-text="questionnaireActionText"
    />
    
    <!-- Password Change Card -->
    <ActionCard
      title="Change Password"
      description="Change your password to ensure account security"
      icon="key"
      route="/profile/change-password"
      color="green"
      action-text="Change Password"
    />
    
    <!-- Logout Card -->
    <ActionCard
      title="Logout"
      description="End your current session and sign out"
      icon="logout"
      color="red"
      :is-action="true"
      action-text="Sign Out"
      @click="handleLogout"
    />
  </div>
</template>
```

These action cards use a responsive 3-column grid layout on large screens, adapting to fewer columns on smaller devices. Each card is color-coded (purple, green, red) using the `color` prop to indicate different types of actions, providing visual hierarchy and intuitive user guidance.

The recent redesign of `ProfilePage.vue` has enhanced the layout using flexbox for improved alignment and spacing. The avatar display has been improved with better sizing, border-radius, and responsive behavior across different screen sizes. The flexbox layout ensures consistent spacing between profile elements and proper alignment of content sections.

By following these best practices, developers can ensure that new styles integrate seamlessly with the existing styling system, maintaining consistency and reducing technical debt.

**Section sources**
- [main.css](file://src/assets/main.css)
- [base.css](file://src/assets/base.css)
- [tailwind.config.js](file://tailwind.config.js)
- [PageHeader.vue](file://src/components/common/PageHeader.vue)
- [BaseButton.vue](file://src/components/ui/BaseButton.vue)
- [BaseModal.vue](file://src/components/ui/BaseModal.vue)
- [LoginPage.vue](file://src/pages/LoginPage.vue)
- [ProfilePage.vue](file://src/pages/ProfilePage.vue)
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue)