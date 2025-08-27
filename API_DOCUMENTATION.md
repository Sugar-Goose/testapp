# API Библиотека для Аутентификации

Эта библиотека предоставляет функции для работы с API аутентификации, включая регистрацию, вход в систему и двухфакторную аутентификацию.

## Установка и настройка

1. Убедитесь, что файл `src/api.js` находится в вашем проекте
2. Измените `API_BASE_URL` в файле `api.js` на ваш реальный URL сервера
3. Импортируйте нужные функции в ваши компоненты

## Доступные функции

### 1. Регистрация пользователя
```javascript
import { registerUser } from './api.js';

const result = await registerUser('user@example.com', 'password123');
```

**Параметры:**
- `email` (string) - email пользователя
- `password` (string) - пароль пользователя

**Возвращает:** Promise с результатом регистрации

### 2. Настройка двухфакторной аутентификации
```javascript
import { setupTwoFactorAuth } from './api.js';

const result = await setupTwoFactorAuth();
```

**Возвращает:** Promise с данными для настройки 2FA

### 3. Верификация двухфакторной аутентификации
```javascript
import { verifyTwoFactorAuth } from './api.js';

const result = await verifyTwoFactorAuth('123456');
```

**Параметры:**
- `token` (string) - токен 2FA

**Возвращает:** Promise с результатом верификации

### 4. Вход в систему
```javascript
import { loginUser } from './api.js';

const result = await loginUser('user@example.com', 'password123', '123456');
```

**Параметры:**
- `email` (string) - email пользователя
- `password` (string) - пароль пользователя
- `twoFactorCode` (string) - код двухфакторной аутентификации

**Возвращает:** Promise с токеном аутентификации

### 5. Управление токенами
```javascript
import { setAuthToken, getAuthToken } from './api.js';

// Сохранение токена
setAuthToken('your-jwt-token');

// Получение токена
const token = getAuthToken();
```

### 6. Авторизованные запросы
```javascript
import { makeAuthenticatedRequest } from './api.js';

const result = await makeAuthenticatedRequest('/protected-endpoint', {
    method: 'GET'
});
```

## Примеры использования в Vue.js компонентах

### Компонент регистрации
```vue
<template>
  <form @submit.prevent="handleRegister">
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <input v-model="twoFactorCode" type="text" placeholder="2FA Code" required>
    <button type="submit">Зарегистрироваться</button>
  </form>
</template>

<script>
import { registerUser } from './api.js';

export default {
  data() {
    return {
      email: '',
      password: '',
      twoFactorCode: ''
    }
  },
  methods: {
    async handleRegister() {
      try {
        const result = await registerUser(this.email, this.password, this.twoFactorCode);
        console.log('Регистрация успешна:', result);
        // Перенаправление или другие действия
      } catch (error) {
        console.error('Ошибка регистрации:', error);
      }
    }
  }
}
</script>
```

### Компонент входа
```vue
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <input v-model="twoFactorCode" type="text" placeholder="2FA Code" required>
    <button type="submit">Войти</button>
  </form>
</template>

<script>
import { loginUser, setAuthToken } from './api.js';

export default {
  data() {
    return {
      email: '',
      password: '',
      twoFactorCode: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const result = await loginUser(this.email, this.password, this.twoFactorCode);
        setAuthToken(result.token);
        console.log('Вход выполнен:', result);
        // Перенаправление или другие действия
      } catch (error) {
        console.error('Ошибка входа:', error);
      }
    }
  }
}
</script>
```

## Обработка ошибок

Все функции API возвращают Promise, поэтому используйте try-catch для обработки ошибок:

```javascript
try {
  const result = await registerUser(email, password);
  // Успешная обработка
} catch (error) {
  // Обработка ошибки
  console.error('API Error:', error.message);
}
```

## Настройка базового URL

Измените константу `API_BASE_URL` в файле `src/api.js`:

```javascript
const API_BASE_URL = 'https://your-api-server.com/api';
```

## Безопасность

- Токены аутентификации сохраняются в localStorage
- Все запросы отправляются с заголовком `Content-Type: application/json`
- Авторизованные запросы автоматически включают заголовок `Authorization: Bearer <token>`

## Поддерживаемые эндпоинты

- `POST /auth/register` - Регистрация пользователя
- `POST /auth/2fa/setup` - Настройка 2FA
- `POST /auth/2fa/verify` - Верификация 2FA
- `POST /auth/login` - Вход в систему
