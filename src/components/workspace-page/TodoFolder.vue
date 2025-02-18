<script lang="ts">
import { reactive } from 'vue'
import Multiselect from 'vue-multiselect'
import { createdWorkspaceTodo, getWorkbucketTodos } from '@/api/todo'
import { getWorkspaceMembers } from '@/api/workspace'
import TrashIcon from '../icons/TrashIcon.vue'
import TodoItem from './TodoItem.vue'

export type CheckListType = {
  _id: string
  text: string
  isChecked: boolean
}
export type AssignmentType = {
  _id: string
  userId: {
    _id: string
    name: string
  }
}
export type TodoType = {
  _id: string
  title: string
  status: 'pending' | 'processing' | 'completed'
  deadline: number
  note: string
  assignments: AssignmentType[]
  checklists: CheckListType[]
  order: number
}

export default {
  components: {
    TrashIcon,
    Multiselect,
    TodoItem,
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
      todos: reactive([] as TodoType[]),
      members: [],
      folderTitle: this.title,
      todoTitle: '',
      todoDeadline: null,
      todoAssign: [] as {
        name: string
        userId: string
      }[],
      createdToggle: false,
    }
  },
  methods: {
    async fetchBucketTodo() {
      try {
        const res = await getWorkbucketTodos(this.id)
        // console.log(res)
        if (res?.success) {
          this.todos = res?.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async fetchMemberlists(workspaceAccount: string) {
      try {
        const res = await getWorkspaceMembers(workspaceAccount)
        if (res?.success) {
          const data = res?.data
          const { members } = data
          const memberOpts = members.map((member: any) => ({
            name: member.name,
            userId: member._id,
          }))
          this.members = memberOpts
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleUpdatedFolder() {
      this.$emit('updated-folder', this.id, this.folderTitle)
    },
    handleDeletedFolder() {
      this.$emit('deleted-folder', this.id)
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
      const date = this.todoDeadline ? new Date(this.todoDeadline) : null
      if (date) {
        date.setHours(23, 59, 59, 999)
      }

      const assignments = this.todoAssign.map((user) => ({ userId: user.userId }))

      const body = {
        title: this.todoTitle,
        deadline: date?.getTime(),
        assignments,
      }
      try {
        const res = await createdWorkspaceTodo(this.id, body)
        if (res?.success) {
          const data = res?.data
          this.todos = [data, ...this.todos]
          this.createdToggle = false
          this.todoTitle = ''
          this.todoDeadline = null
          this.todoAssign = []
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.fetchBucketTodo()
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
            :options="members"
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
    <div class="flex flex-col gap-2">
      <TodoItem
        v-for="todo in todos"
        :key="todo._id"
        :id="todo._id"
        :title="todo.title"
        :status="todo.status"
        :checklists="todo.checklists"
        :assignments="todo.assignments"
        :deadline="todo.deadline"
        :memberOpts="members"
      />
    </div>
  </div>
</template>
