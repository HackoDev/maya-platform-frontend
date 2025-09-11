# Support Ticket Dialog Page Design

## 1. Overview

This document describes the design for a new Support Ticket Dialog page that allows users to view the details of a specific support ticket, including the conversation history, current status, and the ability to add new messages for open tickets. Users can also mark tickets as resolved.

The page will integrate with the existing support system and follow the same design patterns and component structures used throughout the application.

## 2. Requirements

### Functional Requirements

- Display ticket details (ID, status, creation date)
- Show conversation history with distinct styling for user vs support messages
- Allow users to add new messages to open tickets
- Enable users to mark tickets as resolved
- Display loading states and error handling
- Responsive design for all device sizes

### Non-Functional Requirements

- Consistent with existing design system and styling
- Accessible interface following WCAG guidelines
- Efficient data loading and caching
- Error handling and user feedback following existing patterns in `SupportForm.vue` and `SupportTicketItem.vue`

## 3. User Interface Design

### Page Layout

The page will follow a single-column layout with the following sections:

1. Ticket header with status and metadata
2. Conversation history area
3. Message input area (only for open tickets)
4. Action buttons

The layout will be responsive and adapt to different screen sizes, maintaining consistency with existing pages like SupportPage.vue.

### Visual Design

- Use existing color palette and styling components from Tailwind CSS configuration
- Implement dark mode support consistent with other pages using `dark:` variants
- Clear visual distinction between user and support messages:
  - User messages: Right-aligned, blue background in light mode, darker blue in dark mode
  - Support messages: Left-aligned, gray background in light mode, darker gray in dark mode
- Responsive design with appropriate spacing and typography following the application's design system
- Status indicators using the same color scheme as `SupportTicketItem.vue`

## 4. Component Architecture

### Main Page Component

- `SupportTicketDialogPage.vue` - Main page component

### Child Components

- `TicketHeader.vue` - Displays ticket metadata and status. Will use similar styling patterns as `SupportTicketItem.vue` with status badges and date formatting.
- `MessageList.vue` - Renders the conversation history in a scrollable container.
- `MessageItem.vue` - Individual message component with distinct styling for user (right-aligned) and support (left-aligned) messages. Will follow the design patterns established in other parts of the application.
- `MessageInput.vue` - Input area for new messages, based on `SupportForm.vue` with a simplified interface for just the message input.
- `TicketActions.vue` - Action buttons for resolving tickets, following the button styling patterns used throughout the application.

These components will utilize existing UI components like `BaseCard.vue`, `BaseButton.vue`, and `BaseInput.vue` where appropriate to maintain consistency.

## 5. Data Flow

### State Management

- Use existing Pinia store (`useSupportStore`) for ticket data
- Maintain local state for message input and UI interactions
- Handle loading and error states appropriately

### Composable Functions

- Extend `useSupportData` composable with new functions:
  - `fetchTicket(ticketId: string)` - Fetch a specific ticket
  - `addMessage(ticketId: string, message: string)` - Add a new message to a ticket
  - `resolveTicket(ticketId: string)` - Mark a ticket as resolved

### API Integration

- Extend existing support service (`src/services/support.ts`) with new endpoint
- Implement mock data for development and testing, following the same pattern as existing mock data
- Handle real-time updates for message status

## 6. API Design

### Get Ticket Endpoint

```
GET /api/support/tickets/{ticketId}
```

### Request

```
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Parameters:
  ticketId (path): ID of the ticket to retrieve
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "ticket-12345",
    "message": "Issue with profile updates",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:22:00Z",
    "resolvedAt": null,
    "assignedTo": "Support Agent",
    "hasUnreadMessages": false,
    "messages": [
      {
        "id": "msg-1",
        "ticketId": "ticket-12345",
        "message": "I'm having trouble updating my profile information.",
        "isFromSupport": false,
        "createdAt": "2024-01-15T10:30:00Z",
        "author": {
          "role": "user"
        }
      },
      {
        "id": "msg-2",
        "ticketId": "ticket-12345",
        "message": "Thanks for reaching out. Can you provide more details about the issue?",
        "isFromSupport": true,
        "createdAt": "2024-01-15T11:15:00Z",
        "author": {
          "role": "support"
        }
      }
    ]
  }
}
```

### New Message Endpoint

```
POST /api/support/tickets/{ticketId}/messages
```

### Request

```json
{
  "message": "This is my new message"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "msg-3",
    "ticketId": "ticket-12345",
    "message": "This is my new message",
    "isFromSupport": false,
    "createdAt": "2024-01-15T14:22:00Z",
    "author": {
      "role": "user"
    }
  }
}
```

### Resolve Ticket Endpoint

```
PUT /api/support/tickets/{ticketId}/resolve
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "ticket-12345",
    "status": "resolved",
    "resolvedAt": "2024-01-15T14:25:00Z",
    "updatedAt": "2024-01-15T14:25:00Z"
  }
}
```

