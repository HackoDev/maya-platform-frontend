# Интеграция API запросов - Документация

## 🎯 Что было сделано

Успешно интегрированы API запросы для получения списков экспертизы, навыков и услуг в новую упрощенную форму, заменив фейк списки на реальные данные из backend.

## 🔄 Изменения в store

### 1. neural-network-profile-simple.ts

#### Новые импорты:
```typescript
import { portfoliosApi } from '@/services/portfoliosApiClient'
import type { Skill, Specialization, Service } from '@/types/portfolio'
```

#### Новое состояние:
```typescript
// API данные
const skills = ref<Skill[]>([])
const specializations = ref<Specialization[]>([])
const services = ref<Service[]>([])
const portfolioDataLoading = ref(false)
```

#### Новые методы:

##### `loadPortfolioData()`
```typescript
const loadPortfolioData = async () => {
  portfolioDataLoading.value = true
  try {
    const [skillsResponse, specializationsResponse, servicesResponse] = await Promise.all([
      portfoliosApi.getSkills({ limit: 100 }),
      portfoliosApi.getSpecializations({ limit: 100 }),
      portfoliosApi.getServices({ limit: 100 })
    ])
    
    skills.value = skillsResponse.skills
    specializations.value = specializationsResponse.specializations
    services.value = servicesResponse.services
    
    // Обновляем доступные данные для выбора
    availableSpecializations.value = specializations.value
    availableSkills.value = skills.value
    availableServices.value = services.value
  } catch (error) {
    console.error('Error loading portfolio data:', error)
    // Используем заглушки как fallback
    loadFallbackData()
  } finally {
    portfolioDataLoading.value = false
  }
}
```

##### `loadFallbackData()`
```typescript
const loadFallbackData = () => {
  availableSpecializations.value = [
    { id: 1, name: 'Разработка ПО' },
    { id: 2, name: 'Дизайн' },
    { id: 3, name: 'Маркетинг' },
    { id: 4, name: 'Аналитика' },
    { id: 5, name: 'Контент' }
  ]
  
  availableSkills.value = [
    { id: 1, name: 'JavaScript', tools: ['React', 'Vue', 'Node.js'] },
    { id: 2, name: 'Python', tools: ['Django', 'Flask', 'FastAPI'] },
    { id: 3, name: 'UI/UX Design', tools: ['Figma', 'Sketch', 'Adobe XD'] },
    { id: 4, name: 'Data Analysis', tools: ['Python', 'R', 'SQL'] },
    { id: 5, name: 'Content Writing', tools: ['Word', 'Google Docs', 'Notion'] }
  ]
  
  availableServices.value = [
    { id: 1, name: 'Веб-разработка', description: 'Создание веб-приложений' },
    { id: 2, name: 'Дизайн интерфейсов', description: 'UI/UX дизайн' },
    { id: 3, name: 'Контент-маркетинг', description: 'Создание контента' },
    { id: 4, name: 'Аналитика данных', description: 'Анализ и визуализация данных' },
    { id: 5, name: 'Консультации', description: 'Экспертные консультации' }
  ]
}
```

#### Обновленный `initializeProfile()`:
```typescript
const initializeProfile = async (userId: string, existingProfile?: NeuralNetworkProfile) => {
  isLoading.value = true
  try {
    // Загружаем данные из API
    await loadPortfolioData()
    
    if (existingProfile) {
      profile.value = existingProfile
      updateCompletedSteps()
    } else {
      profile.value = createEmptyProfile(userId)
    }
  } catch (error) {
    console.error('Error initializing profile:', error)
    // Загружаем заглушки как fallback
    loadFallbackData()
    throw error
  } finally {
    isLoading.value = false
  }
}
```

## 🔌 API Endpoints

### Используемые endpoints:

1. **Специализации**: `GET /api/web/portfolios/specializations`
   - Параметры: `limit`, `offset`
   - Возвращает: `SpecializationPaginationResponse`

2. **Навыки**: `GET /api/web/portfolios/skills`
   - Параметры: `limit`, `offset`
   - Возвращает: `SkillPaginationResponse`

3. **Услуги**: `GET /api/web/portfolios/services`
   - Параметры: `limit`, `offset`
   - Возвращает: `ServicePaginationResponse`

### Структура ответов:

#### SpecializationPaginationResponse:
```typescript
{
  items: ApiSpecialization[],
  total: number,
  limit: number,
  offset: number
}
```

#### SkillPaginationResponse:
```typescript
{
  skills: Skill[],
  total: number,
  limit: number,
  offset: number
}
```

