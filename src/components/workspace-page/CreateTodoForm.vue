<script lang="ts">
import { toast } from 'vue3-toastify'
import Multiselect from 'vue-multiselect'
import { useFolderStore } from '@/stores/folders'
import { convertTimeToTimestamp } from '@/helpers/formatedTime'
import type { MemberType } from '@/types/members'

const folderStore = useFolderStore()

export default {
  components: {
    Multiselect,
  },
  props: {
    folderId: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => MemberType[],
      required: true
    }
  },
  data() {
    return {
      createdToggle: false,
      todoTitle: '',
      todoDeadline: null,
      todoAssign: [] as { name: string; userId: string }[]
    }
  },
  methods: {
    resetForm() {
      this.todoTitle = ''
      this.todoDeadline = null
      this.todoAssign = []
    },
    toggleForm() {
      this.createdToggle = !this.createdToggle
      if (!this.createdToggle) {
        this.resetForm()
      }
    },
    async handleCreatedTodo() {
      const assignments = this.todoAssign.map((user) => ({ userId: user.userId }))

      const body = {
        title: this.todoTitle,
        deadline: convertTimeToTimestamp(this.todoDeadline),
        assignments,
      }

      const results = await folderStore.onCreatedTodo(this.folderId, body)

      console.log(results)

      if (results) {
        this.resetForm()
        this.createdToggle = false
      } else {
        toast.error('代辦事項建立失敗')
      }
    }
  },
  computed: {
    minDate() {
      return new Date().toISOString().split('T')[0]
    },
  }
}
</script>
<template>
<div class="flex flex-col gap-2">
  <button
  @click="toggleForm"
  class="px-4 h-10 w-full rounded-md flex justify-center items-center font-bold"
  :class="
    createdToggle
      ? 'bg-ocean-teal text-white'
      : 'border text-ocean-teal-60 border-ocean-teal-60 border-dashed hover:border-ocean-teal hover:text-ocean-teal'
  "
>
  + 新增代辦事項
</button>
<div class="bg-white" v-if="createdToggle">
  <div class="px-4 py-2 flex flex-col gap-2">
    <input
      v-model="todoTitle"
      type="text"
      class="w-full h-10 px-2 focus:border-b focus:border-midnight-forest bg-pale-aqua placeholder:text-sm"
      placeholder="輸入代辦事項"
    />
    <input
      v-model="todoDeadline"
      type="date"
      :min="minDate"
      class="w-full h-10 px-2 focus:border-b focus:border-midnight-forest bg-pale-aqua placeholder:text-sm"
      placeholder="輸入截止日期"
    />
    <Multiselect
      v-model="todoAssign"
      track-by="userId"
      label="name"
      :options="options"
      :multiple="true"
      placeholder="請指派人選"
      class="bg-pale-aqua"
    >
    </Multiselect>
  </div>
  <button @click="handleCreatedTodo" class="w-full h-8 bg-golder-amber text-white">
    新增
  </button>
</div>
</div>
</template>
