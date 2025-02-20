<script setup lang="ts">
// import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { checkedAuthentication } from './api/auth'
import { useAuthStore } from './stores/auth'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const token = localStorage.getItem('memberToken')

const checkedUserAuth = async () => {
  try {
    const res = await checkedAuthentication()
    if (res?.success) {
      const data = res?.data
      console.log(data)
      const isAuth = data.isAuth

      if (!isAuth) {
        authStore.logout()
        toast.error('權限不足，請重新登入')

        setTimeout(() => {
          router.push({ name: 'login' })
        }, 2000)
      } else {
        authStore.updatedUserAuth({
          isAuth,
          userId: data.userId,
          user: {
            name: data.user.name,
            email: data.user.email,
            bgColor: data.user.bgColor,
            textColor: data.user.textColor,
          },
        })
      }
    } else {
      authStore.logout()
      toast.error('權限不足，請重新登入')

      setTimeout(() => {
        router.push({ name: 'login' })
      }, 2000)
    }
  } catch (error) {
    authStore.logout()
    toast.error(`權限不足，請重新登入: ${error}`)

    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  }
}
onMounted(() => {
  if (!token) {
    authStore.logout()
    toast.error('權限不足，請重新登入')

    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  } else if (!authStore.isAuth) {
    checkedUserAuth()
  }
})

// import { useAuthStore } from './stores/auth'
// import { onMounted } from 'vue'
// import { toast } from 'vue3-toastify'

// const router = useRouter()
// const token = localStorage.getItem('memberToken')
// const authStore = useAuthStore()

// onMounted(() => {
//   if (!token) {
//     authStore.logout()
//     toast.error('權限不足，請重新登入')

//     setTimeout(() => {
//       router.push({ name: 'login' })
//     }, 2000)
//   } else if (!authStore.isAuth) {
//     authStore.checkedUserAuthentication()
//   }
// })

// watch(
//   () => router.currentRoute.value,
//   () => {
//     if (!token) {
//       authStore.logout()
//       toast.error('權限不足，請重新登入')

//       setTimeout(() => {
//         router.push({ name: 'login' })
//       }, 2000)
//     } else if (!authStore.isAuth) {
//       authStore.checkedUserAuthentication()
//     }
//   },
// )
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
