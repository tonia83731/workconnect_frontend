<script lang="ts">
export default {
  props: {
    id: {
      type: String,
      require: true,
    },
    isMe: {
      type: Boolean,
    },
    text: {
      type: String,
    },
    time: {
      type: String,
    },
    sender: {
      type: String,
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
  <div class="w-full flex justify-end" v-if="isMe">
    <div class="flex items-end gap-2">
      <div class="rounded-xl rounded-br-none bg-light-amber border border-golder-amber px-4 py-1">
        <p>{{ text }}</p>
        <p class="text-xs">{{ time }}</p>
      </div>
      <div
        :title="sender"
        class="bg-golder-amber text-white text-2xl font-bold w-9 h-9 rounded-full flex justify-center items-center"
      >
        {{ sender ? sender[0] : '' }}
      </div>
    </div>
  </div>
  <div class="w-full flex justify-start" v-else>
    <div class="flex items-end gap-2">
      <div
        :title="sender"
        class="text-white bg-peach text-2xl font-bold w-9 h-9 rounded-full flex justify-center items-center"
      >
        {{ sender ? sender[0] : '' }}
      </div>
      <div class="rounded-xl rounded-br-none bg-light-peach border border-peach px-4 py-1">
        <p>{{ text }}</p>
        <p class="text-xs">{{ time }}</p>
      </div>
    </div>
  </div>
</template>
