<script lang="ts">
import { getWorkspaceInfo, updatedWorkspace } from '@/api/workspace'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import PencilEditIcon from '@/components/icons/PencilEditIcon.vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore()

export default {
  components: {
    WorkspaceLayout,
    PencilEditIcon,
  },
  data() {
    return {
      editToggle: false,
      title: '',
      account: '',
      memberCount: 0,
      inviteCount: 0,
      workbucketCount: 0,
      workfolderCount: 0,
    }
  },
  methods: {
    async fetchWorkspaceInfo(workspaceAccount: string) {
      try {
        const res = await getWorkspaceInfo(workspaceAccount)
        if (res?.success) {
          const data = res?.data
          const { title, account, memberCount, inviteCount, workbucketCount, workfolderCount } =
            data
          this.title = title
          this.account = account
          this.memberCount = memberCount
          this.inviteCount = inviteCount
          this.workbucketCount = workbucketCount
          this.workfolderCount = workfolderCount
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleWorkspaceEdit() {
      this.editToggle = !this.editToggle
      if (!this.editToggle) {
        try {
          const res = await updatedWorkspace(this.workspaceAccount as string, {
            title: this.title,
          })

          if (res?.success) {
            toast.success('工作區標題更新成功!')
          } else {
            toast.error('工作區標題更新失敗!')
          }
        } catch (error) {
          console.log(error)
          toast.error('工作區標題更新失敗!')
        }
      }
    },
  },
  mounted() {
    if (this.workspaceAccount) {
      this.fetchWorkspaceInfo(this.workspaceAccount as string)
    }
  },
  computed: {
    workspaceAccount() {
      return this.$route.params.account
    },
    adminStatus() {
      return authStore.adminStatus
    },
  },
}
</script>

<template>
  <WorkspaceLayout mainTitle="工作區設定">
    <template #workspace>
      <div class="flex flex-col gap-12">
        <div class="flex flex-col gap-1">
          <div class="flex justify-between gap-2 items-center">
            <input
              v-if="editToggle"
              type="text"
              v-model="title"
              class="w-full h-12 px-4 text-lg text-sky-blue focus:border-b-2 focus:border-midnight-forest"
            />
            <h5 v-else class="text-2xl font-bold text-ocean-teal">{{ title }}</h5>
            <button :disabled="!adminStatus" class="text-base" @click="handleWorkspaceEdit">
              <PencilEditIcon
                class="text-ocean-teal-60 hover:text-ocean-teal disabled:text-muted-gray-60"
              />
            </button>
          </div>
          <p class="text-ocean-teal-60">{{ account }}</p>
        </div>
        <div class="grid grid-cols-2 grid-rows-2 md:grid-rows-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-md text-midnight-forest">
            <p class="text-sm bg-midnight-forest text-white rounded-t-md py-2 px-4 font-medium">
              BUCKET數量
            </p>
            <div class="font-bold text-4xl text-center p-4">{{ workbucketCount }}</div>
          </div>
          <div class="bg-white rounded-md text-midnight-forest">
            <p class="text-sm bg-midnight-forest text-white rounded-t-md py-2 px-4 font-medium">
              FOLDER數量
            </p>
            <div class="font-bold text-4xl text-center p-4">{{ workfolderCount }}</div>
          </div>
          <div class="bg-white rounded-md text-midnight-forest">
            <p class="text-sm bg-midnight-forest text-white rounded-t-md py-2 px-4 font-medium">
              MEMBER數量
            </p>
            <div class="font-bold text-4xl text-center p-4">{{ memberCount }}</div>
          </div>
          <div class="bg-white rounded-md text-midnight-forest">
            <p class="text-sm bg-midnight-forest text-white rounded-t-md py-2 px-4 font-medium">
              INVITE數量
            </p>
            <div class="font-bold text-4xl text-center p-4">{{ inviteCount }}</div>
          </div>
        </div>
      </div>
    </template>
  </WorkspaceLayout>
</template>
