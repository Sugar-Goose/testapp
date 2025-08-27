// Примеры использования API библиотеки
import { 
    registerUser, 
    setupTwoFactorAuth, 
    verifyTwoFactorAuth, 
    loginUser,
    setAuthToken,
    getAuthToken 
} from './api.js';

/**
 * Пример регистрации пользователя
 */
export async function exampleRegister() {
    try {
        const result = await registerUser('user@example.com', 'password123');
        console.log('Регистрация успешна:', result);
        return result;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        throw error;
    }
}

/**
 * Пример настройки 2FA
 */
export async function exampleSetup2FA() {
    try {
        const result = await setupTwoFactorAuth();
        console.log('2FA настроен:', result);
        return result;
    } catch (error) {
        console.error('Ошибка настройки 2FA:', error);
        throw error;
    }
}

/**
 * Пример верификации 2FA
 */
export async function exampleVerify2FA(token) {
    try {
        const result = await verifyTwoFactorAuth(token);
        console.log('2FA верифицирован:', result);
        return result;
    } catch (error) {
        console.error('Ошибка верификации 2FA:', error);
        throw error;
    }
}

/**
 * Пример входа в систему
 */
export async function exampleLogin(email, password, twoFactorCode) {
    try {
        const result = await loginUser(email, password, twoFactorCode);
        console.log('Вход выполнен:', result);
        
        // Сохраняем токен аутентификации
        if (result.token) {
            setAuthToken(result.token);
        }
        
        return result;
    } catch (error) {
        console.error('Ошибка входа:', error);
        throw error;
    }
}

/**
 * Пример полного процесса аутентификации
 */
export async function exampleFullAuthFlow() {
    try {
        // 1. Регистрация
        console.log('1. Регистрация пользователя...');
        await exampleRegister();
        
        // 2. Настройка 2FA
        console.log('2. Настройка 2FA...');
        const twoFactorSetup = await exampleSetup2FA();
        
        // 3. Верификация 2FA (здесь нужно получить токен от пользователя)
        console.log('3. Верификация 2FA...');
        // const twoFactorToken = '123456'; // Получить от пользователя
        // await exampleVerify2FA(twoFactorToken);
        
        // 4. Вход в систему
        console.log('4. Вход в систему...');
        // await exampleLogin('user@example.com', 'password123', '123456');
        
        console.log('Процесс аутентификации завершен');
    } catch (error) {
        console.error('Ошибка в процессе аутентификации:', error);
    }
}

/**
 * Проверка наличия токена аутентификации
 */
export function checkAuthStatus() {
    const token = getAuthToken();
    if (token) {
        console.log('Пользователь аутентифицирован');
        return true;
    } else {
        console.log('Пользователь не аутентифицирован');
        return false;
    }
}

/**
 * Выход из системы
 */
export function logout() {
    setAuthToken(null);
    console.log('Пользователь вышел из системы');
}
