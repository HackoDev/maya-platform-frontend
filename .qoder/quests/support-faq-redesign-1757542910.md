# Support FAQ Section Redesign

## Overview

This design document outlines the redesign of the Frequently Asked Questions (FAQ) section on the Support page to create a more compact and streamlined user experience. The redesign focuses on simplifying the interface by removing complex filtering and feedback mechanisms while maintaining core functionality.

## Technology Stack & Dependencies

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite 7.0.6
- **Styling**: Tailwind CSS utility-first framework
- **State Management**: Pinia 3.0.3
- **Icons**: Heroicons (24/outline)
- **TypeScript**: ~5.8.0 for type safety

## Component Architecture

### Current Architecture Analysis

The existing FAQ implementation consists of two main components:

- `FAQSection.vue` - Container component with search, filtering, and FAQ list management
- `FAQItem.vue` - Individual FAQ item with expandable content, voting, and metadata

### Redesigned Component Structure

``mermaid
graph TD
A[SupportPage.vue] --> B[SimpleFAQSection.vue]
B --> C[CompactFAQItem.vue]
B --> D[LoadingState]
B --> E[ErrorState]
C --> F[ExpandableContent]

    style A fill:#4CAF50,stroke:#388E3C
    style B fill:#2196F3,stroke:#1976D2
    style C fill:#FF9800,stroke:#F57C00

````

### Component Definitions

#### SimpleFAQSection.vue
**Purpose**: Simplified container component for FAQ management without search and filtering capabilities

**Props Interface**:
```typescript
interface Props {
  faqs: FAQ[]
  loading: boolean
  error?: string | null
}
````

**Emits Interface**:

```typescript
interface Emits {
  (e: 'toggle-faq', faqId: string): void
  (e: 'refresh'): void
}
```

**Key Features**:

- Clean header with icon and title
- Direct FAQ list rendering without filters
- Loading and error state handling
- Responsive layout with improved spacing

#### CompactFAQItem.vue

**Purpose**: Streamlined FAQ item component with minimal visual elements

**Props Interface**:

```typescript
interface Props {
  faq: FAQ
  expanded: boolean
}
```

**Emits Interface**:
``typescript
interface Emits {
(e: 'toggle'): void
}

````

**Key Features**:
- Question title with expand/collapse functionality
- Clean answer content display
- Smooth expand/collapse animations
- Keyboard accessibility support

### Data Model Updates

**Simplified FAQ Interface**:
```typescript
interface SimplifiedFAQ {
  id: string
  question: string
  answer: string
  priority: number
  isPopular?: boolean  // Optional, for internal sorting only
}
````

**Removed Properties**:

- `category` - No longer needed without filtering
- `tags` - Removed as per requirements
- `updatedAt` - Removed as per requirements
- `helpfulVotes` - Removed with voting functionality
- `notHelpfulVotes` - Removed with voting functionality

## Visual Design Specifications

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  📋 FAQ Section Header                                  │
│  "Часто задаваемые вопросы"                            │
│  "Найдите ответы на популярные вопросы"               │
├─────────────────────────────────────────────────────────┤
│  ❓ Question 1                                     ⌄   │
├─────────────────────────────────────────────────────────┤
│     Answer content when expanded                        │
├─────────────────────────────────────────────────────────┤
│  ❓ Question 2                                     ⌄   │
├─────────────────────────────────────────────────────────┤
│  ❓ Question 3                                     ⌄   │
└─────────────────────────────────────────────────────────┘
```

### Spacing and Typography

**Container Spacing**:

- Section padding: `p-6` (24px)
- FAQ item spacing: `space-y-2` (8px between items)
- Internal item padding: `px-4 py-3` (16px horizontal, 12px vertical)

**Typography Scale**:

- Section title: `text-2xl font-bold` (24px, 700 weight)
- Section description: `text-sm text-gray-600` (14px, gray-600)
- Question text: `text-base font-medium` (16px, 500 weight)
- Answer text: `text-sm leading-relaxed` (14px, relaxed line height)

### Color Scheme

**Light Mode Colors**:

- Background: `bg-white` with `border-gray-200`
- Text primary: `text-gray-900`
- Text secondary: `text-gray-600`
- Hover state: `hover:bg-gray-50`

**Dark Mode Colors**:

- Background: `dark:bg-gray-800` with `dark:border-gray-700`
- Text primary: `dark:text-white`
- Text secondary: `dark:text-gray-400`
- Hover state: `dark:hover:bg-gray-750`

## Interaction Design

### FAQ Item Interactions

**Expand/Collapse Behavior**:

1. Click anywhere on question area to toggle
2. Keyboard support: Enter and Space keys
3. Visual feedback with chevron rotation
4. Smooth height transition animation

**Animation Specifications**:

```css
.faq-answer-enter-active,
.faq-answer-leave-active {
  transition: height 0.3s ease-in-out;
}
```

**Focus Management**:

- Clear focus rings for keyboard navigation
- ARIA attributes for screen readers
- Proper heading hierarchy (h3 for questions)

### Responsive Behavior

**Breakpoint Adaptations**:

- Mobile (< 768px): Single column layout, reduced padding
- Tablet (768px - 1024px): Maintained spacing with adjusted margins
- Desktop (> 1024px): Full spacing and optimal line length

## State Management Integration

### FAQ State Structure

```typescript
// In useSupportData composable
interface FAQState {
  faqs: SimplifiedFAQ[]
  expandedFAQs: Set<string>
  loading: boolean
  error: string | null
}

