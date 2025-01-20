<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { ref } from 'vue'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import InvitedMembers from '@/components/member-page/InvitedMembers.vue'
import CurrentMembers from '@/components/member-page/CurrentMembers.vue'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'

export default {
  components: {
    WorkspaceLayout,
    InvitedMembers,
    CurrentMembers,
  },
  setup() {
    const workspaceStore = useWorkspaceStore()
    const { params } = useRoute()
    const { workspaceId } = params
    const input_class =
      'w-full h-9 px-4 py-1.5 rounded-sm bg-gypsum text-gray placeholder:text-gray-50'
    const email = ref('')
    const addToggle = ref(false)
    const invitedToggle = ref(false)
    const currentToggle = ref(true)

    const handleToggle = (type: 'add-member' | 'invited' | 'current') => {
      switch (true) {
        case type === 'add-member':
          if (addToggle.value) email.value = ''
          addToggle.value = !addToggle.value
          break
        case type === 'invited':
          invitedToggle.value = !invitedToggle.value
          break
        case type === 'current':
          currentToggle.value = !currentToggle.value
          break
        default:
          return null
      }
    }

    const handleAddMember = async () => {
      const isExisted =
        workspaceStore.membersList.some((member) => member.email === email.value) ||
        workspaceStore.invitesList.some((member) => member === email.value)
      if (isExisted) {
        toast.error(`${email.value} 已存在，請確認成員列表`)
        return
      }

      const body = {
        email: email.value,
      }

      const res = await workspaceStore.handleAddMember(workspaceId as string, body)

      if (res.success) {
        toast.success(res.message)
        addToggle.value = false
        invitedToggle.value = true
        email.value = ''
      } else {
        toast.error(res.message)
      }
    }

    const handleDeleteMember = async (memberId: string) => {
      const res = await workspaceStore.handleDeleteMember(workspaceId as string, memberId)

      if (res.success) {
        toast.success(res.message)
        currentToggle.value = true
      } else {
        toast.error(res.message)
      }
    }

    const handleUpdatedAdmin = async (memberId: string, isAdmin: boolean) => {
      console.log(memberId, isAdmin)
      let res
      if (isAdmin) {
        res = await workspaceStore.handleRemoveAdmin(workspaceId as string, memberId)
      } else {
        res = await workspaceStore.handleAddAdmin(workspaceId as string, memberId)
      }

      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    }

    return {
      input_class,
      email,
      members: workspaceStore.membersList,
      invites: workspaceStore.invitesList,
      addToggle,
      invitedToggle,
      currentToggle,
      handleAddMember,
      handleDeleteMember,
      handleUpdatedAdmin,
      handleToggle,
    }
  },
}
</script>

<template>
  <WorkspaceLayout mainTitle="成員列表">
    <template #workspace>
      <div class="flex flex-col gap-6">
        <div class="w-full" :class="addToggle && 'grid grid-cols-[100px_1fr] gap-8'">
          <button
            @click="handleToggle('add-member')"
            class="w-[100px] h-9 py-1 rounded-md border-2 text-purple border-purple border-dashed flex justify-center items-center font-bold hover:bg-purple-30"
          >
            邀請成員
          </button>

          <div
            v-if="addToggle"
            class="overflow-hidden transition"
            :class="addToggle ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'"
          >
            <VForm v-slot="{ errors }" @submit="handleAddMember">
              <div class="flex items-center gap-2">
                <VField
                  name="email"
                  type="email"
                  rules="required"
                  placeholder="EMAIL"
                  v-model="email"
                  :class="[input_class, { 'border border-error': errors.email }]"
                />
                <button
                  type="submit"
                  class="bg-purple text-white w-[100px] h-9 rounded-sm text-center py-1.5"
                >
                  新增
                </button>
              </div>
              <ErrorMessage name="email" class="text-error text-sm" />
            </VForm>
          </div>
        </div>
        <InvitedMembers :invitedToggle="invitedToggle" @invite-toggle="handleToggle('invited')" />
        <CurrentMembers
          :currentToggle="currentToggle"
          @current-toggle="handleToggle('current')"
          @updated-admin="handleUpdatedAdmin"
          @delete-member="handleDeleteMember"
        />
      </div>
    </template>
  </WorkspaceLayout>
</template>
