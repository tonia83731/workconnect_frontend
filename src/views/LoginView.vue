<script lang="ts">
import { login } from '@/api/auth'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import Cookies from 'js-cookie'

type LoginInput = {
  email: string
  password: string
}

export default {
  setup() {
    const router = useRouter()
    const { resetForm } = useForm()
    const input_class = 'w-full h-12 px-4 rounded-sm bg-gypsum text-gray placeholder:text-gray-50'
    const email = ref('')
    const password = ref('')

    const handleFormSubmit = async (value: LoginInput) => {
      try {
        const data = await login(value)
        console.log(data)

        if (!data?.success) {
          toast.error('Email或密碼錯誤，請重新輸入')
          resetForm()
          return
        }

        const token = data?.data.token
        if (token) {
          Cookies.set('memberToken', token, { expires: 7, path: '/' })
          toast.success('登入成功，歡迎回來!')

          setTimeout(() => {
            router.push(`/dashboard/${data?.data.user.id}`)
          }, 3000)
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      input_class,
      email,
      password,
      handleFormSubmit,
    }
  },
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <h1 class="font-bold text-xl">WORKCONNECT | 歡迎回來-選擇登入</h1>
    <p class="text-gray-50 text-base">
      沒有帳號? 前往<span
        ><RouterLink
          to="/auth/register"
          class="hover:text-bold hover:underline hover:underline-offset-2 hover:text-gray"
          >註冊</RouterLink
        ></span
      >
    </p>
  </div>
  <VForm @submit="handleFormSubmit" v-slot="{ errors }" class="flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-0.5">
        <VField
          name="email"
          type="email"
          rules="required"
          placeholder="EMAIL"
          v-model="email"
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
          v-model="password"
          :class="[input_class, { 'border border-error': errors.password }]"
        />
        <ErrorMessage name="password" class="text-error text-sm" />
      </div>
    </div>
    <button type="submit" class="bg-purple text-white w-full rounded-sm text-center py-1.5">
      登入
    </button>
  </VForm>
</template>
