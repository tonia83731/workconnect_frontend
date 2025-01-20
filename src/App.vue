<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'
import Cookies from 'js-cookie'

const token = Cookies.get('memberToken')
const authStore = useAuthStore()

onMounted(() => {
  if (token && !authStore.isAuth) {
    authStore.fetchCheckedAuthentication()
  }
})

// console.log(authStore.isAuth)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
