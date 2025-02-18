<script lang="ts">
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'

export default {
  components: { ChevronDownIcon },
  props: {
    invitedToggle: {
      type: Boolean,
      default: false,
    },
    invites: {
      type: Array as () => string[],
      default: () => [],
    },
  },
  methods: {
    handleToggle(type: 'add-member' | 'invited' | 'current') {
      this.$emit('invite-toggle', type)
    },
    handleCancelledInvitations(email: string) {
      this.$emit('cancelled-invite', email)
    },
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
    <div class="bg-white text-midnight-forest shadow-md" v-if="invitedToggle">
      <div
        class="w-full flex justify-center h-9 leading-9 text-muted-gray"
        v-if="invites.length === 0"
      >
        目前沒有邀請中的成員
      </div>
      <div class="flex flex-col" v-else>
        <div
          class="flex justify-between items-center text-sm px-4 w-full h-9 leading-9"
          v-for="(member, index) in invites"
          :key="`invited-member-${member}`"
        >
          <a
            :class="index !== 0 && 'border-t border-muted-gray'"
            :href="`mailto:${member}`"
            class="hover:underline hover:underline-offset-2"
            >{{ member }}</a
          >
          <button
            class="px-2 h-6 leading-6 text-white bg-ocean-teal disabled:bg-muted-gray"
            @click="handleCancelledInvitations(member)"
          >
            取消邀請
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
