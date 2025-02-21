<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import InvitedMembers from '@/components/member-page/InvitedMembers.vue'
import CurrentMembers from '@/components/member-page/CurrentMembers.vue'
import {
  addWorkspaceMembers,
  cancelledInvitations,
  getWorkspaceMembers,
  removeWorkspaceAdmin,
  removeWorkspaceMembers,
} from '@/api/workspace'
import type { MemberType } from '@/types/members'
import { reactive } from 'vue'
import { addWrokspaceAdmin } from '../api/workspace'

export default {
  components: {
    WorkspaceLayout,
    InvitedMembers,
    CurrentMembers,
  },
  data() {
    return {
      input_class:
        'w-full h-9 px-4 py-1.5 rounded-sm bg-gypsum text-ocean-teal placeholder:text-ocean-teal-60',
      addToggle: false,
      addEmail: '' as string,
      inviteToggle: false,
      memberToggle: true,
      invites: reactive([] as string[]),
      members: reactive([] as MemberType[]),
    }
  },
  methods: {
    async fetchMemberlists(workspaceAccount: string) {
      try {
        const res = await getWorkspaceMembers(workspaceAccount)
        if (res?.success) {
          const data = res?.data
          const { invites, members } = data
          this.invites = invites
          this.members = members.map((member: MemberType) => ({
            _id: member._id,
            name: member.name,
            email: member.email,
            isAdmin: member.isAdmin,
          }))
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleToggle(type: 'add-member' | 'invited' | 'member') {
      if (type === 'add-member') {
        this.addToggle = !this.addToggle
        return
      }
      if (type === 'invited') {
        this.inviteToggle = !this.inviteToggle
        return
      }
      if (type === 'member') {
        this.memberToggle = !this.memberToggle
        return
      }
    },
    async handleAddMember() {
      try {
        const res = await addWorkspaceMembers(this.workspaceAccount as string, {
          email: this.addEmail,
        })
        if (res?.success) {
          this.invites.push(this.addEmail)
          this.addEmail = ''
          this.addToggle = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleCancelledInvite(email: string) {
      try {
        const res = await cancelledInvitations(this.workspaceAccount as string, { email })

        if (res?.success) {
          this.inviteToggle = true
          const index = this.invites.indexOf(email)
          if (index !== -1) {
            this.invites.splice(index, 1)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleUpdatedAdmin(memberId: string, isAdmin: boolean) {
      if (!isAdmin) {
        this.handleSetAdmin(memberId)
      } else {
        this.handleRemoveAdmin(memberId)
      }
    },
    async handleSetAdmin(memberId: string) {
      try {
        const res = await addWrokspaceAdmin(this.workspaceAccount as string, memberId)
        if (res?.success) {
          const updated_members = this.members.map((member) => {
            return member._id === memberId ? { ...member, isAdmin: true } : member
          })
          this.members = updated_members
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleRemoveAdmin(memberId: string) {
      try {
        const res = await removeWorkspaceAdmin(this.workspaceAccount as string, memberId)
        if (res?.success) {
          const updated_members = this.members.map((member) => {
            return member._id === memberId ? { ...member, isAdmin: false } : member
          })
          this.members = updated_members
        }
      } catch (error) {
        console.log(error)
      }
    },
    // test here
    async handleDeleteMember(memberId: string) {
      try {
        const res = await removeWorkspaceMembers(this.workspaceAccount as string, memberId)
        if (res?.success) {
          const updated_members = this.members.filter((member) => member._id !== memberId)
          this.members = updated_members
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    if (this.workspaceAccount) {
      this.fetchMemberlists(this.workspaceAccount as string)
    }
  },
  computed: {
    workspaceAccount() {
      return this.$route.params.account
    },
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
            class="w-[100px] h-9 py-1 rounded-md border-2 text-midnight-forest border-midnight-forest border-dashed flex justify-center items-center font-bold hover:border-none hover:bg-midnight-forest hover:text-white"
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
                  name="addEmail"
                  type="email"
                  rules="required"
                  placeholder="EMAIL"
                  v-model="addEmail"
                  :class="[input_class, { 'border border-error': errors.addEmail }]"
                />
                <button
                  type="submit"
                  class="bg-midnight-forest text-white w-[100px] h-9 rounded-sm text-center py-1.5"
                >
                  新增
                </button>
              </div>
              <ErrorMessage name="email" class="text-error text-sm" />
            </VForm>
          </div>
        </div>
        <InvitedMembers
          :invitedToggle="inviteToggle"
          @invite-toggle="handleToggle('invited')"
          @cancelled-invite="handleCancelledInvite"
          :invites="invites"
        />
        <CurrentMembers
          :memberToggle="memberToggle"
          @member-toggle="handleToggle('member')"
          :members="members"
          @updated-admin="handleUpdatedAdmin"
          @delete-member="handleDeleteMember"
        />
        <!-- @updated-admin="handleUpdatedAdmin"
          @delete-member="handleDeleteMember" -->
      </div>
    </template>
  </WorkspaceLayout>
</template>
