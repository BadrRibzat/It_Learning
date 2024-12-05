import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import SignIn from '../views/auth/SignIn.vue';
import SignUp from '../views/auth/SignUp.vue';
import ForgotPassword from '../views/auth/ForgotPassword.vue';
import ProfileDashboard from '../views/profile/ProfileDashboard.vue';
import store from '../store';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/signin', component: SignIn },
  { path: '/signup', component: SignUp },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/profile', component: ProfileDashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ path: '/signin' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
