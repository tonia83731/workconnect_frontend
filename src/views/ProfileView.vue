<script lang="ts">
import { updatedUserProfile } from '@/api/user'
import DefaultLayout from '@/components/common/layout/DefaultLayout.vue'
import LeftArrowIcon from '@/components/icons/LeftArrowIcon.vue'
import { useAuthStore } from '@/stores/auth'
import { inputClass } from '@/styles/input-style'
import { toast } from 'vue3-toastify'

export type RegisterInput = {
  name: string
  email: string
  password?: string
}

const authStore = useAuthStore()

export default {
  components: {
    LeftArrowIcon,
    DefaultLayout,
  },
  data() {
    return {
      input_class: inputClass(),
      // name: '',
      // email: '',
    }
  },
  methods: {
    async handleProfileUpdated() {
      try {
        const res = await updatedUserProfile(this.userId as string, {
          name: this.name,
          email: this.email,
        })

        if (res?.success) {
          toast.success('使用者資料更新成功')
          const data = res?.data
          const user = {
            id: data.id,
            name: data.name,
            email: data.email,
          }

          authStore.getUserData(user)
          this.name = data.name
          this.email = data.email
        } else {
          toast.error('使用者資料更新失敗')
        }
      } catch (error) {
        console.log(error)
        toast.error('使用者資料更新失敗')
      }
    },
  },
  mounted() {
    // if (this.userId) {
    //   this.fetchUserData(this.userId as string)
    // }
  },
  computed: {
    userId() {
      return authStore.userId
    },
    name: {
      get() {
        return authStore.user?.name || ''
      },
      set(value: string) {
        authStore.user!.name = value
      },
    },
    email: {
      get() {
        return authStore.user?.email || ''
      },
      set(value: string) {
        authStore.user!.email = value
      },
    },
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
    <VForm class="flex flex-col gap-8 w-full" v-slot="{ errors }" @submit="handleProfileUpdated">
      <div class="flex flex-col gap-4">
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
