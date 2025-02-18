<script lang="ts">
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

export type MemberDataType = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
}

export default {
  components: { ChevronDownIcon },
  props: {
    memberToggle: {
      type: Boolean,
      default: true,
    },
    members: {
      type: Array as () => MemberDataType[],
    },
  },
  data() {
    return {
      // userId: authStore.userId,
      // userAdmin: authStore.isAdmin,
    }
  },
  methods: {
    handleToggle(type: 'add-member' | 'invited' | 'member') {
      this.$emit('member-toggle', type)
    },
    handleUpdatedAdmin(memberId: string, isAdmin: boolean) {
      this.$emit('updated-admin', memberId, isAdmin)
    },
    handleDeleteMember(memberId: string) {
      this.$emit('delete-member', memberId)
    },
  },
  mounted() {},
  computed: {
    userId() {
      return authStore.userId
    },
    userAdmin() {
      return authStore.adminStatus
    },
  },
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <button
      @click="handleToggle('member')"
      class="w-full text-white h-12 leading-12 px-4 font-bold flex justify-between items-center"
      :class="memberToggle ? 'bg-ocean-teal' : 'bg-ocean-teal-60'"
    >
      <div class="">現有成員</div>
      <ChevronDownIcon class="w-4 h-4 transition" :class="memberToggle && 'rotate-180'" />
    </button>
    <div class="bg-white text-midnight-forest shadow-md" v-if="memberToggle">
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
            :disabled="member._id === userId || !userAdmin"
            class="px-2 h-6 leading-6 rounded-sm disabled:bg-muted-gray"
            :class="member.isAdmin ? 'bg-golder-amber' : 'bg-peach'"
          >
            {{ member.isAdmin ? '取消管理員' : '設為管理員' }}
          </button>
          <button
            @click="handleDeleteMember(member._id)"
            :disabled="member._id === userId || !userAdmin"
            class="px-2 h-6 leading-6 bg-ocean-teal disabled:bg-muted-gray"
          >
            刪除成員
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
