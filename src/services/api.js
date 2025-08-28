const API_BASE_URL = 'https://api.ic.savagealphas.com/';

async function makeRequest(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${API_BASE_URL}${cleanEndpoint}`;

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
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export async function registerUser(email, password) {
    return makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });
}

export async function setupTwoFactorAuth() {
    return makeAuthenticatedRequest('/auth/2fa/setup', {
        method: 'POST'
    });
}

export async function verifyTwoFactorAuth(token) {
    return makeAuthenticatedRequest('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({
            token
        })
    });
}

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

export function setAuthToken(token) {
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
}

export function setUserCredentials(email, password) {
    if (email && password) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
    } else {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPassword');
    }
}

export function getUserCredentials() {
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('userPassword');
    return { email, password };
}

export function getAuthToken() {
    return localStorage.getItem('authToken');
}

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

export async function validateToken(email, password, twoFactorCode) {
    try {
        const result = await loginUser(email, password, twoFactorCode);

        if (result.token || result.accessToken || result.access_token) {
            const newToken = result.token || result.accessToken || result.access_token;
            setAuthToken(newToken);
            console.log('Токен обновлен:', newToken);
        }

        return result;
    } catch (error) {
        console.error('Token validation failed:', error);
        throw error;
    }
}

export async function validateTokenStored() {
    const token = getAuthToken();
    if (token) {
        console.log('Токен найден в localStorage:', token.substring(0, 20) + '...');
        return true;
    } else {
        console.log('Токен не найден в localStorage');
        return false;
    }
}

export default {
    registerUser,
    setupTwoFactorAuth,
    verifyTwoFactorAuth,
    loginUser,
    setAuthToken,
    getAuthToken,
    setUserCredentials,
    getUserCredentials,
    makeAuthenticatedRequest,
    validateToken,
    validateTokenStored
};
