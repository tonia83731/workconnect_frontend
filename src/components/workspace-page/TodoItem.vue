<script lang="ts">
import dayjs from 'dayjs'
import Multiselect from 'vue-multiselect'
import type { AssignmentFormatedType, CheckListType } from '@/types/todos'

import { inputClass, labelClass } from '@/styles/input-style'
import ModalLayout from '../common/layout/ModalLayout.vue'
import CalendarIcon from '../icons/CalendarIcon.vue'
import TrashIcon from '../icons/TrashIcon.vue'
import CheckCircleIcon from '../icons/CheckCircleIcon.vue'
import CheckSolidCircleIcon from '../icons/CheckSolidCircleIcon.vue'
import SpinningCircleIcon from '../icons/SpinningCircle.vue'
import XmarkIcon from '../icons/XmarkIcon.vue'
import CheckIcon from '../icons/CheckIcon.vue'
import { getWorkspaceTodo } from '@/api/todo'
import { getWorkspaceFolders } from '@/api/workfolder'
import { convertTimeToTimestamp } from '@/helpers/formatedTime'
import { useFolderStore } from '@/stores/folders'
import { toast } from 'vue3-toastify'
import debounce from 'lodash/debounce'

const folderStore = useFolderStore()

export default {
  components: {
    CalendarIcon,
    TrashIcon,
    CheckCircleIcon,
    CheckSolidCircleIcon,
    SpinningCircleIcon,
    XmarkIcon,
    CheckIcon,
    ModalLayout,
    Multiselect,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    folderId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    status: {
      type: String,
    },
    checklists: {
      type: Array as () => CheckListType[],
      default: () => []
    },
    assignments: {
      type: Array as () => AssignmentFormatedType[],
      default: () => []
    },
    deadline: {
      type: [Number, null],
      default: null,
    },
    memberOpts: {
      type: Array as () => {
        name: string
        userId: string
      }[],
    },
  },

  data() {
    return {
      label_class: labelClass,
      input_class: inputClass(),
      textarea_class: inputClass('h-auto'),
      todoTitle: '',
      todoStatus: null,
      statusOpts: ['pending', 'processing', 'completed'],
      todoNote: '',
      todoAssignments: [] as {
        name: string
        userId: string
      }[],
      todoChecklists: [] as {
        _id: string
        isChecked: boolean
        text: string
      }[],
      todoWorkfolder: null as {
        id: string
        title: string
      } | null,
      folderOpts: [] as {
        id: string
        title: string
      }[],
      checklistText: '',
      todoDeadline: null as string | null,
      todoToggle: false,
      isSaving: false,
      saveSuccess: null as boolean | null,
      initialValues: {
        title: '',
        note: '',
        deadline: null as string | null,
        assignments: [] as { name: string; userId: string }[],
        checklists: [] as { _id: string; isChecked: boolean; text: string }[],
        status: null as string | null
      }
    }
  },
  methods: {
    async fetchWorkfolders(bucketId: string) {
      try {
        const res = await getWorkspaceFolders(bucketId)
        if (res?.success) {
          const data = res?.data
          const opts = data.map((folder: any) => ({
            id: folder._id,
            title: folder.title,
          }))
          this.folderOpts = opts
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleTodoToggle(todoId: string) {
      try {
        const res = await getWorkspaceTodo(todoId)
        if (res?.success) {
          const data = res?.data
          const { title, workfolderId, status, note, assignments, checklists, deadline } = data

          const formated_assignments = assignments.map((assign: any) => ({
            userId: assign.userId._id,
            name: assign.userId.name,
          }))
          const formated_deadline = deadline ? dayjs(deadline).format('YYYY-MM-DD') : null

          const folder = this.folderOpts.find((item) => item?.id === workfolderId)

          this.todoTitle = title
          this.todoStatus = status
          this.todoNote = note
          this.todoAssignments = formated_assignments
          this.todoChecklists = checklists
          this.todoDeadline = formated_deadline
          this.todoWorkfolder = folder || null

          this.initialValues = {
            title,
            note,
            deadline: formated_deadline,
            assignments: [...formated_assignments],
            checklists: [...checklists],
            status
          }

          this.todoToggle = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    initializedTodo() {
      this.todoTitle = ''
      this.todoStatus = null
      this.todoNote = ''
      this.todoAssignments = []
      this.todoChecklists = []
      this.todoWorkfolder = null
      this.todoDeadline = null
    },
    handleClosedTodoToggle() {
      this.initializedTodo()
      this.todoToggle = false
      this.isSaving = false
    },
    hasChanges(): boolean {
      return (
        this.todoTitle !== this.initialValues.title ||
        this.todoNote !== this.initialValues.note ||
        this.todoDeadline !== this.initialValues.deadline ||
        this.todoStatus !== this.initialValues.status ||
        JSON.stringify(this.todoAssignments) !== JSON.stringify(this.initialValues.assignments) ||
        JSON.stringify(this.todoChecklists) !== JSON.stringify(this.initialValues.checklists)
      )
    },
    async handleEditTodo() {
      this.isSaving = true
      this.saveSuccess = null
      const body = {
        // workfolderId: this.todoWorkfolder?.id,
        title: this.todoTitle,
        status: this.todoStatus ? this.todoStatus : 'pending',
        note: this.todoNote,
        deadline: convertTimeToTimestamp(this.todoDeadline),
        checklists: this.todoChecklists.map((list) => ({
          isChecked: list.isChecked,
          text: list.text,
        })),
        assignments: this.todoAssignments.map((assign) => ({ userId: assign.userId })),
      }
      const status = await folderStore.onEditTodo(this.folderId, this.id as string, body)
      if (status) {
        this.saveSuccess = true
      } else {
        this.saveSuccess = false
      }
    },
    debouncedAutoSave: debounce(function (this: any) {
      if (this.hasChanges()) {
        this.handleEditTodo()
      }
    }, 3000),
    async handleDeleteTodo(e: any, todoId: string) {
      e.stopPropagation()
      const result = await folderStore.onDeletedTodo(this.folderId, todoId as string)

      if (result) {
        this.$emit('delete-todo', todoId)
        this.initializedTodo()
        this.todoToggle = false
      } else {
        toast.error('代辦清單刪除失敗')
      }
    },
    handleAddTodoChecklist() {
      if (this.checklistText.trim() === '') return
      const body = {
        _id: `${Date.now()}`,
        isChecked: false,
        text: this.checklistText,
      }
      this.todoChecklists.push(body)
      this.checklistText = ''
    },
    handleDeleteTodoChecklist(checklistId: string) {
      this.todoChecklists = this.todoChecklists.filter((list) => list._id !== checklistId)
    },
    handleUpdateChecked(e: any, checklistId: string) {
      this.todoChecklists = this.todoChecklists.map((list) => {
        return list._id === checklistId ? { ...list, isChecked: e.target.checked } : list
      })
    },
    handleUpdateText(e: any, checklistId: string) {
      this.todoChecklists = this.todoChecklists.map((list) => {
        return list._id === checklistId ? { ...list, text: e.target.value } : list
      })
    },
  },
  mounted() {
    if (this.bucketId) {
      this.fetchWorkfolders(this.bucketId as string)
    }
  },
  computed: {
    listNum() {
      return this.checklists ? this.checklists.length : []
    },
    ischeckedListNum() {
      const lists = this.checklists ? this.checklists : []
      const finished_lists = lists.filter((check) => check.isChecked)
      return finished_lists.length
    },
    formatedDate() {
      return this.deadline ? dayjs(this.deadline).format('YYYY-MM-DD') : '未設定'
    },
    minDate() {
      return new Date().toISOString().split('T')[0]
    },
    bucketId() {
      return this.$route.params.bucketId
    },
  },
  watch: {
    todoTitle() {
      if (this.hasChanges()) {
        this.debouncedAutoSave()
      }
    },
    todoStatus() {
      if (this.hasChanges()) {
        this.debouncedAutoSave()
      }
    },
    todoNote() {
      if (this.hasChanges()) {
        this.debouncedAutoSave()
      }
    },
    todoDeadline() {
      if (this.hasChanges()) {
        this.debouncedAutoSave()
      }
    },
    todoAssignments: {
      handler() {
        if (this.hasChanges()) {
          this.debouncedAutoSave()
        }
      },
      deep: true
    },
    todoChecklists: {
      handler() {
        if (this.hasChanges()) {
          this.debouncedAutoSave()
        }
      },
      deep: true
    }
  }
}
</script>

<template>
  <div @click="handleTodoToggle(id as string)" class="shadow-md bg-white rounded-sm w-full">
    <!-- title -->
    <div class="flex justify-between items-center h-10 px-4">
      <button class="font-medium truncate">
        {{ title }}
      </button>
      <button class="opacity-0 hover:opacity-100" @click="(e) => handleDeleteTodo(e, id as string)">
        <TrashIcon class="w-4 h-4 text-midnight-forest" />
      </button>
    </div>
    <!-- checklists -->
    <div class="px-4 pb-2 flex gap-2 items-center text-muted-gray text-xs">
      <CheckCircleIcon class="w-4 h-4 text-muted-gray" />
      <p>{{ ischeckedListNum }} / {{ listNum }}</p>
    </div>
    <!-- deadline & assignments -->
    <div class="flex justify-between items-center h-10 px-4 border-t-[0.5px] border-muted-gray">
      <div class="flex items-center gap-2 text-xs">
        <CalendarIcon class="w-4 h-4" />
        <p>{{ formatedDate }}</p>
      </div>
      <div class="flex items-center">
        <div
          v-for="assign in assignments"
          class="w-8 h-8 -ml-2 text-white rounded-full flex justify-center items-center drop-shadow-xl"
          :key="assign.userId"
          :title="assign.name"
          :style="{ backgroundColor: assign.bgColor, color: assign.textColor }"
        >
          <!-- :class="index === 0 ? 'bg-sky-blue' : index === 1 ? 'bg-ocean-teal' : 'bg-golder-amber'" -->
          {{ assign.name ? assign.name[0] : '...' }}
        </div>
      </div>
    </div>
  </div>
  <!-- <TodoItemModal /> -->
  <ModalLayout title="代辦事項" :toggle="todoToggle" modalSize="w-[90%] max-w-[840px] h-full max-h-[560px]" contentSize="h-full max-h-[500px] p-6"  @update:toggle="handleClosedTodoToggle">
    <template #modal>
      <div class="flex flex-col gap-8">
        <div v-if="isSaving" :class="['text-sm flex items-center justify-end gap-1',
          saveSuccess === null ? 'text-muted-gray' : saveSuccess === true ? 'text-green-400' : 'text-red-500'
        ]">

          <SpinningCircleIcon class="w-4 h-4" v-if="saveSuccess === null"/>
          <CheckIcon class="w-4 h-4" v-if="saveSuccess === true"/>
          <XmarkIcon class="w-4 h-4" v-if="saveSuccess === false"/>
          <p>save</p>
        </div>
        <!-- Todo Title -->
        <div class="flex justify-between items-center gap-2">
          <input
            type="text"
            v-model="todoTitle"
            class="w-full h-10 bg-pale-aqua px-2 focus:border-b focus:border-midnight-forest"
            placeholder="輸入代辦事項"
          />
          <button @click="(e) => handleDeleteTodo(e, id as string)">
            <TrashIcon class="w-5 h-5 text-midnight-forest-40 hover:text-midnight-forest" />
          </button>
        </div>
        <div class="flex flex-col gap-4">
          <!-- Todo Assignment -->
          <div class="flex flex-col gap-1">
            <h5 :class="label_class">指派人選</h5>
            <Multiselect
              v-model="todoAssignments"
              :options="memberOpts"
              :multiple="true"
              label="name"
              track-by="userId"
              placeholder="請選擇指派人選"
            ></Multiselect>
          </div>
          <div class="grid grid-cols-2 grid-rows-2 xl:grid-cols-3 xl:grid-rows-1 gap-4">
            <!-- Todo Groups (disabled) -->
            <div class="flex flex-col gap-1 col-span-2 xl:col-span-1">
              <h5 :class="label_class">工作群組</h5>
              <Multiselect
                v-model="todoWorkfolder"
                :options="folderOpts"
                :multiple="false"
                label="title"
                track-by="id"
                placeholder="請選擇工作群組"
                disabled
              ></Multiselect>
            </div>
            <!-- Todo Deadline -->
            <div class="flex flex-col gap-1">
              <h5 :class="label_class">截止日期</h5>
              <input
                type="date"
                :min="minDate"
                v-model="todoDeadline"
                class="w-full h-10 bg-transparend border border-[#e8e8e8] rounded-[5px] px-2 focus:border-b focus:border-midnight-forest"
              />
            </div>
            <!-- Todo Process -->
            <div class="flex flex-col gap-1">
              <h5 :class="label_class">工作進度</h5>
              <Multiselect
                v-model="todoStatus"
                :options="statusOpts"
                :searchable="false"
                placeholder="請選擇工作進度"
              ></Multiselect>
            </div>
          </div>
        </div>
        <!-- Todo Note -->
        <div class="flex flex-col gap-1">
          <h5 :class="label_class">工作筆記</h5>
          <textarea
            v-model="todoNote"
            class="py-2 text-sm"
            :class="textarea_class"
            rows="4"
          ></textarea>
        </div>
        <!-- Todo Checklists -->
        <div class="flex flex-col gap-1">
          <h5 :class="label_class">TODO</h5>
          <div class="flex flex-col gap-1 text-sm text-muted-gray">
            <div
              class="flex items-center gap-2"
              v-for="checklist in todoChecklists"
              :key="checklist?._id"
            >
              <label :for="checklist?._id" class="w-full flex items-center gap-2">
                <input
                  :id="checklist?._id"
                  type="checkbox"
                  class="hidden"
                  :checked="checklist?.isChecked"
                  @change="(e) => handleUpdateChecked(e, checklist?._id)"
                />
                <span class="">
                  <CheckSolidCircleIcon v-if="checklist?.isChecked" class="w-5 h-5" />
                  <CheckCircleIcon v-else class="w-5 h-5" />
                </span>
                <input
                  :value="checklist.text"
                  placeholder="請輸入TODO項目"
                  class="w-full focus:text-midnight-forest bg-transparent focus:border-b focus:border-midnight-forest focus:bg-pale-aqua"
                  :class="checklist?.isChecked && 'line-through'"
                  :disabled="checklist?.isChecked"
                  @change="(e) => handleUpdateText(e, checklist?._id)"
                  @keydown.enter="(e: KeyboardEvent) => {
                    e.preventDefault()
                    handleUpdateText(e, checklist?._id)
                    const target = e.target as HTMLInputElement
                    if (target) target.blur()
                  }"
                />
              </label>
              <button
                @click="() => handleDeleteTodoChecklist(checklist._id)"
                class="opacity-0 hover:opacity-100"
              >
                <TrashIcon class="w-4 h-4 text-muted-gray" />
              </button>
            </div>
            <div class="flex items-center gap-2 h-8">
              <span class="w-5"><CheckCircleIcon class="w-5 h-5" /></span>
              <input
                v-model="checklistText"
                @blur="handleAddTodoChecklist"
                @keydown.enter="(e: KeyboardEvent) => {
                  e.preventDefault()
                  handleAddTodoChecklist()
                  const target = e.target as HTMLInputElement
                  if (target) target.blur()
                }"
                type="text"
                placeholder="請輸入TODO項目"
                class="w-full h-full focus:px-2 focus:border-b focus:border-midnight-forest focus:bg-pale-aqua"
              />
            </div>
          </div>
        </div>

        <!-- <div class="grid grid-cols-2 gap-4">
          <button @click="handleClosedTodoToggle" class="w-full h-8 bg-muted-gray text-white">
            取消
          </button>
          <button @click="handleEditTodo" class="w-full h-8 bg-ocean-teal text-white">儲存</button>
        </div> -->
      </div>
    </template>
  </ModalLayout>
</template>
