<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center">Setup Two-Factor Authentication</h2>
    
    <div v-if="qrCode" class="flex flex-col items-center space-y-4">
      <img :src="qrCode" alt="QR Code for MFA Setup" class="w-64 h-64">
      <p class="text-sm text-gray-600">
        Scan this QR code with your authenticator app
      </p>
    </div>

    <form @submit.prevent="verifyMFA" class="space-y-4">
      <div>
        <label for="token" class="block text-sm font-medium text-gray-700">
          Verification Code
        </label>
        <input
          id="token"
          v-model="verificationCode"
          type="text"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter 6-digit code"
        >
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Verify and Enable 2FA
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import QRCode from 'qrcode';

const store = useStore();
const router = useRouter();
const qrCode = ref('');
const verificationCode = ref('');

onMounted(async () => {
  try {
    const response = await store.dispatch('auth/setupMFA');
    const qr = await QRCode.toDataURL(response.provisioning_uri);
    qrCode.value = qr;
  } catch (error) {
    console.error('Failed to setup MFA:', error);
  }
});

const verifyMFA = async () => {
  try {
    await store.dispatch('auth/verifyMFA', verificationCode.value);
    router.push('/profile');
  } catch (error) {
    console.error('MFA verification failed:', error);
  }
};
</script>
