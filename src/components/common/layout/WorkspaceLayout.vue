<script lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkspaceStore } from '@/stores/workspace.ts'
import ModalLayout from './ModalLayout.vue'
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
import { useAuthStore } from '@/stores/auth'
// import { toast } from 'vue3-toastify'
import { useChatStore } from '../../../stores/chat'

export default {
  components: {
    ModalLayout,
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
  },
  props: {
    mainTitle: {
      type: String,
    },
    needLink: {
      type: Boolean,
      default: false,
    },
    pushLink: {
      type: String,
      default: '#',
    },
  },
  setup(props) {
    const { params, path } = useRoute()
    const router = useRouter()
    const workspaceId = params.workspaceId
    const authStore = useAuthStore()
    const workspaceStore = useWorkspaceStore()
    const chatStore = useChatStore()

    const navToggle = ref(false)
    const todoBtn = {
      name: 'todo',
      href: `/workspace/${workspaceId}/todo`,
      title: '代辦列表',
      icon: 'ClipBoardIcon',
      icon_active: 'ClipBoardSolidIcon',
      todobuckets: workspaceStore.buckets,
    }

    const navlinks = [
      {
        name: 'member',
        href: `/workspace/${workspaceId}/member`,
        title: '成員列表',
        icon: 'UserGroupIcon',
        icon_active: 'UserGroupSolidIcon',
      },
      {
        name: 'chat',
        href: `/workspace/${workspaceId}/chat`,
        title: '討論室',
        icon: 'ChatIcon',
        icon_active: 'ChatSolidIcon',
      },
    ]

    const activeLink = reactive({
      currentPath: path,
    })

    const handleTodoListToggle = () => {
      navToggle.value = !navToggle.value
    }

    // const initializedBucketData = () => {
    //   bucketTitle.value = ''
    //   bucketToggle.value = false
    // }
    // const handleBucketToggle = () => {
    //   if (bucketToggle.value) {
    //     initializedBucketData()
    //   } else {
    //     bucketToggle.value = true
    //   }
    // }
    // const handlCreatedBucket = async () => {
    //   const body = {
    //     title: bucketTitle.value,
    //   }

    //   const res = await workspaceStore.handleCreateBuckets(workspaceId as string, body)

    //   if (res.success) {
    //     toast.success(res.message)
    //   } else {
    //     toast.error(res.message)
    //   }
    // }

    watch(
      () => path,
      (newPath) => {
        activeLink.currentPath = newPath
      },
    )

    const handleSwitchWorkspace = () => {
      workspaceStore.clearWorkspaceData()
      chatStore.clearChatData()
      router.push(`/dashboard/${authStore.userId}`)
    }
    const handleLogout = () => {
      workspaceStore.clearWorkspaceData()
      chatStore.clearChatData()
      authStore.handleLogout()
    }

    // ----------------- FETCTH WORKSPACEDATA -----------------
    onMounted(async () => {
      await workspaceStore.fetchWorkspaceBuckets(workspaceId as string)
      await workspaceStore.fetchWorkspaceMembers(workspaceId as string)
    })

    return {
      workspaceId,
      todoBtn,
      navToggle,
      handleTodoListToggle,
      // handleBucketToggle,
      // handlCreatedBucket,
      navlinks,
      activeLink,
      handleSwitchWorkspace,
      handleLogout,
      ...props,
    }
  },
}
</script>

<template>
  <header
    class="fixed top-0 left-0 bg-white text-midnight-forest shadow-md w-[250px] h-screen py-6 flex flex-col justify-between"
  >
    <div class="flex flex-col gap-8">
      <RouterLink
        :to="`/workspace/${workspaceId}/todo`"
        class="font-bold text-xl text-midnight-forest pl-4"
        >WORKCONNECT</RouterLink
      >
      <nav class="flex flex-col">
        <div class="w-full">
          <button
            @click="handleTodoListToggle"
            class="w-full px-4 py-2 flex justify-between items-center"
            :class="{
              'bg-midnight-forest text-white': activeLink.currentPath.includes(todoBtn.href),
              'bg-white text-midnight-forest': !activeLink.currentPath.includes(todoBtn.href),
            }"
          >
            <div class="flex gap-2 items-center">
              <component
                :is="activeLink.currentPath === todoBtn.href ? todoBtn.icon_active : todoBtn.icon"
                class="w-6 h-6"
              />
              <p class="font-medium text-lg">{{ todoBtn.title }}</p>
            </div>
            <ChevronDownIcon class="w-4 h-4 transition" :class="navToggle && 'rotate-180'" />
          </button>
          <ul v-if="navToggle">
            <li
              class="pl-12 pr-4 py-1 flex items-center gap-1.5 hover:bg-midnight-forest-40"
              v-for="bucket in todoBtn.todobuckets"
              :key="bucket._id"
            >
              <RouterLink :to="`${todoBtn.href}/${bucket._id}`" class="truncate">{{
                bucket.title
              }}</RouterLink>
              <button>
                <PinIcon v-if="bucket.isPinned" class="w-4 h-4 text-midnight-forest" />
                <PinOutlineIcon
                  v-else
                  class="w-4 h-4 text-midnight-forest opacity-0 hover:opacity-100"
                />
              </button>
            </li>
          </ul>
        </div>
        <RouterLink
          v-for="{ name, href, title, icon, icon_active } in navlinks"
          :key="name"
          :to="href"
          class="flex gap-2 items-center px-4 py-2"
          :class="{
            'bg-midnight-forest text-white': activeLink.currentPath === href,
            'bg-white text-midnight-forest': activeLink.currentPath !== href,
          }"
        >
          <component :is="activeLink.currentPath === href ? icon_active : icon" class="w-6 h-6" />
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
      <div class="flex items-center gap-2">
        <h1 class="font-bold text-xl h-7">{{ mainTitle }}</h1>
        <RouterLink v-if="needLink" :to="pushLink">
          <SettingsSolidIcon class="w-6 h-6" />
        </RouterLink>
      </div>
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
