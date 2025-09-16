# Local State Management

<cite>
**Referenced Files in This Document**   
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Local State Management in Modal Components](#local-state-management-in-modal-components)
3. [Form State Initialization and Handling](#form-state-initialization-and-handling)
4. [Validation and Submission Workflow](#validation-and-submission-workflow)
5. [Ephemeral UI State vs Persistent Application State](#ephemeral-ui-state-vs-persistent-application-state)
6. [Best Practices and Common Pitfalls](#best-practices-and-common-pitfalls)

## Introduction
This document provides a comprehensive analysis of local state management within Vue components in the maya-platform-frontend application. The focus is on how reactive primitives such as `ref` and `reactive` are utilized to manage internal form state, dialog visibility, and user input fields—particularly in modal-like components. Although specific modal components like UserModal.vue and CustomerModal.vue could not be located in the current codebase, the patterns observed in existing components such as LoginPage.vue provide valuable insight into the implementation strategies used throughout the project.

The `<script setup>` syntax is leveraged extensively for declaring reactive variables and methods that handle form interactions, validation, and API integration. This document explores these patterns in detail, highlighting how ephemeral UI state is separated from persistent application state managed via Pinia stores.

## Local State Management in Modal Components
In Vue 3's Composition API, local component state is typically managed using `ref` and `reactive`. These functions enable reactivity for primitive values and objects respectively, allowing the UI to automatically update when state changes.

Although dedicated modal components (e.g., UserModal.vue, CustomerModal.vue) were not found in the current repository structure, the **LoginPage.vue** component exemplifies the same principles used in modal forms—particularly in managing form inputs, loading states, and submission logic.

### Key Reactive Constructs
- **`ref`**: Used to create reactive references for primitives (e.g., strings, booleans) or objects.
- **`reactive`**: Creates a deeply reactive object; useful for grouping related state.
- **`computed`**: Derives state based on other reactive data.
- **`<script setup>`**: Enables a concise, composable syntax for defining component logic.

In LoginPage.vue, the following local state variables are declared:

```ts
const loginForm = ref({
  email: '',
  password: ''
})

const loading = ref(false)
```

Here:
- `loginForm` holds the user input fields and is updated via `v-model`.
- `loading` tracks the submission state to disable the button during API calls.

These variables represent **ephemeral UI state**, which exists only during the component’s lifecycle and does not persist beyond it.

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L55-L65)

## Form State Initialization and Handling
Form state in Vue components is initialized directly within the `<script setup>` block using `ref`. This ensures that each instance of the component has its own isolated state.

### Example: Form Initialization in LoginPage.vue
```ts
const loginForm = ref({
  email: '',
  password: ''
})
```

This initializes a reactive object containing two form fields. The template binds these using `v-model:value="loginForm.value.email"` (or simply `v-model` with proper setup).

When the form is submitted:
```ts
const handleLogin = async () => {
  if (!isFormValid.value) return
  loading.value = true

  try {
    await authStore.login(loginForm.value)
    message.success('Login successful')
    router.push('/resumes')
  } catch (error: any) {
    message.error(error.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
```

#### Key Steps:
1. **Validation Check**: Uses a computed property `isFormValid` to determine if submission should proceed.
2. **Loading State**: Sets `loading.value = true` to prevent duplicate submissions.
3. **API Call**: Delegates authentication logic to `authStore.login()`, which manages persistent state.
4. **Reset State**: Finally block ensures `loading` is reset regardless of outcome.

This pattern would be mirrored in modal components like UserModal.vue or CustomerModal.vue, where form data is reset upon closing the modal.

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L75-L102)

## Validation and Submission Workflow
Validation in Vue components is commonly implemented using computed properties that evaluate form state in real time.

### Computed Validation Example
```ts
const isFormValid = computed(() => {
  return loginForm.value.email.length > 0 && loginForm.value.password.length > 0
})
```

This computed property reacts to changes in `loginForm`, enabling or disabling the submit button dynamically:
```html
<NButton :disabled="!isFormValid" :loading="loading">Войти</NButton>
```

For more complex forms (e.g., in modals), additional validation rules could include:
- Email format checking
- Password strength
- Required field enforcement
- Async validation (e.g., checking username availability)

Before submission, validation should always occur to prevent unnecessary API calls. In modal contexts, this might also involve showing inline error messages or highlighting invalid fields.

### Resetting State on Modal Closure
While not present in the current codebase, a typical modal implementation would include a method to reset form state when the modal is closed:

```ts
const resetForm = () => {
  loginForm.value = {
    email: '',
    password: ''
  }
  // Clear any local errors
  formError.value = null
}
```

This function would be called:
- On modal close (via `@close` or `@update:show`)
- After successful submission
- On cancel button click

This ensures no residual data remains for the next time the modal is opened.

## Ephemeral UI State vs Persistent Application State
A critical architectural principle in Vue applications is the separation between **local UI state** and **global application state**.

| **Local UI State** | **Global Application State** |
|--------------------|-------------------------------|
| Managed with `ref`, `reactive` | Managed with Pinia stores |
| Short-lived, component-scoped | Long-lived, shared across components |
| Examples: form inputs, loading indicators | Examples: user session, cached data, preferences |

### Integration with Pinia Stores
In LoginPage.vue, the `authStore` (from Pinia) handles persistent authentication state:

```ts
const authStore = useAuthStore()
await authStore.login(loginForm.value)
```

The store manages:
- Authentication tokens (`access_token`, `refresh_token`)
- Current user data
- Session persistence (via `localStorage`)
- API communication

Meanwhile, the component retains only what’s necessary for rendering and interaction:
- Input values
- Loading state
- Error messages (temporary)

This clean separation ensures scalability and maintainability.

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L55-L102)
- [authStore.ts](file://src/root/auth/store/authStore.ts#L0-L154)

## Best Practices and Common Pitfalls

### ✅ Best Practices
1. **Use `ref` for primitives and small objects**
2. **Group related state with `reactive` when appropriate**
3. **Leverage `computed` for derived state (e.g., validation)**
4. **Reset local state on component teardown or modal close**
5. **Keep business logic in Pinia stores, not components**
6. **Use `try...catch...finally` blocks to ensure state cleanup**

### ❌ Common Pitfalls
1. **Memory Leaks from Uncleaned Refs**
   - Avoid storing large objects or DOM references in `ref` without cleanup.
   - Use `onUnmounted` hook if necessary:
     ```ts
     import { onUnmounted } from 'vue'
     onUnmounted(() => {
       // Clean up timers, listeners, etc.
     })
     ```

2. **Overusing `reactive` for Simple State**
   - Prefer `ref` unless you need deep reactivity on nested objects.

3. **Mutating Props Directly**
   - Never mutate props passed to a modal; use events (`emit`) or stores to communicate changes.

4. **Not Resetting Form State**
   - Always reset form data when closing a modal to avoid data leakage between uses.

5. **Mixing UI and Business Logic**
   - Keep API calls and state mutations in composable functions or stores, not directly in component methods.

### Managing Complex Form State
For forms with nested objects (e.g., user address, roles, permissions), consider:
- Using `reactive` for the main form object
- Breaking forms into sub-components with `v-model` or props/events
- Creating custom composables (e.g., `useUserForm()`) to encapsulate logic

Example:
```ts
const userForm = reactive({
  personal: { name: '', email: '' },
  address: { city: '', street: '' },
  roles: [] as string[]
})
```

Such patterns enhance reusability and testability.

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L55-L102)
- [authStore.ts](file://src/root/auth/store/authStore.ts#L0-L154)