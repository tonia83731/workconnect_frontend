import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: async (to, from, next) => {
        const token = localStorage.getItem('memberToken')
        const authStore = useAuthStore()

        if (token && authStore.isAuth) {
          next({ name: 'dashboard', params: { userId: authStore.userId } })
        } else {
          next({ name: 'login' })
        }
      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/components/common/layout/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/RegisterView.vue'),
        },
      ],
    },
    {
      path: '/dashboard/:userId',
      // /dashboard/:user_id
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiredAuth: true,
      },
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        requiredAuth: true,
      },
    },
    {
      path: '/workspace/:account',
      name: 'workspace',
      children: [
        {
          path: 'todo',
          name: 'work-todo',
          component: () => import('../views/TodoView.vue'),
          meta: {
            requiredAuth: true,
          },
        },
        {
          path: 'todo/:bucketId',
          name: 'work-todo-bucket',
          component: () => import('../views/TodoBucketView.vue'),
          meta: {
            requiredAuth: true,
          },
        },
        {
          path: 'member',
          name: 'work-member',
          component: () => import('../views/MemberView.vue'),
          meta: {
            requiredAuth: true,
          },
        },
        {
          path: 'chat',
          name: 'work-chat',
          component: () => import('../views/ChatView.vue'),
          meta: {
            requiredAuth: true,
          },
        },
        {
          path: 'setting',
          name: 'work-setting',
          component: () => import('../views/SettingView.vue'),
          meta: {
            requiredAuth: true,
          },
        },
      ],
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'no-found',
    //   component: () => import('../views/NofoundView.vue'),
    // },
  ],
})

router.beforeEach(async (to, from, next) => {
  // console.log('to:', to)
  // console.log('from:', from)

  if (to.meta.requireAuth) {
    const token = localStorage.getItem('memberToken')
    if (token) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

// https://hackmd.io/@FortesHuang/SyMAtS6qH

export default router
