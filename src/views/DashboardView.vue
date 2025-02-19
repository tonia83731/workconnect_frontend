<script lang="ts">
import DefaultLayout from '@/components/common/layout/DefaultLayout.vue'
import ModalLayout from '@/components/common/layout/ModalLayout.vue'
import WorkspaceCard from '@/components/dashboard-page/WorkspaceCard.vue'
import InvitationCard from '@/components/dashboard-page/InvitationCard.vue'
import {
  acceptInvitations,
  // acceptInvitations,
  getUserInvitations,
  getUserWorkspaces,
  rejectInvitations,
} from '@/api/user'
import { checkedWorkspaceAccount, createdWorkspace } from '@/api/workspace'
import { labelClass, inputClass } from '@/styles/input-style'
import { defineRule } from 'vee-validate'
import { reactive } from 'vue'
import type { WorkspaceType, UserInvitationsType } from '@/types/workspaces'

export default {
  components: {
    DefaultLayout,
    ModalLayout,
    WorkspaceCard,
    InvitationCard,
  },
  data() {
    return {
      label_class: labelClass,
      input_class: inputClass(),
      createdToggle: false,
      workspaceInfo: {
        title: '',
        account: '@',
      },
      workspaces: reactive([] as WorkspaceType[]),
      invitations: reactive([] as UserInvitationsType[]),
    }
  },
  created() {
    defineRule('accountExists', async (value: string) => {
      if (!value) return '帳號為必填項'

      try {
        const res = await checkedWorkspaceAccount({ account: value })

        if (res?.success && res?.data) {
          return '該帳號已被使用，請使用其他帳號'
        }
      } catch (error) {
        console.log(error)
        return '驗證帳號時發生錯誤'
      }

      return true
    })
  },
  methods: {
    async fetchUserWorkspace(userId: string) {
      try {
        const data = await getUserWorkspaces(userId)
        if (data?.success) {
          const workspace_data = data?.data.map((workspace: WorkspaceType) => {
            const member = workspace.members.find((member) => member.userId === userId)
            const isAdmin = member && member.isAdmin
            return {
              ...workspace,
              isDisabled: !isAdmin,
            }
          })
          this.workspaces = workspace_data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async fetchUserInvitations(userId: string) {
      try {
        const data = await getUserInvitations(userId)
        if (data?.success) {
          this.invitations = data?.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleCreatedToggle() {
      if (this.createdToggle) {
        this.workspaceInfo = {
          title: '',
          account: '@',
        }
      }
      this.createdToggle = !this.createdToggle
    },
    async handleCreatedWorkspace() {
      try {
        const res = await createdWorkspace(this.workspaceInfo)
        if (res?.success) {
          const data = res?.data.workspace
          data.isDisabled = false
          this.workspaces.push(data)
          this.workspaceInfo = {
            title: '',
            account: '@',
          }
          this.createdToggle = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleAcceptInvite(workspaceId: string) {
      try {
        const res = await acceptInvitations(this.userId as string, workspaceId)

        if (res?.success) {
          const data = res?.data
          // console.log(data)
          this.workspaces.push(data)
          const updated_invites = this.invitations.filter((invite) => invite.id !== workspaceId)
          this.invitations = updated_invites
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleCancelledInvite(workspaceId: string) {
      try {
        const res = await rejectInvitations(this.userId as string, workspaceId)
        if (res?.success) {
          const updated_invitations = this.invitations.filter((invite) => invite.id !== workspaceId)
          this.invitations = updated_invitations
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    if (this.userId) {
      this.fetchUserWorkspace(this.userId as string)
      this.fetchUserInvitations(this.userId as string)
    }
  },
  computed: {
    userId() {
      return this.$route.params.userId
    },
  },
}
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-8">
      <div class="flex flex-col gap-8">
        <!-- header -->
        <div class="grid grid-cols-[1fr_120px] gap-4 h-10">
          <h1 class="h-full flex items-center bg-midnight-forest text-white px-4 font-bold text-xl">
            我的工作區
          </h1>
          <button
            @click="handleCreatedToggle"
            class="w-[120px] h-full border-[1.5px] border-ocean-teal border-dashed text-ocean-teal rounded-sm hover:border-0 hover:bg-midnight-forest-60 hover:text-white"
          >
            + 新增工作區
          </button>
        </div>
        <!-- body -->
        <div class="text-muted-gray" v-if="workspaces.length === 0">
          目前沒有工作區, 立即
          <span>
            <button
              class="underline underline-offset-2 hover:font-bold"
              @click="handleCreatedToggle"
            >
              新建
            </button>
          </span>
        </div>
        <div class="flex flex-col gap-4 lg:flex-row" v-else>
          <WorkspaceCard
            v-for="workspace in workspaces"
            :key="workspace?._id"
            :id="workspace?._id"
            :account="workspace?.account"
            :title="workspace?.title"
            :admin_num="workspace?.adminCount"
            :member_num="workspace?.memberCount"
            :disabled_delete="workspace.isDisabled"
          ></WorkspaceCard>
        </div>
      </div>
      <div class="flex flex-col gap-8">
        <h1
          class="h-10 flex items-center bg-golder-amber text-white col-span-2 px-4 font-bold text-xl"
        >
          我的邀請
        </h1>
        <div class="text-muted-gray" v-if="invitations.length === 0">目前沒有工作區邀請</div>
        <div class="flex flex-col gap-4 lg:flex-row" v-else>
          <InvitationCard
            v-for="invite in invitations"
            :key="invite.id"
            :id="invite.id"
            :title="invite.title"
            :account="invite.account"
            :members-count="invite.members_count"
            :invites-count="invite.invites_count"
            @accept-invite="handleAcceptInvite"
            @cancel-invite="handleCancelledInvite"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
  <ModalLayout title="新增工作區" :toggle="createdToggle" @update:toggle="handleCreatedToggle">
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
              v-model="workspaceInfo.title"
              :class="[input_class, { 'border border-error': errors.title }]"
            />
            <ErrorMessage name="title" class="text-error text-sm" />
          </div>
          <div class="flex flex-col gap-0.5">
            <h5 :class="label_class">工作區帳號</h5>
            <VField
              name="account"
              type="string"
              rules="required|min:3|max:20|accountExists"
              placeholder="ACCOUNT"
              v-model="workspaceInfo.account"
              :class="[input_class, { 'border border-error': errors.account }]"
            />
            <ErrorMessage name="account" class="text-error text-sm" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-white">
          <button
            @click="handleCreatedToggle"
            type="button"
            class="bg-disabled-gray w-full rounded-sm text-center py-1.5"
          >
            取消
          </button>
          <button type="submit" class="bg-peach bg-purple w-full rounded-sm text-center py-1.5">
            新增
          </button>
        </div>
      </VForm>
    </template>
  </ModalLayout>
</template>
