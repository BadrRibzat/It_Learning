import { reactive } from "vue";

export const progressState = reactive({
  // Progress tracking
  progress: 0, // User progress percentage
  incrementProgress() {
    this.progress = Math.min(this.progress + 10, 100); // Increment by 10%, max 100%
  },

  // Test tracking
  intermediatePassed: false, // Track if Intermediate Test is passed
  advancedPassed: false, // Track if Advanced Test is passed
});
