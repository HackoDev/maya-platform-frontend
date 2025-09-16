# Neural Network Profile Schema

<cite>
**Referenced Files in This Document**   
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts) - *Updated in recent commit*
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue) - *Updated in recent commit*
- [ProfilePage.vue](file://src/pages/ProfilePage.vue) - *Added in recent commit*
- [ActionCard.vue](file://src/components/ui/ActionCard.vue) - *Added in recent commit*
</cite>

## Update Summary
**Changes Made**   
- Updated documentation to reflect the enhanced profile page with user action cards
- Added new section on Profile Page Enhancement with Action Cards
- Updated component hierarchy and interface details
- Added new file references and sources
- Translated all content to English as per language conversion rules

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Profile Page Enhancement with Action Cards](#profile-page-enhancement-with-action-cards)
10. [Conclusion](#conclusion)

## Introduction
The Neural Network Profile Schema is a comprehensive data structure designed for specialists in AI and neural network services. It enables professionals to create detailed profiles showcasing their expertise, skills, portfolio, services, and contact information. The schema supports a multi-block questionnaire interface with validation, progress tracking, and draft management. Built using Vue 3 and Pinia for state management, it follows a modular architecture with clear separation between data models, business logic, and UI components.

## Project Structure
The Neural Network Profile functionality is organized within the frontend application's component and type system. Key files are located in dedicated directories for types, stores, and components, following a feature-based organization pattern.

```mermaid
graph TB
subgraph "Types"
A[neural-network-profile.ts]
end
subgraph "Store"
B[neural-network-profile.ts]
end
subgraph "Components"
C[NeuralNetworkQuestionnaireForm.vue]
D[SpecializationsBlock.vue]
E[SuperpowerBlock.vue]
F[AbilitiesBlock.vue]
G[PortfolioBlock.vue]
H[ServicesBlock.vue]
I[ExperienceBlock.vue]
J[TestimonialsBlock.vue]
K[ContactsBlock.vue]
end
A --> B
A --> C
B --> C
C --> D
C --> E
C --> F
C --> G
C --> H
C --> I
C --> J
C --> K
style A fill:#4CAF50,stroke:#388E3C
style B fill:#2196F3,stroke:#1976D2
style C fill:#FF9800,stroke:#F57C00
style D fill:#9C27B0,stroke:#7B1FA2
style E fill:#9C27B0,stroke:#7B1FA2
style F fill:#9C27B0,stroke:#7B1FA2
style G fill:#9C27B0,stroke:#7B1FA2
style H fill:#9C27B0,stroke:#7B1FA2
style I fill:#9C27B0,stroke:#7B1FA2
style J fill:#9C27B0,stroke:#7B1FA2
style K fill:#9C27B0,stroke:#7B1FA2
```

**Diagram sources**
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts)
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts)
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue)

**Section sources**
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts)
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts)
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue)

## Core Components
The Neural Network Profile system consists of three core components: the data schema, the state store, and the questionnaire UI. The schema defines the complete structure of a specialist's profile, including eight distinct blocks of information. The Pinia store manages form state, validation, and persistence. The questionnaire component provides a step-by-step interface for completing the profile with progress tracking and navigation.

**Section sources**
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts#L1-L325)
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts#L1-L719)
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue#L1-L283)

## Architecture Overview
The Neural Network Profile follows a clean architecture pattern with clear separation between data models, business logic, and presentation. The system is built around a central schema that defines the complete profile structure. The Pinia store acts as the single source of truth, managing both the current profile data and form state. The questionnaire UI component orchestrates the user experience, providing navigation between blocks and handling user interactions.

```mermaid
graph TD
A[User Interface] --> B[NeuralNetworkQuestionnaireForm]
B --> C[Pinia Store]
C --> D[NeuralNetworkProfileSchema]
B --> E[Individual Block Components]
E --> C
C --> F[API Integration]
style A fill:#FFC107,stroke:#FFA000
style B fill:#2196F3,stroke:#1976D2
style C fill:#4CAF50,stroke:#388E3C
style D fill:#9C27B0,stroke:#7B1FA2
style E fill:#00BCD4,stroke:#00ACC1
style F fill:#FF5722,stroke:#F4511E
```

