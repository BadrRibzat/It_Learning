<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Notes</h1>

    <div class="mb-6">
      <button
        @click="openNoteModal"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Create Note
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NoteCard v-for="note in notes" :key="note.id" :note="note" @edit="openEditModal" @delete="deleteNote" />
    </div>

    <NoteModal :note="selectedNote" :isOpen="isModalOpen" @close="closeModal" @save="saveNote" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { noteService } from '@/api/services/notes';
import NoteCard from '@/components/notes/NoteCard.vue';
import NoteModal from '@/components/notes/NoteModal.vue';

const notes = ref([]);
const selectedNote = ref(null);
const isModalOpen = ref(false);

onMounted(async () => {
  const { data } = await noteService.getNotes();
  notes.value = data;
});

const openNoteModal = () => {
  selectedNote.value = null;
  isModalOpen.value = true;
};

const openEditModal = (note) => {
  selectedNote.value = note;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveNote = async (noteData) => {
  if (noteData.id) {
    const { data } = await noteService.updateNote(noteData.id, noteData);
    const index = notes.value.findIndex((note) => note.id === data.id);
    notes.value.splice(index, 1, data);
  } else {
    const { data } = await noteService.createNote(noteData);
    notes.value.push(data);
  }
  closeModal();
};

const deleteNote = async (noteId) => {
  await noteService.deleteNote(noteId);
  notes.value = notes.value.filter((note) => note.id !== noteId);
};
</script>
