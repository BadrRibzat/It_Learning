import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    component: () => import('@/views/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/Home.vue') },
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true } },
      { path: 'profile', name: 'Profile', component: () => import('@/views/profile/Profile.vue'), meta: { requiresAuth: true } },
      {
        path: 'lessons',
        component: () => import('@/views/lessons/LessonsLayout.vue'),
        children: [
          { path: '', name: 'Lessons', component: () => import('@/views/lessons/LessonsList.vue') },
          { path: ':levelId', name: 'LevelDetail', component: () => import('@/views/lessons/LevelDetail.vue') },
          { path: ':levelId/lesson/:lessonId', name: 'LessonDetail', component: () => import('@/views/lessons/LessonDetail.vue') },
        ],
        meta: { requiresAuth: true },
      },
      { path: 'notes', name: 'Notes', component: () => import('@/views/notes/Notes.vue'), meta: { requiresAuth: true } },
      { path: 'quiz/:quizId', name: 'Quiz', component: () => import('@/views/lessons/Quiz.vue'), meta: { requiresAuth: true } },
      { path: 'chat', name: 'Chat', component: () => import('@/views/chat/ChatView.vue'), meta: { requiresAuth: true } },
      { path: 'about', name: 'About', component: () => import('@/views/About.vue') }, // Add this line
    ],
  },
  {
    path: '/auth',
    component: () => import('@/views/layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'Login', component: () => import('@/views/auth/LoginView.vue') },
      { path: 'register', name: 'Register', component: () => import('@/views/auth/RegisterView.vue') },
      { path: 'forgot-password', name: 'ForgotPassword', component: () => import('@/views/auth/ForgotPassword.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
