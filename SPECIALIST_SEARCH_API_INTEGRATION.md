# Specialist Search API Integration

## Overview
Реализована интеграция с API поиска специалистов через новый метод `searchSpecialists` в `PortfoliosApiClient`.

## Changes Made

### 1. Types (`src/types/portfolio.ts`)
Добавлены новые типы для API ответа поиска специалистов:
- `ApiSpecialistUser` - структура пользователя из API
- `ApiSpecialistProfile` - профиль специалиста из API
- `ApiSpecialistSearchResponse` - ответ API с пагинацией
- `SpecialistSearchProfile` - фронтенд формат профиля специалиста
- `SpecialistSearchPaginationResponse` - пагинированный ответ для фронтенда

### 2. API Client (`src/services/portfoliosApiClient.ts`)
- Добавлен метод `searchSpecialists()` для поиска специалистов
- Добавлен приватный метод `convertApiSpecialistToSpecialist()` для конвертации данных
- Обновлены экспорты для включения новых типов и методов

### 3. Search Service (`src/services/specialist-search.ts`)
- Обновлен `SpecialistSearchService` для использования реального API
- Добавлен fallback на fake данные при ошибке API
- Добавлена конвертация API данных в формат фронтенда

## API Endpoint
```
GET /api/web/portfolios/search?limit=100&offset=0
```

## Usage
```typescript
import { portfoliosApi } from '@/services/portfoliosApiClient'

// Search specialists
const results = await portfoliosApi.searchSpecialists({
  limit: 10,
  offset: 0,
  search: 'AI assistant'
})
```

## Features
- ✅ Пагинация результатов
- ✅ Поиск по тексту
- ✅ Конвертация API данных в формат фронтенда
- ✅ Fallback на fake данные при ошибке API
- ✅ Интеграция с существующим store поиска специалистов
- ✅ TypeScript типизация

## Integration
Страница `SearchSpecialistsPage.vue` автоматически использует новый API через обновленный `SpecialistSearchService`, который теперь вызывает реальный API вместо fake данных.
