<script lang="ts">
import Multiselect from 'vue-multiselect'
import type { TodoFormatedType } from '@/types/todos'
import { getWorkspaceMembers } from '@/api/workspace'
import { convertTimeToTimestamp } from '@/helpers/formatedTime'
import TrashIcon from '../icons/TrashIcon.vue'
import TodoItem from './TodoItem.vue'
import { useFolderStore } from '@/stores/folders'
import { toast } from 'vue3-toastify'
import type { MemberType } from '@/types/members'
import { VueDraggable } from 'vue-draggable-plus'

const folderStore = useFolderStore()

export default {
  components: {
    TrashIcon,
    Multiselect,
    TodoItem,
    VueDraggable,
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
    todos: {
      type: Array as () => TodoFormatedType[],
      defaultValue: [],
      required: true,
    },
  },
  data() {
    return {
      memberOpts: [],
      folderTitle: this.title,
      todoTitle: '',
      todoDeadline: null,
      todoAssign: [] as {
        name: string
        userId: string
      }[],
      createdToggle: false,
      todosList: [...this.todos],
    }
  },
  methods: {
    async fetchMemberlists(workspaceAccount: string) {
      try {
        const res = await getWorkspaceMembers(workspaceAccount)
        if (res?.success) {
          const data = res?.data
          const { members } = data
          const memberOpts = members.map((member: MemberType) => ({
            name: member.name,
            userId: member._id,
          }))
          this.memberOpts = memberOpts
          folderStore.initializedMembers(members)
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleUpdatedFolder() {
      if (!this.folderTitle) return
      folderStore.onUpdatedFolder(this.id, this.folderTitle as string)
    },
    handleDeletedFolder() {
      folderStore.onDeletedFolder(this.id)
    },
    handleCreatedToggle() {
      this.createdToggle = !this.createdToggle
      if (!this.createdToggle) {
        this.todoTitle = ''
        this.todoDeadline = null
        this.todoAssign = []
      }
    },
    async handleCreatedTodo() {
      const assignments = this.todoAssign.map((user) => ({ userId: user.userId }))

      const body = {
        title: this.todoTitle,
        deadline: convertTimeToTimestamp(this.todoDeadline),
        assignments,
      }

      const results = await folderStore.onCreatedTodo(this.id, body)

      if (results) {
        this.createdToggle = false
        this.todoTitle = ''
        this.todoDeadline = null
        this.todoAssign = []
      } else {
        toast.error('代辦事項建立失敗')
      }
    },

    async handleSameFolderDragged(event: any) {
      // 相同folder移動觸發
      // console.log('update')
      const folderId = event.from.id
      const todoId = event.data._id

      const newIdx = event.newIndex
      const oldIdx = event.oldIndex

      folderStore.onSameFolderDragged(folderId, todoId, oldIdx, newIdx)
    },
    async handleDiffFolderDragged(event: any) {
      // 不同folder移動觸發
      // console.log('add')
      // console.log(event)
      // console.log(event.data, event.newIndex, event.oldIndex)
      // console.log(event.data.order, event.data.workfolderId)
      // console.log(event.from.id, event.to.id)

      const folders = folderStore.folders
      const newFolder = folders.find((folder) => folder._id === event.to.id)
      const newTodolength = newFolder ? newFolder.todos.length : 0
      const oldFolder = folders.find((folder) => folder._id === event.from.id)
      const oldTodolength = oldFolder ? oldFolder.todos.length : 0

      const actualNewIdx = newTodolength - event.newIndex
      const actualOldIdx = oldTodolength - 1 - event.oldIndex

      const body = {
        oldFolderId: event.from.id,
        newFolderId: event.to.id,
        newOrder: actualNewIdx,
        oldOrder: actualOldIdx,
      }

      folderStore.onDiffFolderDragged(event.to.id, event.from.id, event.data._id, body)
    },
    // onRemove(event) {
    //   console.log('remove')
    //   console.log(event)
    // },
  },
  mounted() {
    // console.log(this.todos)
    if (this.workspaceAccount) {
      this.fetchMemberlists(this.workspaceAccount as string)
    }
  },
  computed: {
    workspaceAccount() {
      return this.$route.params.account
    },
    minDate() {
      return new Date().toISOString().split('T')[0]
    },
    // todoList() {
    //   return [...this.todos]
    // },
    todoLength() {
      const folders = folderStore.folders
      const folder = folders.find((folder) => folder._id === this.id)
      return folder ? folder.todos.length : 0
    },
  },
}
</script>
<template>
  <div class="flex flex-col gap-4">
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
    <div class="flex flex-col gap-2">
      <button
        @click="handleCreatedToggle"
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
            :options="memberOpts"
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
    <!-- <div class="flex flex-col gap-2">
      <TodoItem
        v-for="todo in todos"
        :key="todo._id"
        :id="todo._id"
        :folderId="todo.workfolderId"
        :title="todo.title"
        :status="todo.status"
        :checklists="todo.checklists"
        :assignments="todo.assignments"
        :deadline="todo.deadline"
        :memberOpts="memberOpts"
      />
    </div> -->
    <VueDraggable
      class="flex flex-col gap-2"
      :animation="50"
      ghostClass="ghost"
      group="todo"
      @update="handleSameFolderDragged"
      @add="handleDiffFolderDragged"
      v-model="todosList"
      :id="id"
    >
      <TodoItem
        v-for="todo in todos"
        :key="todo._id"
        :id="todo._id"
        :folderId="todo.workfolderId"
        :title="todo.title"
        :status="todo.status"
        :checklists="todo.checklists"
        :assignments="todo.assignments"
        :deadline="todo.deadline"
        :memberOpts="memberOpts"
      />
    </VueDraggable>
  </div>
</template>

<!-- <div class="flex flex-col gap-2">
<TodoItem
v-for="todo in todos"
:key="todo._id"
:id="todo._id"
:folderId="todo.workfolderId"
:title="todo.title"
:status="todo.status"
:checklists="todo.checklists"
:assignments="todo.assignments"
:deadline="todo.deadline"
:memberOpts="memberOpts"
/>
</div> -->
