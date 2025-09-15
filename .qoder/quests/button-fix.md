# Fix for "Связаться" Button on Vacancy List Page

## Problem

The "Связаться" (Contact) button on the vacancy list page doesn't display contact information (phone, Telegram, WhatsApp) in the modal.

## Root Cause

The issue is in the `searchVacancies` method in the vacancy store where vacancies are converted from `FakeVacancy` to `Vacancy` format:

1. The first conversion correctly attaches the `_fakeData` property
2. However, a second conversion creates a `VacancyPaginationResponse` object that doesn't preserve the `_fakeData` property

Additionally, the `openContactModal` method doesn't correctly handle vacancies that already contain the `_fakeData` property.

## Solution

### Fix 1: Preserve \_fakeData Property

In `src/stores/vacancy.ts`, modify the `searchVacancies` method to preserve the `_fakeData` property when creating `VacancyPaginationResponse`:

```typescript
const convertedResults: VacancyPaginationResponse = {
  vacancies: convertedVacancies.map(vacancy => ({
    id: vacancy.id,
    title: vacancy.title,
    description: vacancy.description,
    status: vacancy.status,
    createdAt: vacancy.createdAt,
    updatedAt: vacancy.updatedAt,
    clientId: vacancy.clientId,
    clientName: vacancy.clientName,
    clientPhone: vacancy.clientPhone,
    _fakeData: (vacancy as any)._fakeData, // Preserve _fakeData property
  })),
  page: currentPage.value,
  pageSize: searchFilters.value.limit || 7,
  total: fakeResults.total,
  hasMore: fakeResults.hasMore,
}
```

### Fix 2: Improve openContactModal Method

Enhance the `openContactModal` method to properly handle vacancies with existing `_fakeData`:

```typescript
const openContactModal = (vacancy: Vacancy) => {
  // If the vacancy already has _fakeData, use it directly
  if ((vacancy as any)._fakeData) {
    selectedVacancy.value = vacancy
  } else {
    // Find the fake vacancy to get the full contact info
    const fakeVacancy = getVacancyById(vacancy.id)
    if (fakeVacancy) {
      // Update the vacancy with full contact info
      selectedVacancy.value = {
        ...vacancy,
        clientPhone: fakeVacancy.contactInfo.phone,
        _fakeData: fakeVacancy,
      } as Vacancy
    } else {
      selectedVacancy.value = vacancy
    }
  }
  showContactModal.value = true
}
```

## Testing

1. Navigate to the "Все вакансии" page
2. Click the "Связаться" button on any vacancy card
3. Verify the contact modal displays all contact information
