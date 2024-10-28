<template>
  <input
    :class="['input', { 'input--error': error }]"
    :type="type"
    :placeholder="placeholder"
    v-model="modelValue"
    @input="updateValue"
  />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const modelValue = ref(props.modelValue);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<style scoped>
.input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm;
}

.input--error {
  @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}
</style>
