<script lang="ts">
import Multiselect from 'vue-multiselect'
import CrossIcon from '@/components/icons/CrossIcon.vue'
// import CalendarIcon from '../icons/CalendarIcon.vue'
import TrashIcon from '../icons/TrashIcon.vue'
import CheckCircleIcon from '../icons/CheckCircleIcon.vue'
import CheckSolidCircleIcon from '../icons/CheckSolidCircleIcon.vue'

export default {
  components: {
    Multiselect,
    CrossIcon,
    // CalendarIcon,
    TrashIcon,
    CheckCircleIcon,
    CheckSolidCircleIcon,
  },
  props: {
    toggle: {
      type: Boolean,
    },
  },
}
</script>


<template>
<div class="fixed top-0 left-0 z-[999] w-full h-screen bg-dark-60 flex justify-center items-center">
  <div class="w-full h-screen relative">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md w-[90%] md:w-[60%] max-w-[900px] h-full max-h-[560px]">
      <div
          class="h-10 flex justify-between items-center py-1 px-4 rounded-t-md bg-midnight-forest text-white"
      >
        <h5 class="text-lg font-bold">代辦事項</h5>
        <button @click="$emit('update:toggle', false)" class="opacity-50 hover:opacity-100">
          <CrossIcon class="w-5 h-5" />
        </button>
      </div>
      <div
          class="px-4 py-2 overflow-y-auto overflow-x-hidden scroll"
          @click.stop
        >
        <div class="flex flex-col gap-8">
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

        <!-- <div class="grid grid-cols-2 gap-4">
          <button @click="handleClosedTodoToggle" class="w-full h-8 bg-muted-gray text-white">
            取消
          </button>
          <button @click="handleEditTodo" class="w-full h-8 bg-ocean-teal text-white">儲存</button>
        </div> -->
      </div>
      </div>
    </div>
  </div>
</div>
</template>
