<template>
  <NotificationToast
    :type="type"
    :message="content"
    :duration="duration"
    @close="closeToast"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotificationToast from './NotificationToast.vue';

export default defineComponent({
  name: 'CustomToast',
  components: {
    NotificationToast,
  },
  props: {
    type: {
      type: String,
      default: 'default',
    },
    content: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 5000,
    },
  },
  setup(props, { emit }) {
    const closeToast = () => {
      emit('close-toast');
    };

    return {
      closeToast,
    };
  },
});
</script>
