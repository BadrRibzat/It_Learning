import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    component: () => import('@/views/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/Home.vue') },
      { 
        path: 'dashboard', 
        name: 'Dashboard', 
        component: () => import('@/views/Dashboard.vue'), 
        meta: { requiresAuth: true } 
      },
      {
        path: '/levels',
        name: 'Levels',
        component: () => import('@/views/lessons/LevelsView.vue'),
        meta: { requiresAuth: true },
      },
      { 
        path: 'profile', 
        name: 'Profile', 
        component: () => import('@/views/profile/Profile.vue'), 
        meta: { requiresAuth: true } 
      },
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
      { 
        path: 'notes', 
        name: 'Notes', 
        component: () => import('@/views/notes/Notes.vue'), 
        meta: { requiresAuth: true } 
      },
      { 
        path: 'quiz/:quizId', 
        name: 'Quiz', 
        component: () => import('@/views/lessons/Quiz.vue'), 
        meta: { requiresAuth: true } 
      },
      { 
        path: 'chat', 
        name: 'Chat', 
        component: () => import('@/views/chat/ChatView.vue'), 
        meta: { requiresAuth: true } 
      },
      { path: 'about', name: 'About', component: () => import('@/views/About.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/views/layouts/AuthLayout.vue'),
    children: [
      { 
        path: 'login', 
        name: 'Login', 
        component: () => import('@/views/auth/LoginView.vue'), 
        meta: { requiresGuest: true } 
      },
      { 
        path: 'register', 
        name: 'Register', 
        component: () => import('@/views/auth/RegisterView.vue'), 
        meta: { requiresGuest: true } 
      },
      { 
        path: 'forgot-password', 
        name: 'ForgotPassword', 
        component: () => import('@/views/auth/ForgotPassword.vue'), 
        meta: { requiresGuest: true } 
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next({ name: 'Dashboard' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
