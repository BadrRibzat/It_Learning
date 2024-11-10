<template>
  <div class="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-4">
    <div class="mb-8">
      <img class="h-8 w-auto" src="@/assets/logo.svg" alt="Logo" />
    </div>
    <nav>
      <ul>
        <li class="mb-4">
          <router-link to="/dashboard" class="block py-2 px-4 text-gray-700 hover:bg-gray-100">Dashboard</router-link>
        </li>
        <li class="mb-4">
          <router-link to="/dashboard/profile" class="block py-2 px-4 text-gray-700 hover:bg-gray-100">Profile</router-link>
        </li>
        <li class="mb-4">
          <router-link to="/dashboard/notes" class="block py-2 px-4 text-gray-700 hover:bg-gray-100">Notes</router-link>
        </li>
        <li class="mb-4">
          <router-link to="/dashboard/levels" class="block py-2 px-4 text-gray-700 hover:bg-gray-100">Levels</router-link>
        </li>
        <li class="mb-4">
          <router-link to="/dashboard/lessons" class="block py-2 px-4 text-gray-700 hover:bg-gray-100">Lessons</router-link>
        </li>
        <li class="mb-4">
          <router-link to="/dashboard/quizzes" class="block py-2 px-4 text-gray-700 hover:bg-gray-100">Quizzes</router-link>
        </li>
        <li class="mb-4">
          <router-link to="/dashboard/flashcards" class="block py-2 px-4 text-gray-700 hover:bg-gray-100">Flashcards</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
// No additional logic needed
</script>