**Diagram sources**
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts)
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts)
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue)

## Detailed Component Analysis

### Data Schema Analysis
The Neural Network Profile Schema is a TypeScript interface that defines the complete structure of a specialist's profile. It consists of eight distinct blocks, each with specific data fields and validation rules.

```mermaid
classDiagram
class NeuralNetworkProfileSchema {
+string id
+string userId
+string profileType
+string version
+ProfileMetadata metadata
+SpecializationBlock specializations
+SuperpowerBlock superpower
+AbilitiesBlock abilities
+PortfolioBlock portfolio
+ServicesBlock services
+ExperienceBlock experience
+TestimonialsBlock testimonials
+ContactsBlock contacts
+string status
+boolean profileCompleted
+string createdAt
+string updatedAt
}
class ProfileMetadata {
+number completionPercentage
+string lastModifiedBlock
+ValidationError[] validationErrors
+boolean isDraft
+number submissionAttempts
+string[] moderationNotes
}
class ValidationError {
+string blockId
+string fieldId
+string errorMessage
+string errorType
}
class FileReference {
+string url
+string filename
+number size
+string mimeType
}
NeuralNetworkProfileSchema --> ProfileMetadata
NeuralNetworkProfileSchema --> ValidationError
PortfolioBlock --> PortfolioCase
TestimonialsBlock --> TestimonialEntry
TestimonialsBlock --> FileReference
class SpecializationBlock {
+string title
+string description
+SpecializationData data
+ValidationRules validation
}
class SuperpowerBlock {
+string title
+string description
+string placeholder
+SuperpowerData data
+ValidationRules validation
}
class AbilitiesBlock {
+string title
+string description
+AbilitiesData data
+ValidationRules validation
}
class PortfolioBlock {
+string title
+string description
+PortfolioCase[] data
+ValidationRules validation
}
class ServicesBlock {
+string title
+string description
+ServicesData data
+ValidationRules validation
}
class ExperienceBlock {
+string title
+string description
+ExperienceEntry[] data
+ValidationRules validation
}
class TestimonialsBlock {
+string title
+string description
+TestimonialsData data
+ValidationRules validation
}
class ContactsBlock {
+string title
+string description
+ContactsData data
+ValidationRules validation
}
class PortfolioCase {
+string id
+string title
+string description
+string type
+string|FileReference content
+string result
+string[] tools
+string createdAt
}
class ExperienceEntry {
+string id
+string client
+string task
+string[] tools
+string result
+string duration
+string year
}
class TestimonialEntry {
+string id
+string clientName
+string clientPosition
+string testimonialText
+number rating
+string projectType
+string date
}
class NeuralNetworkFormState {
+SpecializationData specializations
+string superpower
+AbilitiesData abilities
+PortfolioCase[] portfolio
+ServicesData services
+ExperienceEntry[] experience
+TestimonialsData testimonials
+ContactsData contacts
+number currentBlock
+Set~number~ completedBlocks
+Record~string, string[]~ validationErrors
+boolean isDirty
+boolean autoSaveEnabled
+string lastAutoSave
}
NeuralNetworkProfileSchema <|-- SpecializationBlock
NeuralNetworkProfileSchema <|-- SuperpowerBlock
NeuralNetworkProfileSchema <|-- AbilitiesBlock
NeuralNetworkProfileSchema <|-- PortfolioBlock
NeuralNetworkProfileSchema <|-- ServicesBlock
NeuralNetworkProfileSchema <|-- ExperienceBlock
NeuralNetworkProfileSchema <|-- TestimonialsBlock
NeuralNetworkProfileSchema <|-- ContactsBlock
```

**Diagram sources**
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts#L1-L325)

**Section sources**
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts#L1-L325)

### State Management Analysis
The Neural Network Profile Store uses Pinia for state management, providing a reactive store that manages both the current profile data and form state. The store handles initialization, form updates, validation, and persistence operations.

