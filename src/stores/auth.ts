import { defineStore } from 'pinia'

type UserProfileData = {
  id: string
  name: string
  email: string
  bgColor: string
  textColor: string
}

type AuthStateProps = {
  isAuth: boolean
  userId: string | null
  user: {
    name: string
    email: string
    bgColor: string
    textColor: string
    // color: string
  } | null
  isMember: boolean | null
  adminStatus: boolean | null
}

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      isAuth: false,
      userId: null,
      user: null,
      isMember: null,
      adminStatus: null,
    }) as AuthStateProps,
  persist: true,
  actions: {
    getUserData(userData: UserProfileData) {
      this.user = {
        name: userData.name,
        email: userData.email,
        bgColor: userData.bgColor,
        textColor: userData.textColor,
      }
      this.userId = userData.id
    },
    updatedUserAuth(userData: {
      isAuth: boolean
      userId: string | null
      user: {
        name: string
        email: string
        bgColor: string
        textColor: string
      } | null
    }) {
      this.isAuth = userData.isAuth
      this.userId = userData.userId
      this.user = userData.user
        ? {
            name: userData.user?.name,
            email: userData.user?.email,
            bgColor: userData.user?.bgColor,
            textColor: userData.user?.textColor,
          }
        : null
    },
    updatedWorkspaceAuth(memberData: { isMember: boolean | null; adminStatus: boolean | null }) {
      this.isMember = memberData.isMember
      this.adminStatus = memberData.adminStatus
    },
    logout() {
      localStorage.removeItem('memberToken')
      this.user = null
      this.userId = null
      this.isAuth = false
      this.isMember = null
      this.adminStatus = null
    },
    workspaceLogout() {
      this.isMember = null
      this.adminStatus = null
    },
  },
})
