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
// import { VueDraggable } from 'vue-draggable-plus'
// import { getWorkfolderTodos } from '@/api/todo'

const folderStore = useFolderStore()

export default {
  components: {
    TrashIcon,
    Multiselect,
    TodoItem,
    // draggable: VueDraggable,
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
      // todos: [] as TodoFormatedType[],
      memberOpts: [],
      folderTitle: this.title,
      todoTitle: '',
      todoDeadline: null,
      todoAssign: [] as {
        name: string
        userId: string
      }[],
      createdToggle: false,
      // ----------------------------------------
      draggedTodo: null as TodoFormatedType | null,
      draggedIdx: null as number | null,
      sourceFolderId: null as string | null,
      // ----------------------------------------
      targetFolderId: null as string | null,
      targetIdx: null as number | null,
    }
  },
  methods: {
    // async fetchFolderTodos(folderId: string) {
    //   try {
    //     const res = await getWorkfolderTodos(folderId)

    //     if (res?.success) {
    //       this.todos = res?.data
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
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
    handleDragStart(folderId: string, todo: TodoFormatedType, idx: number) {
      folderStore.onDragDataSet(folderId, todo, idx)
    },
    handleDrop(folderId: string, todo: TodoFormatedType, idx: number) {
      this.targetFolderId = folderId
      this.targetIdx = idx

      folderStore.onMovedTodo(folderId, idx)
    },
  },
  mounted() {
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
    todoLength() {
      const folders = folderStore.folders
      const folder = folders.find((folder) => folder._id === this.id)
      return folder?.todos.length
    },
  },
  watch: {
    // todos: {
    //   handler(newTodos) {
    //     this.localTodos = [...newTodos]
    //   },
    //   deep: true,
    // },
    // localTodos: {
    //   handler(newList) {
    //     this.$emit('update:todos', newList)
    //   },
    //   deep: true,
    // },
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
    <!-- {{ localTodos }} -->
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
    <div class="flex flex-col gap-2">
      <div
        v-for="(todo, index) in todos"
        :key="todo._id"
        :draggable="true"
        @dragstart="handleDragStart(id, todo, index)"
        @dragover.prevent
        @drop="handleDrop(id, todo, index)"
      >
        <TodoItem
          :id="todo._id"
          :folderId="todo.workfolderId"
          :title="todo.title"
          :status="todo.status"
          :checklists="todo.checklists"
          :assignments="todo.assignments"
          :deadline="todo.deadline"
          :memberOpts="memberOpts"
        />
      </div>
    </div>
    <!-- <draggable
      v-model="localTodos"
      group="todos"
      class="flex flex-col gap-2"
      @update="onUpdated"
      @add="onAdd"
      @remove="onRemove"
      @end="ondragend"
      item-key="_id"
    >
      <TodoItem
        v-for="todo in localTodos"
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
    </draggable> -->
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

<!-- <VueDraggable
      v-model="localTodos"
      :group="{ name: 'todos', pull: true, put: true }"
      class="flex flex-col gap-2"
      @update="onUpdated(id)"
      @add="onAdd(id)"
      @remove="onRemove(id)"
      @start="onDragStart"
      @end="onDragEnd"
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
    </VueDraggable> -->
