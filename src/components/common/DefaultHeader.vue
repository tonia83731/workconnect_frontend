<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import UserIcon from '@/components/icons/UserIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'

const authStore = useAuthStore()

export default {
  components: {
    UserIcon,
    LogoutIcon,
  },
  data() {
    return {}
  },
  methods: {
    handleLogout() {
      authStore.logout()
      this.$router.push({ name: 'login' })
    },
  },
  computed: {
    userId() {
      return authStore.userId
    },
    userName() {
      return authStore.user?.name || ''
    },
  },
}
</script>
<template>
  <header
    class="bg-white fixed top-10 left-1/2 -translate-x-1/2 shadow-md max-w-7xl w-5/6 mx-auto xl:w-full h-[60px]"
  >
    <div class="w-11/12 mx-auto h-[60px] leading-[60px] flex justify-between items-center">
      <h5 class="font-bold text-xl">WORKCONNECT</h5>
      <div class="flex items-center gap-2">
        <RouterLink :to="`/profile/${userId}`" class="flex flex-col items-center gap-0.5 group">
          <div
            class="w-8 h-8 rounded-full bg-soft-aqua flex justify-center items-center group-hover:border group-hover:border-ocean-teal"
          >
            <UserIcon class="text-ocean-teal" />
          </div>
          <p class="text-xs text-ocean-teal hidden group-hover:block">{{ userName }}</p>
        </RouterLink>
        <button @click="handleLogout" class="flex flex-col items-center gap-0.5 group">
          <div
            class="w-8 h-8 rounded-full bg-soft-aqua flex justify-center items-center group-hover:border group-hover:border-ocean-teal"
          >
            <LogoutIcon class="text-ocean-teal" />
          </div>
          <p class="text-xs text-ocean-teal hidden group-hover:block">登出</p>
        </button>
      </div>
    </div>
  </header>
</template>
