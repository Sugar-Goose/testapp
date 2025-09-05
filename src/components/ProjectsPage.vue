<template>
  <div class="projects-page">
    <header class="page-header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <span class="logo-text">Savage Investor</span>
        </div>

        <div class="user-menu">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            Назад
          </button>
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

    <main class="page-main">
      <div class="page-title">
        <h1>Инвестиционные проекты</h1>
        <p>Выберите проект для инвестирования</p>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>Загрузка проектов...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>{{ error }}</p>
        <button @click="loadProjects" class="retry-btn">
          <i class="fas fa-redo"></i>
          Попробовать снова
        </button>
      </div>

      <div v-else-if="projects.length === 0" class="empty-container">
        <div class="empty-icon">
          <i class="fas fa-folder-open"></i>
        </div>
        <h3>Проекты не найдены</h3>
        <p>В данный момент нет доступных проектов для инвестирования</p>
        <button @click="loadProjects" class="retry-btn">
          <i class="fas fa-redo"></i>
          Обновить
        </button>
      </div>

      <div v-else class="projects-grid">
        <div 
          v-for="project in projects" 
          :key="project.id" 
          class="project-card"
          @click="openProjectDetails(project)"
        >
          <div class="project-icon">
            <i class="fas fa-building"></i>
          </div>
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
          <div class="project-stats">
            <div class="stat">
              <span class="stat-label">Макс. средства:</span>
              <span class="stat-value">{{ project.maxFunds }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Текущие средства:</span>
              <span class="stat-value">{{ project.currentFunds }}</span>
            </div>
          </div>
          <div class="project-footer">
            <span class="view-details">
              <i class="fas fa-arrow-right"></i>
              Подробнее
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- Project Details Modal -->
    <ProjectDetailsModal 
      v-if="selectedProject" 
      :project="selectedProject"
      @close="closeProjectDetails"
    />
  </div>
</template>

<script>
import { getUserCredentials, setAuthToken, setUserCredentials, getAuthToken } from '../services/api.js'
import { getProjects } from '../services/api.js'
import ProjectDetailsModal from './ProjectDetailsModal.vue'

export default {
  name: 'ProjectsPage',
  components: {
    ProjectDetailsModal
  },
  data() {
    return {
      userEmail: '',
      projects: [],
      loading: false,
      error: null,
      selectedProject: null
    }
  },
  async mounted() {
    // Инициализация страницы проектов
    const credentials = getUserCredentials()
    this.userEmail = credentials.email || 'Пользователь'
    
    const token = getAuthToken()
    if (!token) {
      console.error('Токен авторизации не найден')
      this.error = 'Ошибка авторизации. Пожалуйста, войдите в систему заново.'
      setTimeout(() => {
        this.handleLogout()
      }, 2000)
      return
    }
    
    console.log('Токен найден, загружаем проекты:', token.substring(0, 20) + '...')
    try {
      await this.loadProjects()
    } catch (error) {
      console.error('Ошибка при загрузке проектов:', error)
      if (error.message.includes('401')) {
        console.error('Токен недействителен, разлогиниваем пользователя')
        this.handleLogout()
      }
    }
  },
  methods: {
    async loadProjects() {
      this.loading = true
      this.error = null
      
      try {
        const response = await getProjects()
        this.projects = response.items || []
        console.log('Проекты загружены:', this.projects)
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error)
        
        if (error.message.includes('401')) {
          this.error = 'Ошибка авторизации. Пожалуйста, войдите в систему заново.'
          setTimeout(() => {
            this.handleLogout()
          }, 2000)
        } else if (error.message.includes('403')) {
          this.error = 'Недостаточно прав для просмотра проектов.'
        } else if (error.message.includes('500')) {
          this.error = 'Ошибка сервера. Попробуйте позже.'
        } else {
          this.error = 'Не удалось загрузить проекты. Проверьте подключение к интернету.'
        }
      } finally {
        this.loading = false
      }
    },
    
    openProjectDetails(project) {
      this.selectedProject = project
    },
    
    closeProjectDetails() {
      this.selectedProject = null
    },
    
    goBack() {
      this.$emit('navigate', 'dashboard')
    },
    
    handleLogout() {
      setAuthToken(null)
      setUserCredentials(null, null)
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>
.projects-page {
  height: 100vh;
  width: 100vw;
  background: #0f0f23;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
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

.back-btn {
  background: rgba(110, 92, 247, 0.1);
  border: 1px solid rgba(110, 92, 247, 0.3);
  color: #6E5CF7;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(110, 92, 247, 0.2);
  border-color: rgba(110, 92, 247, 0.5);
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

.page-main {
  flex: 1;
  padding: 40px 32px;
  overflow-y: auto;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-title {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out;
}

.page-title h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #6E5CF7, #8B7CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-title p {
  font-size: 18px;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  animation: fadeInUp 0.8s ease-out;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6E5CF7, #8B7CF6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.loading-spinner i {
  font-size: 24px;
  color: #ffffff;
}

.loading-container p {
  font-size: 16px;
  opacity: 0.8;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  animation: fadeInUp 0.8s ease-out;
}

.error-icon {
  width: 60px;
  height: 60px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.error-icon i {
  font-size: 24px;
  color: #dc3545;
}

.error-container p {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 20px;
  text-align: center;
}

.retry-btn {
  background: rgba(110, 92, 247, 0.1);
  border: 1px solid rgba(110, 92, 247, 0.3);
  color: #6E5CF7;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: rgba(110, 92, 247, 0.2);
  border-color: rgba(110, 92, 247, 0.5);
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  animation: fadeInUp 0.8s ease-out;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(110, 92, 247, 0.1);
  border: 1px solid rgba(110, 92, 247, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon i {
  font-size: 32px;
  color: #6E5CF7;
}

.empty-container h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.empty-container p {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 24px;
  text-align: center;
  max-width: 400px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.project-card {
  background: rgba(26, 26, 46, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(45, 45, 68, 0.5);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(110, 92, 247, 0.3);
  box-shadow: 0 8px 32px rgba(110, 92, 247, 0.1);
}

.project-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6E5CF7, #8B7CF6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.project-icon i {
  font-size: 28px;
  color: #ffffff;
}

.project-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.project-card p {
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
  margin-bottom: 20px;
}

.project-stats {
  margin-bottom: 20px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.stat-label {
  opacity: 0.7;
}

.stat-value {
  font-weight: 600;
  color: #6E5CF7;
}

.project-footer {
  border-top: 1px solid rgba(45, 45, 68, 0.5);
  padding-top: 16px;
}

.view-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6E5CF7;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.project-card:hover .view-details {
  color: #8B7CF6;
}

.view-details i {
  transition: transform 0.2s ease;
}

.project-card:hover .view-details i {
  transform: translateX(4px);
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
  .page-header {
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

  .page-main {
    padding: 24px 20px;
  }

  .page-title h1 {
    font-size: 28px;
  }

  .page-title p {
    font-size: 16px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .project-card {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 10px 16px;
  }

  .page-main {
    padding: 20px 16px;
  }

  .page-title h1 {
    font-size: 24px;
  }

  .page-title p {
    font-size: 14px;
  }

  .project-card {
    padding: 20px 16px;
  }

  .project-icon {
    width: 56px;
    height: 56px;
  }

  .project-icon i {
    font-size: 24px;
  }
}
</style>
