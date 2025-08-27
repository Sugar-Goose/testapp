# Руководство по интеграции API аутентификации

## Обзор

В проекте реализована полная интеграция с API аутентификации, включающая:
- Регистрацию пользователей
- Вход в систему
- Двухфакторную аутентификацию (2FA)
- Управление токенами

## Структура файлов

### Основные файлы API
- `src/api.js` - Основная библиотека API функций
- `src/api-examples.js` - Примеры использования
- `src/test-api.js` - Тестовые функции для разработки

### Компоненты
- `src/components/AuthPage.vue` - Главная страница аутентификации
- `src/components/AuthForm.vue` - Форма входа/регистрации
- `src/components/TwoFactorAuth.vue` - Компонент 2FA
- `src/components/AuthSuccess.vue` - Экран успешной аутентификации

## Настройка

### 1. URL API
В файле `src/api.js` измените базовый URL:
```javascript
const API_BASE_URL = 'https://api.ic.savagealphas.com/api/';
```

### 2. Импорт в компоненты
```javascript
import { 
  registerUser, 
  loginUser, 
  setupTwoFactorAuth, 
  verifyTwoFactorAuth,
  setAuthToken,
  getAuthToken 
} from '../api.js'
```

## Использование

### Регистрация пользователя
```javascript
try {
  const result = await registerUser('user@example.com', 'password123')
  console.log('Регистрация успешна:', result)
} catch (error) {
  console.error('Ошибка регистрации:', error.message)
}
```

### Вход в систему
```javascript
try {
  const result = await loginUser('user@example.com', 'password123', '123456')
  if (result.token) {
    setAuthToken(result.token)
  }
  console.log('Вход выполнен:', result)
} catch (error) {
  console.error('Ошибка входа:', error.message)
}
```

### Настройка 2FA
```javascript
try {
  const result = await setupTwoFactorAuth()
  console.log('2FA настроен:', result)
} catch (error) {
  console.error('Ошибка настройки 2FA:', error.message)
}
```

### Верификация 2FA
```javascript
try {
  const result = await verifyTwoFactorAuth('123456')
  console.log('2FA верифицирован:', result)
} catch (error) {
  console.error('Ошибка верификации 2FA:', error.message)
}
```

## Поток аутентификации

### Регистрация нового пользователя
1. Пользователь заполняет форму регистрации
2. Отправляется запрос `POST /auth/register`
3. Отправляется запрос `POST /auth/2fa/setup`
4. Показывается QR-код для настройки 2FA
5. Пользователь вводит код из приложения
6. Отправляется запрос `POST /auth/2fa/verify`
7. Показывается экран успеха

### Вход существующего пользователя
1. Пользователь заполняет форму входа
2. Показывается форма для ввода 2FA кода
3. Отправляется запрос `POST /auth/login` с кодом 2FA
4. Сохраняется токен аутентификации
5. Показывается экран успеха

## Управление токенами

### Сохранение токена
```javascript
setAuthToken('your-jwt-token')
```

### Получение токена
```javascript
const token = getAuthToken()
```

### Очистка токена
```javascript
setAuthToken(null)
```

### Авторизованные запросы
```javascript
import { makeAuthenticatedRequest } from '../api.js'

const result = await makeAuthenticatedRequest('/protected-endpoint', {
  method: 'GET'
})
```

## Тестирование

### В консоли браузера
Откройте консоль разработчика и используйте:
```javascript
// Запуск всех тестов
window.testAPI.runFullTest()

// Отдельные тесты
window.testAPI.testRegistration()
window.testAPI.testLogin('test@example.com', 'password123', '123456')
window.testAPI.testTokenManagement()
```

### Тестовые данные
- Email: `test@example.com`
- Password: `TestPassword123`
- 2FA Code: `123456`

## Обработка ошибок

Все API функции возвращают Promise и могут выбросить ошибки:

```javascript
try {
  const result = await registerUser(email, password)
  // Успешная обработка
} catch (error) {
  // Обработка ошибки
  console.error('API Error:', error.message)
  
  // Показать пользователю
  this.errorMessage = error.message
}
```

## Состояния компонентов

### AuthPage.vue
- `isLogin` - режим входа/регистрации
- `showTwoFactor` - показывать ли 2FA
- `showSuccess` - показывать ли экран успеха
- `isLoading` - состояние загрузки
- `errorMessage` - сообщение об ошибке

### TwoFactorAuth.vue
- `isLogin` - режим входа (скрывает QR-код)
- `secretCode` - секретный код для QR

## Безопасность

- Токены сохраняются в localStorage
- Все запросы используют HTTPS
- Автоматическое добавление заголовка Authorization
- Валидация данных на клиенте

## Расширение

### Добавление новых эндпоинтов
1. Добавьте функцию в `src/api.js`
2. Используйте `makeRequest()` или `makeAuthenticatedRequest()`
3. Добавьте тест в `src/test-api.js`

### Кастомизация UI
- Измените стили в компонентах
- Добавьте новые состояния загрузки
- Настройте сообщения об ошибках

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь в правильности URL API
3. Проверьте формат данных запросов
4. Используйте тестовые функции для диагностики
