<script lang="ts">
import { UserGroupIcon } from '@heroicons/vue/24/outline'
export default {
  components: {
    UserGroupIcon,
  },
  props: {
    id: { type: String },
    account: {
      type: String,
    },
    title: {
      type: String,
    },
    admin: {
      type: String,
    },
    member_num: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    return {
      ...props,
    }
  },
}
</script>

<template>
  <RouterLink
    :to="`/workspace/${id}/todo`"
    class="p-4 rounded-sm shadow-md bg-gypsum h-24 flex flex-col justify-between group hover:bg-teal-gray text-purple hover:text-white hover:shadow-lg"
  >
    <h5 class="font-bold text-lg">{{ title }}</h5>
    <div
      class="flex justify-between gap-2 items-center text-sm text-gray-50 group-hover:text-white"
    >
      <div class="flex items-center gap-1">
        {{ account }}
      </div>
      <div class="flex items-center gap-1">
        <UserGroupIcon class="w-4 h-4" />
        <p>{{ member_num }}</p>
      </div>
    </div>
  </RouterLink>
</template>
