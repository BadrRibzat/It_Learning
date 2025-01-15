import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LessonView from '@/views/LessonView.vue';
import FlashcardsView from '@/views/FlashcardsView.vue';
import QuizView from '@/views/QuizView.vue';
import ProfileView from '@/views/ProfileView.vue';
import LevelsView from '@/views/LevelsView.vue';
import LevelTestView from '@/views/LevelTestView.vue';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/levels', component: LevelsView, meta: { requiresAuth: true } },
  { path: '/lessons/:levelId', component: LessonView, name: 'lessons', meta: { requiresAuth: true } },
  { path: '/flashcards', component: FlashcardsView, meta: { requiresAuth: true } },
  { path: '/quiz/:lessonId', component: QuizView, name: 'quiz', meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/level-test/:levelId', component: LevelTestView, name: 'levelTest', meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!store.state.auth.token;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
