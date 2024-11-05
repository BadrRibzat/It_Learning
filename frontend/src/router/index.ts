import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LessonView from "@/views/LessonView.vue";
import FlashcardsView from "@/views/FlashcardsView.vue";
import QuizView from "@/views/QuizView.vue";
import ProfileView from "@/views/ProfileView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/lessons", component: LessonView },
  { path: "/flashcards", component: FlashcardsView },
  { path: "/quiz", component: QuizView },
  { path: "/profile", component: ProfileView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
