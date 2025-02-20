<script lang="ts">
import { updatedUserProfile } from '@/api/user'
import DefaultLayout from '@/components/common/layout/DefaultLayout.vue'
import LeftArrowIcon from '@/components/icons/LeftArrowIcon.vue'
import { useAuthStore } from '@/stores/auth'
import { inputClass, labelClass } from '@/styles/input-style'
import { toast } from 'vue3-toastify'
import { ColorPicker } from 'vue-accessible-color-picker'
const authStore = useAuthStore()

export default {
  components: {
    LeftArrowIcon,
    DefaultLayout,
    ColorPicker,
  },
  data() {
    return {
      label_class: labelClass,
      input_class: inputClass(),
      bgToggle: false,
      textToggle: false,
      // bgColor: authStore.user?.bgColor,
      // textColor: authStore.user?.textColor,
    }
  },
  methods: {
    // async fetchUserProfile(userId: string) {
    //   try {
    //     const res = await getUserProfile(userId)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    async handleProfileUpdated() {
      const body = {
        name: this.name,
        email: this.email,
        bgColor: this.bgColor,
        textColor: this.textColor,
      }
      console.log(this.userId, body)
      try {
        const res = await updatedUserProfile(this.userId as string, body)

        if (res?.success) {
          toast.success('使用者資料更新成功')
          const data = res?.data
          console.log(data)
          const user = {
            id: data.id,
            name: data.name,
            email: data.email,
            bgColor: data.bgColor,
            textColor: data.textColor,
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
    handleColorToggle(type: 'bg' | 'text') {
      if (type === 'bg') {
        this.bgToggle = !this.bgToggle
        if (this.bgToggle) {
          this.textToggle = false
        }
      }
      if (type === 'text') {
        this.textToggle = !this.textToggle
        if (this.textToggle) {
          this.bgToggle = false
        }
      }
    },
    bgColorChanged(e: any) {
      const color = e.cssColor
      this.bgColor = color
    },
    textColorChanged(e: any) {
      const color = e.cssColor
      this.textColor = color
    },
  },
  mounted() {
    console.log(authStore.user)
    // if (this.userId) {
    //   this.fetchUserData(this.userId as string)
    // }
  },
  computed: {
    userId() {
      return this.$route.params.userId || authStore.userId
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
    bgColor: {
      get() {
        return authStore.user?.bgColor || '#AEDADA'
      },
      set(value: string) {
        authStore.user!.bgColor = value
      },
    },
    textColor: {
      get() {
        return authStore.user?.textColor || '#016766'
      },
      set(value: string) {
        authStore.user!.textColor = value
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
    <!-- {{ bgColor }} {{ textColor }} -->
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
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-4">
              <div :class="label_class">圖像背景顏色</div>
              <div class="relative">
                <button
                  type="button"
                  @click="handleColorToggle('bg')"
                  class="w-8 h-5 border-2 border-midnight-forest"
                  :style="{ backgroundColor: bgColor }"
                ></button>
                <div
                  v-if="bgToggle"
                  class="absolute w-[150px] md:w-[300px] bottom-0 left-0 -translate-y-[40px]"
                >
                  <ColorPicker
                    default-format="rgb"
                    :color="bgColor"
                    alpha-channel="hide"
                    @color-change="bgColorChanged"
                  />
                </div>
              </div>
              <!-- <color-picker v-model="bgColor" @update:modelValue="updateBgColor" /> -->
              <!-- @update:pureColor="updateBgColor" -->
            </div>
            <div class="flex items-center gap-4">
              <div :class="label_class">圖像文字顏色</div>
              <div class="relative">
                <button
                  type="button"
                  @click="handleColorToggle('text')"
                  class="w-8 h-5 border-2 border-midnight-forest"
                  :style="{ backgroundColor: textColor }"
                ></button>
                <div
                  v-if="textToggle"
                  class="absolute w-[150px] md:w-[300px] bottom-0 left-0 -translate-y-[40px]"
                >
                  <ColorPicker
                    default-format="rgb"
                    :color="textColor"
                    alpha-channel="hide"
                    @color-change="textColorChanged"
                  />
                </div>
              </div>
            </div>
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
<style>
@import url('vue-accessible-color-picker/styles');
</style>
