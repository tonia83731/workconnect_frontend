<script lang="ts">
import CrossIcon from '@/components/icons/CrossIcon.vue'
import { onMounted, onUnmounted, ref } from 'vue'
export default {
  components: {
    CrossIcon,
  },
  props: {
    title: {
      type: String,
    },
    toggle: {
      type: Boolean,
    },
  },
  emit: ['update:toggle'],
  setup(props, { emit }) {
    const modalRef = ref<HTMLElement | null>(null)

    const handleToggleClickOutside = (event: MouseEvent) => {
      if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
        emit('update:toggle', false)
      }
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleToggleClickOutside)
    })
    onUnmounted(() => {
      document.removeEventListener('mousedown', handleToggleClickOutside)
    })

    return {
      modalRef,
      ...props,
    }
  },
}
</script>

<template>
  <div
    v-if="toggle"
    class="fixed top-0 left-0 z-[999] w-full h-screen bg-dark-60 flex justify-center items-center"
  >
    <div class="w-full h-screen relative">
      <div
        ref="modalRef"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md w-1/2 max-h-[400px]"
      >
        <div
          class="h-10 flex justify-between items-center py-1 px-4 rounded-t-md bg-midnight-forest text-white"
        >
          <h5 class="text-lg font-bold">{{ title }}</h5>
          <button @click="$emit('update:toggle', false)" class="opacity-50 hover:opacity-100">
            <CrossIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-4 py-2 h-full max-h-[360px] overflow-y-auto overflow-x-hidden scroll">
          <slot name="modal"></slot>
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
