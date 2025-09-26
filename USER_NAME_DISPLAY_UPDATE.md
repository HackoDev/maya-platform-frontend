# User Name Display Update

## Overview
Добавлено отображение реального имени и фамилии пользователя из API данных вместо заглушки "Специалист {id}".

## Changes Made

### 1. Types (`src/types/neural-network-profile-simple.ts`)
- Добавлено поле `user` в интерфейс `NeuralNetworkProfile`:
  ```typescript
  user?: {
    id: number
    email: string
    firstName: string
    lastName: string
    avatar?: string
    phone?: string
    telegram?: string
    whatsapp?: string
  }
  ```

### 2. API Client (`src/services/portfoliosApiClient.ts`)
- Обновлен метод `convertMeResponseToSimplifiedProfile()` для сохранения данных пользователя:
  - Сохраняет `firstName`, `lastName`, `email`, `avatar` и другие поля пользователя
  - Данные доступны как в `user`, так и в `customContacts` для обратной совместимости

### 3. Store (`src/stores/specialist-profile-view-simple.ts`)
- Обновлена функция `convertApiProfileToViewData()`:
  - Формирует `displayName` из `firstName` и `lastName`
  - Fallback на `Специалист {id}` если данные пользователя недоступны
  - Использует `avatar` из данных пользователя
- Обновлен `displayContacts`:
  - Приоритет: `customContacts` → `user` данные
  - Добавлен доступ к `email` из данных пользователя
  - Улучшена логика определения наличия контактов

## Features
- ✅ Отображение реального имени и фамилии
- ✅ Отображение аватара пользователя
- ✅ Доступ к email пользователя
- ✅ Fallback на заглушку при отсутствии данных
- ✅ Обратная совместимость с существующими компонентами
- ✅ Приоритет customContacts над user данными

## Display Logic
```typescript
// Формирование имени
const displayName = apiProfile.user 
  ? `${apiProfile.user.firstName} ${apiProfile.user.lastName}`.trim()
  : `Специалист ${apiProfile.id}`

// Приоритет контактов
phone: customContacts?.phone || userContacts?.phone
email: userContacts?.email
```

## Components Affected
- **ProfileHeader**: Отображает `displayName` и формирует инициалы
- **ContactSection**: Использует обновленные контакты
- **ContactButtons**: Получает имя для отображения

## API Data Flow
1. API возвращает данные с полем `user`
2. `convertMeResponseToSimplifiedProfile()` сохраняет данные пользователя
3. `convertApiProfileToViewData()` формирует `displayName`
4. Компоненты отображают реальное имя пользователя

## Backward Compatibility
- Сохранена поддержка fallback на тестовые данные
- Существующие компоненты работают без изменений
- Приоритет `customContacts` над `user` данными для контактов
