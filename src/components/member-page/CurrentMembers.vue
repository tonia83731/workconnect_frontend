<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useWorkspaceStore } from '@/stores/workspace'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
export default {
  components: { ChevronDownIcon },
  props: {
    currentToggle: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const workspaceStore = useWorkspaceStore()
    const handleToggle = (type: 'add-member' | 'invited' | 'current') => {
      emit('current-toggle', type)
    }
    const handleDeleteMember = (memberId: string) => {
      emit('delete-member', memberId)
    }
    const handleUpdatedAdmin = (memberId: string, isAdmin: boolean) => {
      emit('updated-admin', memberId, isAdmin)
    }

    return {
      userId: authStore.userId,
      members: workspaceStore.membersList,
      handleToggle,
      handleDeleteMember,
      handleUpdatedAdmin,
      ...props,
    }
  },
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <button
      @click="handleToggle('current')"
      class="w-full text-white h-12 leading-12 px-4 font-bold flex justify-between items-center"
      :class="currentToggle ? 'bg-ocean-teal' : 'bg-ocean-teal-60'"
    >
      <div class="">現有成員</div>
      <ChevronDownIcon class="w-4 h-4 transition" :class="currentToggle && 'rotate-180'" />
    </button>
    <div class="bg-white text-midnight-forest shadow-md" v-if="currentToggle">
      <div
        class="w-full h-12 px-4 text-sm flex justify-between items-center"
        :class="index !== 0 && 'border-t border-muted-gray'"
        v-for="(member, index) in members"
        :key="`invited-member-${member._id}`"
      >
        <div class="flex flex-col gap-0.5">
          <h5 class="font-bold">{{ member.name }}</h5>
          <a
            :href="`mailto:${member.email}`"
            class="hover:underline hover:underline-offset-2 text-xs"
            >{{ member.email }}</a
          >
        </div>

        <div class="text-white flex items-center gap-2">
          <button
            @click="handleUpdatedAdmin(member._id, member.isAdmin)"
            :disabled="member._id === userId"
            class="px-2 h-6 leading-6 rounded-sm disabled:bg-muted-gray"
            :class="member.isAdmin ? 'bg-golder-amber' : 'bg-peach'"
          >
            {{ member.isAdmin ? '取消管理員' : '設為管理員' }}
          </button>
          <button
            @click="handleDeleteMember(member._id)"
            :disabled="member._id === userId"
            class="px-2 h-6 leading-6 bg-ocean-teal disabled:bg-muted-gray"
          >
            刪除成員
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