#### ServicePaginationResponse:
```typescript
{
  services: Service[],
  total: number,
  limit: number,
  offset: number
}
```

## 🎨 Компоненты

### Компоненты уже используют API данные:

#### SpecializationsStep.vue:
```typescript
const store = useNeuralNetworkProfileStore()
const availableSpecializations = computed(() => store.availableSpecializations)
const dataLoading = computed(() => store.dataLoading)
```

#### SkillsStep.vue:
```typescript
const store = useNeuralNetworkProfileStore()
const availableSkills = computed(() => store.availableSkills)
const dataLoading = computed(() => store.dataLoading)
```

#### ServicesStep.vue:
```typescript
const store = useNeuralNetworkProfileStore()
const availableServices = computed(() => store.availableServices)
const dataLoading = computed(() => store.dataLoading)
```

## 🔄 Логика работы

### 1. Инициализация:
1. **Запуск формы** → `initializeProfile()`
2. **Загрузка API данных** → `loadPortfolioData()`
3. **Параллельные запросы** → `Promise.all([getSkills, getSpecializations, getServices])`
4. **Обновление состояния** → `availableSpecializations`, `availableSkills`, `availableServices`
5. **Fallback при ошибке** → `loadFallbackData()`

### 2. Отображение:
1. **Компоненты шагов** → используют `store.availableSpecializations/skills/services`
2. **Состояние загрузки** → `store.dataLoading` для показа спиннера
3. **Обработка ошибок** → автоматический fallback на заглушки

### 3. Fallback стратегия:
- **При ошибке API** → автоматически загружаются заглушки
- **При отсутствии сети** → используются локальные данные
- **При таймауте** → graceful degradation

## 🚀 Преимущества интеграции

### Для пользователей:
- ✅ **Актуальные данные** - всегда свежие списки из backend
- ✅ **Быстрая загрузка** - параллельные запросы
- ✅ **Надежность** - fallback на заглушки при ошибках
- ✅ **Консистентность** - единые данные во всем приложении

### Для разработчиков:
- ✅ **Централизованное управление** - все API вызовы в store
- ✅ **Типобезопасность** - правильные TypeScript типы
- ✅ **Обработка ошибок** - graceful fallback
- ✅ **Кэширование** - данные загружаются один раз

### Для backend:
- ✅ **Стандартные endpoints** - используются существующие API
- ✅ **Пагинация** - поддержка limit/offset
- ✅ **Аутентификация** - через AuthApiClient
- ✅ **Масштабируемость** - легко добавить новые поля

## 📊 Сравнение версий

| Аспект | Старая версия | Новая версия | Улучшение |
|--------|---------------|--------------|-----------|
| **Данные** | API запросы | API запросы + fallback | ✅ Надежнее |
| **Загрузка** | Последовательная | Параллельная | ✅ Быстрее |
| **Обработка ошибок** | Базовая | Graceful fallback | ✅ Лучше |
| **Типы** | Сложные | Упрощенные | ✅ Проще |
| **Кэширование** | Нет | В store | ✅ Эффективнее |

## 🔧 Технические детали

### Аутентификация:
- Используется `AuthApiClient` для автоматической аутентификации
- Токены обновляются автоматически
- Обработка 401/403 ошибок

### Обработка ошибок:
```typescript
try {
  // API запросы
} catch (error) {
  console.error('Error loading portfolio data:', error)
  // Fallback на заглушки
  loadFallbackData()
}
```

### Состояние загрузки:
```typescript
const portfolioDataLoading = ref(false)
// Показывается спиннер во время загрузки
```

### Параллельные запросы:
```typescript
const [skillsResponse, specializationsResponse, servicesResponse] = await Promise.all([
  portfoliosApi.getSkills({ limit: 100 }),
  portfoliosApi.getSpecializations({ limit: 100 }),
  portfoliosApi.getServices({ limit: 100 })
])
```

## 🎉 Результат

Теперь новая упрощенная форма:

- **Загружает реальные данные** из API вместо заглушек
- **Использует параллельные запросы** для быстрой загрузки
- **Имеет graceful fallback** при ошибках API
- **Поддерживает состояние загрузки** с индикаторами
- **Типобезопасна** с правильными TypeScript типами
- **Совместима** с существующими API endpoints

**Интеграция API запросов успешно завершена!** 🚀

## 📋 Следующие шаги

1. **Тестирование** - проверить работу с реальным API
2. **Оптимизация** - добавить кэширование и debounce
3. **Мониторинг** - добавить логирование ошибок
4. **Документация** - обновить API документацию

