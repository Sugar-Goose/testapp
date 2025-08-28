<template>
  <div class="auth-page">
    <SplineComp />

    <div class="logo">
      <div class="logo-icon">
        <i class="fas fa-chart-line"></i>
      </div>
      <span class="logo-text">Savage Investor</span>
    </div>

    <div class="auth-container">
      <div class="auth-card">
        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
        </div>

        <AuthForm v-if="!showTwoFactor && !showSuccess" :is-login="isLogin" @submit="handleAuthSubmit"
          @mode-change="toggleAuthMode" />

        <TwoFactorAuth v-else-if="showTwoFactor && !showSuccess" :secret-code="twoFactorSecret"
          :qr-code="twoFactorQrCode" :otpauth-url="twoFactorOtpauthUrl" :is-login="isLogin"
          @verify="handleTwoFactorVerify" @cancel="showTwoFactor = false" />

        <AuthSuccess v-else-if="showSuccess" :user-email="formData.email" @logout="handleLogout"
          @auth-success="$emit('auth-success')" />
      </div>
    </div>


  </div>
</template>

<script>
import AuthForm from './AuthForm.vue'
import TwoFactorAuth from './TwoFactorAuth.vue'
import AuthSuccess from './AuthSuccess.vue'
import SplineComp from './SplineComp.vue'
import {
  registerUser,
  setupTwoFactorAuth,
  verifyTwoFactorAuth,
  loginUser,
  setAuthToken,
  getAuthToken,
  setUserCredentials,
  getUserCredentials,
  validateToken
} from '../services/api.js'

