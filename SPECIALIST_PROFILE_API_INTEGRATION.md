# Specialist Profile API Integration

## Overview
Реализована интеграция с API для получения детального профиля специалиста по ID через новый метод `getSpecialistById` в `PortfoliosApiClient`.

## Changes Made

### 1. API Client (`src/services/portfoliosApiClient.ts`)
- Добавлен метод `getSpecialistById(id: string)` для получения профиля специалиста по ID
- Использует существующий метод `convertMeResponseToSimplifiedProfile()` для конвертации данных
- Обновлены экспорты для включения нового метода

### 2. Store (`src/stores/specialist-profile-view-simple.ts`)
- Добавлена функция `convertApiProfileToViewData()` для конвертации API данных в формат профиля
- Добавлена функция `calculateCompletionPercentage()` для расчета процента заполнения профиля
- Обновлен метод `loadProfile()` для использования реального API с fallback на тестовые данные
- Исправлены типы данных для совместимости с компонентами:
  - `tools` конвертируется из `string` в `string[]`
  - `price` парсится из строки в число
  - Добавлены значения по умолчанию для опциональных полей

### 3. Page (`src/pages/SpecialistProfileViewSimplePage.vue`)
- Обновлен `onMounted` для использования `loadProfile()` вместо `loadTestData()`
- Теперь загружает реальные данные по ID из роутера

## API Endpoint
```
GET /api/web/portfolios/{id}
```

## Usage
```typescript
import { portfoliosApi } from '@/services/portfoliosApiClient'

// Get specialist profile by ID
const profile = await portfoliosApi.getSpecialistById('107ac429-89ad-407d-9e1c-79cc26a596dd')
```

## Features
- ✅ Получение профиля специалиста по ID
- ✅ Конвертация API данных в формат фронтенда
- ✅ Fallback на тестовые данные при ошибке API
- ✅ Расчет процента заполнения профиля
- ✅ Совместимость с существующими компонентами
- ✅ TypeScript типизация
- ✅ Обработка ошибок

## Data Conversion
API возвращает данные в формате `NeuralNetworkProfile`, которые конвертируются в `SpecialistProfileViewData`:

- **Basic Info**: ID, имя пользователя, суперспособность, статус
- **Profile Data**: Полные данные профиля из API
- **Metadata**: Процент заполнения, статус модерации, даты

## Integration
Страница `SpecialistProfileViewSimplePage.vue` автоматически использует новый API через обновленный store:
1. Получает ID специалиста из роутера (`/specialist/:id`)
2. Вызывает `loadProfile(id)` в store
3. Store пытается загрузить данные через API
4. При ошибке API использует fallback на тестовые данные
5. Отображает профиль в существующих компонентах

## Error Handling
- Graceful fallback на тестовые данные при ошибке API
- Отображение ошибок пользователю
- Возможность повторной попытки загрузки
- Логирование ошибок в консоль
