<script lang="ts">
import UserGroupIcon from '../icons/UserGroupIcon.vue'
import KeyIcon from '../icons/KeyIcon.vue'
import TrashIcon from '../icons/TrashIcon.vue'
import { inputClass } from '@/styles/input-style'

export default {
  components: {
    UserGroupIcon,
    KeyIcon,
    TrashIcon,
  },
  props: {
    id: { type: String },
    account: {
      type: String,
    },
    title: {
      type: String,
    },
    admin: {
      type: String,
    },
    admin_num: {
      type: Number,
      default: 1,
    },
    member_num: {
      type: Number,
      default: 1,
    },
    disabled_delete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editToggle: false,
      workspaceTitle: this.title,
      input_class: inputClass('h-8', 'bg-white'),
    }
  },
  methods: {
    async handleDeletedWorkspace() {
      // console.log('click')
    },
    async handleWorkspaceEdit() {
      this.editToggle = !this.editToggle
      if (this.editToggle) {
      }
    },
  },
  computed: {},
}
</script>

<template>
  <div
    class="p-4 rounded-sm shadow-md bg-pale-aqua h-24 flex flex-col justify-between hover:shadow-lg w-full"
  >
    <RouterLink :to="`/workspace/${account}/todo`" class="flex items-center gap-4">
      <h5 class="font-bold text-lg truncate">{{ title }}</h5>
      <p class="text-sm text-midnight-forest-60">|</p>
      <p class="text-sm text-midnight-forest-60">{{ account }}</p>
    </RouterLink>
    <div class="flex justify-between gap-2 items-center text-sm text-midnight-forest-60">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <KeyIcon class="w-4 h-4" />
          <p>{{ admin_num }}</p>
        </div>
        <div class="flex items-center gap-1">
          <UserGroupIcon class="w-4 h-4" />
          <p>{{ member_num }}</p>
        </div>
      </div>
      <button :disabled="disabled_delete" @click="handleDeletedWorkspace">
        <TrashIcon class="w-4 h-4 hover:text-midnight-forest" />
      </button>
    </div>
  </div>
</template>
