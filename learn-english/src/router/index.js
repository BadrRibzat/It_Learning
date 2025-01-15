import { createRouter, createWebHistory } from "vue-router";

// Public Views
import HomeView from "@/views/public/HomeView.vue";
import AboutView from "@/views/public/AboutView.vue";
import ContactView from "@/views/public/ContactView.vue";
import FeaturesView from "@/views/public/FeaturesView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";

// User Views
import ProfileView from "@/views/user/ProfileView.vue";
import ProfileForm from "@/components/profile/ProfileForm.vue";
import StatisticsView from "@/views/user/StatisticsView.vue";
import RecommendedView from "@/views/user/RecommendedView.vue";
import NotesView from "@/views/user/NotesView.vue";
import BeginnerView from "@/views/levels/BeginnerView.vue";
import IntermediateView from "@/views/levels/IntermediateView.vue";
import AdvancedView from "@/views/levels/AdvancedView.vue";
import FlashcardsView from "@/views/flashcards/FlashcardsView.vue";
import QuizzesView from "@/views/quizzes/QuizzesView.vue";
import TestView from "@/views/levels/TestView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
  },
  {
    path: "/features",
    name: "features",
    component: FeaturesView,
  },
  {
    path: "/auth/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/auth/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    children: [
      {
        path: "",
        name: "profile.default",
        component: () => import("@/views/user/ProfileView.vue"),
      },
      {
        path: "statistics",
        name: "profile.statistics",
        component: StatisticsView,
      },
      {
        path: "recommended",
        name: "profile.recommended",
        component: RecommendedView,
      },
      {
	path: "Test",
	name: "profile.Test",
	component: TestView,
      },
      {
        path: "beginner",
        name: "profile.beginner",
        component: BeginnerView,
      },
      {
        path: "intermediate",
        name: "profile.intermediate",
        component: IntermediateView,
      },
      {
        path: "advanced",
        name: "profile.advanced",
        component: AdvancedView,
      },
      {
        path: "flashcards",
        name: "profile.flashcards",
        component: FlashcardsView,
      },
      {
        path: "quizzes",
        name: "profile.quizzes",
        component: QuizzesView,
      },
      {
        path: "notes",
        name: "profile.notes",
        component: NotesView,
      },
    ],
  },
  {
    path: "/profile/edit",
    name: "profile.edit",
    component: ProfileForm,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
