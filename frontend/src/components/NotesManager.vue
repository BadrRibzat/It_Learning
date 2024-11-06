<template>
  <div class="notes-manager">
    <h2 class="text-2xl font-bold mb-4">{{ $t('notes.title') }}</h2>
    <form @submit.prevent="addNote" class="mb-4">
      <BaseInput v-model="newNote.title" :placeholder="$t('notes.titlePlaceholder')" class="mb-2" />
      <textarea
        v-model="newNote.content"
        :placeholder="$t('notes.contentPlaceholder')"
        class="w-full p-2 border rounded mb-2"
      ></textarea>
      <BaseButton type="submit">{{ $t('notes.add') }}</BaseButton>
    </form>
    <div v-for="note in notes" :key="note.id" class="bg-white p-4 rounded shadow mb-4">
      <h3 class="text-xl font-semibold mb-2">{{ note.title }}</h3>
      <p class="mb-2">{{ note.content }}</p>
      <div class="flex justify-end">
        <BaseButton @click="editNote(note)" class="mr-2">{{ $t('notes.edit') }}</BaseButton>
        <BaseButton @click="deleteNote(note.id)" variant="secondary">{{
          $t('notes.delete')
        }}</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { key } from '@/store';
import { Note } from '@/store/modules/notes';

const store = useStore(key);
const notes = ref<Note[]>([]);
const newNote = ref({ title: '', content: '', note_type: 'general' });

onMounted(async () => {
  await fetchNotes();
});

const fetchNotes = async () => {
  try {
    await store.dispatch('notes/fetchNotes');
    notes.value = store.state.notes.notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
};

const addNote = async () => {
  try {
    await store.dispatch('notes/addNote', newNote.value);
    newNote.value = { title: '', content: '', note_type: 'general' };
    await fetchNotes();
  } catch (error) {
    console.error('Error adding note:', error);
  }
};

const editNote = async (note: Note) => {
  try {
    const updatedNote = {
      ...note,
      title: prompt('Enter new title', note.title) || note.title,
      content: prompt('Enter new content', note.content) || note.content,
    };
    await store.dispatch('notes/updateNote', updatedNote);
    await fetchNotes();
  } catch (error) {
    console.error('Error updating note:', error);
  }
};

const deleteNote = async (noteId: number) => {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await store.dispatch('notes/deleteNote', noteId);
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }
};
</script>
