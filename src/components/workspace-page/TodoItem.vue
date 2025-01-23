<script lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import VueDatePicker from '@vuepic/vue-datepicker'
import Multiselect from 'vue-multiselect'
import { getWorkspaceFolders } from '@/api/workfolder'
import { getWorkspaceTodo } from '@/api/todo'
import type { AssignmentType, CheckListType } from '@/stores/todos'
import { formatedTime, formatedTimeToTimestamp } from '@/helpers/formatedTime'
import { input_class, label_class } from '@/data/input-style'
import ModalLayout from '../common/layout/ModalLayout.vue'
import CalendarIcon from '../icons/CalendarIcon.vue'
import TrashIcon from '../icons/TrashIcon.vue'
import CheckCircleIcon from '../icons/CheckCircleIcon.vue'
import CheckSolidCircleIcon from '../icons/CheckSolidCircleIcon.vue'
import { useWorkspaceStore } from '@/stores/workspace'

export type TodoEditData = {
  _id: string
  workfolderId: {
    id: string
    name: string
  }
  title: string
  assignments: {
    id: string
    name: string
  }[]
  status: {
    id: string
    name: string
  }
  note: string
  checklists: CheckListType[]
  deadline: number | string
  order: number
}

export default {
  components: {
    CalendarIcon,
    TrashIcon,
    CheckCircleIcon,
    CheckSolidCircleIcon,
    ModalLayout,
    VueDatePicker,
    Multiselect,
  },
  props: {
    id: {
      type: String,
    },
    title: {
      type: String,
    },
    status: {
      type: String,
    },
    checklists: {
      type: Array as () => CheckListType[],
    },
    assignments: {
      type: Array as () => AssignmentType[],
    },
    deadline: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    // const GroupTitle = ref(props.title)
    const workspaceState = useWorkspaceStore()
    const memberOptions = workspaceState.membersList.map((member) => ({
      id: member._id,
      name: member.name,
    }))

    const statusOptions = [
      {
        id: 'pending',
        name: 'PENDING',
      },
      {
        id: 'processing',
        name: 'PROCESSING',
      },
      {
        id: 'completed',
        name: 'COMPLETED',
      },
    ]

    const { params } = useRoute()
    const { workspaceId, bucketId } = params

    const ischecked_checklists = props?.checklists?.filter((item: CheckListType) => item.isChecked)
    const checklistsNum = ref(props.checklists?.length)
    const isChecklistsNum = ref(ischecked_checklists?.length)

    const foldersOptions = ref<
      {
        id: string
        name: string
      }[]
    >([])

    const todoToggle = ref(false)
    const checklistText = ref('')
    const todoData = ref<TodoEditData>({
      _id: '',
      workfolderId: {
        id: '',
        name: '',
      },
      title: '',
      status: statusOptions[0],
      deadline: 0,
      order: 0,
      checklists: [],
      assignments: [],
      note: '',
    })

    const handleEditTodoToggle = async () => {
      try {
        const data = await getWorkspaceTodo(workspaceId as string, props.id as string)

        if (data?.success) {
          const {
            _id,
            workfolderId,
            title,
            status,
            deadline,
            order,
            checklists,
            assignments,
            note,
          } = data?.data
          const status_opt = statusOptions.find((s) => s.id === status)
          const assign_opt = memberOptions.filter((m) => {
            return assignments.map(
              (a: {
                userId: {
                  _id: string
                  name: string
                }
                _id: string
              }) => {
                return a.userId._id === m.id
              },
            )
          })
          const workfolder_opt = foldersOptions.value.find((f) => f?.id === workfolderId)

          todoToggle.value = true
          todoData.value = {
            _id,
            workfolderId: workfolder_opt
              ? workfolder_opt
              : {
                  id: '',
                  name: '',
                },
            title,
            status: status_opt ? status_opt : statusOptions[0],
            deadline,
            order,
            checklists,
            assignments: assign_opt,
            note,
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    const handleModalToggleClosed = () => {
      todoToggle.value = false
      todoData.value = {
        _id: '',
        workfolderId: {
          id: '',
          name: '',
        },
        title: '',
        status: statusOptions[0],
        deadline: 0,
        order: 0,
        checklists: [],
        assignments: [],
        note: '',
      }
    }
    const handleAddedChecklist = () => {
      const body = {
        _id: `temp_${Date.now()}`,
        isChecked: false,
        text: checklistText.value,
      }
      todoData.value.checklists.push(body)
      checklistText.value = ''
    }

    const handleDeletedChecklist = (checklistId: string) => {
      todoData.value.checklists = todoData.value.checklists.filter(
        (item) => item._id !== checklistId,
      )
    }

    const handleEditTodo = () => {
      const { _id, workfolderId, title, status, deadline, order, checklists, assignments, note } =
        todoData.value
      const body = {
        _id,
        workfolderId: workfolderId.id,
        title,
        status: status.id,
        deadline: formatedTimeToTimestamp(deadline),
        order,
        checklists: checklists.map((c) => ({ isChecked: c.isChecked, text: c.text })),
        assignments: assignments.map((a) => ({ userId: a.id })),
        note,
      }
      emit('edit-todo', props.id, body)
    }

    const handleDeleteTodo = () => {
      emit('delete-todo', props.id)
      if (todoToggle.value) todoToggle.value = false
    }

    // -------------------- FETCH FOLDER/TODO DATA --------------------
    const fetchWorkfolders = async () => {
      try {
        const data = await getWorkspaceFolders(workspaceId as string, bucketId as string)

        if (data?.success) {
          const folders = data?.data
          const format_folders = folders.map(
            (item: {
              _id: string
              workspaceId: string
              workbucketId: string
              title: string
              order: number
            }) => ({
              id: item._id,
              name: item.title,
            }),
          )
          foldersOptions.value = format_folders
        }
      } catch (error) {
        console.log(error)
      }
    }

    onMounted(async () => {
      await fetchWorkfolders()
    })

    return {
      label_class,
      input_class: input_class('h-32', 'bg-pale-aqua'),
      todoData,
      todoToggle,

      checklistText,
      checklistsNum,
      isChecklistsNum,

      memberOptions,
      statusOptions,
      foldersOptions,
      handleModalToggleClosed,
      formatedTime,
      handleEditTodoToggle,
      handleEditTodo,
      handleAddedChecklist,
      handleDeletedChecklist,
      handleDeleteTodo,
      ...props,
    }
  },
}
</script>

<template>
  <button @click="handleEditTodoToggle" class="shadow-md bg-white rounded-sm w-full">
    <!-- title -->
    <div class="flex justify-between items-center h-10 px-4">
      <h5 class="font-medium">{{ title }}</h5>
      <button @click="handleDeleteTodo" class="opacity-0 hover:opacity-100">
        <TrashIcon class="w-4 h-4 text-midnight-forest" />
      </button>
    </div>
    <!-- checklists -->
    <div class="px-4 pb-2 flex gap-2 items-center text-muted-gray text-xs">
      <CheckCircleIcon class="w-4 h-4 text-muted-gray" />
      {{ isChecklistsNum }} / {{ checklistsNum }}
    </div>
    <!-- deadline & assignments -->
    <div class="flex justify-between items-center h-10 px-4 border-t-[0.5px] border-muted-gray">
      <div class="flex items-center gap-2 text-xs">
        <CalendarIcon class="w-4 h-4" />
        <p>{{ formatedTime(deadline as number) }}</p>
      </div>
      <div class="flex items-center">
        <div
          v-for="(assign, index) in assignments"
          class="w-8 h-8 -ml-2 text-white rounded-full flex justify-center items-center drop-shadow-xl"
          :class="index === 0 ? 'bg-sky-blue' : index === 1 ? 'bg-ocean-teal' : 'bg-golder-amber'"
          :key="assign._id"
        >
          {{ assign.userId.name[0] }}
        </div>
      </div>
    </div>
  </button>
  <ModalLayout
    :title="todoData?.title"
    :toggle="todoToggle"
    @update:toggle="handleModalToggleClosed"
  >
    <template #modal>
      <div class="flex flex-col gap-8">
        <!-- TITLE & DELETE -->
        <div class="flex justify-between items-center gap-2">
          <input
            type="text"
            v-model="todoData.title"
            class="w-full h-10 bg-pale-aqua focus:border-b focus:border-midnight-forest"
            placeholder="輸入代辦事項"
          />
          <button @click="handleDeleteTodo">
            <TrashIcon class="w-5 h-5 text-midnight-forest-40 hover:text-midnight-forest" />
          </button>
        </div>
        <div class="flex flex-col gap-4">
          <!-- ASSIGNMENTS -->
          <div class="flex flex-col gap-1">
            <h5 :class="label_class">指派人選</h5>
            <Multiselect
              v-model="todoData.assignments"
              :options="memberOptions"
              :multiple="true"
              label="name"
              track-by="id"
              placeholder="請選擇指派人選"
            ></Multiselect>
          </div>
          <div class="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-4">
            <!-- FOLDERS -->
            <div class="flex flex-col gap-1">
              <h5 :class="label_class">工作群組</h5>
              <Multiselect
                v-model="todoData.workfolderId"
                :options="foldersOptions"
                label="name"
                track-by="id"
                placeholder="請選擇工作群組"
              >
                <template v-slot:singleLabel="{ option }">
                  <span class="truncate w-[106px] block">{{ option.name }}</span>
                </template></Multiselect
              >
            </div>
            <!-- DEADLINE -->
            <div class="flex flex-col gap-1">
              <h5 :class="label_class">截止日期</h5>
              <VueDatePicker
                v-model="todoData.deadline"
                :minDate="new Date()"
                :enableTimePicker="false"
              >
                <template #trigger>
                  <div
                    class="w-full h-[40px] leading-10 px-2 rounded-[5px] bg-white border border-[#e5e7eb]"
                    :class="todoData.deadline ? 'text-midnight-forest' : 'text-muted-gray text-sm'"
                  >
                    {{ formatedTime(todoData.deadline) || '請輸入截止日期' }}
                  </div>
                </template>
              </VueDatePicker>
            </div>
            <!-- STATUS -->
            <div class="flex flex-col gap-1">
              <h5 :class="label_class">工作進度</h5>
              <Multiselect
                v-model="todoData.status"
                :options="statusOptions"
                label="name"
                track-by="id"
                placeholder="請選擇工作進度"
              ></Multiselect>
            </div>
          </div>
        </div>
        <!-- NOTE -->
        <div class="flex flex-col gap-1">
          <h5 :class="label_class">工作筆記</h5>
          <textarea v-model="todoData.note" :class="input_class"></textarea>
        </div>
        <!-- CHECKLISTS -->
        <div class="flex flex-col gap-1">
          <h5 :class="label_class">TODO</h5>
          <div class="flex flex-col gap-1 text-sm text-muted-gray">
            <div
              class="flex items-center gap-2"
              v-for="checklist in todoData.checklists"
              :key="checklist._id"
            >
              <label :for="checklist._id" class="w-full flex items-center gap-2">
                <input
                  :id="checklist._id"
                  type="checkbox"
                  v-model="checklist.isChecked"
                  class="hidden"
                />
                <span class="">
                  <CheckSolidCircleIcon v-if="checklist.isChecked" class="w-5 h-5" />
                  <CheckCircleIcon v-else class="w-5 h-5" />
                </span>
                <input
                  v-model="checklist.text"
                  placeholder="請輸入TODO項目"
                  class="w-full focus:text-midnight-forest bg-transparent focus:border-b focus:border-midnight-forest focus:bg-pale-aqua"
                  :class="checklist.isChecked && 'line-through'"
                  :disabled="checklist.isChecked"
                />
              </label>
              <button
                @click="() => handleDeletedChecklist(checklist._id)"
                class="opacity-0 hover:opacity-100"
              >
                <TrashIcon class="w-4 h-4 text-muted-gray" />
              </button>
            </div>
            <div class="flex items-center gap-2 h-8">
              <CheckCircleIcon class="w-5 h-5" />
              <input
                v-model="checklistText"
                @blur="handleAddedChecklist"
                type="text"
                placeholder="請輸入TODO項目"
                class="w-full h-full focus:border-b focus:border-midnight-forest focus:bg-pale-aqua"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button @click="handleModalToggleClosed" class="w-full h-8 bg-muted-gray text-white">
            取消
          </button>
          <button @click="handleEditTodo" class="w-full h-8 bg-ocean-teal text-white">儲存</button>
        </div>
      </div>
    </template>
  </ModalLayout>
</template>
