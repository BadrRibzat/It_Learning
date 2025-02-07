import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';

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

router.beforeEach(async (to, from, next) => {
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