// Simplified actions
const actions = {
  toggleFAQ: (faqId: string) => void
  refreshFAQs: () => Promise<void>
  clearExpandedState: () => void
}
```

### Removed State Management

**Eliminated Features**:

- Search query state and filtering logic
- Category selection state
- Popular filter toggle state
- Voting feedback state and API calls
- Complex filtering computed properties

## Implementation Strategy

### Phase 1: Component Simplification

1. Create `SimpleFAQSection.vue` based on existing `FAQSection.vue`
2. Remove search input and category selector elements
3. Remove quick filter buttons and related state
4. Simplify computed properties for direct FAQ rendering

### Phase 2: FAQ Item Redesign

1. Create `CompactFAQItem.vue` based on existing `FAQItem.vue`
2. Remove category tags and popular badges
3. Remove voting buttons and helpful feedback section
4. Remove updated date display
5. Maintain expand/collapse functionality and animations

### Phase 3: Integration and Testing

1. Update `SupportPage.vue` to use new components
2. Update type definitions to remove unused properties
3. Test responsive behavior across devices
4. Verify accessibility compliance
5. Update unit tests to match new component structure

## Performance Considerations

### Optimization Benefits

**Reduced Bundle Size**:

- Fewer DOM elements per FAQ item
- Simplified component logic reduces JavaScript execution
- Removed unused imports and dependencies

**Improved Rendering Performance**:

- Lighter virtual DOM tree structure
- Faster re-renders due to simplified reactive state
- Reduced memory footprint from eliminated state tracking

**Enhanced User Experience**:

- Faster initial page load
- Smoother interactions with reduced complexity
- Better focus management without competing UI elements

## Accessibility Compliance

### ARIA Implementation

**Required Attributes**:

- `aria-expanded` on FAQ question buttons
- `aria-controls` linking questions to answers
- `role="region"` on expanded answer content
- Proper heading hierarchy with `h3` elements

**Keyboard Navigation**:

- Tab order through FAQ questions
- Enter/Space key activation for expand/collapse
- Focus management during state changes

**Screen Reader Support**:

- Descriptive `aria-label` attributes
- Clear content structure without visual-only information
- Semantic HTML elements for proper content relationships

## Testing Strategy

### Unit Testing Scope

**SimpleFAQSection.vue Tests**:

- FAQ list rendering with different data sets
- Loading state display
- Error state handling and retry functionality
- Event emission for FAQ toggle and refresh actions

**CompactFAQItem.vue Tests**:

- Question and answer content rendering
- Expand/collapse state management
- Animation behavior verification
- Keyboard interaction testing

### Integration Testing

**Component Integration**:

- FAQ data flow from parent to child components
- State synchronization between components
- Error boundary behavior with invalid data

### Visual Regression Testing

**Screenshot Comparisons**:

- FAQ section in collapsed state
- FAQ section with multiple expanded items
- Responsive behavior across breakpoints
- Dark mode appearance verification
