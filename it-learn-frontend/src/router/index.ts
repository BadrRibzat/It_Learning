import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { levelGuard } from '../utils/levelGuard';
import DefaultLayout from '../components/layout/DefaultLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/public/HomeView.vue')
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/public/AboutView.vue')
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('../views/public/ContactView.vue')
        },
        // Protected profile routes
        {
          path: 'profile',
          component: () => import('../views/user/ProfileView.vue'),
          meta: { requiresAuth: true },
          children: [
            {
              path: '',
              name: 'profile-overview',
              component: () => import('../components/profile/ProfileOverview.vue')
            },
            {
              path: 'settings',
              name: 'profile-settings',
              component: () => import('../components/profile/ProfileSettings.vue')
            },
            {
              path: 'achievements',
              name: 'achievements',
              component: () => import('../views/user/AchievementsView.vue')
            },
            {
              path: 'stats',
              name: 'learning-stats',
              component: () => import('../views/user/LearningStatsView.vue')
            },
            // Learning routes
            {
              path: 'learning',
              children: [
                {
                  path: '',
                  name: 'learning-dashboard',
                  component: () => import('../views/user/learning/LearningDashboard.vue')
                },
                {
                  path: 'level/:levelId',
                  name: 'level',
                  component: () => import('../views/user/learning/LevelView.vue'),
                  beforeEnter: levelGuard,
                  props: true
                },
                {
                  path: 'level/:levelId/lesson/:lessonId',
                  name: 'lesson',
                  component: () => import('../views/user/learning/LessonView.vue'),
                  props: true
                },
                {
                  path: 'level/:levelId/lesson/:lessonId/flashcards',
                  name: 'flashcards',
                  component: () => import('../views/user/learning/FlashcardsView.vue'),
                  props: true
                },
                {
                  path: 'level/:levelId/lesson/:lessonId/quiz',
                  name: 'quiz',
                  component: () => import('../views/user/learning/QuizView.vue'),
                  props: true
                },
                {
                  path: 'level/:levelId/test',
                  name: 'level-test',
                  component: () => import('../views/user/learning/LevelTestView.vue'),
                  beforeEnter: levelGuard,
                  props: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/public/NotFoundView.vue')
    }
  ]
});

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Handle authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ 
      name: 'login', 
      query: { 
        redirect: to.fullPath,
        message: 'Please log in to access your learning space.'
      }
    });
  }
  // Handle guest only routes
  else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'profile-overview' });
  }
  // Redirect authenticated users from home to profile
  else if (isAuthenticated && to.name === 'home') {
    next({ name: 'profile-overview' });
  }
  // Allow all other routes
  else {
    next();
  }
});

export default router;
