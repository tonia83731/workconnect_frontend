<script lang="ts">
import CrossIcon from '@/components/icons/CrossIcon.vue'

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
    modalSize: {
      type: String,
      default: 'w-1/2 max-h-[400px]'
    },
    contentSize: {
      type: String,
      default: 'px-4 py-2 h-full max-h-[360px]'
    }
    // height: {
    //   type: String,
    //   default: 'max-h-[400px]'
    // }
  },
  emit: ['update:toggle'],
  data() {
    return {
      modalRef: null as HTMLElement | null,
    }
  },
  methods: {
    handleToggleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      const modalEl = this.$refs.modalRef as HTMLElement | undefined

      if (modalEl && !modalEl.contains(target)) {
        this.$emit('update:toggle', false)
      }
    },
  },
  mounted() {
    document.addEventListener('mousedown', this.handleToggleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleToggleClickOutside)
  },
}
</script>

<template>
  <div
    v-if="toggle"
    class="fixed top-0 left-0 z-[999] w-full h-screen bg-dark-60 flex justify-center items-center"
    @click.self="$emit('update:toggle', false)"
  >
    <div class="w-full h-screen relative">
      <div
        ref="modalRef"
        :class="[
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md',
          modalSize
        ]"
      >
        <div
          class="h-10 flex justify-between items-center py-1 px-4 rounded-t-md bg-midnight-forest text-white"
        >
          <h5 class="text-lg font-bold">{{ title }}</h5>
          <button @click="$emit('update:toggle', false)" class="opacity-50 hover:opacity-100">
            <CrossIcon class="w-5 h-5" />
          </button>
        </div>
        <div
          :class="[
            'overflow-y-auto overflow-x-hidden scroll',
            contentSize
          ]"
          @click.stop
        >
          <slot name="modal"></slot>
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
