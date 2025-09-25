# Руководство по упрощению схемы анкеты нейросетевого специалиста

## Обзор изменений

Мы провели масштабное упрощение схемы данных и компонентов для анкеты нейросетевого специалиста. Основная цель - упростить backend интеграцию и сделать код более поддерживаемым.

## Ключевые упрощения

### 1. Упрощенная модель данных

**Было (сложная структура):**
```typescript
interface NeuralNetworkProfileSchema {
  specializations: {
    title: string
    description: string
    data: {
      selectedSpecializationIds: number[]
      customSpecializations: string[]
    }
    validation: {
      required: boolean
      minSelected: number
      maxSelected: number
    }
  }
  // ... другие блоки с аналогичной структурой
}
```

**Стало (плоская структура):**
```typescript
interface NeuralNetworkProfile {
  specializations: number[]
  customSpecializations: string[]
  superpower: string
  skills: number[]
  customSkills: string[]
  // ... остальные поля на верхнем уровне
}
```

### 2. Упрощенный Store

**Основные изменения:**
- Убрана сложная логика валидации
- Простые computed свойства
- Минимальное состояние
- Прямолинейные методы обновления

**Новые файлы:**
- `src/stores/neural-network-profile-simple.ts`
- `src/types/neural-network-profile-simple.ts`

### 3. Компонентная архитектура

**Структура компонентов:**
```
src/components/profile/
├── NeuralNetworkProfileFormSimple.vue (основная форма)
└── steps/
    ├── SpecializationsStep.vue
    ├── SuperpowerStep.vue
    ├── SkillsStep.vue
    └── ContactsStep.vue
```

**Принципы:**
- Каждый шаг - отдельный компонент
- Простая передача данных через props/emits
- Локальная валидация в каждом компоненте
- Минимальная связанность между компонентами

### 4. Упрощенная навигация

**Особенности:**
- Простая логика переключения шагов
- Минимальная проверка завершенности
- Прямолинейный flow без сложных условий
- Автоматическое продвижение после завершения шага

## Преимущества для Backend

### 1. Простая схема базы данных
```sql
CREATE TABLE neural_network_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL,
  specializations INTEGER[],
  custom_specializations TEXT[],
  superpower TEXT,
  skills INTEGER[],
  custom_skills TEXT[],
  portfolio JSONB,
  services JSONB,
  experience JSONB,
  testimonials JSONB,
  custom_contacts JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 2. Простые API endpoints
```typescript
// GET /api/profiles/neural-network/:userId
// POST /api/profiles/neural-network
// PUT /api/profiles/neural-network/:id
// DELETE /api/profiles/neural-network/:id
```

### 3. Упрощенная валидация
```typescript
const validateProfile = (profile: NeuralNetworkProfile) => {
  const errors = []
  
  if (profile.specializations.length === 0) {
    errors.push('Выберите хотя бы одну специализацию')
  }
  
  if (!profile.superpower || profile.superpower.length < 10) {
    errors.push('Суперспособность должна содержать минимум 10 символов')
  }
  
  return errors
}
```

## Файловая структура

### Новые файлы
```
src/
├── types/
│   └── neural-network-profile-simple.ts
├── stores/
│   └── neural-network-profile-simple.ts
├── components/profile/
│   ├── NeuralNetworkProfileFormSimple.vue
│   └── steps/
│       ├── SpecializationsStep.vue
│       ├── SuperpowerStep.vue
│       ├── SkillsStep.vue
│       └── ContactsStep.vue
└── pages/
    └── NeuralNetworkProfileSimplePage.vue
```

### Устаревшие файлы (можно удалить после миграции)
```
src/
├── types/
│   └── neural-network-profile.ts (сложная версия)
├── stores/
│   └── neural-network-profile.ts (сложная версия)
└── components/profile/
    ├── NeuralNetworkQuestionnaireForm.vue (сложная версия)
    └── neural-network/ (старые блоки)
```

## Миграция данных

### Конвертация из старого формата в новый
```typescript
const migrateProfile = (oldProfile: NeuralNetworkProfileSchema): NeuralNetworkProfile => {
  return {
    id: oldProfile.id,
    userId: oldProfile.userId,
    status: oldProfile.status,
    createdAt: oldProfile.createdAt,
    updatedAt: oldProfile.updatedAt,
    
    specializations: oldProfile.specializations.data.selectedSpecializationIds,
    customSpecializations: oldProfile.specializations.data.customSpecializations || [],
    superpower: oldProfile.superpower.data.text,
    skills: oldProfile.abilities.data.selectedSkillIds,
    customSkills: oldProfile.abilities.data.customAbilities || [],
    
    portfolio: oldProfile.portfolio.data,
    services: oldProfile.services.data.customServices || [],
    experience: oldProfile.experience.data,
    testimonials: oldProfile.testimonials.data.photos || [],
    
    customContacts: oldProfile.contacts.data.overrideContacts
  }
}
```

## Тестирование

### Запуск упрощенной версии
1. Откройте `/neural-network-profile-simple` в браузере
2. Проверьте работу всех шагов
3. Убедитесь в корректности валидации
4. Проверьте автосохранение

### Проверка интеграции
```bash
# Запуск линтера
npm run lint

# Запуск тестов
npm run test

# Проверка типов
npm run type-check
```

## Следующие шаги

1. **Создать недостающие компоненты шагов:**
   - PortfolioStep.vue
   - ServicesStep.vue
   - ExperienceStep.vue
   - TestimonialsStep.vue

2. **Интеграция с Backend:**
   - Создать API endpoints
   - Реализовать сохранение/загрузку профилей
   - Добавить валидацию на сервере

3. **Миграция существующих данных:**
   - Создать скрипт миграции
   - Протестировать на тестовых данных
   - Выполнить миграцию в продакшене

4. **Удаление старого кода:**
   - После успешной миграции удалить старые файлы
   - Обновить импорты в других компонентах
   - Обновить документацию

## Заключение

Упрощенная схема обеспечивает:
- **Простота разработки** - меньше кода, проще понимание
- **Производительность** - меньше вложенности, быстрее обработка
- **Масштабируемость** - легче добавлять новые поля
- **Поддерживаемость** - проще отладка и исправление ошибок

Backend разработчики получают простую схему данных без сложных вложенных структур, что значительно упрощает создание API и работу с базой данных.
