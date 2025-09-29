# Technology Stack & Dependencies

<cite>
**Referenced Files in This Document**   
- [package.json](file://package.json) - *Updated with new navigation features*
- [vite.config.ts](file://vite.config.ts)
- [tsconfig.json](file://tsconfig.json)
- [tsconfig.app.json](file://tsconfig.app.json)
- [main.ts](file://src/main.ts)
- [TopNavbar.vue](file://src/components/common/TopNavbar.vue) - *Redesigned with user profile and responsive menu*
- [navigation.ts](file://src/stores/navigation.ts) - *Updated navigation store with new items and logic*
- [user.ts](file://src/stores/user.ts)
- [UserProfileSection.vue](file://src/components/common/UserProfileSection.vue)
- [MobileNavigationMenu.vue](file://src/components/common/MobileNavigationMenu.vue)
- [eslint.config.ts](file://eslint.config.ts)
- [types/index.ts](file://src/types/index.ts)
</cite>

## Update Summary
**Changes Made**   
- Updated **Core Framework** section to reflect new navigation component implementation
- Added details about responsive navigation patterns in **Vue 3 with Composition API**
- Enhanced **State Management: Pinia** section with new navigation store functionality
- Updated code examples to reflect current implementation in TopNavbar.vue and navigation.ts
- Added new section on **Navigation Component Architecture**
- Updated **Section sources** to include newly modified files

## Table of Contents
1. [Technology Stack & Dependencies](#technology-stack--dependencies)
2. [Core Framework: Vue 3 with Composition API](#core-framework-vue-3-with-composition-api)
3. [Build Tool: Vite](#build-tool-vite)
4. [Type Safety: TypeScript](#type-safety-typescript)
5. [State Management: Pinia](#state-management-pinia)
6. [Routing: Vue Router](#routing-vue-router)
7. [HTTP Client: Axios](#http-client-axios)
8. [UI Component Library: Naive UI](#ui-component-library-naive-ui)
9. [Development Tooling](#development-tooling)
10. [Environment Configuration](#environment-configuration)
11. [Navigation Component Architecture](#navigation-component-architecture)

## Core Framework: Vue 3 with Composition API

The maya-platform-frontend application is built on **Vue 3**, leveraging the modern **Composition API** and `<script setup>` syntax for enhanced code organization, reusability, and developer experience. This approach allows developers to organize logic by feature rather than by option (like `data`, `methods`, `computed`), making complex components easier to understand and maintain.

The Composition API enables the extraction of reusable logic into **composables**, such as `usePagination.ts` and `useLocalStorage.ts`, which encapsulate specific behaviors and can be shared across components. The `<script setup>` syntax (declared with `lang="ts"` for TypeScript support) provides a more concise and expressive way to define component logic, automatically exposing top-level bindings to the template without requiring an explicit `setup()` function return.

Recent updates to the navigation system demonstrate advanced Composition API patterns. The `TopNavbar.vue` component uses `computed` properties to dynamically filter navigation items based on authentication state and employs `watch` to synchronize route changes with the navigation store:

```vue
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNavigationStore } from '@/stores/navigation'

const route = useRoute()
const userStore = useUserStore()
const navigationStore = useNavigationStore()

const visibleNavigationItems = computed(() => {
  return navigationStore.getVisibleNavigationItems().filter(item => {
    return !item.requiresAuth || userStore.isAuthenticated
  })
})

const isActiveRoute = (path: string) => {
  return route.path === path
}

watch(
  () => route.path,
  (newPath) => {
    navigationStore.setActiveRoute(newPath)
  },
  { immediate: true }
)
</script>
```

This pattern improves readability and reduces boilerplate, especially when working with TypeScript, as type inference works seamlessly with reactive variables.

**Section sources**
- [TopNavbar.vue](file://src/components/common/TopNavbar.vue#L1-L130) - *Updated in recent commit*
- [types/index.ts](file://src/types/index.ts#L50-L82) - *Navigation interfaces*

## Build Tool: Vite

**Vite** is used as the build tool and development server, providing a fast, modern development experience with near-instant hot module replacement (HMR) and optimized production builds. Vite leverages native ES modules in the browser during development, eliminating the need for bundling and significantly reducing startup time.

The Vite configuration in `vite.config.ts` integrates essential plugins:
- `@vitejs/plugin-vue`: Enables Vue 3 single-file component support.
- `vite-plugin-vue-devtools`: Integrates Vue DevTools for enhanced debugging.
- `rollup-plugin-visualizer`: Generates bundle analysis reports.
- Automatic alias resolution for improved import paths.

A key feature of the Vite setup is the use of **path aliases**, which improve import readability and maintainability. These aliases are defined in both `vite.config.ts` and `tsconfig.app.json` to ensure consistency between the build tool and TypeScript compiler:

```ts
// vite.config.ts
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
    '@/stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
    // ... other aliases
  }
}
```

These aliases allow imports like `import { useUserStore } from '@/stores/user'` instead of long relative paths, improving code clarity and refactorability.

**Section sources**
- [vite.config.ts](file://vite.config.ts#L1-L48)
- [tsconfig.app.json](file://tsconfig.app.json#L1-L32)

## Type Safety: TypeScript

**TypeScript** is integrated throughout the codebase to provide static type checking, improving code quality, maintainability, and developer experience. The project uses a modular TypeScript configuration with `tsconfig.json` referencing `tsconfig.app.json` and `tsconfig.node.json`, enabling separate configurations for application and Node.js environments.

Key TypeScript features in use:
- **Strict mode** (`"strict": true`) ensures comprehensive type checking.
- **No unused locals/parameters** (`noUnusedLocals`, `noUnusedParameters`) enforces clean code.
- **Consistent casing** (`forceConsistentCasingInFileNames`) prevents import issues on case-sensitive systems.
- **Path mapping** aligns with Vite aliases for consistent module resolution.

TypeScript interfaces are used extensively to define data structures. The navigation system uses `NavigationItem` and store state/action interfaces to ensure type safety:

```ts
// types/index.ts
export interface NavigationItem {
  id: string
  label: string
  route: string
  icon?: string
  requiresAuth: boolean
  visible: boolean
}

export interface NavigationStoreState {
  isMobileMenuOpen: boolean
  activeRoute: string
  navigationItems: NavigationItem[]
}

export interface NavigationStoreActions {
  toggleMobileMenu(): void
  closeMobileMenu(): void
  setActiveRoute(route: string): void
  getVisibleNavigationItems(): NavigationItem[]
}
```

These types are implemented in the Pinia store, ensuring type safety across the navigation system.

**Section sources**
- [tsconfig.json](file://tsconfig.json#L1-L10)
- [tsconfig.app.json](file://tsconfig.app.json#L1-L32)
- [types/index.ts](file://src/types/index.ts#L50-L82)

## State Management: Pinia

**Pinia** is the official state management library for Vue 3, used to manage global application state in a type-safe, modular way. The application uses a store-per-feature pattern, with dedicated stores like `user.ts`, `counter.ts`, and `navigation.ts`.

The `useNavigationStore` demonstrates key Pinia patterns:
- **DefineStore with Composition API**: Uses `defineStore` with a setup-style syntax.
- **Reactive state**: Uses `ref()` to define reactive properties.
- **Computed properties**: `visibleNavigationItems` filters items based on visibility.
- **Actions**: Encapsulates navigation logic like menu toggling and route tracking.
- **Automatic TypeScript inference**: No need for explicit typing of actions due to the setup-style store.

```ts
// navigation.ts
export const useNavigationStore = defineStore('navigation', (): NavigationStoreState & NavigationStoreActions => {
  const isMobileMenuOpen = ref(false)
  const activeRoute = ref('')

  const navigationItems = ref<NavigationItem[]>([
    {
      id: 'my-profile',
      label: 'Мой профиль',
      route: '/profile',
      requiresAuth: true,
      visible: true,
    },
    // ... other items
  ])

  const visibleNavigationItems = computed(() => {
    return navigationItems.value.filter(item => item.visible)
  })

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  const setActiveRoute = (route: string) => {
    activeRoute.value = route
  }

  return {
    isMobileMenuOpen,
    activeRoute,
    navigationItems,
    toggleMobileMenu,
    closeMobileMenu,
    setActiveRoute,
    getVisibleNavigationItems,
  }
})
```

The store is initialized in `main.ts` and used in components via `useNavigationStore()`, enabling reactive state access and updates across the application.

**Section sources**
- [navigation.ts](file://src/stores/navigation.ts#L1-L75) - *Updated in recent commit*
- [user.ts](file://src/stores/user.ts#L1-L31)
- [main.ts](file://src/main.ts#L1-L13)

## Routing: Vue Router

**Vue Router** manages client-side navigation with a hierarchical route structure. The router is configured in `router/index.ts` using `createRouter` with `createWebHistory`, enabling clean URLs without hash fragments.

Key routing features:
- **Lazy loading**: Route components are dynamically imported, enabling code splitting.
- **Route guards**: Can be applied to protect authenticated routes.
- **Named routes**: Enable programmatic navigation.
- **Route meta fields**: Support additional route information.

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
      meta: { requiresAuth: true }
    }
    // ... other routes
  ]
})
```

This setup ensures that navigation state is properly synchronized with the URL and component rendering.

**Section sources**
- [router/index.ts](file://src/router/index.ts)

## HTTP Client: Axios

**Axios** is used for HTTP communication with the backend API. The application wraps Axios in a custom configuration to provide consistent request handling, interceptors, and environment-aware base URLs.

Key features of the HTTP client:
- **Environment-based base URL**: Uses Vite environment variables.
- **Request interceptors**: Add headers and authentication tokens.
- **Response interceptors**: Handle errors and authentication failures.
- **Type-safe responses**: Leverage TypeScript interfaces for API responses.

```ts
// Example pattern (implementation not shown in current files)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
```

API services use this configured instance to make type-safe requests throughout the application.

**Section sources**
- [package.json](file://package.json#L30-L35) - *Axios dependency*

## UI Component Library: Naive UI

**Naive UI** is used as the component library, providing a rich set of accessible, customizable UI components. It is integrated via direct imports and works alongside Tailwind CSS for styling.

The application uses Naive UI components for various interface elements, with styling customized through Tailwind classes and CSS variables. The component library provides accessible form controls, modals, and other interactive elements that follow modern design patterns.

Key integration points:
- **Icon components**: Uses Heroicons via `@heroicons/vue`.
- **Accessibility**: Built-in ARIA attributes and keyboard navigation.
- **Theming**: Customized through CSS variables and Tailwind configuration.
- **Responsive design**: Components adapt to different screen sizes.

```vue
<!-- Example from TopNavbar.vue -->
<Bars3Icon v-if="!navigationStore.isMobileMenuOpen" class="h-6 w-6" />
<XMarkIcon v-else class="h-6 w-6" />
```

This approach combines the robust functionality of Naive UI with the design flexibility of Tailwind CSS.

**Section sources**
- [TopNavbar.vue](file://src/components/common/TopNavbar.vue#L1-L130) - *Uses Heroicons*
- [package.json](file://package.json#L25-L26) - *Heroicons dependency*

## Development Tooling

The project includes a robust set of development tools to ensure code quality, consistency, and collaboration:

### ESLint
Configured via `eslint.config.ts`, it enforces coding standards using:
- `@typescript-eslint/eslint-plugin`: TypeScript rule enforcement.
- `eslint-plugin-vue`: Vue-specific rules.
- Custom rules: Disables `vue/multi-word-component-names` for flexibility.

```ts
// eslint.config.ts
export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    name: 'app/vue-rules',
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/component-api-style': ['error', ['script-setup']],
    },
  },
  // ... other configurations
]
```

### Prettier & Husky
- **Prettier**: Formats code consistently (`format` script).
- **Husky + lint-staged**: Runs ESLint and Prettier on staged files before commits, ensuring only clean code is committed.

### Type Checking
The `type-check` script runs `vue-tsc --noEmit`, performing a full type check across `.ts` and `.vue` files, catching type errors early.

### Testing
- **Vitest**: Unit testing framework configured in `vitest.config.ts`.
- **Coverage**: Integrated with `@vitest/coverage-v8` for code coverage reporting.
- **UI Testing**: `test:ui` script provides a browser interface for test development.

**Section sources**
- [eslint.config.ts](file://eslint.config.ts#L1-L73)
- [vitest.config.ts](file://vitest.config.ts#L1-L26)
- [package.json](file://package.json#L10-L20) - *Scripts configuration*

## Environment Configuration

The application supports multiple environments through Vite's environment variable system. Environment variables prefixed with `VITE_` are exposed to the client-side code.

Key configuration features:
- **Environment variables**: Defined in `.env` files or system environment.
- **Build modes**: Different configurations for development, staging, and production.
- **Type safety**: Environment variables are typed through `import.meta.env`.

```ts
// Example usage
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
```

The build system supports different modes through specific scripts:
```json
"scripts": {
  "build:dev": "vite build --mode development",
  "build:staging": "vite build --mode staging",
  "build:prod": "vite build --mode production"
}
```

This setup enables seamless switching between environments with appropriate API endpoints and settings.

**Section sources**
- [package.json](file://package.json#L10-L20) - *Build scripts*
- [vite.config.ts](file://vite.config.ts#L1-L48) - *Server configuration*

## Navigation Component Architecture

The navigation system has been redesigned to provide a responsive, user-centric experience with proper state management. The architecture follows Vue 3 best practices and leverages the Composition API for maximum reusability.

### TopNavbar.vue
The main navigation component that adapts to different screen sizes:
- **Desktop**: Horizontal navigation with user profile
- **Mobile**: Hamburger menu with slide-out navigation
- **Responsive**: Uses Tailwind's breakpoint system
- **State-driven**: Reacts to authentication and route changes

```vue
<template>
  <nav class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex justify-between items-center h-full">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <span class="text-xl font-bold text-blue-600 dark:text-blue-400"> 
              MayaWork
            </span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex space-x-8">
          <router-link
            v-for="item in visibleNavigationItems"
            :key="item.id"
            :to="item.route"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                   hover:text-gray-900 dark:hover:text-white rounded-md 
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :class="{ 
              'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': isActiveRoute(item.route) 
            }"
          >
            {{ item.label }}
          </router-link>
        </div>

        <!-- User Section -->
        <div class="flex items-center space-x-4">
          <UserProfileSection 
            v-if="userStore.isAuthenticated" 
            :user="userStore.currentUser" 
          />
          <template v-else>
            <router-link
              to="/login"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Войти
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 
                 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-100 
                 dark:hover:bg-gray-700 transition-colors"
          :aria-expanded="navigationStore.isMobileMenuOpen"
          @click="navigationStore.toggleMobileMenu"
        >
          <Bars3Icon v-if="!navigationStore.isMobileMenuOpen" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <MobileNavigationMenu
      :is-open="navigationStore.isMobileMenuOpen"
      :navigation-items="visibleNavigationItems"
      :user="userStore.currentUser"
      @close="navigationStore.closeMobileMenu"
    />
  </nav>
</template>
```

### MobileNavigationMenu.vue
Handles the mobile navigation experience with smooth transitions and proper accessibility:
- **Slide animation**: Uses Vue's transition system
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Event handling**: Closes on route change or explicit close

### Navigation Store Pattern
The `navigation.ts` store provides a centralized state management solution:
- **Single source of truth**: All navigation state is managed in one place
- **Reactive updates**: Components automatically update when state changes
- **Cross-component coordination**: Navbar and mobile menu stay in sync
- **Route awareness**: Tracks active route for visual feedback

This architecture ensures a consistent, responsive navigation experience across all devices and user states.

**Section sources**
- [TopNavbar.vue](file://src/components/common/TopNavbar.vue#L1-L130) - *Main navigation component*
- [MobileNavigationMenu.vue](file://src/components/common/MobileNavigationMenu.vue) - *Mobile navigation component*
- [navigation.ts](file://src/stores/navigation.ts#L1-L75) - *Navigation state management*
- [user.ts](file://src/stores/user.ts#L1-L31) - *Authentication state for conditional rendering*
- [UserProfileSection.vue](file://src/components/common/UserProfileSection.vue) - *User profile display*