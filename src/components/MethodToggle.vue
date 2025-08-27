<template>
  <div class="method-toggle">
    <div 
      v-for="method in methods" 
      :key="method.value"
      class="method-option"
      :class="{ 'active': selectedMethod === method.value }"
      @click="$emit('update:modelValue', method.value)"
    >
      <div class="method-icon">
        <i :class="method.icon"></i>
      </div>
      <span class="method-label">{{ method.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MethodToggle',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    methods: {
      type: Array,
      default: () => [
        { value: 'email', label: 'Email', icon: 'fas fa-envelope' },
        { value: 'phone', label: 'Phone', icon: 'fas fa-phone' }
      ]
    }
  },
  emits: ['update:modelValue'],
  computed: {
    selectedMethod() {
      return this.modelValue
    }
  }
}
</script>

<style scoped>
.method-toggle {
  display: flex;
  background: #1a1a2e;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  gap: 4px;
}

.method-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #8b8b9f;
}

.method-option:hover {
  color: #ffffff;
}

.method-option.active {
  background: #2d2d44;
  color: #ffffff;
}

.method-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-icon i {
  font-size: 16px;
}

.method-label {
  font-size: 14px;
  font-weight: 500;
}

/* Медиа запросы */
@media (max-width: 768px) {
  .method-toggle {
    border-radius: 10px;
    padding: 3px;
  }
  
  .method-option {
    padding: 10px 12px;
    gap: 6px;
  }
  
  .method-icon i {
    font-size: 14px;
  }
  
  .method-label {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .method-option {
    padding: 8px 10px;
    gap: 4px;
  }
  
  .method-icon i {
    font-size: 13px;
  }
  
  .method-label {
    font-size: 12px;
  }
}
</style>
