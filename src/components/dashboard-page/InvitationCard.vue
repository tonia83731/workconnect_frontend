<script lang="ts">
export default {
  props: {
    id: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    account: {
      type: String,
      require: true,
    },
    membersCount: {
      type: Number,
      default: 1,
    },
    invitesCount: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    handleAcceptInvitations(workspaceId: string) {
      this.$emit('accept-invite', workspaceId)
    },
    handleCancledInvitations(workspaceId: string) {
      this.$emit('cancel-invite', workspaceId)
    },
  },
}
</script>
<template>
  <li class="w-full flex justify-between items-center gap-4 bg-white rounded-sm shadow-md p-2">
    <div class="flex flex-col gap-0.5">
      <h5 class="font-bold text-lg">{{ title }}</h5>
      <div class="flex items-center gap-1 text-muted-gray">
        <div class="">成員* {{ membersCount }}</div>
        <p>|</p>
        <div class="">邀請* {{ invitesCount }}</div>
      </div>
    </div>
    <div class="flex flex-col gap-2 text-white lg:grid lg:grid-cols-2">
      <!--  @click="handleAcceptInvitations" -->
      <!-- @click="handleDeclineInvitations" -->
      <button
        @click="handleAcceptInvitations(id as string)"
        class="w-full px-2.5 py-1 rounded-md bg-peach hover:shadow-md"
      >
        接受
      </button>
      <button
        @click="handleCancledInvitations(id as string)"
        class="w-full px-2.5 py-1 rounded-md bg-disabled-gray hover:shadow-md"
      >
        拒絕
      </button>
    </div>
  </li>
</template>
