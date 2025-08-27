<template>
  <div class="progress-indicator">
    <div class="progress-steps">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="progress-step"
        :class="{ 'active': step.active, 'completed': step.completed }"
      >
        <div class="step-icon">
          <i v-if="step.completed" class="fas fa-check"></i>
          <span v-else>{{ step.number }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
      </div>
      <div class="progress-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressIndicator',
  props: {
    steps: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.progress-indicator {
  margin-bottom: 24px;
}

.progress-steps {
  display: flex;
  align-items: center;
  position: relative;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2d2d44;
  border: 2px solid #2d2d44;
  color: #8b8b9f;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step-icon i {
  font-size: 12px;
}

.progress-step.active .step-icon {
  background: #6E5CF7;
  border-color: #6E5CF7;
  color: #ffffff;
}

.progress-step.completed .step-icon {
  background: #6E5CF7;
  border-color: #6E5CF7;
  color: #ffffff;
}

.step-label {
  font-size: 12px;
  color: #8b8b9f;
  font-weight: 500;
  text-align: center;
  transition: color 0.3s ease;
}

.progress-step.active .step-label {
  color: #6E5CF7;
}

.progress-step.completed .step-label {
  color: #6E5CF7;
}

.progress-line {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #2d2d44;
  z-index: 1;
}

/* Медиа запросы */
@media (max-width: 768px) {
  .step-icon {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .step-label {
    font-size: 11px;
  }
  
  .progress-line {
    top: 14px;
    left: 14px;
    right: 14px;
  }
}

@media (max-width: 480px) {
  .step-icon {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }
  
  .step-label {
    font-size: 10px;
  }
  
  .progress-line {
    top: 12px;
    left: 12px;
    right: 12px;
  }
}
</style>
