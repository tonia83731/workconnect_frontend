<script lang="ts">
import { ref } from 'vue'
import CalendarIcon from '../icons/CalendarIcon.vue'
import type { CheckListType } from '@/views/TodoBucketView.vue'

export default {
  components: { CalendarIcon },
  props: {
    id: {
      type: Number,
    },
    title: {
      type: String,
    },
    status: {
      type: String,
    },
    checklist: {
      type: Array as () => CheckListType[],
    },
    deadline: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const GroupTitle = ref(props.title)
    const handleDeleteGroup = () => {
      emit('delete-group', props.id)
    }

    return {
      handleDeleteGroup,
      GroupTitle,
      ...props,
    }
  },
}
</script>

<template>
  <button class="shadow-md bg-white rounded-sm w-full">
    <div class="h-full w-full flex flex-col justify-between items-start">
      <div class="w-full flex justify-between items-center px-4 py-1">
        <h5 class="font-bold">
          {{ title }}
        </h5>
        <p
          class="text-[10px] text-white rounded-sm px-1"
          :class="
            status === 'pending'
              ? 'bg-tiffany'
              : status === 'processing'
                ? 'bg-purple'
                : 'bg-gray-30'
          "
        >
          {{ status }}
        </p>
      </div>
      <ul class="text-[10px] flex flex-col gap-0.5 px-4 py-1 w-full h-[40px] overflow-y-auto">
        <li class="flex items-center gap-2" v-for="list in checklist" :key="list.id">
          <input
            :id="list.id.toString()"
            type="checkbox"
            v-model="list.isChecked"
            class="w-3 h-3 rounded-[50%]"
          />
          <label
            :for="list.id.toString()"
            class="truncate"
            :class="list.isChecked ? 'line-through text-gray-30' : 'text-purple-50'"
            >{{ list.text }}</label
          >
        </li>
      </ul>
      <div
        class="w-full px-4 py-1 text-[10px] border-t border-purple-50 text-purple-50 flex justify-between items-center"
      >
        <div class="flex items-center gap-1">
          <CalendarIcon class="w-4 h-4" />
          <p>{{ deadline }}</p>
        </div>
      </div>
    </div>
  </button>
</template>
