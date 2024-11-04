import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import ProfileView from '../views/ProfileView.vue';
import LevelsOverviewView from '../views/LevelsOverviewView.vue';
import LessonDetailView from '../views/LessonDetailView.vue';
import FlashcardsView from '../views/FlashcardsView.vue';
import QuizzesView from '../views/QuizzesView.vue';
import LevelTestsView from '../views/LevelTestsView.vue';
import NotesManagementView from '../views/NotesManagementView.vue';
import AboutView from '../views/AboutView.vue';
import ContactView from '../views/ContactView.vue';
import SignInView from '../views/SignInView.vue';
import SignUpView from '../views/SignUpView.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/levels',
    name: 'LevelsOverview',
    component: LevelsOverviewView,
    meta: { requiresAuth: true },
  },
  {
    path: '/lesson/:id',
    name: 'LessonDetail',
    component: LessonDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/flashcards',
    name: 'Flashcards',
    component: FlashcardsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/quizzes',
    name: 'Quizzes',
    component: QuizzesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/level-tests',
    name: 'LevelTests',
    component: LevelTestsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/notes',
    name: 'NotesManagement',
    component: NotesManagementView,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignInView,
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUpView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.getters.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next('/sign-in');
  } else {
    next();
  }
});

export default router;
