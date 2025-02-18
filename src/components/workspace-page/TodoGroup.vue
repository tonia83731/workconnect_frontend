<script lang="ts">
import { ref, type PropType } from 'vue'
import { useRoute } from 'vue-router'
import VueDatePicker from '@vuepic/vue-datepicker'
import Multiselect from 'vue-multiselect'
import { toast } from 'vue3-toastify'
import { type TodoFullType } from '@/api/todo'
import { useWorkspaceStore } from '@/stores/workspace'
import { useTodoStore, type TodoType } from '@/stores/todos'
import { formatedTime, formatedTimeToTimestamp } from '@/helpers/formatedTime'
import TodoItem from './TodoItem.vue'
import TrashIcon from '../icons/TrashIcon.vue'
import PencilEditIcon from '../icons/PencilEditIcon.vue'

type AssignmentSelectType = {
  id: string
  name: string
}

export default {
  components: {
    TrashIcon,
    PencilEditIcon,
    VueDatePicker,
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
    },
    todos: {
      type: Array as PropType<TodoType[]>,
      required: true,
    },
  },
  data() {
    return {
      folderTitle: this.title,
    }
  },
  methods: {
    async handleUpdatedFolder() {},
    async handleDeletedFolder() {},
  },
  mounted() {},
  // setup(props, { emit }) {
  //   const { params } = useRoute()
  //   const workspaceId = params.workspaceId as string
  //   const workspaceStore = useWorkspaceStore()
  //   const todoStore = useTodoStore()

  //   const folderTitle = ref(props.title)
  //   const foldertodoToggle = ref(false)

  //   const todoTitle = ref('')
  //   const todoAssignment = ref<AssignmentSelectType[]>([])
  //   const todoDeadline = ref(null)

  //   const initializedTodoData = () => {
  //     todoTitle.value = ''
  //     todoAssignment.value = []
  //     todoDeadline.value = null
  //   }

  //   const handleCreatedTodoToggle = () => {
  //     if (foldertodoToggle.value) {
  //       initializedTodoData()
  //     }
  //     foldertodoToggle.value = !foldertodoToggle.value
  //   }

  //   const handleCreatedTodo = async () => {
  //     if (todoTitle.value === '') return
  //     const assignments = todoAssignment.value.map((assign) => ({
  //       userId: assign.id,
  //     }))

  //     // const date = todoDeadline.value ? new Date(todoDeadline.value) : new Date()
  //     // date.setHours(23, 59, 59, 999)
  //     // const timestamp = date.getTime()

  //     const timestamp = formatedTimeToTimestamp(todoDeadline.value)

  //     const body = {
  //       title: todoTitle.value,
  //       ...(todoDeadline.value ? { deadline: timestamp } : {}),
  //       ...(assignments.length > 0 ? { assignments: assignments } : {}),
  //     }

  //     const result = await todoStore.addedTodo(workspaceId, props.id as string, body)

  //     if (!result?.success) {
  //       toast.error(result?.message)
  //       return
  //     }

  //     initializedTodoData()
  //     foldertodoToggle.value = false
  //   }

  //   const handleEditTodo = async (todoId: string, body: TodoFullType) => {
  //     await todoStore.updatedTodo(workspaceId, todoId, body)
  //   }
  //   const handleDeleteTodo = async (todoId: string) => {
  //     await todoStore.deletedTodo(workspaceId, props.id, todoId)
  //   }

  //   const handleUpdatedFolder = () => {
  //     if (props.title === folderTitle.value) return
  //     emit('update-folder', props.id, folderTitle.value)
  //   }
  //   const handleDeleteFolder = () => {
  //     emit('delete-folder', props.id)
  //   }

  //   // -------------------- MULTISELECT OPTIONS --------------------
  //   const memberOptions = workspaceStore.membersList.map((member) => ({
  //     id: member._id,
  //     name: member.name,
  //   }))

  //   return {
  //     folderTitle,
  //     folderTodos: props.todos,
  //     member: memberOptions,
  //     todoToggle: foldertodoToggle,

  //     todoTitle,
  //     todoAssignment,
  //     todoDeadline,

  //     formatedTime,
  //     handleUpdatedFolder,
  //     handleDeleteFolder,
  //     handleCreatedTodoToggle,
  //     handleCreatedTodo,
  //     handleEditTodo,
  //     handleDeleteTodo,
  //     ...props,
  //   }
  // },
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="relative bg-white h-10 px-2 flex justify-between items-center">
      <label :for="id" class="group flex items-center gap-1">
        <PencilEditIcon class="w-4 h-4 group-focus-within:block hidden" />
        <input
          :id="id"
          type="text"
          v-model="folderTitle"
          placeholder="請輸入群組名稱"
          class="bg-transparent w-[210px] focus:border-b focus:border-midnight-forest"
          @blur="handleUpdatedFolder"
        />
      </label>
      <button @click="handleDeletedFolder" class="text-midnight-forest opacity-0 hover:opacity-100">
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>
    <div class="flex flex-col gap-4">
      <!-- 新增代辦事項 -->
      <!-- <div class="flex flex-col gap-2">
        <button
          @click="handleCreatedTodoToggle"
          class="px-4 h-10 w-full rounded-md border text-ocean-teal-60 border-ocean-teal-60 border-dashed flex justify-center items-center font-bold hover:border-ocean-teal hover:text-ocean-teal"
        >
          + 新增代辦事項
        </button>
        <div v-if="todoToggle" class="bg-white">
          <div class="px-4 py-2 flex flex-col gap-2">
            <input
              v-model="todoTitle"
              type="text"
              class="w-full h-10 px-2 bg-transparent focus:border-b focus:border-midnight-forest focus:bg-pale-aqua"
              placeholder="輸入代辦事項"
            />
            <div class="flex flex-col gap-1">
              <VueDatePicker v-model="todoDeadline" :minDate="new Date()" :enableTimePicker="false">
                <template #trigger>
                  <div
                    class="w-full h-[43px] leading-10 px-2 rounded-[5px] bg-white border border-[#e5e7eb]"
                    :class="todoDeadline ? 'text-midnight-forest' : 'text-muted-gray text-sm'"
                  >
                    {{ formatedTime(todoDeadline) || '請輸入截止日期' }}
                  </div>
                </template>
              </VueDatePicker>
              <Multiselect
                v-model="todoAssignment"
                track-by="id"
                label="name"
                :options="member"
                :multiple="true"
                placeholder="請指派人選"
                class="bg-transparent"
              >
              </Multiselect>
            </div>
          </div>
          <button @click="handleCreatedTodo" class="w-full h-8 bg-ocean-teal text-white">
            新增
          </button>
        </div>
      </div>
      <div class="scroll overflow-y-auto h-[480px] flex flex-col gap-2">
        <TodoItem
          v-for="todo in todos"
          :key="todo._id"
          :id="todo._id"
          :title="todo.title"
          :status="todo.status"
          :checklists="todo.checklists"
          :assignments="todo.assignments"
          :deadline="todo.deadline"
          @edit-todo="handleEditTodo"
          @delete-todo="handleDeleteTodo"
        />
      </div> -->
    </div>
  </div>
</template>
<style></style>
