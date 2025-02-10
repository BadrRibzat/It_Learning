<template>
  <div class="switch-wrapper">
    <label 
      :for="switchId"
      class="flex items-center cursor-pointer"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    >
      <div class="relative">
        <input
          :id="switchId"
          type="checkbox"
          class="sr-only"
          :checked="modelValue"
          :disabled="disabled || loading"
          :required="required"
          :name="name"
          @change="handleChange"
        />
        
        <div
          class="switch-track relative"
          :class="[
            sizeClasses[size],
            'rounded-full transition-colors duration-200 ease-in-out',
            modelValue ? colorClasses[color] : 'bg-gray-200',
            { 'cursor-not-allowed': disabled }
          ]"
        >
          <span
            class="switch-thumb absolute top-0.5 left-0.5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out"
            :class="[
              thumbSizeClasses[size],
              modelValue ? 'translate-x-full' : 'translate-x-0',
              { 'animate-pulse': loading }
            ]"
          />
        </div>

        <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
          <svg 
            class="animate-spin h-4 w-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle 
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>

      <div v-if="label || description" class="ml-3">
        <span 
          v-if="label"
          class="text-sm font-medium text-gray-900"
        >
          {{ label }}
        </span>
        <p 
          v-if="description"
          class="text-xs text-gray-500"
        >
          {{ description }}
        </p>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notification';

interface SwitchProps {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  name?: string;
  required?: boolean;
  loading?: boolean;
  description?: string;
}

const props = withDefaults(defineProps<SwitchProps>(), {
  size: 'md',
  color: 'primary',
  disabled: false,
  loading: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const notificationStore = useNotificationStore();
const switchId = ref(`switch-${Math.random().toString(36).substr(2, 9)}`);
const isAnimating = ref(false);

const sizeClasses = {
  sm: 'h-4 w-7',
  md: 'h-6 w-11',
  lg: 'h-8 w-14'
};

const thumbSizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-5 w-5',
  lg: 'h-7 w-7'
};

const colorClasses = {
  primary: 'bg-primary-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-red-600'
};

const handleChange = async () => {
  if (props.disabled || props.loading || isAnimating.value) return;

  isAnimating.value = true;
  const newValue = !props.modelValue;

  try {
    await logUserActivity('switch_toggled', {
      id: switchId.value,
      name: props.name,
      previousValue: props.modelValue,
      newValue,
      timestamp: TIMESTAMP,
      user: USER_LOGIN
    });

    emit('update:modelValue', newValue);
    emit('change', newValue);
  } catch (error) {
    console.error('Switch toggle error:', error);
    notificationStore.error('Failed to update switch state');
  } finally {
    setTimeout(() => {
      isAnimating.value = false;
    }, 200);
  }
};

watch(() => props.modelValue, (newValue) => {
  logUserActivity('switch_value_changed', {
    id: switchId.value,
    value: newValue,
    timestamp: TIMESTAMP,
    user: USER_LOGIN
  });
});

onMounted(() => {
  logUserActivity('switch_mounted', {
    id: switchId.value,
    initialValue: props.modelValue,
    timestamp: TIMESTAMP,
    user: USER_LOGIN
  });
});
</script>

<style scoped>
.switch-wrapper {
  @apply inline-flex;
}

.switch-track:focus-within {
  @apply ring-2 ring-offset-2 ring-primary-500;
}

.switch-thumb {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
