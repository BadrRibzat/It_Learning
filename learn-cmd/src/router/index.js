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
    component: ProfileView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "profile.dashboard",
        component: () => import("@/components/profile/ProfileComponent.vue"),
      },
      {
        path: "settings",
        name: "profile.settings",
        component: () => import("@/components/profile/ProfileForm.vue"),
      },
      {
        path: "notes",
        name: "profile.notes",
        component: () => import("@/views/user/NotesView.vue"),
      },
      {
        path: "lessons",
        component: () => import("@/views/lessons/LessonsView.vue"),
        children: [
          {
            path: "",
            name: "profile.lessons",
            component: () => import("@/components/lessons/LessonsComponent.vue"),
          },
          {
            path: ":level",
            name: "profile.lessons.level",
            component: () => import("@/components/lessons/LessonsComponent.vue"),
            props: true,
          },
          {
            path: ":level/flashcards",
            name: "profile.lessons.flashcards",
            component: () => import("@/components/lessons/FlashcardsComponent.vue"),
            props: true,
          },
          {
            path: ":level/quiz",
            name: "profile.lessons.quiz",
            component: () => import("@/components/lessons/QuizComponent.vue"),
            props: true,
          },
          {
            path: ":level/test",
            name: "profile.lessons.test",
            component: () => import("@/components/lessons/LevelTestComponent.vue"),
            props: true,
          }
        ]
      },
      {
        path: "flashcards",
        name: "profile.flashcards",
        component: () => import("@/views/lessons/FlashcardsView.vue"),
      },
      {
        path: "statistics",
        name: "profile.statistics",
        component: () => import("@/components/progress/StatisticsChart.vue"),
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else if (isAuthenticated && (to.name === 'login' || to.name === 'register')) {
    next({ name: 'profile' });
  } else {
    next();
  }
});

export default router;
