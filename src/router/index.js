import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import BugView from '../views/BugView.vue'
import ProfileView from '../views/ProfileView.vue'
import VerifyEmail from '../views/VerifyEmailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/bugs/:id',
      name: 'bug-detail',
      component: BugView,
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: VerifyEmail,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (!token) {
    if (to.name !== 'auth') {
      return next({
        name: 'auth',
      })
    }
  } else {
    if (to.name === 'auth') {
      return next({
        name: 'home',
      })
    }
  }

  next()
})

export default router
