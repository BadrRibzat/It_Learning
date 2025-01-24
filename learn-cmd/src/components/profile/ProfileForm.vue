<template>
  <div class="profile-edit py-10">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold text-center text-primary mb-8">
        Edit Profile
      </h1>
      <div class="bg-white shadow-lg rounded-lg p-8">
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="first-name" class="block text-gray-700 font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              v-model="form.firstName"
              class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
            />
          </div>

          <div class="mb-4">
            <label for="last-name" class="block text-gray-700 font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              v-model="form.lastName"
              class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
            />
          </div>

          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
            />
          </div>

          <div class="mb-4">
            <label for="bio" class="block text-gray-700 font-bold mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              v-model="form.bio"
              rows="4"
              class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="location" class="block text-gray-700 font-bold mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              v-model="form.location"
              class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
            />
          </div>

          <div class="mt-8">
            <button
              type="submit"
              class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
            <router-link to="/profile" class="text-gray-600 hover:underline ml-4">
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "ProfileForm",
  setup() {
    const router = useRouter();
    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      location: "",
    });

    const submitForm = async () => {
      try {
        console.log("Profile updated:", form);
        router.push("/profile");
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    };

    return {
      form,
      submitForm,
    };
  },
};
</script>