```mermaid
sequenceDiagram
participant UI as "Questionnaire UI"
participant Store as "Pinia Store"
participant API as "Backend API"
UI->>Store : initializeForm()
Store->>Store : Load existing profile or create mock
Store->>Store : Populate form state
Store-->>UI : Form ready
loop User Interaction
UI->>Store : updateFormField(blockId, fieldId, value)
Store->>Store : Update form state
Store->>Store : Mark form as dirty
Store->>Store : Trigger debounced auto-save
end
UI->>Store : validateBlock(blockId)
Store->>Store : Run block-specific validation
Store-->>UI : Return validation errors
UI->>Store : saveDraft()
Store->>API : Save draft to backend
API-->>Store : Success response
Store->>Store : Update lastAutoSave timestamp
UI->>Store : submitProfile()
Store->>Store : validateCompleteForm()
alt Form is valid
Store->>API : Submit profile for review
API-->>Store : Success response
Store-->>UI : Submission successful
else Form has errors
Store-->>UI : Throw validation error
end
```

**Diagram sources**
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts#L1-L719)

**Section sources**
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts#L1-L719)

### User Interface Analysis
The Neural Network Questionnaire Form provides a step-by-step interface for completing the profile. It features progress tracking, block navigation, validation feedback, and auto-save functionality. The form is divided into eight blocks, each focusing on a specific aspect of the specialist's profile.

```mermaid
flowchart TD
A[Page Load] --> B[Initialize Form]
B --> C{Existing Profile?}
C --> |Yes| D[Load Profile Data]
C --> |No| E[Create Empty Form]
D --> F[Set Current Block]
E --> F
F --> G[Display Progress Header]
G --> H[Render Current Block]
H --> I[Handle User Input]
I --> J[Update Form Field]
J --> K[Validate Block]
K --> L{Valid?}
L --> |Yes| M[Mark Block as Complete]
L --> |No| N[Show Validation Errors]
M --> O[Auto-save Draft]
N --> O
O --> P{Next/Previous Clicked?}
P --> |Yes| H
P --> |No| Q[Wait for Input]
Q --> I
R[Submit Clicked] --> S[Validate All Blocks]
S --> T{All Valid?}
T --> |Yes| U[Submit to Backend]
T --> |No| V[Show All Errors]
U --> W[Show Success Message]
V --> X[Focus on First Error]
```

**Diagram sources**
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue#L1-L283)

**Section sources**
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue#L1-L283)

## Dependency Analysis
The Neural Network Profile system has a clear dependency hierarchy. The questionnaire UI component depends on both the data schema and the Pinia store. The store depends on the schema for type definitions. Individual block components depend on the store for state management and the schema for data structure.

```mermaid
graph TD
A[NeuralNetworkQuestionnaireForm.vue] --> B[neural-network-profile.ts Types]
A --> C[useNeuralNetworkProfileStore]
C --> B
A --> D[SpecializationsBlock.vue]
A --> E[SuperpowerBlock.vue]
A --> F[AbilitiesBlock.vue]
A --> G[PortfolioBlock.vue]
A --> H[ServicesBlock.vue]
A --> I[ExperienceBlock.vue]
A --> J[TestimonialsBlock.vue]
A --> K[ContactsBlock.vue]
D --> C
E --> C
F --> C
G --> C
H --> C
I --> C
J --> C
K --> C
style A fill:#2196F3,stroke:#1976D2
style B fill:#9C27B0,stroke:#7B1FA2
style C fill:#4CAF50,stroke:#388E3C
style D fill:#00BCD4,stroke:#00ACC1
style E fill:#00BCD4,stroke:#00ACC1
style F fill:#00BCD4,stroke:#00ACC1
style G fill:#00BCD4,stroke:#00ACC1
style H fill:#00BCD4,stroke:#00ACC1
style I fill:#00BCD4,stroke:#00ACC1
style J fill:#00BCD4,stroke:#00ACC1
style K fill:#00BCD4,stroke:#00ACC1
```

**Diagram sources**
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue)
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts)
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts)

**Section sources**
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue)
- [neural-network-profile.ts](file://src/types/neural-network-profile.ts)
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts)

