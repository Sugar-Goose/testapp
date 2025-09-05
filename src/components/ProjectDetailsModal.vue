<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="project-header">
          <div class="project-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="project-info">
            <h2>{{ project.name }}</h2>
            <p>{{ project.description }}</p>
          </div>
        </div>
        <button @click="closeModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="project-details">
          <div class="details-section">
            <h3>Информация о проекте</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Максимальные средства:</span>
                <span class="detail-value">{{ project.maxFunds }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Текущие средства:</span>
                <span class="detail-value">{{ project.currentFunds }}</span>
              </div>
            </div>
          </div>

          <div class="plans-section">
            <h3>Доступные планы инвестирования</h3>
            
            <div v-if="plansLoading" class="loading-plans">
              <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
              </div>
              <p>Загрузка планов...</p>
            </div>

            <div v-else-if="plansError" class="error-plans">
              <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <p>{{ plansError }}</p>
              <button @click="loadPlans" class="retry-btn">
                <i class="fas fa-redo"></i>
                Попробовать снова
              </button>
            </div>

            <div v-else class="plans-grid">
              <div 
                v-for="plan in plans" 
                :key="plan.id" 
                class="plan-card"
                @click="selectPlan(plan)"
                :class="{ 'selected': selectedPlan && selectedPlan.id === plan.id }"
              >
                <div class="plan-header">
                  <h4>{{ plan.name }}</h4>
                  <div class="plan-badge" :class="getPlanBadgeClass(plan)">
                    {{ getPlanBadgeText(plan) }}
                  </div>
                </div>
                
                <p class="plan-description">{{ plan.description }}</p>
                
                <div class="plan-details">
                  <div class="plan-detail">
                    <span class="detail-label">Длительность:</span>
                    <span class="detail-value">{{ plan.durationDays }} дней</span>
                  </div>
                  <div class="plan-detail">
                    <span class="detail-label">Дневная ставка:</span>
                    <span class="detail-value">{{ plan.dailyInterestRate }}%</span>
                  </div>
                  <div class="plan-detail">
                    <span class="detail-label">Тип процентов:</span>
                    <span class="detail-value">{{ getInterestTypeText(plan.interestType) }}</span>
                  </div>
                  <div class="plan-detail">
                    <span class="detail-label">Тип штрафа:</span>
                    <span class="detail-value">{{ getPenaltyTypeText(plan.penaltyType) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedPlan" class="investment-section">
            <h3>Инвестирование в план "{{ selectedPlan.name }}"</h3>
            <div class="investment-form">
              <div class="form-group">
                <label for="amount">Сумма инвестирования:</label>
                <input 
                  id="amount"
                  v-model="investmentAmount" 
                  type="number" 
                  placeholder="Введите сумму"
                  class="amount-input"
                />
              </div>
              <div class="form-group">
                <label for="wallet">Адрес кошелька:</label>
                <input 
                  id="wallet"
                  v-model="walletAddress" 
                  type="text" 
                  placeholder="Введите адрес кошелька"
                  class="wallet-input"
                />
              </div>
              <button 
                @click="createInvestment" 
                :disabled="!investmentAmount || !walletAddress || creatingInvestment"
                class="invest-btn"
              >
                <i v-if="creatingInvestment" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-coins"></i>
                {{ creatingInvestment ? 'Создание...' : 'Инвестировать' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectPlans, createInvestmentIntent } from '../services/api.js'

export default {
  name: 'ProjectDetailsModal',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      plans: [],
      plansLoading: false,
      plansError: null,
      selectedPlan: null,
      investmentAmount: '',
      walletAddress: '',
      creatingInvestment: false
    }
  },
  async mounted() {
    // Загрузка планов проекта при открытии модального окна
    await this.loadPlans()
  },
  methods: {
    async loadPlans() {
      this.plansLoading = true
      this.plansError = null
      
      try {
        const response = await getProjectPlans(this.project.id)
        this.plans = response.items || []
        console.log('Планы загружены:', this.plans)
      } catch (error) {
        console.error('Ошибка загрузки планов:', error)
        this.plansError = 'Не удалось загрузить планы проекта. Проверьте подключение к интернету.'
      } finally {
        this.plansLoading = false
      }
    },
    
    selectPlan(plan) {
      this.selectedPlan = plan
    },
    
    getPlanBadgeClass(plan) {
      if (plan.durationDays <= 30) {
        return 'badge-short'
      } else if (plan.durationDays <= 90) {
        return 'badge-medium'
      } else {
        return 'badge-long'
      }
    },
    
    getPlanBadgeText(plan) {
      if (plan.durationDays <= 30) {
        return 'Краткосрочный'
      } else if (plan.durationDays <= 90) {
        return 'Среднесрочный'
      } else {
        return 'Долгосрочный'
      }
    },
    
    getInterestTypeText(type) {
      const types = {
        'simple': 'Простые',
        'compound': 'Сложные'
      }
      return types[type] || type
    },
    
    getPenaltyTypeText(type) {
      const types = {
        'linear': 'Линейный',
        'exponential': 'Экспоненциальный'
      }
      return types[type] || type
    },
    
    async createInvestment() {
      if (!this.selectedPlan || !this.investmentAmount || !this.walletAddress) {
        alert('Пожалуйста, заполните все поля')
        return
      }
      
      if (parseFloat(this.investmentAmount) <= 0) {
        alert('Сумма инвестирования должна быть больше 0')
        return
      }
      
      if (this.walletAddress.length < 10) {
        alert('Адрес кошелька слишком короткий')
        return
      }
      
      this.creatingInvestment = true
      
      try {
        const response = await createInvestmentIntent(
          this.project.id,
          this.selectedPlan.id,
          this.investmentAmount
        )
        
        console.log('Инвестиция создана:', response)
        
        alert('Инвестиция успешно создана!')
        this.investmentAmount = ''
        this.walletAddress = ''
        this.selectedPlan = null
        
      } catch (error) {
        console.error('Ошибка создания инвестиции:', error)
        if (error.message.includes('401')) {
          alert('Ошибка авторизации. Пожалуйста, войдите в систему заново.')
        } else if (error.message.includes('400')) {
          alert('Неверные данные. Проверьте введенную информацию.')
        } else {
          alert('Ошибка создания инвестиции. Попробуйте снова.')
        }
      } finally {
        this.creatingInvestment = false
      }
    },
    
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: #0f0f23;
  border: 1px solid rgba(45, 45, 68, 0.5);
  border-radius: 20px;
  width: 90vw;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(45, 45, 68, 0.5);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.project-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6E5CF7, #8B7CF6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.project-icon i {
  font-size: 28px;
  color: #ffffff;
}

.project-info h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
}

.project-info p {
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.5;
}

.close-btn {
  background: rgba(45, 45, 68, 0.5);
  border: 1px solid rgba(45, 45, 68, 0.8);
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  border-color: rgba(220, 53, 69, 0.5);
  color: #dc3545;
}

.modal-body {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.project-details h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ffffff;
  border-bottom: 1px solid rgba(45, 45, 68, 0.5);
  padding-bottom: 12px;
}

.details-section {
  margin-bottom: 40px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail-item {
  background: rgba(26, 26, 46, 0.3);
  border: 1px solid rgba(45, 45, 68, 0.5);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  opacity: 0.7;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #6E5CF7;
}

.plans-section {
  margin-bottom: 40px;
}

.loading-plans, .error-plans {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6E5CF7, #8B7CF6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.loading-spinner i {
  font-size: 18px;
  color: #ffffff;
}

.loading-plans p, .error-plans p {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 16px;
}

.error-icon {
  width: 40px;
  height: 40px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.error-icon i {
  font-size: 18px;
  color: #dc3545;
}

.retry-btn {
  background: rgba(110, 92, 247, 0.1);
  border: 1px solid rgba(110, 92, 247, 0.3);
  color: #6E5CF7;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: rgba(110, 92, 247, 0.2);
  border-color: rgba(110, 92, 247, 0.5);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.plan-card {
  background: rgba(26, 26, 46, 0.3);
  border: 1px solid rgba(45, 45, 68, 0.5);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-card:hover {
  border-color: rgba(110, 92, 247, 0.3);
  transform: translateY(-2px);
}

.plan-card.selected {
  border-color: #6E5CF7;
  background: rgba(110, 92, 247, 0.1);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.plan-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.plan-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.badge-short {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-long {
  background: rgba(110, 92, 247, 0.2);
  color: #6E5CF7;
  border: 1px solid rgba(110, 92, 247, 0.3);
}

.plan-description {
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
  margin-bottom: 20px;
}

.plan-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.plan-detail .detail-label {
  opacity: 0.7;
}

.plan-detail .detail-value {
  font-weight: 600;
  color: #6E5CF7;
}

.investment-section {
  background: rgba(26, 26, 46, 0.3);
  border: 1px solid rgba(45, 45, 68, 0.5);
  border-radius: 16px;
  padding: 24px;
}

.investment-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.amount-input, .wallet-input {
  background: rgba(26, 26, 46, 0.5);
  border: 1px solid rgba(45, 45, 68, 0.8);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.2s ease;
}

.amount-input:focus, .wallet-input:focus {
  outline: none;
  border-color: #6E5CF7;
  box-shadow: 0 0 0 2px rgba(110, 92, 247, 0.2);
}

.amount-input::placeholder, .wallet-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.invest-btn {
  background: linear-gradient(135deg, #6E5CF7, #8B7CF6);
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.invest-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(110, 92, 247, 0.3);
}

.invest-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 95vw;
    max-height: 95vh;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .modal-body {
    padding: 24px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .project-info h2 {
    font-size: 20px;
  }

  .project-info p {
    font-size: 14px;
  }
}
</style>
