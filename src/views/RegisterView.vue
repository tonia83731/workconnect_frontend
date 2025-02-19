<script lang="ts">
import { defineRule } from 'vee-validate'
import { toast } from 'vue3-toastify'
import { register } from '@/api/auth'
import { inputClass } from '@/styles/input-style'
import type { RegisterFormType } from '@/types/auth'

export default {
  data() {
    return {
      input_class: inputClass(),
      register: {
        name: '',
        email: '',
        password: '',
      } as RegisterFormType,
      status: '',
    }
  },
  created() {
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
  },
  methods: {
    async handleRegisterSubmit() {
      try {
        const data = await register(this.register)
        if (data?.success) {
          toast.success('使用者註冊成功!')

          // this.register.name = ''
          // this.register.email = ''
          // this.register.password = ''

          setTimeout(() => {
            this.$router.push('/auth/login')
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
    <h1 class="font-bold text-xl">WORKCONNECT | 歡迎回來-選擇註冊</h1>
    <p class="text-midnight-forest-40 textbase">
      已經是會員? 前往<span
        ><RouterLink
          to="/auth/login"
          class="hover:text-bold hover:underline hover:underline-offset-2 hover:text-midnight-forest"
          >登入</RouterLink
        ></span
      >
    </p>
  </div>
  <VForm class="flex flex-col gap-8" v-slot="{ errors }" @submit="handleRegisterSubmit">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-0.5">
        <VField
          name="name"
          type="string"
          rules="required"
          placeholder="NAME"
          v-model="register.name"
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
          v-model="register.email"
          :class="[input_class, { 'border border-error': errors.email }]"
        /><ErrorMessage name="email" class="text-error text-sm" />
      </div>
      <div class="flex flex-col gap-0.5">
        <VField
          name="password"
          type="password"
          rules="strongPassword"
          placeholder="PASSWORD"
          v-model="register.password"
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