## Performance Considerations
The Neural Network Profile system implements several performance optimizations. The auto-save functionality uses debouncing to prevent excessive API calls, saving only after 2 seconds of user inactivity. The form validation is performed at the block level, allowing for incremental validation rather than validating the entire form on every change. The use of Pinia's reactive state management ensures efficient updates to the UI when form data changes. The component structure follows Vue's best practices for reactivity, with proper use of refs and reactive properties.

## Troubleshooting Guide
Common issues with the Neural Network Profile system and their solutions:

**Form not saving changes**: Ensure the `isDirty` flag is being set correctly when fields are updated. Check that the `updateFormField` action is properly called from all block components.

**Validation errors not clearing**: Verify that validation errors are being removed from the `validationErrors` object when fields are updated. The `updateFormField` action should delete the corresponding error entry.

**Progress percentage not updating**: Confirm that the `completedBlocks` Set is being updated correctly in the `validateBlock` action. The `getCompletionPercentage` getter calculates based on the size of this Set.

**Auto-save not working**: Check that the `debouncedAutoSave` function is being called from `updateFormField` and that the timeout is properly cleared and reset. Ensure `autoSaveEnabled` is true.

**Navigation issues between blocks**: Verify that `currentBlock` is being updated correctly in the `previousBlock` and `nextBlock` methods. The `nextBlock` method should validate the current block before proceeding.

**Section sources**
- [neural-network-profile.ts](file://src/stores/neural-network-profile.ts#L1-L719)
- [NeuralNetworkQuestionnaireForm.vue](file://src/components/profile/NeuralNetworkQuestionnaireForm.vue#L1-L283)

## Profile Page Enhancement with Action Cards
The profile page has been enhanced with a new user interface that includes action cards for improved navigation and user experience. This enhancement provides users with clear pathways to access different profile-related functionalities.

```mermaid
graph TB
ProfilePage[ProfilePage.vue]
subgraph "Current Components"
UserInfo[User Information Display]
PageHeader[Page Header with Icon]
end
subgraph "New Components"
ActionSection[Profile Actions Section]
QuestionnaireCard[Questionnaire Access Card]
PasswordCard[Password Change Card]
LogoutCard[Logout Action Card]
end
ProfilePage --> UserInfo
ProfilePage --> PageHeader
ProfilePage --> ActionSection
ActionSection --> QuestionnaireCard
ActionSection --> PasswordCard
ActionSection --> LogoutCard
QuestionnaireCard --> Router[Vue Router]
PasswordCard --> Router
LogoutCard --> UserStore[User Store]
classDef current fill:#e1f5fe
classDef new fill:#f3e5f5
classDef external fill:#fff3e0
class UserInfo,PageHeader current
class ActionSection,QuestionnaireCard,PasswordCard,LogoutCard new
class Router,UserStore external
```

**Diagram sources**
- [ProfilePage.vue](file://src/pages/ProfilePage.vue#L1-L100)
- [ActionCard.vue](file://src/components/ui/ActionCard.vue#L1-L50)

The enhanced profile page includes three main action cards:
- **Questionnaire Access Card**: Provides direct access to the neural network specialist questionnaire
- **Password Change Card**: Allows users to change their account password
- **Logout Action Card**: Enables users to log out of their current session

The ActionCard component interface includes the following properties:
- **title**: String - The title displayed on the card
- **description**: String - A brief description of the action
- **icon**: String - The icon to display on the card
- **route**: String (optional) - The route to navigate to when the card is clicked
- **color**: 'purple' | 'green' | 'red' - The color theme of the card
- **isAction**: Boolean (optional) - Indicates if the card triggers an action rather than navigation

**Section sources**
- [ProfilePage.vue](file://src/pages/ProfilePage.vue#L1-L100)
- [ActionCard.vue](file://src/components/ui/ActionCard.vue#L1-L50)

## Conclusion
The Neural Network Profile Schema provides a comprehensive framework for AI specialists to create detailed professional profiles. Its modular design with eight distinct blocks allows for structured data collection while maintaining user-friendly navigation. The implementation leverages Vue 3's reactivity system and Pinia for efficient state management. The schema's validation rules ensure data quality, while the auto-save and progress tracking features enhance the user experience. This system effectively balances comprehensive data collection with an intuitive interface, making it easy for specialists to showcase their expertise in the AI field.