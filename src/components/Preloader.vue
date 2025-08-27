<template>
  <div class="preloader" :class="{ 'fade-out': isFadingOut }">
    <div class="preloader-content">
      <div class="logo-container">
        <div class="logo-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <span class="logo-text">Savage Investor</span>
      </div>
      
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      
      <div class="loading-text">
        <span>Loading</span>
        <span class="dots">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppPreloader',
  data() {
    return {
      isFadingOut: false
    }
  },
  mounted() {
    // Запускаем анимацию исчезновения через 1 секунду
    setTimeout(() => {
      this.isFadingOut = true
      // Удаляем прелоадер из DOM через 0.5 секунды
      setTimeout(() => {
        this.$emit('preloader-complete')
      }, 500)
    }, 1000)
  }
}
</script>

<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
}

.preloader.fade-out {
  opacity: 0;
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: #6E5CF7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.logo-icon i {
  color: #ffffff;
  font-size: 24px;
}

.logo-text {
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #6E5CF7;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: rgba(110, 92, 247, 0.7);
  animation-delay: -0.5s;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: rgba(110, 92, 247, 0.4);
  animation-delay: -1s;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8b8b9f;
  font-size: 16px;
  font-weight: 500;
}

.dots {
  display: flex;
  gap: 2px;
}

.dot {
  animation: dotPulse 1.4s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(110, 92, 247, 0.7);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(110, 92, 247, 0);
  }
}

@keyframes dotPulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Медиа запросы */
@media (max-width: 768px) {
  .logo-icon {
    width: 40px;
    height: 40px;
  }
  
  .logo-icon i {
    font-size: 20px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
  }
  
  .loading-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .logo-icon {
    width: 36px;
    height: 36px;
  }
  
  .logo-icon i {
    font-size: 18px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
  }
  
  .loading-text {
    font-size: 13px;
  }
}
</style>
