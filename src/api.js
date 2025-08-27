// API библиотека для работы с аутентификацией
// Базовый URL API (замените на ваш реальный URL)
const API_BASE_URL = 'https://api.ic.savagealphas.com/api/'; // Измените на ваш URL

/**
 * Универсальная функция для выполнения HTTP запросов
 * @param {string} endpoint - эндпоинт API
 * @param {Object} options - опции запроса
 * @returns {Promise} - промис с результатом запроса
 */
async function makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const requestOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Регистрация нового пользователя
 * @param {string} email - email пользователя
 * @param {string} password - пароль пользователя
 * @returns {Promise} - промис с результатом регистрации
 */
export async function registerUser(email, password) {
    return makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });
}

/**
 * Настройка двухфакторной аутентификации
 * @returns {Promise} - промис с результатом настройки 2FA
 */
export async function setupTwoFactorAuth() {
    return makeRequest('/auth/2fa/setup', {
        method: 'POST'
    });
}

/**
 * Верификация двухфакторной аутентификации
 * @param {string} token - токен 2FA
 * @returns {Promise} - промис с результатом верификации
 */
export async function verifyTwoFactorAuth(token) {
    return makeRequest('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({
            token
        })
    });
}

/**
 * Вход пользователя в систему
 * @param {string} email - email пользователя
 * @param {string} password - пароль пользователя
 * @param {string} twoFactorCode - код двухфакторной аутентификации
 * @returns {Promise} - промис с результатом входа
 */
export async function loginUser(email, password, twoFactorCode) {
    return makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            twoFactorCode
        })
    });
}

/**
 * Установка токена аутентификации в заголовки
 * @param {string} token - JWT токен
 */
export function setAuthToken(token) {
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
}

/**
 * Получение токена аутентификации
 * @returns {string|null} - токен или null
 */
export function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Создание запроса с авторизацией
 * @param {string} endpoint - эндпоинт API
 * @param {Object} options - опции запроса
 * @returns {Promise} - промис с результатом запроса
 */
export async function makeAuthenticatedRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    };

    return makeRequest(endpoint, authOptions);
}

// Экспорт всех функций
export default {
    registerUser,
    setupTwoFactorAuth,
    verifyTwoFactorAuth,
    loginUser,
    setAuthToken,
    getAuthToken,
    makeAuthenticatedRequest
};
