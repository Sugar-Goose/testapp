<template>
  <div class="auth-form">
    <div class="form-header">
      <div class="header-icon">
        <i class="fas fa-shield-alt"></i>
      </div>
      <h1 class="header-title">{{ isLogin ? 'Sign In' : 'Create your account' }}</h1>
      <p class="header-subtitle">
        {{ isLogin ? 'Access your investor cabinet' : 'Secure your access with an authenticator app' }}
      </p>
    </div>

    <ProgressIndicator :steps="progressSteps" />

    <MethodToggle 
      v-model="selectedMethod" 
      :methods="authMethods"
    />

    <form @submit.prevent="handleSubmit" class="form-content">
      <InputField
        v-model="formData.email"
        label="Email Address"
        id="email"
        type="email"
        placeholder="investor@example.com"
        icon="fas fa-envelope"
        :has-error="errors.email"
        :error-message="errors.email"
      />

      <InputField
        v-model="formData.password"
        label="Password"
        id="password"
        type="password"
        placeholder="••••••••"
        icon="fas fa-lock"
        :action-icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
        :has-error="errors.password"
        :error-message="errors.password"
        :show-password="showPassword"
        @action="togglePasswordVisibility"
      />

      <InputField
        v-if="!isLogin"
        v-model="formData.confirmPassword"
        label="Confirm password"
        id="confirmPassword"
        type="password"
        placeholder="••••••••"
        icon="fas fa-lock"
        :action-icon="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
        :has-error="errors.confirmPassword"
        :error-message="errors.confirmPassword"
        :show-password="showConfirmPassword"
        @action="toggleConfirmPasswordVisibility"
      />

      <div class="form-actions">
        <a v-if="isLogin" href="#" class="forgot-password">Forgot password?</a>
        
        <button type="submit" class="submit-button" :disabled="!isFormValid">
          {{ isLogin ? 'Continue' : 'Sign up' }}
        </button>
      </div>
    </form>

    <div class="form-footer">
      <p class="footer-text">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <a href="#" @click.prevent="toggleMode" class="footer-link">
          {{ isLogin ? 'Sign up' : 'Sign in' }}
        </a>
      </p>
      
      <div v-if="isLogin" class="security-info">
        <i class="fas fa-check"></i>
        <span>Secure 2FA verification</span>
      </div>
    </div>
  </div>
</template>

<script>
import InputField from './InputField.vue'
import ProgressIndicator from './ProgressIndicator.vue'
import MethodToggle from './MethodToggle.vue'

export default {
  name: 'AuthForm',
  components: {
    InputField,
    ProgressIndicator,
    MethodToggle
  },
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  emits: ['submit', 'mode-change'],
  data() {
    return {
      selectedMethod: 'email',
      formData: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPassword: false
    }
  },
  computed: {
    authMethods() {
      return [
        { value: 'email', label: 'Email', icon: 'fas fa-envelope' },
        { value: 'phone', label: 'Phone', icon: 'fas fa-phone' }
      ]
    },
    progressSteps() {
      if (this.isLogin) {
        return [
          { number: 1, label: 'Sign in', active: true, completed: false },
          { number: 2, label: 'Verify', active: false, completed: false }
        ]
      } else {
        return [
          { number: 1, label: 'Sign up', active: true, completed: false },
          { number: 2, label: 'Setup 2FA', active: false, completed: false }
        ]
      }
    },
    isFormValid() {
      if (this.isLogin) {
        return this.formData.email && this.formData.password && !this.errors.email && !this.errors.password
      } else {
        return this.formData.email && this.formData.password && this.formData.confirmPassword && 
               !this.errors.email && !this.errors.password && !this.errors.confirmPassword
      }
    }
  },
  watch: {
    'formData.email'() {
      this.validateEmail()
    },
    'formData.password'() {
      this.validatePassword()
      if (!this.isLogin) {
        this.validateConfirmPassword()
      }
    },
    'formData.confirmPassword'() {
      if (!this.isLogin) {
        this.validateConfirmPassword()
      }
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.formData.email) {
        this.errors.email = 'Email is required'
      } else if (!emailRegex.test(this.formData.email)) {
        this.errors.email = 'Please enter a valid email address'
      } else {
        this.errors.email = ''
      }
    },
    validatePassword() {
      if (!this.formData.password) {
        this.errors.password = 'Password is required'
      } else if (this.formData.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.formData.password)) {
        this.errors.password = 'Password must contain uppercase, lowercase and number'
      } else {
        this.errors.password = ''
      }
    },
    validateConfirmPassword() {
      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
      } else if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
      } else {
        this.errors.confirmPassword = ''
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    toggleMode() {
      this.$emit('mode-change')
    },
    handleSubmit() {
      if (this.isFormValid) {
        this.$emit('submit', {
          method: this.selectedMethod,
          data: this.formData
        })
      }
    }
  }
}
</script>

<style scoped>
.auth-form {
  width: 100%;
  max-width: 400px;
}

.form-header {
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
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
}

.header-subtitle {
  color: #8b8b9f;
  font-size: 14px;
  margin: 0;
}

.form-content {
  margin-bottom: 24px;
}

.form-actions {
  margin-top: 24px;
}

.forgot-password {
  display: block;
  text-align: right;
  color: #6E5CF7;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 16px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #5a4fd8;
}

.submit-button {
  width: 100%;
  background: #ffffff;
  color: #1a1a2e;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.submit-button:hover:not(:disabled) {
  background: #f0f0f0;
}

.submit-button:disabled {
  background: #2d2d44;
  color: #8b8b9f;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
}

.footer-text {
  color: #8b8b9f;
  font-size: 14px;
  margin: 0 0 16px;
}

.footer-link {
  color: #6E5CF7;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #5a4fd8;
}

.security-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #8b8b9f;
  font-size: 12px;
}

.security-info i {
  color: #6E5CF7;
  font-size: 14px;
}

/* Медиа запросы */
@media (max-width: 768px) {
  .header-title {
    font-size: 24px;
  }
  
  .header-icon {
    width: 44px;
    height: 44px;
  }
  
  .header-icon i {
    font-size: 18px;
  }
  
  .submit-button {
    padding: 14px 20px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 20px;
  }
  
  .header-icon {
    width: 40px;
    height: 40px;
  }
  
  .header-icon i {
    font-size: 16px;
  }
  
  .submit-button {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .footer-text {
    font-size: 13px;
  }
}
</style>
