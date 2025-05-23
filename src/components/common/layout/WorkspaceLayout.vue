<script lang="ts">
import ModalLayout from './ModalLayout.vue'
import LeftArrowIcon from '@/components/icons/LeftArrowIcon.vue'
import ClipBoardIcon from '@/components/icons/ClipBoardIcon.vue'
import ClipBoardSolidIcon from '@/components/icons/ClipBoardSolidIcon.vue'
import UserGroupIcon from '@/components/icons/UserGroupIcon.vue'
import UserGroupSolidIcon from '@/components/icons/UserGroupSolidIcon.vue'
import ChatIcon from '@/components/icons/ChatIcon.vue'
import ChatSolidIcon from '@/components/icons/ChatSolidIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import SettingsSolidIcon from '@/components/icons/SettingsSolidIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import SwitchIcon from '@/components/icons/SwitchIcon.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import PinIcon from '@/components/icons/PinnedIcon.vue'
import PinOutlineIcon from '@/components/icons/PinnedOutlineIcon.vue'
import DotsIcon from '@/components/icons/EllipsisVerticalIcon.vue'
import SettingIcon from '@/components/icons/SettingIcon.vue'
import SettingSolidIcon from '@/components/icons/SettingSolidIcon.vue'
import ArrowLongRightIcon from '@/components/icons/ArrowLongRightIcon.vue'
import { getWorkspaceBuckets, updatedPinnedWorkspaceBucket } from '@/api/workbucket'
import { useAuthStore } from '@/stores/auth'
import { useBucketStore } from '@/stores/bucket'
// import { watchEffect } from 'vue'
// import { getUserProfile } from '@/api/user'
import { toast } from 'vue3-toastify'
import { checkedWorkspaceAuth } from '@/api/workspace'
import { checkedAuthentication } from '@/api/auth'
const authStore = useAuthStore()
const bucketStore = useBucketStore()

type NavlinkType = {
  name: string
  href: string
  title: string
  icon: string
  icon_active: string
}

// interface WorkspaceLayoutType {
//   navlinks: NavlinkType[]
//   todolink: NavlinkType & {
//     todoBuckets: string[]
//   }
// }

