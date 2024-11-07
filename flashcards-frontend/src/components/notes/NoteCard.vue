<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">{{ note.title }}</h3>
    <p class="text-gray-700 mb-4">{{ note.content }}</p>
    <div class="flex justify-end">
      <button @click="editNote" class="bg-primary text-white px-4 py-2 rounded-lg mr-4">Edit</button>
      <button @click="deleteNote" class="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  note: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update', 'delete'])

const editNote = () => {
  emit('update', props.note)
}

const deleteNote = () => {
  emit('delete', props.note.id)
}
</script>
