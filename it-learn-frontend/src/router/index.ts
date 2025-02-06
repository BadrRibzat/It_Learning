import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/public/HomeView.vue'),
      meta: { layout: 'default' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/public/AboutView.vue'),
      meta: { layout: 'default' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/public/ContactView.vue'),
      meta: { layout: 'default' }
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
    // Add more routes as needed
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  }
  // Check if route requires guest access
  else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' });
  }
  else {
    next();
  }
});

export default router;