export default {
  components: {
    ModalLayout,
    LeftArrowIcon,
    ClipBoardIcon,
    ClipBoardSolidIcon,
    UserGroupIcon,
    UserGroupSolidIcon,
    ChatIcon,
    ChatSolidIcon,
    SettingsIcon,
    SettingsSolidIcon,
    LogoutIcon,
    SwitchIcon,
    ChevronDownIcon,
    TrashIcon,
    PinIcon,
    PinOutlineIcon,
    DotsIcon,
    ArrowLongRightIcon,
    SettingIcon,
    SettingSolidIcon,
  },
  props: {
    mainTitle: {
      type: String,
    },
    // needLink: {
    //   type: Boolean,
    //   default: false,
    // },
    // pushTitle: {
    //   type: String,
    // },
  },
  data() {
    return {
      navlinks: [] as NavlinkType[],
      todolink: {
        name: 'todo',
        href: '',
        title: '代辦列表',
        icon: 'ClipBoardIcon',
        icon_active: 'ClipBoardSolidIcon',
        // todobuckets: [],
      },
      todoToggle: true,
      // userId: authStore.userId,
    }
  },
  watch: {
    workspaceAccount: {
      immediate: true,
      handler() {
        this.updateLinks()
      },
    },
  },
  methods: {
    async checkedUserAuth() {
      try {
        const res = await checkedAuthentication()
        if (res?.success) {
          const data = res?.data
          // console.log(data)
          const isAuth = data.isAuth

          if (!isAuth) {
            authStore.logout()
            toast.error('權限不足，請重新登入')

            setTimeout(() => {
              this.$router.push({ name: 'login' })
            }, 2000)
          } else {
            authStore.updatedUserAuth({
              isAuth,
              userId: data.userId,
              user: {
                name: data.user.name,
                email: data.user.email,
                bgColor: data.user.bgColor,
                textColor: data.user.textColor,
              },
            })
          }
        } else {
          authStore.logout()
          toast.error('權限不足，請重新登入')

          setTimeout(() => {
            this.$router.push({ name: 'login' })
          }, 2000)
        }
      } catch (error) {
        authStore.logout()
        toast.error(`權限不足，請重新登入: ${error}`)

        setTimeout(() => {
          this.$router.push({ name: 'login' })
        }, 2000)
      }
    },
    async checkWorkspaceAuthentication(workspaceAccount: string) {
      try {
        const res = await checkedWorkspaceAuth(workspaceAccount)
        if (res?.success) {
          const data = res?.data
          const { isMember, admin_status } = data
          if (!isMember) {
            authStore.workspaceLogout()
            toast.error('工作區權限不足')
            setTimeout(() => {
              const url = `/dashboard/${this.userId}`
              this.$router.push(url)
            }, 2000)
          } else {
            authStore.updatedWorkspaceAuth({
              isMember,
              adminStatus: admin_status,
            })
          }
        } else {
          authStore.workspaceLogout()
          toast.error('工作區權限不足')
          setTimeout(() => {
            const url = `/dashboard/${this.userId}`
            this.$router.push(url)
          }, 2000)
        }
      } catch (error) {
        // console.log(error)
        authStore.workspaceLogout()
        toast.error(`工作區權限不足: ${error}`)
        setTimeout(() => {
          const url = `/dashboard/${this.userId}`
          this.$router.push(url)
        }, 2000)
      }
    },
    async fetchBuckets(workspaceAccount: string) {
      try {
        const res = await getWorkspaceBuckets(workspaceAccount)
        if (res?.success) {
          const data = res?.data
          const pinned_data = data.filter((data: any) => data.isPinned)
          bucketStore.updatedBuckets(data)
          bucketStore.updatedPinnedBuckets(pinned_data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    updateLinks() {
      this.navlinks = [
        {
          name: 'member',
          href: `/workspace/${this.workspaceAccount}/member`,
          title: '成員列表',
          icon: 'UserGroupIcon',
          icon_active: 'UserGroupSolidIcon',
        },
        {
          name: 'chat',
          href: `/workspace/${this.workspaceAccount}/chat`,
          title: '討論室',
          icon: 'ChatIcon',
          icon_active: 'ChatSolidIcon',
        },
        {
          name: 'setting',
          href: `/workspace/${this.workspaceAccount}/setting`,
          title: '工作區設定',
          icon: 'SettingIcon',
          icon_active: 'SettingSolidIcon',
        },
      ]
      this.todolink.href = `/workspace/${this.workspaceAccount}/todo`
    },
    handleTodoToggle() {
      this.todoToggle = !this.todoToggle
    },
    async handleUnpinned(bucketId: string) {
      try {
        const res = await updatedPinnedWorkspaceBucket(bucketId)
        if (res?.success) {
          const data = res?.data
          const buckets = bucketStore.buckets
          const updated_buckets = buckets.map((bucket) => {
            return bucket._id === bucketId ? data : bucket
          })
          bucketStore.updatedBuckets(updated_buckets)

          const pinned_buckets = updated_buckets.filter((bucket) => bucket.isPinned)
          bucketStore.updatedPinnedBuckets(pinned_buckets)
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleSwitchWorkspace() {
      authStore.workspaceLogout()
      this.$router.push(`/dashboard/${this.userId}`)
    },
    handleLogout() {
      authStore.logout()
      this.$router.push({ name: 'login' })
    },
  },
  mounted() {
    this.checkedUserAuth()
    if (this.workspaceAccount) {
      this.checkWorkspaceAuthentication(this.workspaceAccount as string)
      this.fetchBuckets(this.workspaceAccount as string)
    }
    this.updateLinks()
    // console.log(authStore.user)
  },
  computed: {
    workspaceAccount() {
      return this.$route.params.account
    },
    activeLink() {
      return this.$route.path
    },
    todobuckets() {
      return bucketStore.pinnedBuckets || []
    },
    userId() {
      return authStore.userId
    },
  },
}
</script>

<template>
  <header
    class="fixed top-0 left-0 bg-white text-midnight-forest shadow-md w-[250px] h-screen py-6 flex flex-col justify-between"
  >
    <div class="flex flex-col gap-8">
      <RouterLink
        :to="`/workspace/${workspaceAccount}/todo`"
        class="font-bold text-xl text-midnight-forest pl-4"
        >WORKCONNECT</RouterLink
      >
      <nav class="flex flex-col">
        <div class="w-full">
          <button
            @click="handleTodoToggle"
            class="w-full px-4 py-2 flex justify-between items-center"
            :class="{
              'bg-midnight-forest text-white': activeLink.includes(todolink.href) || todoToggle,
              'bg-white text-midnight-forest': !activeLink.includes(todolink.href) && !todoToggle,
            }"
          >
            <div class="flex gap-2 items-center">
              <component
                :is="activeLink === todolink.href ? todolink.icon_active : todolink.icon"
                class="w-6 h-6"
              />
              <p class="font-medium text-lg">{{ todolink.title }}</p>
            </div>
            <ChevronDownIcon
              v-if="todobuckets.length > 0"
              class="w-4 h-4 transition"
              :class="todoToggle && 'rotate-180'"
            />
          </button>
          <ul v-if="todoToggle">
            <li
              v-if="todobuckets.length <= 0"
              class="pl-12 pr-4 py-2 flex items-center gap-1.5 text-midnight-forest-40 text-sm"
            >
              目前沒有Bucket
            </li>
            <li
              v-else
              class="pl-12 pr-4 py-2 flex items-center gap-1.5 hover:bg-midnight-forest-40"
              v-for="bucket in todobuckets"
              :key="bucket._id"
            >
              <button @click="handleUnpinned(bucket._id)">
                <PinIcon v-if="bucket.isPinned" class="w-4 h-4 text-midnight-forest" />
                <PinOutlineIcon
                  v-else
                  class="w-4 h-4 text-midnight-forest opacity-0 hover:opacity-100"
                />
              </button>
              <RouterLink :to="`${todolink.href}/${bucket._id}`" class="truncate">{{
                bucket.title
              }}</RouterLink>
            </li>

            <li
              class="pl-12 pr-4 py-2 flex items-center gap-1.5 text-ocean-teal hover:bg-midnight-forest-40"
            >
              <RouterLink
                class="flex items-center gap-1 font-medium"
                :to="`/workspace/${workspaceAccount}/todo`"
              >
                <div>前往Bucket列表</div>
                <div><ArrowLongRightIcon /></div>
              </RouterLink>
            </li>
          </ul>
        </div>
        <RouterLink
          v-for="{ name, href, title, icon, icon_active } in navlinks"
          :key="name"
          :to="href"
          class="flex gap-2 items-center px-4 py-2"
          :class="{
            'bg-midnight-forest text-white': activeLink === href,
            'bg-white text-midnight-forest': activeLink !== href,
          }"
        >
          <component :is="activeLink === href ? icon_active : icon" class="w-6 h-6" />
          <p class="font-medium text-lg">{{ title }}</p>
        </RouterLink>
      </nav>
    </div>
    <div>
      <button
        @click="handleSwitchWorkspace"
        class="flex gap-2 items-center px-4 py-2 hover:font-bold"
      >
        <SwitchIcon class="w-6 h-6" />
        <p>切換工作區</p>
      </button>
      <button @click="handleLogout" class="flex gap-2 items-center px-4 py-2 hover:font-bold">
        <LogoutIcon class="w-6 h-6" />
        <p>登出</p>
      </button>
    </div>
  </header>
  <main
    class="w-[calc(100%-250px)] h-full max-h-screen overflow-y-auto overflow-x-hidden absolute top-0 left-[250px] bg-pale-aqua text-midnight-forest"
  >
    <div class="w-5/6 max-w-5xl mx-auto xl:w-full h-screen pt-12 pb-8 flex flex-col gap-8">
      <h1 class="font-bold text-xl h-7">{{ mainTitle }}</h1>
      <!-- <div v-if="needLink" class="flex items-center gap-2">
        <RouterLink :to="`/workspace/${workspaceAccount}/todo`" class="font-bold text-xl h-7">{{
          mainTitle
        }}</RouterLink>
        <LeftArrowIcon class="w-6 h-6 rotate-180" />
        <h1 class="font-bold text-xl h-7">{{ pushTitle }}</h1>
      </div> -->
      <!-- <div class="flex items-center gap-2">
        <h1 class="font-bold text-xl h-7">{{ mainTitle }}</h1>
      </div> -->
      <div class="h-[calc(100vh-3.75rem)]">
        <slot name="workspace"></slot>
      </div>
      <RouterView />
    </div>
  </main>
  <!-- <ModalLayout title="新增工作欄" :toggle="bucketToggle" @update:toggle="handleBucketToggle">
    <template #modal>
      <VForm class="flex flex-col gap-8" v-slot="{ errors }" @submit="handlCreatedBucket">
        <div class="flex flex-col gap-0.5">
          <h5 :class="label_class">工作欄名稱</h5>
          <VField
            name="bucketTitle"
            type="string"
            rules="required|min:3|max:20"
            placeholder="TITLE"
            v-model="bucketTitle"
            :class="[input_class, { 'border border-error': errors.bucketTitle }]"
          />
          <ErrorMessage name="title" class="text-error text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="handleBucketToggle"
            type="button"
            class="bg-gray-30 text-white w-full rounded-sm text-center py-1.5"
          >
            取消
          </button>
          <button type="submit" class="bg-purple text-white w-full rounded-sm text-center py-1.5">
            新增
          </button>
        </div>
      </VForm>
    </template>
  </ModalLayout> -->
</template>
