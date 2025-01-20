import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { toast } from 'vue3-toastify'
import { checkedAuthentication } from '@/api/auth'
import { getUserProfile, updatedUserProfile } from '@/api/user'
import type { RegisterInput } from '@/views/ProfileView.vue'

type UserProfileData = {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const router = useRouter()

    const isAuth = ref<boolean>(false)
    const userId = ref<string | null>(null)
    const user = ref<UserProfileData | null>(null)

    const fetchCheckedAuthentication = async () => {
      try {
        const data = await checkedAuthentication()

        if (data?.success) {
          isAuth.value = data.data.isAuth

          if (data.data.isAuth) {
            userId.value = data.data.userId
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    const handleLogout = () => {
      Cookies.remove('memberToken', { path: '/' })
      user.value = null
      router.push('/auth/login')
    }

    const handleUpdatedProfile = async (payload: RegisterInput) => {
      if (!user.value) return
      try {
        const data = await updatedUserProfile(user.value?.id as string, payload)
        if (!data?.success) {
          toast.error('使用者資訊更新失敗!')
          return
        }

        toast.success('使用者資訊更新成功!')
        user.value = data?.data
      } catch (error) {
        console.log(error)
      }
    }

    // ------------------ FETCH USERDATA ------------------
    const fetchUserProfile = async (userId: string) => {
      try {
        const data = await getUserProfile(userId)

        if (data?.success) {
          user.value = data?.data
        } else {
          user.value = null
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      isAuth,
      userId,
      user,
      fetchCheckedAuthentication,
      fetchUserProfile,
      handleUpdatedProfile,
      handleLogout,
    }
  },
  {
    persist: true,
  },
)
