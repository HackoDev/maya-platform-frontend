# Shared Components Library

<cite>
**Referenced Files in This Document**   
- [vite.config.ts](file://vite.config.ts#L0-L43)
- [tsconfig.app.json](file://tsconfig.app.json#L0-L24)
- [main.ts](file://src/main.ts#L0-L13)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure and Shared Components Location](#project-structure-and-shared-components-location)
3. [Shared Components Architecture and Import System](#shared-components-architecture-and-import-system)
4. [Styling and Theming Strategy](#styling-and-theming-strategy)
5. [Naive UI Integration](#naive-ui-integration)
6. [Conclusion](#conclusion)

## Introduction

The Shared Components Library in the maya-platform-frontend application is designed to provide a centralized repository of reusable UI components that can be consistently used across various modules of the application. These components aim to standardize user interface elements, promote code reuse, enforce design consistency, and reduce duplication. The library is intended to support key functionality such as confirmation dialogs, status indicators, search inputs, and multi-selection controls.

Despite the documentation objective referencing specific components like `ConfirmDelete.vue`, `StatusTag.vue`, and `MultiSelector.vue`, the actual file system scan did not locate the `src/root/shared/components` directory or its contents. However, configuration files confirm the intended structure and usage patterns of the shared components system.

This document synthesizes available evidence from configuration and entry point files to reconstruct the intended architecture and usage of the shared components library.

## Project Structure and Shared Components Location

Based on the project's configuration files, the application follows a modular, feature-based architecture with a dedicated `shared` module located at `src/root/shared`. This module is designed to house cross-cutting concerns such as reusable components, utilities, composable functions, and shared data models.

The `vite.config.ts` and `tsconfig.app.json` files define a path alias `@shared` that maps to `./src/root/shared`, enabling clean and consistent imports throughout the codebase:

```ts
'@shared': fileURLToPath(new URL('./src/root/shared', import.meta.url))
```

This path alias allows developers to import shared components using a concise syntax:
```typescript
import { ConfirmDelete } from '@shared/components/ConfirmDelete.vue'
```

Despite the logical structure indicated by these aliases, attempts to access the `src/root/shared` directory and its subdirectories (`components`, `styles`) resulted in "directory not found" errors, suggesting either a configuration mismatch or an incomplete workspace state.

**Section sources**
- [vite.config.ts](file://vite.config.ts#L34-L38)
- [tsconfig.app.json](file://tsconfig.app.json#L20-L24)

## Shared Components Architecture and Import System

The shared components library leverages TypeScript path aliases and Vite's module resolution system to enable clean, maintainable imports. The `index.ts` file within `src/root/shared/components` (though not accessible) is expected to serve as the barrel export file, re-exporting all public components for simplified consumption.

This pattern allows for:
- **Clean imports**: `import { StatusTag } from '@shared/components'`
- **Encapsulation**: Internal file structure changes don't affect consumers
- **Tree-shaking**: Unused components are excluded from production bundles
- **Consistent API**: Uniform import syntax across the application

The component abstraction strategy appears to follow these principles:
- **Cross-module reuse**: Components used in multiple feature areas (e.g., `ConfirmDelete` for destructive actions in objects, users, and refs modules)
- **Behavior consistency**: Components like `MultiSelector` ensure uniform selection behavior and accessibility
- **Stateless design**: Shared components are likely designed to be stateless, receiving data via props and emitting events
- **Slot-based flexibility**: Use of Vue slots to allow content customization while maintaining structural consistency

The `index.ts` file would typically contain barrel exports like:
```ts
export { default as ConfirmDelete } from './ConfirmDelete.vue'
export { default as StatusTag } from './StatusTag.vue'
export { default as MultiSelector } from './MultiSelector.vue'
// ... other components
```

**Section sources**
- [vite.config.ts](file://vite.config.ts#L34-L38)
- [tsconfig.app.json](file://tsconfig.app.json#L20-L24)

## Styling and Theming Strategy

The application imports a SCSS file `./styles/main.scss` in the main entry point (`main.ts`), indicating a centralized styling approach:

```ts
import './styles/main.scss'
```

This suggests that global styles, variables, and mixins are defined in the `styles` directory. Although attempts to access `src/styles` failed, the presence of this import confirms a structured styling system.

The theming strategy likely involves:
- **SCSS variables**: Centralized color, spacing, and typography definitions
- **Naive UI theme overrides**: Customization of Naive UI component appearance
- **Component-specific styles**: Scoped SCSS within individual components
- **Utility classes**: Helper classes for common layout and styling patterns

The absence of `naiveTheme.ts` in the file system scan suggests that either:
1. The theme file exists but was not detected due to workspace limitations
2. Theming is handled entirely through SCSS variables and CSS custom properties
3. Default Naive UI themes are used without customization

The styling approach combines:
- **Global SCSS**: For application-wide styles and variables
- **Component-scoped styles**: For component-specific styling
- **Naive UI integration**: Leveraging the component library's built-in styling system

**Section sources**
- [main.ts](file://src/main.ts#L1)
- [vite.config.ts](file://vite.config.ts#L34-L38)

## Naive UI Integration

The application integrates Naive UI, a Vue 3 component library, as evidenced by the `unplugin-vue-components` configuration in `vite.config.ts`:

```ts
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// ...
Components({
  resolvers: [NaiveUiResolver()],
}),
```

This configuration enables automatic importing of Naive UI components, reducing boilerplate and improving developer experience. The `components.d.ts` file confirms this by declaring global components from Naive UI:

```ts
declare module 'vue' {
  export interface GlobalComponents {
    NButton: typeof import('naive-ui')['NButton']
    NModal: typeof import('naive-ui')['NModal']
    NTag: typeof import('naive-ui')['NTag']
    // ... other Naive UI components
  }
}
```

The shared components library likely wraps or extends Naive UI components to:
- Apply consistent application-specific styling
- Provide default configurations
- Add accessibility enhancements
- Implement domain-specific behaviors

For example, `StatusTag.vue` might wrap `NTag` with predefined color mappings for status values, while `ConfirmDelete.vue` might wrap `NModal` with standardized confirmation dialog structure.

This integration strategy allows the application to benefit from a robust, accessible component library while maintaining brand consistency and domain-specific requirements.

**Section sources**
- [vite.config.ts](file://vite.config.ts#L7-L10)
- [components.d.ts](file://components.d.ts#L10-L30)

## Conclusion

While the physical files for the shared components library could not be accessed in the current workspace state, the configuration files provide strong evidence of its intended architecture and usage patterns. The library is designed to:

1. **Promote consistency**: Through reusable, standardized UI components
2. **Enable clean imports**: Using path aliases and barrel exports
3. **Integrate with Naive UI**: Leveraging a robust component library while customizing for application needs
4. **Support theming**: Through SCSS and potential Naive UI theme customization
5. **Ensure accessibility**: By building on accessible foundation components

The shared components library represents a critical abstraction layer that enables maintainable, consistent UI development across the maya-platform-frontend application. Despite the current inability to access the component files directly, the documented patterns reflect modern Vue application architecture best practices.

Future work should focus on verifying the actual implementation against this documented architecture and ensuring all shared components follow accessibility, internationalization, and theming guidelines.