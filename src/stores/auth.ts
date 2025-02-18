import { defineStore } from 'pinia'
import { checkedAuthentication } from '@/api/auth'

type UserProfileData = {
  id: string
  name: string
  email: string
}

type AuthStateProps = {
  isAuth: boolean
  userId: string | null
  user: {
    name: string
    email: string
  } | null
}

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      isAuth: false,
      userId: null,
      user: null,
    }) as AuthStateProps,
  actions: {
    getUserData(userData: UserProfileData) {
      this.user = {
        name: userData.name,
        email: userData.email,
      }
      this.userId = userData.id
    },
    async checkedUserAuthentication() {
      try {
        const res = await checkedAuthentication()
        if (res?.success) {
          this.isAuth = res?.data.isAuth
          this.userId = res?.data.userId
          this.user = {
            name: res?.data.user.name,
            email: res?.data.user.email,
          }
        } else {
          this.isAuth = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    logout() {
      localStorage.removeItem('memberToken')
      this.user = null
      this.userId = null
      this.isAuth = false
    },
  },
})
