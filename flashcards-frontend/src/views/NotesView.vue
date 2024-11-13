<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Notes</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Notes Content -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Create New Note Form -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-4">Create New Note</h2>
          <form @submit.prevent="createNote" class="space-y-4">
            <!-- Form fields remain the same -->
          </form>
        </div>

        <!-- Note Cards -->
        <NoteCard
          v-for="note in notes"
          :key="note?.id || crypto.randomUUID()"
          :note="note"
          @edit="startEditing"
          @delete="confirmDeleteNote"
        />

        <!-- Edit Note Modal -->
        <EditNoteModal 
          v-if="isEditing && editingNote"
          :note="editingNote"
          @update="updateNote"
          @cancel="cancelEditing"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { APP_CONFIG } from '@/config';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import NoteCard from '@/components/notes/NoteCard.vue';
import EditNoteModal from '@/components/notes/EditNoteModal.vue';

const config = APP_CONFIG;
const store = useStore();

// State
const newNote = ref({
  title: '',
  content: '',
  note_type: 'general'
});

// Computed properties from store
const notes = computed(() => store.state.notes?.notes || []);
const isEditing = computed(() => store.state.notes?.isEditing || false);
const editingNote = computed(() => store.state.notes?.editingNote || null);
const loading = computed(() => store.state.notes?.loading || false);
const error = computed(() => store.state.notes?.error || null);

// Validation
const titleError = computed(() => {
  const title = newNote.value.title;
  if (!title) return 'Title is required';
  if (title.length < 3) return 'Title must be at least 3 characters';
  if (title.length > 100) return 'Title cannot exceed 100 characters';
  return '';
});

const contentError = computed(() => {
  const content = newNote.value.content;
  if (!content) return 'Content is required';
  if (content.length < 10) return 'Content must be at least 10 characters';
  if (content.length > 1000) return 'Content cannot exceed 1000 characters';
  return '';
});

const isFormValid = computed(() => {
  return !titleError.value && !contentError.value;
});

// Lifecycle
onMounted(async () => {
  try {
    await store.dispatch('notes/fetchNotes');
  } catch (err) {
    console.error('Failed to fetch notes:', err);
  }
});

// Methods
const createNote = async () => {
  if (!isFormValid.value) {
    store.dispatch('app/showNotification', {
      message: 'Please fix the errors before submitting',
      type: 'error'
    });
    return;
  }

  try {
    await store.dispatch('notes/createNote', newNote.value);
    // Reset form
    newNote.value = {
      title: '',
      content: '',
      note_type: 'general'
    };
  } catch (error) {
    console.error('Failed to create note:', error);
    store.dispatch('app/showNotification', {
      message: 'Failed to create note',
      type: 'error'
    });
  }
};

const startEditing = (note) => {
  store.dispatch('notes/startEditing', note);
};

const updateNote = async (updatedNote) => {
  try {
    await store.dispatch('notes/updateNote', {
      id: updatedNote.id,
      noteData: updatedNote
    });
  } catch (error) {
    console.error('Failed to update note:', error);
  }
};

const confirmDeleteNote = async (note) => {
  const confirmed = window.confirm('Are you sure you want to delete this note?');
  if (confirmed) {
    try {
      await store.dispatch('notes/deleteNote', note.id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }
};

const cancelEditing = () => {
  store.dispatch('notes/cancelEditing');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
