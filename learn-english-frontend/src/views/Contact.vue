<template>
  <div class="contact p-8">
    <h1 class="text-4xl font-bold">Contact Us</h1>
    <form class="mt-4">
      <div class="mb-4">
        <label for="name" class="block text-gray-700">Name</label>
        <input type="text" id="name" class="w-full p-2 border border-gray-300 rounded">
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700">Email</label>
        <input type="email" id="email" class="w-full p-2 border border-gray-300 rounded">
      </div>
      <div class="mb-4">
        <label for="message" class="block text-gray-700">Message</label>
        <textarea id="message" class="w-full p-2 border border-gray-300 rounded"></textarea>
      </div>
      <button type="submit" class="bg-blue-500 text-white p-2 rounded">Submit</button>
    </form>
  </div>
</template>
