# Service Options Integration

## Overview
Обновлен блок "Услуги и цены" для учета цен из поля `serviceOptions`. Теперь система корректно отображает как кастомные услуги, так и предопределенные услуги с их кастомными ценами и описаниями.

## Changes Made

### 1. Store (`src/stores/specialist-profile-view-simple.ts`)
- **Добавлено состояние `loadedServices`**: Кэш для загруженных услуг по ID
- **Добавлена функция `loadServiceById()`**: Загружает детали услуги по ID с кэшированием
- **Обновлен `displayServices`**: Теперь объединяет `customServices` и услуги из `services` с `serviceOptions`
- **Обновлен `loadProfile()`**: Автоматически загружает детали услуг при загрузке профиля

### 2. Page (`src/pages/SpecialistProfileViewSimplePage.vue`)
- **Добавлен блок "Услуги и цены"**: Отдельная секция для отображения услуг
- **Добавлен импорт `ServicesSection`**: Компонент для отображения услуг
- **Условное отображение**: Блок показывается только при наличии услуг

## Service Options Logic

### Структура данных
```typescript
serviceOptions: Record<string, ServiceOption>
// где ключ - ID услуги, значение - опции услуги

ServiceOption {
  selected: boolean           // выбрана ли услуга
  customPrice?: number       // кастомная цена
  customDescription?: string // кастомное описание
}
```

### Логика отображения
1. **Custom Services**: Отображаются как есть из `customServices`
2. **Predefined Services**: 
   - Загружаются по ID из API
   - Отображаются только если `serviceOption.selected === true`
   - Используется `customPrice` если доступна, иначе базовая цена услуги
   - Используется `customDescription` если доступно, иначе описание услуги

### Приоритет цен
```typescript
const price = serviceOption.customPrice || parseFloat(loadedService.price) || 0
const description = serviceOption.customDescription || loadedService.description
```

## Features
- ✅ Отображение кастомных услуг
- ✅ Отображение предопределенных услуг с кастомными ценами
- ✅ Кэширование загруженных услуг
- ✅ Автоматическая загрузка деталей услуг
- ✅ Fallback на базовые цены при отсутствии кастомных
- ✅ Отдельный блок "Услуги и цены" в профиле
- ✅ Совместимость с существующими компонентами

## API Integration
- **Загрузка услуг**: `portfoliosApi.getServiceById(id)`
- **Кэширование**: Предотвращает повторные запросы
- **Обработка ошибок**: Graceful fallback при ошибках загрузки
- **Параллельная загрузка**: Все услуги загружаются одновременно

## Display Components
- **ProfileOverview**: Краткий обзор услуг в блоке "Обзор профиля"
- **ServicesSection**: Полный блок "Услуги и цены" с детальной информацией
- **Условное отображение**: Блоки показываются только при наличии услуг

## Data Flow
1. Загружается профиль специалиста
2. Извлекаются ID услуг из `services` и `serviceOptions`
3. Параллельно загружаются детали всех услуг
4. `displayServices` объединяет кастомные и предопределенные услуги
5. Компоненты отображают объединенный список услуг

## Backward Compatibility
- Сохранена поддержка `customServices`
- Существующие компоненты работают без изменений
- Fallback на тестовые данные при ошибках API
- Graceful обработка отсутствующих данных
