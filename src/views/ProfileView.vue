<script lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { defineRule } from 'vee-validate'
import DefaultLayout from '@/components/common/layout/DefaultLayout.vue'
import LeftArrowIcon from '@/components/icons/LeftArrowIcon.vue'
import { useAuthStore } from '@/stores/auth'
import { input_class } from '@/data/input-style'

export type RegisterInput = {
  name: string
  account: string
  email: string
  password: string
}

export default {
  components: {
    LeftArrowIcon,
    DefaultLayout,
  },
  setup() {
    const authStore = useAuthStore()
    const { params } = useRoute()
    // const input_class = 'w-full h-12 px-4 rounded-sm bg-gypsum text-gray placeholder:text-gray-50'
    const name = ref<string>('')
    const email = ref<string>('')
    const password = ref<string>('')

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
      console.log(value)
      // await authStore.handleUpdatedProfile(params?.userId as string, value)
    }

    onMounted(() => {
      if (authStore.isAuth && authStore.user) {
        name.value = authStore.user.name
        email.value = authStore.user.email
      }
    })

    watch(
      () => authStore.user,
      (newUser) => {
        if (!newUser) return
        name.value = newUser?.name
        email.value = newUser?.email
      },
    )

    return {
      input_class: input_class(),
      name,
      email,
      password,
      handleFormSubmit,
      userId: params?.userId,
    }
  },
}
</script>

<template>
  <DefaultLayout>
    <RouterLink :to="`/dashboard/${userId}`" class="flex items-center justify-start gap-1">
      <LeftArrowIcon />
      <p>回到工作區選單</p>
    </RouterLink>
    <h1 class="font-bold text-xl">使用者資料</h1>
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
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-midnight-forest text-white w-full md:w-1/3 rounded-sm text-center py-1.5"
        >
          更新
        </button>
      </div>
    </VForm>
  </DefaultLayout>
</template>
