# Specialist Profile API Service

<cite>
**Referenced Files in This Document**   
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction

The Specialist Profile API Service is a frontend implementation responsible for retrieving, aggregating, and displaying comprehensive specialist profile information in the MayaWork. This service integrates data from multiple sources to provide a unified view of specialist profiles, combining basic search data with detailed neural network profile information. The service supports both direct profile viewing and modal-based interactions, with robust error handling and state management.

## Project Structure

The Specialist Profile API Service is organized within the frontend repository using a modular architecture that separates concerns across services, stores, types, and components. The key directories involved in this service are:

- `src/services`: Contains the core business logic and API service implementation
- `src/stores`: Manages application state using Pinia
- `src/types`: Defines TypeScript interfaces and types for type safety
- `src/pages`: Contains the main page component that renders the profile view
- `src/components/profile`: Houses reusable UI components for different sections of the profile

```mermaid
graph TB
subgraph "Frontend Layers"
S[Service Layer] --> T[Type Definitions]
ST[Store Layer] --> S
ST --> T
P[Page Component] --> ST
C[Profile Components] --> ST
end
S --> |Provides data| ST
ST --> |Provides state| P
ST --> |Provides data| C
P --> |Renders| C
style S fill:#4B5563,stroke:#374151
style ST fill:#6B7280,stroke:#4B5563
style P fill:#10B981,stroke:#059669
style C fill:#3B82F6,stroke:#2563EB
style T fill:#F59E0B,stroke:#D97706
```

**Diagram sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue)

**Section sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue)

## Core Components

The Specialist Profile API Service consists of four main components that work together to deliver profile data to the user interface:

1. **SpecialistProfileViewService**: The core service class that handles data retrieval and aggregation
2. **useSpecialistProfileViewStore**: The Pinia store that manages application state
3. **SpecialistProfileViewPage**: The main page component that orchestrates the UI
4. **Profile Section Components**: Reusable components for different sections of the profile

The service follows a clean architecture pattern, with clear separation between data access, state management, and presentation layers. The service implementation uses TypeScript interfaces to ensure type safety throughout the application.

**Section sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue)

## Architecture Overview

The Specialist Profile API Service follows a layered architecture that separates concerns and promotes reusability. The service retrieves data from multiple sources, transforms it into a unified format, and makes it available to the UI components through a centralized store.

```mermaid
sequenceDiagram
participant UI as "Profile Page"
participant Store as "Pinia Store"
participant Service as "Profile Service"
participant API as "Backend API"
UI->>Store : loadProfile(id)
Store->>Service : getProfileById(id)
Service->>API : getBasicProfile(id)
Service->>API : getDetailedProfile(id)
API-->>Service : Basic Profile Data
API-->>Service : Detailed Profile Data
Service->>Service : Transform Data
Service-->>Store : Combined Profile Data
Store->>Store : Update State
Store-->>UI : Profile Loaded
UI->>UI : Render Profile Components
Note over Service,Store : Data transformation combines<br/>basic and detailed profiles
Note over Store,UI : Reactive updates via Pinia store
```

**Diagram sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue)

## Detailed Component Analysis

### Specialist Profile View Service Analysis

The SpecialistProfileViewService is the core business logic component responsible for retrieving and aggregating specialist profile data from multiple sources. It implements the SpecialistProfileViewAPI interface and provides methods for fetching both basic and detailed profile information.

#### Service Implementation
```mermaid
classDiagram
class SpecialistProfileViewService {
+mockDetailedProfiles : Record~string, NeuralNetworkProfileSchema~
+getBasicProfile(id : string) : Promise~SpecialistProfile~
+getDetailedProfile(id : string) : Promise~NeuralNetworkProfileSchema~
+getProfileById(id : string) : Promise~ProfileViewData~
-extractSpecializations(profile : NeuralNetworkProfileSchema) : string[]
-extractAbilities(profile : NeuralNetworkProfileSchema) : string[]
}
class SpecialistProfileViewAPI {
<<interface>>
+getProfileById(id : string) : Promise~ProfileViewData~
+getBasicProfile(id : string) : Promise~SpecialistProfile~
+getDetailedProfile(id : string) : Promise~NeuralNetworkProfileSchema~
}
SpecialistProfileViewService ..|> SpecialistProfileViewAPI
class ProfileViewData {
+basicInfo : object
+detailedInfo : object
+metadata : object
}
class NeuralNetworkProfileSchema {
+id : string
+userId : string
+profileType : string
+version : string
+metadata : object
+specializations : object
+superpower : object
+abilities : object
+portfolio : object
+services : object
+experience : object
+testimonials : object
+contacts : object
+status : string
+profileCompleted : boolean
+createdAt : string
+updatedAt : string
}
SpecialistProfileViewService --> ProfileViewData : "returns"
SpecialistProfileViewService --> NeuralNetworkProfileSchema : "uses"
SpecialistProfileViewService --> SpecialistProfile : "uses"
```

**Diagram sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts)

**Section sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts#L1-L470)

### State Management Store Analysis