## 7. Routing

### Route Definition

```
{
  path: '/support/tickets/:id',
  name: 'SupportTicketDialog',
  component: () => import('@/pages/SupportTicketDialogPage.vue'),
  meta: {
    title: 'Support Ticket',
    requiresAuth: true,
  },
}
```

### Navigation

- Accessible from the Support History section on the Support page
- URL parameter for ticket ID

## 8. Implementation Plan

### Phase 1: Core Components

1. Create main page component (`SupportTicketDialogPage.vue`) following the patterns in `SupportPage.vue`
2. Implement ticket header component with status badges using the same approach as `SupportTicketItem.vue`
3. Create message list and message item components with Tailwind CSS styling
4. Implement basic styling consistent with the application design system

### Phase 2: Functionality

1. Integrate with support store (`useSupportStore`) and extend `useSupportData` composable
2. Implement message input for open tickets based on `SupportForm.vue`
3. Add resolve ticket functionality with appropriate state management
4. Implement loading and error states using existing patterns

### Phase 3: Polish

1. Add smooth scrolling for message history
2. Implement responsive design with mobile-first approach
3. Add accessibility features (keyboard navigation, ARIA labels)
4. Conduct testing and integrate with existing test suite

## 9. Testing Strategy

### Unit Tests

- Test individual components with various ticket states (open, in-progress, resolved, closed)
- Verify message rendering for user and support messages using the same patterns as `SupportTicketItem.vue`
- Test form validation for message input following patterns in `SupportForm.vue`
- Test error states and loading states

### Integration Tests

- Test API integration with mock data using the same patterns as existing support tests
- Verify state management updates in `useSupportStore`
- Test navigation between support pages using existing router patterns

### UI Tests

- Verify responsive design on different screen sizes following the responsive patterns in the application
- Test dark mode implementation using the same dark mode classes as other components
- Validate accessibility compliance with keyboard navigation and screen reader support

## 10. Mock Data Implementation

Based on the existing mock data structure in `src/services/support.ts`, we'll implement the following mock data for development:

### Sample Ticket Data

```
const mockTicketData: SupportTicket = {
  id: 'ticket-12345',
  message: 'Issue with profile updates',
  status: 'open',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T14:22:00Z',
  resolvedAt: null,
  assignedTo: 'Support Agent',
  hasUnreadMessages: false,
  messages: [
    {
      id: 'msg-1',
      ticketId: 'ticket-12345',
      message: 'I\'m having trouble updating my profile information.',
      isFromSupport: false,
      createdAt: '2024-01-15T10:30:00Z',
      author: {
        role: 'user'
      }
    },
    {
      id: 'msg-2',
      ticketId: 'ticket-12345',
      message: 'Thanks for reaching out. Can you provide more details about the issue?',
      isFromSupport: true,
      createdAt: '2024-01-15T11:15:00Z',
      author: {
        role: 'support'
      }
    }
  ]
}
```

### Mock API Functions

```
// In src/services/support.ts
export const mockApiGetTicket = async (ticketId: string): Promise<SupportTicket> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  // Find ticket in mock data or return a default one
  const ticket = mockSupportTicketsData.find(t => t.id === ticketId)
  if (ticket) {
    return ticket
  }

  // Return default ticket if not found
  return mockTicketData
}

export const mockApiAddMessage = async (
  ticketId: string,
  message: string
): Promise<SupportMessage> => {
  await new Promise(resolve => setTimeout(resolve, 600))

  const newMessage: SupportMessage = {
    id: `msg-${Date.now()}`,
    ticketId,
    message,
    isFromSupport: false,
    createdAt: new Date().toISOString(),
    author: {
      role: 'user'
    }
  }

  // Update the ticket in mock data
  const ticketIndex = mockSupportTicketsData.findIndex(t => t.id === ticketId)
  if (ticketIndex !== -1) {
    mockSupportTicketsData[ticketIndex].messages.push(newMessage)
    mockSupportTicketsData[ticketIndex].updatedAt = new Date().toISOString()
  }

  return newMessage
}

export const mockApiResolveTicket = async (ticketId: string): Promise<SupportTicket> => {
  await new Promise(resolve => setTimeout(resolve, 600))

  const ticketIndex = mockSupportTicketsData.findIndex(t => t.id === ticketId)
  if (ticketIndex !== -1) {
    mockSupportTicketsData[ticketIndex].status = 'resolved'
    mockSupportTicketsData[ticketIndex].resolvedAt = new Date().toISOString()
    mockSupportTicketsData[ticketIndex].updatedAt = new Date().toISOString()
    return mockSupportTicketsData[ticketIndex]
  }

  // Return updated mock ticket if not found
  const updatedTicket = { ...mockTicketData }
  updatedTicket.status = 'resolved'
  updatedTicket.resolvedAt = new Date().toISOString()
  updatedTicket.updatedAt = new Date().toISOString()
  return updatedTicket
}
```
