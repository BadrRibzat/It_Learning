import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

// Import public views
import HomeView from "@/views/public/HomeView.vue";
import AboutView from "@/views/public/AboutView.vue";
import ContactView from "@/views/public/ContactView.vue";
import FeaturesView from "@/views/public/FeaturesView.vue";

// Import auth views
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";

// Import user views
import ProfileView from "@/views/user/ProfileView.vue";

const routes = [
  // Public Routes
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

  // Protected Profile Route with all features as children
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: { requiresAuth: true },
    children: [
      // Profile related routes
      {
        path: "",
        name: "profile.dashboard",
        component: () => import("@/components/profile/ProfileComponent.vue"),
      },
      {
        path: "statistics",
        name: "profile.statistics",
        component: () => import("@/components/progress/StatisticsChart.vue"),
      },
      {
        path: "notes",
        name: "profile.notes",
        component: () => import("@/views/user/NotesView.vue"),
      },
      // Lessons routes as children of profile
      {
        path: "lessons",
        name: "profile.lessons",
        component: () => import("@/views/lessons/LessonsView.vue"),
      },
      {
        path: "lessons/:level/flashcards",
        name: "profile.lessons.flashcards",
        component: () => import("@/views/lessons/FlashcardsView.vue"),
      },
      {
        path: "lessons/:level/quiz",
        name: "profile.lessons.quiz",
        component: () => import("@/views/lessons/QuizView.vue"),
      },
      {
        path: "lessons/:level/test",
        name: "profile.lessons.test",
        component: () => import("@/views/lessons/LevelTestView.vue"),
      }
    ],
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'profile' });
  } else {
    next();
  }
});

export default router;
