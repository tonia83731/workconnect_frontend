<script lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import UserIcon from '@/components/icons/UserIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'

export default {
  components: {
    UserIcon,
    LogoutIcon,
  },
  setup() {
    const authStore = useAuthStore()
    const { params } = useRoute()

    const handleLogout = () => {
      authStore.handleLogout()
    }

    onMounted(() => {
      if (params?.userId) {
        authStore.fetchUserProfile(params.userId as string)
      }
    })

    return { user: authStore.user, userId: params.userId, handleLogout }
  },
}
</script>

<template>
  <header
    class="bg-white fixed top-10 left-1/2 -translate-x-1/2 shadow-md max-w-7xl w-5/6 mx-auto xl:w-full h-[60px]"
  >
    <div class="w-11/12 mx-auto h-[60px] leading-[60px] flex justify-end items-center">
      <div class="flex items-center gap-2">
        <RouterLink :to="`/profile/${userId}`" class="flex flex-col items-center gap-0.5 group">
          <div
            class="w-10 h-10 rounded-full bg-gray-30 flex justify-center items-center group-hover:border group-hover:border-teal-gray"
          >
            <UserIcon class="text-teal-gray" />
          </div>
          <p class="text-xs text-teal-gray group-hover:font-bold">{{ user?.name }}</p>
        </RouterLink>
        <button @click="handleLogout" class="flex flex-col items-center gap-0.5 group">
          <div
            class="w-10 h-10 rounded-full bg-gray-30 flex justify-center items-center group-hover:border group-hover:border-teal-gray"
          >
            <LogoutIcon class="text-teal-gray" />
          </div>
          <p class="text-xs text-teal-gray group-hover:font-bold">登出</p>
        </button>
      </div>
    </div>
  </header>
  <main class="max-w-7xl w-5/6 mx-auto xl:w-full pb-14">
    <div class="mt-[150px] flex flex-col gap-6">
      <slot></slot>
    </div>
    <RouterView />
  </main>
</template>
