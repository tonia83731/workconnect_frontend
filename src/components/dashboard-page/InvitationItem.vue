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
    membersCount: {
      type: Number,
      default: 1,
    },
    invitesCount: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    return {
      ...props,
    }
  },
}
</script>
<template>
  <li class="">
    <div class="flex flex-col gap-0.5">
      <h5 class="font-bold text-lg">{{ title }}</h5>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="">成員數量: {{ membersCount }}</div>
        <div class="">邀請數量: {{ invitesCount }}</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <!-- <button @click="handleAcceptInvitations" class="">接受</button>
      <button @click="handleDeclineInvitations" class="">拒絕</button> -->
    </div>
  </li>
</template>
