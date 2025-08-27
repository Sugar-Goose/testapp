<template>
  <div class="auth-success">
    <div class="success-header">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2 class="success-title">Authentication Successful!</h2>
      <p class="success-subtitle">Welcome to your investor cabinet</p>
    </div>

    <div class="success-content">
      <div class="user-info">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-details">
          <h3 class="user-name">{{ userEmail }}</h3>
          <p class="user-status">Authenticated</p>
        </div>
      </div>

      <div class="security-badge">
        <i class="fas fa-shield-alt"></i>
        <span>2FA Enabled</span>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="goToDashboard" class="dashboard-button">
        <i class="fas fa-chart-line"></i>
        Go to Dashboard
      </button>
      <button @click="logout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getAuthToken } from '../api.js'

export default {
  name: 'AuthSuccess',
  props: {
    userEmail: {
      type: String,
      required: true
    }
  },
  emits: ['logout'],
  methods: {
    goToDashboard() {
      // Здесь можно добавить навигацию к дашборду
      console.log('Переход к дашборду')
      // this.$router.push('/dashboard')
    },
    logout() {
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>
.auth-success {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.success-header {
  margin-bottom: 32px;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.success-icon i {
  color: #ffffff;
  font-size: 32px;
}

.success-title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}

.success-subtitle {
  color: #8b8b9f;
  font-size: 14px;
  margin: 0;
}

.success-content {
  margin-bottom: 32px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: #6E5CF7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar i {
  color: #ffffff;
  font-size: 20px;
}

.user-details {
  text-align: left;
  flex: 1;
}

.user-name {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
}

.user-status {
  color: #28a745;
  font-size: 12px;
  margin: 0;
}

.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #28a745;
  font-size: 14px;
  font-weight: 500;
}

.security-badge i {
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.dashboard-button,
.logout-button {
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

.dashboard-button {
  background: #ffffff;
  color: #1a1a2e;
}

.dashboard-button:hover {
  background: #f0f0f0;
}

.logout-button {
  background: #2d2d44;
  color: #ffffff;
  border: 1px solid #3d3d54;
}

.logout-button:hover {
  background: #3d3d54;
}

/* Медиа запросы */
@media (max-width: 768px) {
  .success-icon {
    width: 56px;
    height: 56px;
  }
  
  .success-icon i {
    font-size: 28px;
  }
  
  .success-title {
    font-size: 20px;
  }
  
  .user-info {
    padding: 16px;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
  }
  
  .user-avatar i {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .dashboard-button,
  .logout-button {
    padding: 12px 20px;
  }
}
</style>
