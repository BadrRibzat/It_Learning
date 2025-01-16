<template>
  <div class="relative inline-block text-left">
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-primary-500"
      id="options-menu"
      aria-expanded="true"
      aria-haspopup="true"
    >
      <span class="mr-2">
        <i :class="selectedLanguage.icon"></i>
      </span>
      {{ selectedLanguage.code.toUpperCase() }}
      <svg
        class="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <div class="py-1" role="none">
        <button
          v-for="language in languages"
          :key="language.code"
          @click="changeLanguage(language)"
          class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
        >
          <span class="flex items-center">
            <i :class="language.icon" class="mr-2"></i>
            {{ language.name }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "LanguageSwitcher",
  props: {
    modelValue: {
      type: String,
      default: "en",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const languages = [
      { code: "ar", name: "Arabic", icon: "fas fa-globe-africa" },
      { code: "en", name: "English", icon: "fas fa-flag-usa" },
      { code: "fr", name: "French", icon: "fas fa-flag" },
      { code: "es", name: "Spanish", icon: "fas fa-flag" },
      { code: "de", name: "German", icon: "fas fa-flag" },
      { code: "ja", name: "Japanese", icon: "fas fa-flag" },
      { code: "ko", name: "Korean", icon: "fas fa-flag" },
      { code: "zh", name: "Chinese", icon: "fas fa-flag" },
    ];

    const selectedLanguage = ref(
      languages.find((lang) => lang.code === props.modelValue) || languages[0]
    );

    const changeLanguage = (language) => {
      selectedLanguage.value = language;
      isOpen.value = false;
      emit("update:modelValue", language.code); // Emit the selected language code
    };

    return {
      isOpen,
      selectedLanguage,
      languages,
      changeLanguage,
    };
  },
};
</script>
