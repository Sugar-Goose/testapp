// Базовый URL API
const API_BASE_URL = 'https://api.ic.savagealphas.com/';

// Универсальная функция для API запросов
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

        const contentType = response.headers.get('content-type');

        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const textData = await response.text();
            
            try {
                data = JSON.parse(textData);
            } catch (parseError) {
                data = {
                    message: textData,
                    success: true,
                    statusCode: response.status
                };
            }
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export async function registerUser(email, password, referralCode = '') {
    return makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            referralCode
        })
    });
}

export async function verifyLogin(email, verificationCode) {
    return makeRequest('/auth/verify-login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            verificationCode
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

export async function loginUser(email, password, twoFactorCode = null) {
    const body = {
        email,
        password
    };
    
    if (twoFactorCode) {
        body.twoFactorCode = twoFactorCode;
    }
    
    return makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body)
    });
}


export function setAuthToken(token) {
    try {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    } catch (error) {
        console.error('Ошибка при работе с localStorage:', error);
        throw new Error('Не удалось сохранить токен авторизации');
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
    try {
        return localStorage.getItem('authToken');
    } catch (error) {
        console.error('Ошибка при чтении из localStorage:', error);
        return null;
    }
}

// Запросы с авторизацией
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
        }

        return result;
    } catch (error) {
        console.error('Token validation failed:', error);
        throw error;
    }
}

export async function validateTokenStored() {
    const token = getAuthToken();
    return !!token;
}

export async function getProjects() {
    return makeAuthenticatedRequest('/projects', {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    });
}

export async function getProjectPlans(projectId) {
    return makeAuthenticatedRequest(`/projects/${projectId}/plans`, {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    });
}

export async function getUserInvestments() {
    return makeAuthenticatedRequest('/investments', {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    });
}

export async function createInvestmentIntent(projectId, planId, expectedAmount) {
    return makeAuthenticatedRequest('/investments/intents', {
        method: 'POST',
        body: JSON.stringify({
            projectId,
            planId,
            expectedAmount
        })
    });
}

export async function createWithdrawalRequest(userInvestmentId, amount, wallet) {
    return makeAuthenticatedRequest('/investments/withdrawals', {
        method: 'POST',
        body: JSON.stringify({
            userInvestmentId,
            amount,
            wallet
        })
    });
}

export async function getWithdrawalDetails(investmentId) {
    return makeAuthenticatedRequest(`/investments/${investmentId}/withdrawals/details`, {
        method: 'GET',
        headers: {
            'accept': '*/*'
        }
    });
}

export default {
    registerUser,
    verifyLogin,
    setupTwoFactorAuth,
    verifyTwoFactorAuth,
    loginUser,
    setAuthToken,
    getAuthToken,
    setUserCredentials,
    getUserCredentials,
    makeAuthenticatedRequest,
    validateToken,
    validateTokenStored,
    getProjects,
    getProjectPlans,
    getUserInvestments,
    createInvestmentIntent,
    createWithdrawalRequest,
    getWithdrawalDetails
};
