import { createRouter, createWebHistory } from 'vue-router';
import store from '@/stores';

import Home from '@/views/Home.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import ProfileView from '@/views/dashboard/ProfileView.vue';
import NotesView from '@/views/NotesView.vue';
import LevelsView from '@/views/levels/LevelsView.vue';
import LevelTestView from '@/views/levels/LevelTestView.vue';
import LessonsView from '@/views/lessons/LessonsView.vue';
import LessonDetailView from '@/views/lessons/LessonDetailView.vue';
import FlashcardsView from '@/views/flashcards/FlashcardsView.vue';
import FlashcardDetailView from '@/views/flashcards/FlashcardDetailView.vue';
import ProgressView from '@/views/ProgressView.vue';
import QuizDetailView from '@/views/quizzes/QuizDetailView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/features',
    name: 'Features',
    component: () => import('@/views/Features.vue'),
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import('@/views/Pricing.vue'),
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/notes',
    name: 'Notes',
    component: NotesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/levels',
    name: 'Levels',
    component: LevelsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/levels/:id/test',
    name: 'LevelTest',
    component: LevelTestView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/lessons',
    name: 'Lessons',
    component: LessonsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/lessons/:id',
    name: 'LessonDetail',
    component: LessonDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/flashcards',
    name: 'Flashcards',
    component: FlashcardsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/flashcards/:id',
    name: 'FlashcardDetail',
    component: FlashcardDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/progress',
    name: 'Progress',
    component: ProgressView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/quizzes/:id',
    name: 'QuizDetail',
    component: QuizDetailView,
    meta: { requiresAuth: true },
  },
   // Catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = store.state.auth.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
