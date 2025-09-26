# Services Display Fix

## Problem
Услуги не отображались на странице детализации профиля специалиста, потому что система ожидала массив ID услуг, но сервер возвращал полные объекты услуг.

## Root Cause
- **API Response**: Сервер возвращает `services` как массив полных объектов услуг
- **Expected Format**: Код ожидал `services` как массив ID и пытался загружать детали отдельно
- **Type Mismatch**: Типы не соответствовали реальной структуре данных

## Changes Made

### 1. Types (`src/types/neural-network-profile-simple.ts`)
- **Updated `services` field**: Изменили с `number[]` на `ServiceItem[]`
- **Updated `ServiceItem.id`**: Изменили с `string` на `string | number`
- **Made `priceType` optional**: Добавили `?` так как поле может отсутствовать в данных с сервера

```typescript
// Before
services: number[] // ID услуг

// After  
services: ServiceItem[] // Полные данные услуг

// ServiceItem updates
id: string | number
priceType?: 'fixed' | 'hourly' | 'project' | 'negotiable'
```

### 2. API Client (`src/services/portfoliosApiClient.ts`)
- **Fixed data conversion**: Убрали конвертацию `services` в массив ID
- **Preserve full data**: Теперь сохраняем полные объекты услуг как есть

```typescript
// Before
services: apiData.services.map((x: any) => x.id) || [],

// After
services: apiData.services || [], // Сохраняем полные данные услуг
```

### 3. Store (`src/stores/specialist-profile-view-simple.ts`)
- **Removed service loading logic**: Убрали загрузку деталей услуг по ID
- **Updated `displayServices`**: Переписали логику для работы с полными объектами
- **Removed unused code**: Удалили `loadServiceById`, `loadedServices` и связанные импорты

#### New displayServices Logic
```typescript
// Add services from services array (now contains full service objects)
if (profileData.services) {
  profileData.services.forEach(service => {
    const serviceId = service.id.toString()
    const serviceOption = profileData.serviceOptions?.[serviceId]
    
    // Use custom price and description from serviceOptions if available
    const price = serviceOption?.customPrice || service.price
    const description = serviceOption?.customDescription || service.description
    
    result.push({
      id: service.id,
      name: service.name,
      description,
      price: parseFloat(price.toString()) || 0,
      priceType: service.priceType || 'fixed',
      isCustom: false,
      formattedPrice: formatPrice(parseFloat(price.toString()) || 0, service.priceType || 'fixed')
    })
  })
}
```

## Data Structure Support

### Server Response Format
```json
{
  "services": [
    {
      "id": 1,
      "name": "Нейроассистент под ключ",
      "description": "Полная настройка AI-ассистента для вашего бизнеса",
      "price": "от 15 000 руб"
    }
  ],
  "customServices": [
    {
      "name": "Разработка веб-сайтов используя Cursor",
      "description": "Используя современные инструменты могу помочь вашему бизнесу использовать современные инструменты",
      "price": "от 25000 рублей",
      "priceType": "fixed"
    }
  ],
  "serviceOptions": {
    "1": {
      "customPrice": "от 15 000 руб",
      "customDescription": "Полная настройка AI-ассистента для вашего бизнеса"
    }
  }
}
```

## Features
- ✅ Отображение всех услуг из `services` массива
- ✅ Отображение кастомных услуг из `customServices`
- ✅ Поддержка кастомных цен из `serviceOptions`
- ✅ Поддержка кастомных описаний из `serviceOptions`
- ✅ Правильное форматирование цен
- ✅ Fallback на базовые данные при отсутствии кастомных
- ✅ Поддержка как числовых, так и строковых ID

## Service Options Priority
1. **Custom Services**: Отображаются как есть
2. **Predefined Services**: 
   - Базовая цена/описание из `services`
   - Кастомная цена/описание из `serviceOptions` (если доступно)
   - Fallback на 'fixed' для `priceType` если отсутствует

## Performance Improvements
- **Removed API calls**: Больше не загружаем детали услуг отдельно
- **Simplified logic**: Упрощена логика отображения услуг
- **Better caching**: Данные приходят сразу с сервера

## Backward Compatibility
- Сохранена поддержка `customServices`
- Сохранена поддержка `serviceOptions`
- Fallback на тестовые данные при ошибках API
- Graceful обработка отсутствующих полей
