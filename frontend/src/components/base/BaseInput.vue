<template>
  <div>
    <input
      :class="[
        'px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent',
        'w-full',
        error && 'border-red-500',
      ]"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: '',
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
