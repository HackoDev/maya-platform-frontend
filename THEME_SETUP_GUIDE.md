# Настройка системы переключения тем 🌓

## Что изменилось

✅ **Исправлена проблема**: Теперь при переключении темы в настройках профиля все страницы автоматически меняют стиль
✅ **Удален переключатель**: Убран переключатель темы из шапки сайта
✅ **Темная тема по умолчанию**: Все новые пользователи получают темную тему по умолчанию
✅ **Настройки профиля**: Тема теперь управляется только через настройки профиля

## Основные изменения

### 1. Конфигурация Tailwind CSS
```js
// tailwind.config.js
export default {
  // ...
  darkMode: 'class', // Включена поддержка темной темы через CSS класс
  // ...
}
```

### 2. Обновлённые CSS переменные
```css
/* base.css */

/* Светлая тема (по умолчанию) */
:root,
.light {
  --color-background: #ffffff;
  --color-text: #2c3e50;
  /* другие переменные */
}

/* Темная тема через CSS класс */
.dark {
  --color-background: #181818;
  --color-text: #ffffff;
  /* другие переменные */
}

/* Fallback для системных предпочтений */
@media (prefers-color-scheme: dark) {
  :root:not(.light):not(.dark) {
    /* темная тема когда нет ручного выбора */
  }
}
```

### 3. Обновлённый Theme Store
Теперь добавляет соответствующие CSS классы к элементу `<html>`:
- `.light` - для светлой темы
- `.dark` - для темной темы
- Никакого класса - для системной темы (использует media query)

## Как это работает

### Приоритет применения тем:
1. **Ручной выбор** (высший приоритет): `.light` или `.dark` классы
2. **Системные предпочтения** (fallback): `prefers-color-scheme: dark`

### Tailwind CSS классы:
```html
<!-- Эти классы теперь корректно переключаются -->
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  Содержимое автоматически меняет стиль
</div>
```

### CSS переменные:
```css
/* Автоматически обновляются при смене темы */
.my-component {
  background-color: var(--color-background);
  color: var(--color-text);
}
```

## Тестирование

1. **Откройте приложение**: http://localhost:3004/
2. **Проверьте дефолтную тему**: Приложение должно открыться в темной теме
3. **Перейдите в настройки профиля**: `/profile-settings`
4. **Найдите секцию "Тема интерфейса"**: Локализована после смены пароля
5. **Протестируйте переключение**:
   - Светлая тема
   - Темная тема (по умолчанию)
   - Системная тема (следует предпочтениям ОС)

### Дополнительный тест
Откройте тестовую страницу: http://localhost:3004/theme-test.html

## Что нужно знать разработчикам

### Для новых компонентов:
```vue
<template>
  <!-- Используйте Tailwind классы с dark: префиксом -->
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
      Заголовок
    </h1>
  </div>
</template>
```

### Для кастомных CSS:
```css
.my-component {
  /* Используйте CSS переменные */
  background-color: var(--color-background);
  color: var(--color-text);
  border-color: var(--color-border);
}

/* Или CSS классы с селекторами */
.my-component {
  background-color: white;
}

.dark .my-component {
  background-color: #1a1a1a;
}
```

### Использование в JavaScript:
```js
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Получить текущую тему
console.log(themeStore.currentTheme) // 'light' | 'dark' | 'system'
console.log(themeStore.isDarkMode)   // boolean

// Изменить тему
themeStore.setTheme('dark')
themeStore.toggleTheme()  // Переключить light/dark
themeStore.cycleTheme()   // Циклично: light → dark → system
```

## Решенные проблемы

- ❌ **Было**: Стили реагировали только на `prefers-color-scheme: dark`
- ✅ **Стало**: Стили реагируют на ручное переключение + системные предпочтения
- ✅ **Совместимость**: Все существующие Tailwind классы работают корректно
- ✅ **Fallback**: Системные предпочтения работают как запасной вариант

## Команды для разработки

```bash
# Запуск в режиме разработки
pnpm dev

# Проверка типов
pnpm type-check

# Сборка для продакшена
pnpm build

# Тестирование
pnpm test
```

🎉 **Готово!** Теперь переключение темы работает корректно на всех страницах.