<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Notes</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- New Note Card -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-4">Create New Note</h2>
          <form @submit.prevent="createNote" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Title</label>
              <input 
                v-model="newNote.title" 
                type="text" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                :maxlength="config.maxNoteTitleLength"
                required
              />
              <p class="mt-1 text-sm text-gray-500">
                {{ newNote.title.length }} / {{ config.maxNoteTitleLength }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Content</label>
              <textarea 
                v-model="newNote.content" 
                rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                :maxlength="config.maxNoteContentLength"
                required
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">
                {{ newNote.content.length }} / {{ config.maxNoteContentLength }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Note Type</label>
              <select 
                v-model="newNote.note_type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="general">General</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="grammar">Grammar</option>
              </select>
            </div>
            <button 
              type="submit" 
              class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
            >
              Create Note
            </button>
          </form>
        </div>

        <!-- Existing Notes -->
        <NoteCard 
          v-for="note in notes" 
          :key="note.id" 
          :note="note"
          @edit="startEditing"
          @delete="deleteNote"
        />

        <!-- Edit Modal -->
        <div 
          v-if="isEditing" 
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4">Edit Note</h2>
            <form @submit.prevent="updateNote" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  v-model="editingNote.title" 
                  type="text" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  :maxlength="config.maxNoteTitleLength"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Content</label>
                <textarea 
                  v-model="editingNote.content" 
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  :maxlength="config.maxNoteContentLength"
                  required
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Note Type</label>
                <select 
                  v-model="editingNote.note_type"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="general">General</option>
                  <option value="vocabulary">Vocabulary</option>
                  <option value="grammar">Grammar</option>
                </select>
              </div>
              <div class="flex justify-between">
                <button 
                  type="button" 
                  @click="cancelEditing"
                  class="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
                >
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import NoteCard from '@/components/notes/NoteCard.vue';
import config from '@/config/config.json';

const store = useStore();
const newNote = ref({
  title: '',
  content: '',
  note_type: 'general'
});

const notes = computed(() => store.state.notes.notes);
const isEditing = computed(() => store.state.notes.isEditing);
const editingNote = computed(() => store.state.notes.editingNote);

onMounted(async () => {
  await store.dispatch('notes/fetchNotes');
});

const createNote = async () => {
  try {
    await store.dispatch('notes/createNote', newNote.value);
    newNote.value = {
      title: '',
      content: '',
      note_type: 'general'
    };
  } catch (error) {
    console.error('Failed to create note:', error);
  }
};

const startEditing = (note) => {
  store.dispatch('notes/startEditing', note);
};

const updateNote = async () => {
  try {
    await store.dispatch('notes/updateNote', {
      id: editingNote.value.id,
      noteData: editingNote.value
    });
  } catch (error) {
    console.error('Failed to update note:', error);
  }
};

const deleteNote = async (id) => {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await store.dispatch('notes/deleteNote', id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }
};

const cancelEditing = () => {
  store.dispatch('notes/cancelEditing');
};
</script>
