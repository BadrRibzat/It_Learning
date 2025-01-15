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

          <div class="mb-4">
            <label
              for="profile-picture"
              class="block text-gray-700 font-bold mb-2"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              @change="onFileSelected"
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
      <div v-if="showNotification" class="mt-4">
        <Notification :message="notificationMessage" type="success" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Notification from "@/components/common/Notification.vue";
import { processImage } from "@/utils/imageUtils";

export default {
  name: "ProfileForm",
  components: {
    Notification,
  },
  setup() {
    const router = useRouter();
    const showNotification = ref(false);
    const notificationMessage = ref("");

    // Load existing user data from localStorage
    const savedUser = localStorage.getItem('userData');
    const defaultUser = savedUser ? JSON.parse(savedUser) : {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      location: "",
      profilePicture: null,
    };

    const form = reactive({ ...defaultUser });

    const onFileSelected = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          showNotification.value = true;
          notificationMessage.value = "Processing image...";
          
          const processedImage = await processImage(file);
          form.profilePicture = processedImage;
          
          showNotification.value = true;
          notificationMessage.value = "Image processed successfully!";
        } catch (error) {
          console.error('Error processing image:', error);
          showNotification.value = true;
          notificationMessage.value = "Error processing image. Please try a smaller image.";
        }
      }
    };

    const submitForm = async () => {
      try {
        localStorage.setItem('userData', JSON.stringify(form));
        showNotification.value = true;
        notificationMessage.value = "Profile updated successfully!";
        
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } catch (error) {
        console.error('Error saving profile:', error);
        showNotification.value = true;
        notificationMessage.value = "Error saving profile. Image might be too large.";
      }
    };

    return {
      form,
      submitForm,
      onFileSelected,
      showNotification,
      notificationMessage,
    };
  },
};
</script>
