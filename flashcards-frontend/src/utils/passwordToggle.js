import { ref } from 'vue';

export function usePasswordToggle() {
  const isPasswordVisible = ref(false);
  const passwordType = ref('password');

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
    passwordType.value = isPasswordVisible.value ? 'text' : 'password';
  };

  return {
    isPasswordVisible,
    passwordType,
    togglePasswordVisibility
  };
}
