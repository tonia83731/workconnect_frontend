<script lang="ts">
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'

export default {
  components: { TodoItem, TrashIcon },
  props: {
    id: {
      type: Number,
    },
    title: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const input_class = 'w-full h-12 px-4 rounded-sm bg-gypsum text-gray placeholder:text-gray-50'
    const todoGroup = ref({
      id: 1,
      title: 'Todo 1',
      innerFile: [
        {
          id: 1,
          title: 'Task 1',
          assign: ['Member1', 'Member2'], // Members assigned to the task
          status: 'pending', // Options: pending, processing, complete
          note: 'This is a note for task 1',
          checklist: [
            { id: 1, text: 'Check item 1', isChecked: false },
            { id: 2, text: 'Check item 2', isChecked: true },
          ],
          deadline: '2025-01-10', // Example deadline
        },
        {
          id: 2,
          title: 'Task 2',
          assign: ['Member3'],
          status: 'processing',
          note: 'This is a note for task 2',
          checklist: [
            { id: 1, text: 'Check item A', isChecked: true },
            { id: 2, text: 'Check item B', isChecked: false },
          ],
          deadline: '2025-01-15',
        },
      ],
    })
    const GroupTitle = ref('Todo 1')
    const todoToggle = ref(false)

    const todoTitle = ref('')
    const todoAssign = ref([])
    const todoDeadline = ref('')

    const assignOptions = ref([
      'Select option',
      'options',
      'selected',
      'mulitple',
      'label',
      'searchable',
      'clearOnSelect',
      'hideSelected',
      'maxHeight',
      'allowEmpty',
      'showLabels',
      'onChange',
      'touched',
    ])

    const handleDeleteGroup = () => {
      emit('delete-group', props.id)
    }

    const handleTodoGroupToggle = () => {
      todoToggle.value = !todoToggle.value
    }
    const handleTodoGroupCreated = (value: { todoTitle: string }) => {
      const body = {
        title: value.todoTitle,
        deadline: todoDeadline.value,
        assign: todoAssign.value,
      }
      console.log(body)
    }

    return {
      input_class,
      todoGroup,
      handleDeleteGroup,
      GroupTitle,
      todoToggle,
      todoTitle,
      todoAssign,
      assignOptions,
      todoDeadline,
      handleTodoGroupToggle,
      handleTodoGroupCreated,
      ...props,
    }
  },
}
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div
      class="h-10 px-2 bg-gypsum text-purple shadow-md group flex justify-between gap-2 items-center"
    >
      <input
        type="text"
        class="h-10 bg-transparent focus:border-b focus:border-purple"
        placeholder="請輸入群組標題"
        v-model="GroupTitle"
      />
      <!-- @blur -->
      <button @click="handleDeleteGroup" class="hidden group-hover:block">
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>
    <div
      class="h-full max-h-[300px] scroll overflow-y-auto overflow-x-hidden hover:pr-4 flex flex-col gap-2"
    >
      <!-- 新增代辦事項 & 新增Form -->
      <div class="flex flex-col gap-2">
        <button
          @click="handleTodoGroupToggle"
          class="h-10 px-2 border border-dashed border-gypsum text-gypsum rounded-sm hover:border-purple hover:text-purple"
        >
          + 新增代辦事項
        </button>
        <VForm
          v-if="todoToggle"
          class="bg-white shadow-md"
          v-slot="{ errors }"
          @submit="handleTodoGroupCreated"
        >
          <div class="p-2 flex flex-col gap-2">
            <!-- TITLE -->
            <div class="flex flex-col gap-0.5">
              <VField
                name="todoTitle"
                type="string"
                rules="required|max:20"
                placeholder="TODO TITLE"
                v-model="todoTitle"
                class="w-full h-8 px-4 rounded-sm text-purple placeholder:text-gray-50 focus:border-b focus:border-gray-50"
                :class="{ 'border-b border-error': errors.todoTitle }"
              />
              <ErrorMessage name="todoTitle" class="text-error text-xs" />
            </div>
            <!-- DEADLINE -->
            <VueDatePicker
              v-model="todoDeadline"
              :teleport="true"
              :enableTime="false"
              placeholder="DEADLINE"
            >
              <template #input-icon>
                <!--Empty to remove icon or place new SVG here -->
              </template>
            </VueDatePicker>
            <!-- ASSIGN -->
            <VMultiSelect
              :options="assignOptions"
              :multiple="true"
              :max="3"
              v-model="todoAssign"
              placeholder="ASSIGN TO"
            >
            </VMultiSelect>
          </div>
          <div class="grid grid-cols-[1fr_1.5fr] h-6 text-white">
            <button type="button" class="bg-gray-30">取消</button>
            <button type="submit" class="bg-purple">建立</button>
          </div>
        </VForm>
      </div>
      <!-- 代辦事項列表 -->
      <TodoItem
        v-for="todo in todoGroup.innerFile"
        :key="todo.id"
        :id="todo.id"
        :title="todo.title"
        :status="todo.status"
        :deadline="todo.deadline"
        :checklist="todo.checklist"
      />
    </div>
  </div>
</template>
