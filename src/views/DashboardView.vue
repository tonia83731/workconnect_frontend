<script lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import DefaultLayout from '@/components/common/layout/DefaultLayout.vue'
import ModalLayout from '@/components/common/layout/ModalLayout.vue'
import WorkspaceCard from '@/components/dashboard-page/WorkspaceCard.vue'
import InvitationItem from '@/components/dashboard-page/InvitationItem.vue'
import {
  acceptInvitations,
  getUserInvitations,
  getUserWorkspaces,
  rejectInvitations,
} from '@/api/user'
import { createdWorkspace } from '@/api/workspace'
import { label_class, input_class } from '@/data/input-style'

export type WorkspaceInput = {
  title: string
  account: string
}

type UserWorkspaceData = {
  _id: string
  account: string
  title: string
  memberCount: number
}

type UserInvitationsData = {
  id: string
  account: string
  title: string
  members_count: number
  invites_count: number
}

export default {
  components: {
    DefaultLayout,
    ModalLayout,
    WorkspaceCard,
    InvitationItem,
  },
  setup() {
    const { params } = useRoute()

    const workspaces = ref<UserWorkspaceData[]>([])
    const invitations = ref<UserInvitationsData[]>([])

    const toggle = ref<boolean>(false)
    const title = ref('')
    const account = ref('')

    const handleModalToggle = () => {
      if (toggle.value) {
        initializedModal()
      } else {
        toggle.value = true
      }
    }
    const initializedModal = () => {
      toggle.value = false
      title.value = ''
      account.value = ''
    }

    const handleCreatedWorkspace = async (payload: WorkspaceInput) => {
      try {
        const data = await createdWorkspace(payload)

        if (data?.success) {
          const workspace = data?.data.workspace
          const new_workspace = {
            _id: workspace._id,
            account: workspace.account,
            title: workspace.title,
            memberCount: 1,
          }

          workspaces.value = [...workspaces.value, new_workspace]

          toast.success('工作區成功建立!')
          initializedModal()
        } else {
          toast.error('工作區建立失敗，請在試一次')
        }
      } catch (error) {
        toast.error(`工作區建立失敗，請在試一次: ${error}`)
      }
    }

    const handleConfirmInvitation = async (workspaceId: string) => {
      try {
        const data = await acceptInvitations(params?.userId as string, workspaceId)

        if (data?.success) {
          toast.success('已成功接受邀請')

          // 更新工作列表

          // 更新邀請列表
          const updated_invitations = invitations.value.filter((item) => item.id !== workspaceId)
          invitations.value = updated_invitations
        } else {
          toast.error('接受邀請失敗，請在試一次')
        }
      } catch (error) {
        console.log(error)
      }
    }
    const handleCancelInvitation = async (workspaceId: string) => {
      try {
        const data = await rejectInvitations(params?.userId as string, workspaceId)

        if (data?.success) {
          toast.success('已拒絕邀請')

          // 更新邀請列表
          const updated_invitations = invitations.value.filter((item) => item.id !== workspaceId)
          invitations.value = updated_invitations
        } else {
          toast.error('拒絕邀請失敗，請在試一次')
        }
      } catch (error) {
        console.log(error)
      }
    }

    // -------------------------- GET USERDATA --------------------------
    const fetchUserWorkspace = async (userId: string) => {
      if (!userId) return
      try {
        const data = await getUserWorkspaces(userId)
        if (data?.success) {
          workspaces.value = data?.data
        }
      } catch (error) {
        console.log(error)
      }
    }
    const fetchUserInvitations = async (userId: string) => {
      try {
        const data = await getUserInvitations(userId)
        if (data?.success) {
          invitations.value = data?.data
        }
      } catch (error) {
        console.log(error)
      }
    }
    onMounted(() => {
      fetchUserWorkspace(params?.userId as string)
      fetchUserInvitations(params?.userId as string)
    })

    return {
      workspaces,
      invitations,
      label_class,
      input_class: input_class(),
      handleCreatedWorkspace,
      handleModalToggle,
      handleConfirmInvitation,
      handleCancelInvitation,
      toggle,
      title,
      account,
    }
  },
}
</script>

<template>
  <DefaultLayout>
    <div class="grid grid-cols-[2fr_1fr] gap-8">
      <div class="flex flex-col gap-4">
        <button
          @click="handleModalToggle"
          class="px-4 py-2 rounded-md h-12 flex justify-center items-center text-lg bg-midnight-forest-40 text-white hover:bg-midnight-forest hover:shadow-md hover:font-bold"
        >
          + 新增工作區
        </button>
        <div class="grid grid-cols-2 gap-4">
          <WorkspaceCard
            v-for="workspace in workspaces"
            :id="workspace._id"
            :key="workspace.account"
            :account="workspace.account"
            :title="workspace.title"
            :member_num="workspace.memberCount"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div
          class="px-4 py-2 h-12 flex justify-between items-center font-bold text-lg"
          :class="
            invitations.length > 0
              ? 'bg-golder-amber text-white shadow-lg'
              : 'bg-white text-midnight-forest-40'
          "
        >
          <p>邀請清單</p>
          <p
            class="text-base font-medium bg-midnight-forest-40 text-white w-5 h-5 rounded-full flex justify-center items-center"
          >
            {{ invitations.length }}
          </p>
        </div>
        <div>
          <div
            class="h-24 flex justify-center items-center text-midnight-forest-40"
            v-if="invitations.length === 0"
          >
            目前無新邀請
          </div>
          <ul class="" v-else>
            <InvitationItem
              v-for="invitation in invitations"
              :key="invitation.id"
              :id="invitation.id"
              :title="invitation.title"
              :membersCount="invitation.members_count"
              :invitesCount="invitation.invites_count"
            />
          </ul>
        </div>
      </div>
    </div>
  </DefaultLayout>

  <ModalLayout title="新增工作區" :toggle="toggle" @update:toggle="handleModalToggle">
    <template #modal>
      <VForm class="flex flex-col gap-8" v-slot="{ errors }" @submit="handleCreatedWorkspace">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-0.5">
            <h5 :class="label_class">工作區名稱</h5>
            <VField
              name="title"
              type="string"
              rules="required|max:20"
              placeholder="TITLE"
              v-model="title"
              :class="[input_class, { 'border border-error': errors.title }]"
            />
            <ErrorMessage name="title" class="text-error text-sm" />
          </div>
          <div class="flex flex-col gap-0.5">
            <h5 :class="label_class">工作區帳號</h5>
            <VField
              name="account"
              type="string"
              rules="required|min:3|max:20"
              placeholder="ACCOUNT"
              v-model="account"
              :class="[input_class, { 'border border-error': errors.account }]"
            />
            <ErrorMessage name="account" class="text-error text-sm" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-white">
          <button
            @click="handleModalToggle"
            type="button"
            class="bg-gray-30 w-full rounded-sm text-center py-1.5"
          >
            取消
          </button>
          <button type="submit" class="bg-purple w-full rounded-sm text-center py-1.5">新增</button>
        </div>
      </VForm>
    </template>
  </ModalLayout>
</template>
