<template>
  <div class="email-verification">
    <div class="verification-header">
      <div class="header-icon">
        <i class="fas fa-envelope-open"></i>
      </div>
      <h2 class="header-title">Подтверждение Email</h2>
      <p class="header-subtitle">
        Мы отправили код подтверждения на ваш email
      </p>
    </div>

    <div class="verification-content">
      <div class="email-info">
        <i class="fas fa-envelope"></i>
        <span>{{ email }}</span>
      </div>

      <div class="code-input-section">
        <h3 class="code-title">Введите код подтверждения</h3>
        <p class="code-subtitle">6-значный код из письма</p>

        <div class="code-inputs">
          <input 
            v-for="(digit, index) in 6" 
            :key="index" 
            type="text" 
            maxlength="1" 
            class="code-digit"
            :class="{ 'active': activeDigit === index }" 
            v-model="verificationCode[index]"
            @input="handleCodeInput($event, index)" 
            @focus="activeDigit = index" 
            @keydown="handleKeydown($event, index)"
            ref="codeInputs" 
          />
        </div>
      </div>

      <div class="resend-section">
        <p class="resend-text">
          Не получили код?
          <button type="button" @click="resendCode" :disabled="resendCooldown > 0" class="resend-btn">
            {{ resendCooldown > 0 ? `Отправить снова (${resendCooldown}s)` : 'Отправить снова' }}
          </button>
        </p>
      </div>
    </div>

    <div class="action-buttons">
      <button type="button" @click="$emit('cancel')" class="cancel-button">
        Отмена
      </button>
      <button type="button" @click="verifyCode" class="verify-button" :disabled="!isCodeComplete || verifying">
        <i v-if="verifying" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-check"></i>
        {{ verifying ? 'Проверка...' : 'Подтвердить' }}
      </button>
    </div>

    <div v-if="errorMessage" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
import { verifyLogin } from '../services/api.js'

export default {
  name: 'EmailVerification',
  props: {
    email: {
      type: String,
      required: true
    }
  },
  emits: ['verify', 'cancel'],
  data() {
    return {
      verificationCode: ['', '', '', '', '', ''],
      activeDigit: 0,
      verifying: false,
      errorMessage: '',
      resendCooldown: 0,
      resendTimer: null
    }
  },
  computed: {
    isCodeComplete() {
      return this.verificationCode.every(digit => digit !== '')
    }
  },
  mounted() {
    // Инициализация компонента верификации email
    console.log('EmailVerification mounted for email:', this.email)
  },
  beforeUnmount() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer)
    }
  },
  methods: {
    handleCodeInput(event, index) {
      const value = event.target.value
      if (value && /^\d$/.test(value)) {
        this.verificationCode[index] = value
        if (index < 5) {
          this.$nextTick(() => {
            this.$refs.codeInputs[index + 1]?.focus()
          })
        }
      } else {
        this.verificationCode[index] = ''
      }
    },
    
    handleKeydown(event, index) {
      if (event.key === 'Backspace' && !this.verificationCode[index] && index > 0) {
        this.$nextTick(() => {
          this.$refs.codeInputs[index - 1]?.focus()
        })
      }
    },
    
    async verifyCode() {
      if (!this.isCodeComplete) {
        this.errorMessage = 'Пожалуйста, введите полный код'
        return
      }
      
      this.verifying = true
      this.errorMessage = ''
      
      try {
        const code = this.verificationCode.join('')
        console.log('Отправляем код верификации:', code)
        console.log('Email для верификации:', this.email)
        
        const result = await verifyLogin(this.email, code)
        
        console.log('Login verification result:', result)
        console.log('Тип результата:', typeof result)
        console.log('Ключи результата:', Object.keys(result))
        if (!result) {
          throw new Error('Пустой ответ от сервера')
        }
        
        this.$emit('verify', { code, result })
        
      } catch (error) {
        console.error('Login verification error:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
        if (error.message.includes('401')) {
          this.errorMessage = 'Неверный код подтверждения'
        } else if (error.message.includes('400')) {
          this.errorMessage = 'Неверный формат кода'
        } else if (error.message.includes('500')) {
          this.errorMessage = 'Ошибка сервера. Попробуйте позже'
        } else {
          this.errorMessage = error.message || 'Ошибка подтверждения входа'
        }
      } finally {
        this.verifying = false
      }
    },
    
    async resendCode() {
      this.errorMessage = 'Повторная отправка кода не поддерживается'
    }
  }
}
</script>

<style scoped>
.email-verification {
  width: 100%;
  max-width: 400px;
}

.verification-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: #6E5CF7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.header-icon i {
  color: #ffffff;
  font-size: 20px;
}

.header-title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}

.header-subtitle {
  color: #8b8b9f;
  font-size: 14px;
  margin: 0;
}

.verification-content {
  margin-bottom: 32px;
}

.email-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(26, 26, 46, 0.3);
  border: 1px solid rgba(45, 45, 68, 0.5);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  color: #ffffff;
  font-size: 14px;
}

.email-info i {
  color: #6E5CF7;
}

.code-input-section {
  margin-bottom: 24px;
}

.code-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
  text-align: center;
}

.code-subtitle {
  color: #8b8b9f;
  font-size: 14px;
  margin: 0 0 20px;
  text-align: center;
}

.code-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.code-digit {
  width: 48px;
  height: 48px;
  background: #1a1a2e;
  border: 1px solid #2d2d44;
  border-radius: 8px;
  text-align: center;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  outline: none;
  transition: all 0.3s ease;
}

.code-digit.active {
  border-color: #6E5CF7;
  box-shadow: 0 0 0 2px rgba(110, 92, 247, 0.1);
}

.resend-section {
  text-align: center;
}

.resend-text {
  color: #8b8b9f;
  font-size: 14px;
  margin: 0;
}

.resend-btn {
  background: none;
  border: none;
  color: #6E5CF7;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.resend-btn:hover:not(:disabled) {
  color: #8B7CF6;
}

.resend-btn:disabled {
  color: #8b8b9f;
  cursor: not-allowed;
  text-decoration: none;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.cancel-button,
.verify-button {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cancel-button {
  background: #2d2d44;
  color: #ffffff;
}

.cancel-button:hover {
  background: #3d3d54;
}

.verify-button {
  background: #ffffff;
  color: #1a1a2e;
}

.verify-button:hover:not(:disabled) {
  background: #f0f0f0;
}

.verify-button:disabled {
  background: #2d2d44;
  color: #8b8b9f;
  cursor: not-allowed;
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc3545;
  font-size: 14px;
}

.error-message i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .code-digit {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 20px;
  }

  .code-digit {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .cancel-button,
  .verify-button {
    padding: 12px 20px;
  }
}
</style>
