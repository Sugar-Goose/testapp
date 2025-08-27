<template>
  <div class="input-field">
    <label :for="id" class="input-label">{{ label }}</label>
    <div class="input-container" :class="{ 'error': hasError, 'focused': isFocused }">
      <div class="input-icon" v-if="icon">
        <i :class="icon"></i>
      </div>
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="placeholder"
        class="input-element"
        :class="{ 'has-icon': icon }"
      />
      <div class="input-action" v-if="actionIcon" @click="$emit('action')">
        <i :class="actionIcon"></i>
      </div>
    </div>
    <div class="error-message" v-if="hasError">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    actionIcon: {
      type: String,
      default: ''
    },
    hasError: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    showPassword: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'action'],
  data() {
    return {
      isFocused: false
    }
  },
  computed: {
    inputType() {
      if (this.type === 'password' && this.showPassword) {
        return 'text'
      }
      return this.type
    }
  }
}
</script>

<style scoped>
.input-field {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #1a1a2e;
  border: 1px solid #2d2d44;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input-container.focused {
  border-color: #6E5CF7;
  box-shadow: 0 0 0 2px rgba(110, 92, 247, 0.1);
}

.input-container.error {
  border-color: #ff4757;
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: #8b8b9f;
}

.input-icon i {
  font-size: 18px;
}

.input-element {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 16px;
  padding: 14px 16px;
  border-radius: 12px;
}

.input-element.has-icon {
  padding-left: 0;
}

.input-element::placeholder {
  color: #8b8b9f;
}

.input-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: #8b8b9f;
  cursor: pointer;
  transition: color 0.3s ease;
}

.input-action:hover {
  color: #ffffff;
}

.input-action i {
  font-size: 18px;
}

.error-message {
  color: #ff4757;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
}

/* Медиа запросы */
@media (max-width: 768px) {
  .input-container {
    border-radius: 10px;
  }
  
  .input-element {
    font-size: 16px;
    padding: 12px 14px;
  }
  
  .input-icon,
  .input-action {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 480px) {
  .input-label {
    font-size: 13px;
  }
  
  .input-element {
    font-size: 16px;
    padding: 10px 12px;
  }
  
  .input-icon,
  .input-action {
    width: 40px;
    height: 40px;
  }
}
</style>
