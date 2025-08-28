<template>
  <div class="main-app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <span class="logo-text">Savage Investor</span>
        </div>

        <div class="user-menu">
          <div class="user-info">
            <i class="fas fa-user-circle"></i>
            <span class="user-email">{{ userEmail }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            Выйти
          </button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="welcome-section">
        <h1>Добро пожаловать в Savage Investor!</h1>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <h3>Аналитика</h3>
          <p>Просматривайте детальную аналитику ваших инвестиций</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-wallet"></i>
          </div>
          <h3>Портфель</h3>
          <p>Управляйте своим инвестиционным портфелем</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-bell"></i>
          </div>
          <h3>Уведомления</h3>
          <p>Получайте уведомления о важных событиях</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-cog"></i>
          </div>
          <h3>Настройки</h3>
          <p>Настройте параметры безопасности и уведомлений</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getUserCredentials, setAuthToken, setUserCredentials } from '../services/api.js'

export default {
  name: 'MainApp',
  data() {
    return {
      userEmail: ''
    }
  },
  mounted() {
    const credentials = getUserCredentials()
    this.userEmail = credentials.email || 'Пользователь'
  },
  methods: {
    handleLogout() {
      setAuthToken(null)
      setUserCredentials(null, null)

      this.$emit('logout')
    }
  }
}
</script>

<style scoped>
.main-app {
  height: 100vh;
  width: 100vw;
  background: #0f0f23;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(45, 45, 68, 0.5);
  padding: 16px 32px;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
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

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
}

.user-info i {
  font-size: 20px;
  color: #6E5CF7;
}

.user-email {
  font-size: 14px;
  opacity: 0.9;
}

.logout-btn {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  border-color: rgba(220, 53, 69, 0.5);
}

.app-main {
  flex: 1;
  padding: 40px 32px;
  overflow-y: auto;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out;
}

.welcome-section h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #6E5CF7, #8B7CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-section p {
  font-size: 18px;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.feature-card {
  background: rgba(26, 26, 46, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(45, 45, 68, 0.5);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(110, 92, 247, 0.3);
  box-shadow: 0 8px 32px rgba(110, 92, 247, 0.1);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6E5CF7, #8B7CF6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.feature-icon i {
  font-size: 28px;
  color: #ffffff;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.feature-card p {
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 12px 20px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .user-menu {
    width: 100%;
    justify-content: space-between;
  }

  .app-main {
    padding: 24px 20px;
  }

  .welcome-section h1 {
    font-size: 28px;
  }

  .welcome-section p {
    font-size: 16px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feature-card {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 10px 16px;
  }

  .app-main {
    padding: 20px 16px;
  }

  .welcome-section h1 {
    font-size: 24px;
  }

  .welcome-section p {
    font-size: 14px;
  }

  .feature-card {
    padding: 20px 16px;
  }

  .feature-icon {
    width: 56px;
    height: 56px;
  }

  .feature-icon i {
    font-size: 24px;
  }
}
</style>