The useSpecialistProfileViewStore is a Pinia store that manages the application state for the specialist profile view. It provides a reactive interface for components to access profile data and perform actions.

#### Store Implementation
```mermaid
classDiagram
class useSpecialistProfileViewStore {
+currentProfile : ref~ProfileViewData | null~
+isLoading : ref~boolean~
+error : ref~string | null~
+isModalOpen : ref~boolean~
+isProfileLoaded : computed~boolean~
+profileSections : computed~ProfileSection[]~
+hasPortfolio : computed~boolean~
+hasExperience : computed~boolean~
+hasTestimonials : computed~boolean~
+averageRating : computed~number | undefined~
+isProfileApproved : computed~boolean~
+profileCompletionPercentage : computed~number~
+loadProfile(id : string) : Promise~void~
+clearProfile() : void
+openModal() : void
+closeModal() : void
+refreshProfile() : Promise~void~
+updateSectionVisibility(sectionId : string, visible : boolean) : void
+getSectionData(sectionId : string) : any
+initiateContact(method : string) : void
+shareProfile() : Promise~void~
+copyProfileLink() : Promise~void~
}
class ProfileViewData {
+basicInfo : object
+detailedInfo : object
+metadata : object
}
class ProfileSection {
+id : string
+title : string
+component : string
+visible : boolean
+order : number
+required : boolean
}
useSpecialistProfileViewStore --> ProfileViewData
useSpecialistProfileViewStore --> ProfileSection
useSpecialistProfileViewStore --> SpecialistProfileViewService : "uses"
```

**Diagram sources**
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts)

**Section sources**
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts#L1-L344)

### API Endpoints and Request/Response Structures

The Specialist Profile API Service exposes several endpoints for retrieving profile data. These endpoints follow a consistent pattern for request and response structures.

#### Endpoint: GET /profile/{id}
Retrieves a complete specialist profile by ID, combining data from multiple sources.

**Request Structure**
```json
{
  "id": "specialist-1"
}
```

**Response Structure**
```json
{
  "basicInfo": {
    "id": "string",
    "userId": "string",
    "displayName": "string",
    "superpower": "string",
    "avatarUrl": "string | undefined",
    "status": "available | busy | unavailable",
    "lastActive": "string"
  },
  "detailedInfo": {
    "specializations": ["string"],
    "abilities": ["string"],
    "services": [
      {
        "name": "string",
        "description": "string",
        "price": "number | string",
        "priceType": "fixed | hourly | project | negotiable",
        "category": "string",
        "isCustom": "boolean"
      }
    ],
    "portfolio": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "type": "text | link | visual | bot | landing",
        "content": "string | FileReference",
        "result": "string",
        "tools": ["string"],
        "createdAt": "string"
      }
    ],
    "experience": [
      {
        "id": "string",
        "client": "string",
        "task": "string",
        "tools": ["string"],
        "result": "string",
        "duration": "string",
        "year": "string"
      }
    ],
    "testimonials": {
      "textTestimonials": [
        {
          "id": "string",
          "clientName": "string",
          "clientPosition": "string",
          "testimonialText": "string",
          "rating": "number",
          "projectType": "string",
          "date": "string"
        }
      ],
      "externalLinks": ["string"],
      "files": ["FileReference"],
      "averageRating": "number",
      "totalCount": "number"
    },
    "contacts": {
      "telegram": "string",
      "email": "string",
      "website": "string",
      "phone": "string",
      "whatsapp": "string",
      "discord": "string",
      "linkedin": "string",
      "preferredContact": "string",
      "responseTime": "string",
      "availability": "string"
    }
  },
  "metadata": {
    "profileCompleted": "boolean",
    "completionPercentage": "number",
    "moderationStatus": "draft | pending | approved | rejected",
    "lastUpdated": "string"
  }
}
```

**Section sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts#L1-L470)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts#L1-L282)

### Error Handling Patterns

The Specialist Profile API Service implements comprehensive error handling to ensure a robust user experience. Errors are handled at multiple levels, from service implementation to UI presentation.

#### Error Handling Flow
```mermaid
flowchart TD
Start([Service Call]) --> ValidateInput["Validate Input Parameters"]
ValidateInput --> TryBlock["Try: Execute Service Logic"]
TryBlock --> Success["Success: Return Data"]
TryBlock --> Error["Catch: Handle Error"]
Error --> TransformError["Transform Error Message"]
TransformError --> LogError["Log Error (if needed)"]
TransformError --> ReturnError["Return User-Friendly Error"]
ReturnError --> UI["UI Component"]
UI --> DisplayError["Display Error Message"]
UI --> RetryOptions["Show Retry Options"]
Success --> UI
style Start fill:#22c55e,stroke:#16a34a
style Success fill:#22c55e,stroke:#16a34a
style Error fill:#ef4444,stroke:#dc2626
style TransformError fill:#f97316,stroke:#ea580c
style ReturnError fill:#f97316,stroke:#ea580c
style DisplayError fill:#ef4444,stroke:#dc2626
style RetryOptions fill:#3b82f6,stroke:#2563eb
```

