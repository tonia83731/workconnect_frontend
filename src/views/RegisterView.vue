<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineRule, useForm } from 'vee-validate'
import { toast } from 'vue3-toastify'
import { register } from '@/api/auth'
import { input_class } from '@/data/input-style'

type RegisterInput = {
  name: string
  email: string
  password: string
}

export default {
  setup() {
    const router = useRouter()
    const { resetForm } = useForm()
    const name = ref('')
    const email = ref('')
    const password = ref('')

    defineRule('strongPassword', (value: string) => {
      switch (true) {
        case !value:
          return 'password是必填'
        case value.length < 8:
          return 'password最少須8碼'
        case !/[A-Z]/.test(value) &&
          !/[a-z]/.test(value) &&
          !/[0-9]/.test(value) &&
          !/[!@#$%^&*]/.test(value):
          return 'password須包含A-Z*2, a-z*2, 0-9*2, 符號*2'
        default:
          return true
      }
    })

    const handleFormSubmit = async (value: RegisterInput) => {
      try {
        const data = await register(value)
        if (data?.success) {
          toast.success('使用者註冊成功!')
          resetForm()

          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      input_class: input_class(),
      name,
      email,
      password,
      handleFormSubmit,
    }
  },
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <h1 class="font-bold text-xl">WORKCONNECT | 歡迎回來-選擇註冊</h1>
    <p class="text-midnight-forest-40 text-base">
      已經是會員? 前往<span
        ><RouterLink
          to="/auth/login"
          class="hover:text-bold hover:underline hover:underline-offset-2 hover:text-midnight-forest"
          >登入</RouterLink
        ></span
      >
    </p>
  </div>
  <VForm class="flex flex-col gap-8" v-slot="{ errors }" @submit="handleFormSubmit">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-0.5">
        <VField
          name="name"
          type="string"
          rules="required"
          placeholder="NAME"
          v-model="name"
          :class="[input_class, { 'border border-error': errors.name }]"
        >
        </VField>
        <ErrorMessage name="name" class="text-error text-sm" />
      </div>
      <div class="flex flex-col gap-0.5">
        <VField
          name="email"
          type="email"
          rules="required|email"
          placeholder="EMAIL"
          v-model="email"
          :class="[input_class, { 'border border-error': errors.email }]"
        /><ErrorMessage name="email" class="text-error text-sm" />
      </div>
      <div class="flex flex-col gap-0.5">
        <VField
          name="password"
          type="password"
          rules="strongPassword"
          placeholder="PASSWORD"
          v-model="password"
          :class="[input_class, { 'border border-error': errors.password }]"
        /><ErrorMessage name="password" class="text-error text-sm" />
      </div>
    </div>
    <button
      type="submit"
      class="bg-midnight-forest text-white w-full rounded-sm text-center py-1.5"
    >
      註冊
    </button>
  </VForm>
</template>
