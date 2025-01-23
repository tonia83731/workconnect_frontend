<script lang="ts">
import { useWorkspaceStore } from '@/stores/workspace'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'

export default {
  components: { ChevronDownIcon },
  props: {
    invitedToggle: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const workspaceStore = useWorkspaceStore()
    const handleToggle = (type: 'add-member' | 'invited' | 'current') => {
      emit('invite-toggle', type)
    }
    return {
      invites: workspaceStore.invitesList,
      handleToggle,
      ...props,
    }
  },
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <button
      @click="handleToggle('invited')"
      class="w-full text-white h-12 leading-12 px-4 font-bold flex justify-between items-center"
      :class="invitedToggle ? 'bg-ocean-teal' : 'bg-ocean-teal-60'"
    >
      <div class="">邀請中成員</div>
      <ChevronDownIcon class="w-4 h-4 transition" :class="invitedToggle && 'rotate-180'" />
    </button>
    <div class="bg-white text-midnight-forest shadow-md flex flex-col" v-if="invitedToggle">
      <a
        v-for="(member, index) in invites"
        :key="`invited-member-${member}`"
        :class="index !== 0 && 'border-t border-muted-gray'"
        :href="`mailto:${member}`"
        class="w-full h-9 leading-9 px-4 text-sm hover:underline hover:underline-offset-2"
        >{{ member }}</a
      >
    </div>
  </div>
</template>
