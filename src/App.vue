<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const router = useRouter()
const token = localStorage.getItem('memberToken')
const authStore = useAuthStore()

onMounted(() => {
  if (!token) {
    authStore.logout()
    toast.error('權限不足，請重新登入')

    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  } else if (!authStore.isAuth) {
    authStore.checkedUserAuthentication()
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
