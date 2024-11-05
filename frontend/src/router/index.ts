import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LessonView from "@/views/LessonView.vue";
import FlashcardsView from "@/views/FlashcardsView.vue";
import QuizView from "@/views/QuizView.vue";
import ProfileView from "@/views/ProfileView.vue";
import LevelsView from "@/views/LevelsView.vue";
import LevelTestView from "@/views/LevelTestView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/levels", component: LevelsView },
  { path: "/lessons/:levelId", component: LessonView, name: 'lessons' },
  { path: "/flashcards", component: FlashcardsView },
  { path: "/quiz/:lessonId", component: QuizView, name: 'quiz' },
  { path: "/profile", component: ProfileView },
  { path: "/level-test/:levelId", component: LevelTestView, name: 'levelTest' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
