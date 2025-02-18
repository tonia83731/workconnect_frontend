<script lang="ts">
import dayjs from 'dayjs'
import Multiselect from 'vue-multiselect'
import type { AssignmentType, CheckListType } from '@/stores/todos'
import { inputClass, labelClass } from '@/styles/input-style'
import ModalLayout from '../common/layout/ModalLayout.vue'
import CalendarIcon from '../icons/CalendarIcon.vue'
import TrashIcon from '../icons/TrashIcon.vue'
import CheckCircleIcon from '../icons/CheckCircleIcon.vue'
import CheckSolidCircleIcon from '../icons/CheckSolidCircleIcon.vue'
import { getWorkspaceTodo } from '@/api/todo'
import { getWorkspaceFolders } from '@/api/workfolder'

export type TodoEditData = {
  _id: string
  workfolderId: {
    id: string
    name: string
  }
  title: string
  assignments: {
    userId: string
    name: string
  }[]
  status: {
    id: string
    name: string
  }
  note: string
  checklists: CheckListType[]
  deadline: number | null
  order: number
}

export default {
  components: {
    CalendarIcon,
    TrashIcon,
    CheckCircleIcon,
    CheckSolidCircleIcon,
    ModalLayout,
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
      // todo: {
      //   _id: '',
      //   workfolderId: {
      //     id: '',
      //     name: '',
      //   },
      // },

      todoTitle: '',
      todoStatus: null,
      statusOpts: ['pending', 'processing', 'completed'],
      todoNote: '',
      todoAssignments: [],
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
    }
  },
  methods: {
    async fecthWorkfolders(bucketId: string) {
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
          console.log(folder)

          this.todoTitle = title
          this.todoStatus = status
          this.todoNote = note
          this.todoAssignments = formated_assignments
          this.todoChecklists = checklists
          this.todoDeadline = formated_deadline

          this.todoWorkfolder = folder || null

          this.todoToggle = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleClosedTodoToggle() {
      this.todoToggle = false
    },
    handleEditTodo() {
      const body = {}
      this.$emit('edit-todo', body)
      this.todoToggle = false
    },
    handleDeleteTodo(todoId: string) {
      this.$emit('delete-todo', todoId)
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
      this.fecthWorkfolders(this.bucketId as string)
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
    formatedAssignments() {
      return this.assignments?.map((assign) => ({
        userId: assign.userId._id,
        name: assign.userId.name,
      }))
    },
    minDate() {
      return new Date().toISOString().split('T')[0]
    },
    bucketId() {
      return this.$route.params.bucketId
    },
  },
}
</script>

<template>
  <button @click="handleTodoToggle(id as string)" class="shadow-md bg-white rounded-sm w-full">
    <!-- title -->
    <div class="flex justify-between items-center h-10 px-4">
      <h5 class="font-medium">{{ title }}</h5>
      <button class="opacity-0 hover:opacity-100">
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
          v-for="(assign, index) in formatedAssignments"
          class="w-8 h-8 -ml-2 text-white rounded-full flex justify-center items-center drop-shadow-xl"
          :class="index === 0 ? 'bg-sky-blue' : index === 1 ? 'bg-ocean-teal' : 'bg-golder-amber'"
          :key="assign.userId"
          :title="assign.name"
        >
          {{ assign.name[0] }}
        </div>
      </div>
    </div>
  </button>
  <ModalLayout title="代辦事項" :toggle="todoToggle" @update:toggle="handleClosedTodoToggle">
    <template #modal>
      <div class="flex flex-col gap-8">
        <div class="flex justify-between items-center gap-2">
          <input
            type="text"
            v-model="todoTitle"
            class="w-full h-10 bg-pale-aqua px-2 focus:border-b focus:border-midnight-forest"
            placeholder="輸入代辦事項"
          />
          <button @click="handleDeleteTodo(id as string)">
            <TrashIcon class="w-5 h-5 text-midnight-forest-40 hover:text-midnight-forest" />
          </button>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h5 :class="label_class">指派人選</h5>
            <Multiselect
              v-model="todoAssignments"
              :options="memberOpts"
              :multiple="true"
              label="name"
              track-by="id"
              placeholder="請選擇指派人選"
            ></Multiselect>
          </div>
          <div class="grid grid-cols-2 grid-rows-2 xl:grid-cols-3 xl:grid-rows-1 gap-4">
            <div class="flex flex-col gap-1 col-span-2 xl:col-span-1">
              <h5 :class="label_class">工作群組</h5>
              <Multiselect
                v-model="todoWorkfolder"
                :options="folderOpts"
                :multiple="false"
                label="title"
                track-by="id"
                placeholder="請選擇工作群組"
              ></Multiselect>
            </div>
            <div class="flex flex-col gap-1">
              <h5 :class="label_class">截止日期</h5>
              <input
                type="date"
                :min="minDate"
                v-model="todoDeadline"
                class="w-full h-10 bg-transparend border border-[#e8e8e8] rounded-[5px] px-2 focus:border-b focus:border-midnight-forest"
              />
            </div>
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
        <div class="flex flex-col gap-1">
          <h5 :class="label_class">工作筆記</h5>
          <textarea
            v-model="todoNote"
            class="py-2 text-sm"
            :class="textarea_class"
            rows="4"
          ></textarea>
        </div>
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
                type="text"
                placeholder="請輸入TODO項目"
                class="w-full h-full focus:px-2 focus:border-b focus:border-midnight-forest focus:bg-pale-aqua"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button @click="handleClosedTodoToggle" class="w-full h-8 bg-muted-gray text-white">
            取消
          </button>
          <button @click="handleEditTodo" class="w-full h-8 bg-ocean-teal text-white">儲存</button>
        </div>
      </div>
    </template>
  </ModalLayout>
</template>
