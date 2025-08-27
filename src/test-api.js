// Тестовый файл для проверки работы API
import { 
  registerUser, 
  setupTwoFactorAuth, 
  verifyTwoFactorAuth, 
  loginUser,
  setAuthToken,
  getAuthToken 
} from './api.js'

// Функция для тестирования регистрации
export async function testRegistration() {
  console.log('🧪 Тестирование регистрации...')
  try {
    const result = await registerUser('test@example.com', 'TestPassword123')
    console.log('✅ Регистрация успешна:', result)
    return result
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error.message)
    throw error
  }
}

// Функция для тестирования настройки 2FA
export async function testSetup2FA() {
  console.log('🧪 Тестирование настройки 2FA...')
  try {
    const result = await setupTwoFactorAuth()
    console.log('✅ 2FA настройка успешна:', result)
    return result
  } catch (error) {
    console.error('❌ Ошибка настройки 2FA:', error.message)
    throw error
  }
}

// Функция для тестирования верификации 2FA
export async function testVerify2FA(token) {
  console.log('🧪 Тестирование верификации 2FA...')
  try {
    const result = await verifyTwoFactorAuth(token)
    console.log('✅ 2FA верификация успешна:', result)
    return result
  } catch (error) {
    console.error('❌ Ошибка верификации 2FA:', error.message)
    throw error
  }
}

// Функция для тестирования входа
export async function testLogin(email, password, twoFactorCode) {
  console.log('🧪 Тестирование входа...')
  try {
    const result = await loginUser(email, password, twoFactorCode)
    console.log('✅ Вход успешен:', result)
    
    // Сохраняем токен
    if (result.token) {
      setAuthToken(result.token)
      console.log('💾 Токен сохранен')
    }
    
    return result
  } catch (error) {
    console.error('❌ Ошибка входа:', error.message)
    throw error
  }
}

// Функция для тестирования управления токенами
export function testTokenManagement() {
  console.log('🧪 Тестирование управления токенами...')
  
  // Проверяем текущий токен
  const currentToken = getAuthToken()
  console.log('📋 Текущий токен:', currentToken ? 'Есть' : 'Нет')
  
  // Устанавливаем тестовый токен
  setAuthToken('test-token-123')
  console.log('💾 Тестовый токен установлен')
  
  // Проверяем токен снова
  const newToken = getAuthToken()
  console.log('📋 Новый токен:', newToken)
  
  // Очищаем токен
  setAuthToken(null)
  console.log('🗑️ Токен очищен')
  
  const clearedToken = getAuthToken()
  console.log('📋 Токен после очистки:', clearedToken ? 'Есть' : 'Нет')
}

// Функция для полного тестирования
export async function runFullTest() {
  console.log('🚀 Запуск полного тестирования API...')
  
  try {
    // Тест 1: Регистрация
    await testRegistration()
    
         // Тест 2: Настройка 2FA
     // eslint-disable-next-line no-unused-vars
     const twoFactorResult = await testSetup2FA()
    
    // Тест 3: Верификация 2FA (с тестовым кодом)
    await testVerify2FA('123456')
    
    // Тест 4: Вход в систему
    await testLogin('test@example.com', 'TestPassword123', '123456')
    
    // Тест 5: Управление токенами
    testTokenManagement()
    
    console.log('🎉 Все тесты пройдены успешно!')
  } catch (error) {
    console.error('💥 Тестирование завершено с ошибками:', error.message)
  }
}

// Экспорт для использования в консоли браузера
if (typeof window !== 'undefined') {
  window.testAPI = {
    testRegistration,
    testSetup2FA,
    testVerify2FA,
    testLogin,
    testTokenManagement,
    runFullTest
  }
  
  console.log('🧪 API тесты доступны в window.testAPI')
  console.log('Пример использования: window.testAPI.runFullTest()')
}
