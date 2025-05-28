<script lang="ts">
import type { TodoFormatedType } from '@/types/todos'
import { getWorkspaceMembers } from '@/api/workspace'
import { useFolderStore } from '@/stores/folders'
import TrashIcon from '../icons/TrashIcon.vue'
import type { MemberType } from '@/types/members'
import { VueDraggable } from 'vue-draggable-plus'

import TodoItem from './TodoItem.vue'
import CreateTodoForm from './CreateTodoForm.vue'

const folderStore = useFolderStore()

export default {
  components: {
    TrashIcon,
    CreateTodoForm,
    TodoItem,
    VueDraggable
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
      localTodos: [] as TodoFormatedType[],
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

    // handleDragStart(evt: any) {
    //   // Add dragging class for visual feedback
    //   evt.item.classList.add('dragging')
    // },

    // handleDragEnd(evt: any) {
    //   // Remove dragging class
    //   evt.item.classList.remove('dragging')
    // },
    // handleDragStart(folderId: string, todo: TodoFormatedType, idx: number) {
    //   folderStore.onDragDataSet(folderId, todo, idx)
    // },
    // handleDrop(folderId: string, todo: TodoFormatedType, idx: number) {
    //   this.targetFolderId = folderId
    //   this.targetIdx = idx

    //   folderStore.onMovedTodo(folderId, idx)
    // },
    handleTodoUpdate(evt: any) {
      // Handle reordering within the same folder
      const { oldIndex, newIndex } = evt
      console.log(oldIndex, newIndex, 'update')

      const updated_orders = this.localTodos.map(todo => todo._id)
      if (oldIndex !== newIndex) {
        folderStore.onTodoPositionUpdate(this.id, updated_orders)
      }
    },
    handleTodoAdd(evt: any) {
      // Handle moving todo from one folder to another
      const { newIndex, item } = evt
      const todoId = item.getAttribute('data-id')
      const sourceFolderId = item.getAttribute('data-folder-id')
      console.log(newIndex, todoId, sourceFolderId, 'add')

      if (sourceFolderId !== this.id) {
        // Moving between different folders
        folderStore.onTodoFolderUpdate(sourceFolderId, this.id, todoId, newIndex)
      }
    },
    handleTodoRemove(evt: any) {
      // const { oldIndex, item } = evt
      // const todoId = item.getAttribute('data-id')
      // console.log(oldIndex, todoId, 'remove')

      // Update the source folder's todo list
      const {oldIndex} = evt
      folderStore.onRemoveTodo(this.id, oldIndex)
    }
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
    // minDate() {
    //   return new Date().toISOString().split('T')[0]
    // },
    todoLength() {
      const folders = folderStore.folders
      const folder = folders.find((folder) => folder._id === this.id)
      return folder?.todos.length
    },
  },
  watch: {
    todos: {
      handler(newTodos) {
        this.localTodos = [...newTodos]
      },
      immediate: true,
      deep: true
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
    <CreateTodoForm
      :folderId="id"
      :options="memberOpts"
    />
    <VueDraggable
      v-model="localTodos"
      class="flex flex-col gap-2 h-full"
      group="todo"
      @update="handleTodoUpdate"
      @add="handleTodoAdd"
      @remove="handleTodoRemove"
      :animation="150"
      ghost-class="ghost"
      drag-class="dragging"
      handle=".todo-item"
    >
      <div
        v-for="todo in localTodos"
        :key="todo._id"
        class="todo-item"
        :data-id="todo._id"
        :data-folder-id="todo.workfolderId"
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
    </VueDraggable>
  </div>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.dragging {
  cursor: move;
  opacity: 0.8;
}

.todo-item {
  cursor: move;
}
</style>