The service uses a try-catch block in the `getProfileById` method to catch any errors that occur during data retrieval. Errors are transformed into user-friendly messages and stored in the Pinia store for display in the UI. The UI component displays an error state with options to retry or navigate back.

**Section sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts#L1-L470)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue#L1-L401)

## Dependency Analysis

The Specialist Profile API Service has a well-defined dependency structure that promotes loose coupling and testability. The service depends on type definitions and interfaces but has no direct dependencies on UI components.

```mermaid
graph TD
A[SpecialistProfileViewService] --> B[NeuralNetworkProfileSchema]
A --> C[SpecialistProfile]
A --> D[ProfileViewData]
A --> E[ServiceDetails]
A --> F[PortfolioCase]
A --> G[ExperienceEntry]
A --> H[TestimonialData]
A --> I[ContactInfo]
J[useSpecialistProfileViewStore] --> A
J --> D
J --> K[ProfileSection]
L[SpecialistProfileViewPage] --> J
L --> M[ProfileHeader]
L --> N[ProfileOverview]
L --> O[SpecializationsSection]
L --> P[ServicesSection]
L --> Q[PortfolioSection]
L --> R[ExperienceSection]
L --> S[TestimonialsSection]
L --> T[ContactSection]
style A fill:#3b82f6,stroke:#2563eb
style J fill:#10b981,stroke:#059669
style L fill:#8b5cf6,stroke:#7c3aed
style B fill:#f59e0b,stroke:#d97706
style C fill:#f59e0b,stroke:#d97706
style D fill:#f59e0b,stroke:#d97706
style E fill:#f59e0b,stroke:#d97706
style F fill:#f59e0b,stroke:#d97706
style G fill:#f59e0b,stroke:#d97706
style H fill:#f59e0b,stroke:#d97706
style I fill:#f59e0b,stroke:#d97706
style K fill:#f59e0b,stroke:#d97706
style M fill:#6b7280,stroke:#4b5563
style N fill:#6b7280,stroke:#4b5563
style O fill:#6b7280,stroke:#4b5563
style P fill:#6b7280,stroke:#4b5563
style Q fill:#6b7280,stroke:#4b5563
style R fill:#6b7280,stroke:#4b5563
style S fill:#6b7280,stroke:#4b5563
style T fill:#6b7280,stroke:#4b5563
```

**Diagram sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue)

**Section sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/types/specialist-profile-view.ts)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue)

## Performance Considerations

The Specialist Profile API Service implements several performance optimizations to ensure a responsive user experience:

1. **Parallel Data Loading**: The service uses `Promise.all` to fetch basic and detailed profile data simultaneously, reducing overall load time.

2. **State Caching**: The Pinia store caches the loaded profile data, preventing unnecessary re-fetching when navigating back to the same profile.

3. **Conditional Rendering**: The UI components conditionally render sections based on data availability, reducing the rendering workload.

4. **Efficient Data Transformation**: The service performs data transformation only once when loading the profile, rather than on each render.

5. **Lazy Loading**: Optional sections (portfolio, experience, testimonials) are only rendered when they contain data.

The service currently uses mock data with artificial delays to simulate API calls. In a production environment, these delays would be replaced with actual network requests, and additional optimizations such as data caching and pagination might be necessary for large datasets.

## Troubleshooting Guide

### Common Issues and Solutions

**Issue: Profile fails to load**
- **Possible Causes**: Invalid specialist ID, network connectivity issues, server errors
- **Solutions**: Verify the specialist ID, check network connection, retry the request

**Issue: Missing profile sections**
- **Possible Causes**: Data not available in the detailed profile, conditional rendering logic
- **Solutions**: Check if the specialist has added data to the section, verify the store's computed properties

**Issue: Incorrect data display**
- **Possible Causes**: Data transformation errors, type mismatches
- **Solutions**: Verify the data transformation logic in the service, check TypeScript interfaces for consistency

**Issue: Modal not closing properly**
- **Possible Causes**: Event listeners not cleaned up, body scroll not restored
- **Solutions**: Ensure onUnmounted lifecycle hook is called, verify closeModal action

### Debugging Tips

1. Check the browser console for error messages
2. Verify the specialist ID being passed to the service
3. Inspect the Pinia store state using Vue DevTools
4. Check network requests in the browser's developer tools
5. Verify that all required dependencies are properly imported

**Section sources**
- [specialist-profile-view.ts](file://src/services/specialist-profile-view.ts)
- [specialist-profile-view.ts](file://src/stores/specialist-profile-view.ts)
- [SpecialistProfileViewPage.vue](file://src/pages/SpecialistProfileViewPage.vue)

## Conclusion

The Specialist Profile API Service provides a robust and scalable solution for displaying specialist profiles in the MayaWork. By combining data from multiple sources and using a clean architecture with proper separation of concerns, the service delivers a rich user experience with comprehensive profile information. The implementation follows best practices for state management, error handling, and performance optimization, making it maintainable and extensible. The service could be further enhanced with features like data caching, pagination for large datasets, and improved loading states for better user experience.