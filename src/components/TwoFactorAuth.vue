<template>
  <div class="two-factor-auth">
    <div class="auth-header">
      <div class="header-icon">
        <i class="fas fa-shield-alt"></i>
      </div>
      <h2 class="header-title">{{ isLogin ? 'Two-Factor Authentication' : 'Set Up Authenticator' }}</h2>
      <p class="header-subtitle">
        {{ isLogin ? 'Enter your 6-digit verification code' : 'Scan this QR code with your authenticator app' }}
      </p>
    </div>

    <div v-if="!isLogin" class="qr-section">
      <div class="qr-container">
        <div class="qr-placeholder">
          <i class="fas fa-qrcode"></i>
          <span>QR Code Placeholder</span>
        </div>
      </div>
    </div>

    <div v-if="!isLogin" class="manual-code-section">
      <p class="manual-text">Can't scan? Enter this code manually:</p>
      <div class="code-container">
        <input 
          type="text" 
          :value="secretCode" 
          readonly 
          class="secret-code-input"
        />
        <button @click="copyCode" class="copy-button">
          <i class="fas fa-copy"></i>
        </button>
      </div>
    </div>

    <div class="verification-section">
      <h3 class="verification-title">Verification Code</h3>
      <p class="verification-subtitle">Enter the 6-digit code</p>
      
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

    <div class="authenticator-apps">
      <h4 class="apps-title">Recommended Authenticator Apps</h4>
      <div class="apps-grid">
        <div 
          v-for="app in authenticatorApps" 
          :key="app.name"
          class="app-option"
          :class="{ 'selected': selectedApp === app.name }"
          @click="selectedApp = app.name"
        >
          <div class="app-radio">
            <div class="radio-circle"></div>
          </div>
          <span class="app-name">{{ app.name }}</span>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="$emit('cancel')" class="cancel-button">
        Cancel
      </button>
      <button 
        @click="verifyCode" 
        class="verify-button"
        :disabled="!isCodeComplete"
      >
        Verify & Continue
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoFactorAuth',
  props: {
    secretCode: {
      type: String,
      default: 'T7AL C2KD ONB5 TWL2 WHPM GNUQ 65UZ WKJB'
    },
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['verify', 'cancel'],
  data() {
    return {
      verificationCode: ['', '', '', '', '', ''],
      activeDigit: 0,
      selectedApp: 'Google Authenticator',
      authenticatorApps: [
        { name: 'Google Authenticator' },
        { name: 'Microsoft Authenticator' },
        { name: 'Authy' },
        { name: '1Password' }
      ]
    }
  },
  computed: {
    isCodeComplete() {
      return this.verificationCode.every(digit => digit !== '')
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
    copyCode() {
      navigator.clipboard.writeText(this.secretCode)
      // Можно добавить уведомление об успешном копировании
    },
    verifyCode() {
      const code = this.verificationCode.join('')
      this.$emit('verify', { code, app: this.selectedApp })
    }
  }
}
</script>

<style scoped>
.two-factor-auth {
  width: 100%;
  max-width: 400px;
}

.auth-header {
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

.qr-section {
  margin-bottom: 24px;
}

.qr-container {
  display: flex;
  justify-content: center;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.qr-placeholder i {
  font-size: 48px;
  color: #2d2d44;
}

.qr-placeholder span {
  color: #8b8b9f;
  font-size: 12px;
}

.manual-code-section {
  margin-bottom: 32px;
}

.manual-text {
  color: #8b8b9f;
  font-size: 14px;
  margin: 0 0 12px;
}

.code-container {
  display: flex;
  gap: 8px;
}

.secret-code-input {
  flex: 1;
  background: #1a1a2e;
  border: 1px solid #2d2d44;
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-family: monospace;
  font-size: 12px;
  outline: none;
}

.copy-button {
  background: #2d2d44;
  border: 1px solid #2d2d44;
  border-radius: 8px;
  padding: 12px;
  color: #8b8b9f;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-button:hover {
  background: #3d3d54;
  color: #ffffff;
}

.verification-section {
  margin-bottom: 32px;
}

.verification-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
}

.verification-subtitle {
  color: #8b8b9f;
  font-size: 14px;
  margin: 0 0 16px;
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

.authenticator-apps {
  margin-bottom: 32px;
}

.apps-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
}

.apps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.app-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #1a1a2e;
  border: 1px solid #2d2d44;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.app-option:hover {
  border-color: #3d3d54;
}

.app-option.selected {
  border-color: #6E5CF7;
  background: rgba(110, 92, 247, 0.1);
}

.app-radio {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-circle {
  width: 16px;
  height: 16px;
  border: 2px solid #2d2d44;
  border-radius: 50%;
  position: relative;
}

.app-option.selected .radio-circle {
  border-color: #6E5CF7;
}

.app-option.selected .radio-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #6E5CF7;
  border-radius: 50%;
}

.app-name {
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
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

/* Медиа запросы */
@media (max-width: 768px) {
  .qr-placeholder {
    width: 160px;
    height: 160px;
  }
  
  .qr-placeholder i {
    font-size: 36px;
  }
  
  .code-digit {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
  
  .apps-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 20px;
  }
  
  .qr-placeholder {
    width: 140px;
    height: 140px;
  }
  
  .qr-placeholder i {
    font-size: 32px;
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