export default {
  name: 'AuthPage',
  components: {
    AuthForm,
    TwoFactorAuth,
    AuthSuccess,
    SplineComp
  },
  data() {
    return {
      isLogin: true,
      showTwoFactor: false,
      showSuccess: false,
      twoFactorSecret: '',
      twoFactorQrCode: '',
      twoFactorOtpauthUrl: '',
      isLoading: false,
      errorMessage: '',
      formData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    toggleAuthMode() {
      this.isLogin = !this.isLogin
      this.showTwoFactor = false
      this.errorMessage = ''
    },
    async handleAuthSubmit(authData) {
      try {
        this.isLoading = true
        this.errorMessage = ''


        this.formData = { ...authData.data }

        if (this.isLogin) {
          this.showTwoFactor = true
        } else {
          const registerResult = await registerUser(
            authData.data.email,
            authData.data.password
          )
          console.log('Регистрация успешна:', registerResult)
          console.log('Тип ответа:', typeof registerResult)
          console.log('Ключи ответа:', Object.keys(registerResult))

          console.log('Выполняем вход после регистрации...')
          const loginResult = await loginUser(
            authData.data.email,
            authData.data.password,
            '000000' // Временный код 2FA для первого входа
          )
          console.log('Вход после регистрации:', loginResult)

          if (loginResult.token) {
            setAuthToken(loginResult.token)
            setUserCredentials(authData.data.email, authData.data.password)
            console.log('Токен сохранен после входа:', loginResult.token)
          } else if (loginResult.accessToken) {
            setAuthToken(loginResult.accessToken)
            setUserCredentials(authData.data.email, authData.data.password)
            console.log('Access token сохранен после входа:', loginResult.accessToken)
          } else if (loginResult.access_token) {
            setAuthToken(loginResult.access_token)
            setUserCredentials(authData.data.email, authData.data.password)
            console.log('Access token сохранен после входа:', loginResult.access_token)
          } else {
            console.log('Токен не найден в ответе входа:', loginResult)
          }

          const currentToken = getAuthToken()
          console.log('Текущий токен перед 2FA:', currentToken)

          const twoFactorResult = await setupTwoFactorAuth()
          console.log('2FA настройка:', twoFactorResult)

          this.twoFactorSecret = twoFactorResult.secret || 'T7AL C2KD ONB5 TWL2 WHPM GNUQ 65UZ WKJB'
          this.twoFactorQrCode = twoFactorResult.qrCode || ''
          this.twoFactorOtpauthUrl = twoFactorResult.otpauthUrl || ''

          this.showTwoFactor = true
        }
      } catch (error) {
        console.error('Ошибка аутентификации:', error)
        this.errorMessage = error.message || 'Произошла ошибка при аутентификации'
      } finally {
        this.isLoading = false
      }
    },
    async handleTwoFactorVerify(twoFactorData) {
      try {
        this.isLoading = true
        this.errorMessage = ''

        if (this.isLogin) {
          const loginResult = await loginUser(
            this.formData.email,
            this.formData.password,
            twoFactorData.code
          )
          console.log('Вход выполнен:', loginResult)

          if (loginResult.token) {
            setAuthToken(loginResult.token)
            setUserCredentials(this.formData.email, this.formData.password)
          } else if (loginResult.accessToken) {
            setAuthToken(loginResult.accessToken)
            setUserCredentials(this.formData.email, this.formData.password)
          } else if (loginResult.access_token) {
            setAuthToken(loginResult.access_token)
            setUserCredentials(this.formData.email, this.formData.password)
          }
        } else {
          const verifyResult = await verifyTwoFactorAuth(twoFactorData.code)
          console.log('2FA верифицирован:', verifyResult)

          if (verifyResult.token) {
            setAuthToken(verifyResult.token)
          } else if (verifyResult.accessToken) {
            setAuthToken(verifyResult.accessToken)
          } else if (verifyResult.access_token) {
            setAuthToken(verifyResult.access_token)
          }
        }

        console.log('Аутентификация завершена успешно!')
        this.showSuccess = true
        this.showTwoFactor = false

        this.$emit('auth-success')

      } catch (error) {
        console.error('Ошибка 2FA:', error)
        this.errorMessage = error.message || 'Ошибка верификации 2FA'
      } finally {
        this.isLoading = false
      }
    },
    async handleAutoLogin() {
      try {
        const credentials = getUserCredentials()

        if (!credentials.email || !credentials.password) {
          console.log('Нет сохраненных данных пользователя')
          setAuthToken(null)
          return
        }

        const userInfo = await validateToken(credentials.email, credentials.password, '000000')
        console.log('Токен валиден, информация о пользователе:', userInfo)

        this.formData = {
          email: credentials.email,
          password: ''
        }

        this.showSuccess = true
        this.showTwoFactor = false
        this.isLogin = true

        console.log('Автоматический вход выполнен')
      } catch (error) {
        console.error('Ошибка автоматического входа:', error)
        setAuthToken(null)
        setUserCredentials(null, null)
        this.showSuccess = false
        this.showTwoFactor = false
        this.isLogin = true
      }
    },
    handleLogout() {
      setAuthToken(null)
      setUserCredentials(null, null)
      this.showSuccess = false
      this.showTwoFactor = false
      this.isLogin = true
      this.errorMessage = ''
      this.formData = {
        email: '',
        password: ''
      }

      console.log('Пользователь вышел из системы')
    }
  }
}
</script>

<style scoped>
.auth-page {
  height: 100vh;
  width: 100vw;
  background: #000;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.logo {
  position: absolute;
  top: 32px;
  left: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: #6E5CF7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon i {
  color: #ffffff;
  font-size: 20px;
}

.logo-text {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}

.auth-container {
  pointer-events: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 3;
  position: relative;
}

.auth-card {
  pointer-events: all;
  background: rgba(26, 26, 46, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(45, 45, 68, 0.5);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .logo {
    top: 20px;
    left: 20px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
  }

  .logo-icon i {
    font-size: 18px;
  }

  .logo-text {
    font-size: 18px;
  }

  .auth-container {
    padding: 16px;
  }

  .auth-card {
    padding: 32px 24px;
    border-radius: 16px;
  }
}

@media (max-width: 480px) {
  .logo {
    top: 16px;
    left: 16px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-icon i {
    font-size: 16px;
  }

  .logo-text {
    font-size: 16px;
  }

  .auth-container {
    padding: 12px;
  }

  .auth-card {
    padding: 24px 20px;
    border-radius: 12px;
  }
}

@media (max-width: 360px) {
  .logo {
    top: 12px;
    left: 12px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .logo-icon i {
    font-size: 14px;
  }

  .logo-text {
    font-size: 14px;
  }

  .auth-container {
    padding: 8px;
  }

  .auth-card {
    padding: 20px 16px;
    border-radius: 10px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-card {
  animation: fadeIn 0.6s ease-out;
  position: relative;
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc3545;
  font-size: 14px;
}

.error-message i {
  font-size: 16px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  z-index: 10;
}

.loading-spinner {
  color: #6E5CF7;
  font-size: 24px;
}
</style>
