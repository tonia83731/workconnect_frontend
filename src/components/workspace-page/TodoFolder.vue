<script lang="ts">
import TrashIcon from '../icons/TrashIcon.vue'
export default {
  components: {
    TrashIcon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      defaultValue: '',
    },
  },
  data() {
    return {
      folderTitle: this.title,
    }
  },
  methods: {
    handleUpdatedFolder() {
      this.$emit('updated-folder', this.id, this.folderTitle)
    },
    handleDeletedFolder() {
      this.$emit('deleted-folder', this.id)
    },
  },
}
</script>
<template>
  <div class="h-12 text-midnight-forest bg-white px-4 flex items-center justify-between gap-4">
    <label :for="id" class="text-midnight-forest h-full">
      <input
        type="text"
        :id="id"
        v-model="folderTitle"
        placeholder="資料夾名稱"
        class="bg-transparent h-full text-lg font-bold focus:border-b-[1.5px] focus:border-midnight-forest placeholder:text-base placeholder:font-normal"
        @blur="handleUpdatedFolder"
      />
    </label>
    <button @click="handleDeletedFolder" class="opacity-0 hover:opacity-100" title="刪除文件夾">
      <TrashIcon class="w-4 h-4" />
    </button>
  </div>
</template>
