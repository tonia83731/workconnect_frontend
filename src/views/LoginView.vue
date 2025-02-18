<script lang="ts">
import { toast } from 'vue3-toastify'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { inputClass } from '@/styles/input-style'

type LoginForm = {
  email: string
  password: string
}

export default {
  data() {
    return {
      authStore: useAuthStore(),
      input_class: inputClass(),
      login: {
        email: '',
        password: '',
      } as LoginForm,
    }
  },
  methods: {
    async handleLoginSubmit() {
      try {
        const data = await login(this.login)

        if (!data?.success) {
          toast.error('Email或密碼錯誤，請重新輸入')
          return
        }

        const { token, user } = data?.data

        if (token && user) {
          toast.success('登入成功，歡迎回來!')
          localStorage.setItem('memberToken', token)

          this.authStore.getUserData(user)
          this.authStore.isAuth = true

          setTimeout(() => {
            this.$router.push(`/dashboard/${user.id}`)
          }, 2000)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <h1 class="font-bold text-xl">WORKCONNECT | 歡迎回來-選擇登入</h1>
    <p class="text-midnight-forest-40 text-base">
      沒有帳號? 前往<span
        ><RouterLink
          to="/auth/register"
          class="hover:text-bold hover:underline hover:underline-offset-2 hover:text-midnight-forest"
          >註冊</RouterLink
        ></span
      >
    </p>
  </div>
  <VForm @submit="handleLoginSubmit" v-slot="{ errors }" class="flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-0.5">
        <VField
          name="email"
          type="email"
          rules="required"
          placeholder="EMAIL"
          v-model="login.email"
          :class="[input_class, { 'border border-error': errors.email }]"
        />
        <ErrorMessage name="email" class="text-error text-sm" />
      </div>
      <div class="flex flex-col gap-0.5">
        <VField
          name="password"
          type="password"
          rules="required"
          placeholder="PASSWORD"
          v-model="login.password"
          :class="[input_class, { 'border border-error': errors.password }]"
        />
        <ErrorMessage name="password" class="text-error text-sm" />
      </div>
    </div>
    <button
      type="submit"
      class="bg-midnight-forest text-white w-full rounded-sm text-center py-1.5 hover:shadow-md hover:font-semibold"
    >
      登入
    </button>
  </VForm>
</template>
