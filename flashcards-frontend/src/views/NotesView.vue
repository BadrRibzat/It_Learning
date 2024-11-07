<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Notes</h1>
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Create Note</h2>
          <form @submit.prevent="createNote">
            <div class="mb-4">
              <label class="block text-gray-700">Title</label>
              <input v-model="newNote.title" class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">Content</label>
              <textarea v-model="newNote.content" class="w-full px-4 py-2 border rounded-lg"></textarea>
            </div>
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded-lg">Create Note</button>
          </form>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-4">My Notes</h2>
          <div v-for="note in notes" :key="note.id" class="mb-4">
            <NoteCard :note="note" @update="updateNote" @delete="deleteNote" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import NoteCard from '@/components/notes/NoteCard.vue'

const store = useStore()
const notes = ref([])
const newNote = ref({ title: '', content: '' })

onMounted(async () => {
  try {
    await store.dispatch('notes/fetchNotes')
    notes.value = store.state.notes.notes
  } catch (error) {
    console.error('Failed to fetch notes:', error)
  }
})

const createNote = async () => {
  try {
    await store.dispatch('notes/createNote', newNote.value)
    newNote.value = { title: '', content: '' }
  } catch (error) {
    console.error('Failed to create note:', error)
  }
}

const updateNote = async (note) => {
  try {
    await store.dispatch('notes/updateNote', { id: note.id, noteData: note })
  } catch (error) {
    console.error('Failed to update note:', error)
  }
}

const deleteNote = async (id) => {
  try {
    await store.dispatch('notes/deleteNote', id)
  } catch (error) {
    console.error('Failed to delete note:', error)
  }
}
</script>
