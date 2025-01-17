import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

// Public Views
import HomeView from "@/views/public/HomeView.vue";
import AboutView from "@/views/public/AboutView.vue";
import ContactView from "@/views/public/ContactView.vue";
import FeaturesView from "@/views/public/FeaturesView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import MFAView from '@/views/auth/MFAView.vue';
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue';
import VerifyEmailView from '@/views/auth/VerifyEmailView.vue';

// User Views
import ProfileView from "@/views/user/ProfileView.vue";
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
    path: "/auth/mfa",
    name: "MFA",
    component: MFAView,
  },
  {
    path: "/auth/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordView,
  },
  {
    path: "/auth/reset-password",
    name: "ResetPassword",
    component: ResetPasswordView,
  },
  {
    path: "/auth/verify-email",
    name: "VerifyEmail",
    component: VerifyEmailView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "edit",
        name: "profile.edit",
        component: () => import("@/components/profile/ProfileForm.vue"),
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token') !== null;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'profile' });
  } else {
    next();
  }
});

export default router;
