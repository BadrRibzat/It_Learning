<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="text-3xl font-bold text-primary mt-2">{{ value }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ label }}</p>
      </div>
      <div class="bg-primary-50 p-3 rounded-full">
        <font-awesome-icon 
          :icon="icon" 
          class="text-2xl text-primary"
          :aria-label="title"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
