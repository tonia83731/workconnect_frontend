<script lang="ts">
import { getUserProfile } from '@/api/user'
import DefaultHeader from '../DefaultHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import { checkedAuthentication } from '@/api/auth'

const authStore = useAuthStore()

export default {
  components: {
    DefaultHeader,
  },
  methods: {
    async checkedUserAuth() {
      try {
        const res = await checkedAuthentication()
        if (res?.success) {
          const data = res?.data
          // console.log(data)
          const isAuth = data.isAuth

          if (!isAuth) {
            authStore.logout()
            toast.error('權限不足，請重新登入')

            setTimeout(() => {
              this.$router.push({ name: 'login' })
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
            this.$router.push({ name: 'login' })
          }, 2000)
        }
      } catch (error) {
        authStore.logout()
        toast.error(`權限不足，請重新登入: ${error}`)

        setTimeout(() => {
          this.$router.push({ name: 'login' })
        }, 2000)
      }
    },
    async fetchUserProfile(userId: string) {
      try {
        const res = await getUserProfile(userId)

        if (res?.success) {
          // console.log(res?.data)
          authStore.getUserData(res?.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.checkedUserAuth()
    const userId = this.$route.params.userId
    if (userId) {
      this.fetchUserProfile(userId as string)
    }
  },
}
</script>

<template>
  <DefaultHeader />
  <main class="max-w-7xl w-5/6 mx-auto xl:w-full pb-14">
    <div class="mt-[150px] flex flex-col gap-6">
      <slot></slot>
    </div>
    <RouterView />
  </main>
</template>
