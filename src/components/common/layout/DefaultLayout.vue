<script lang="ts">
import DefaultHeader from '../DefaultHeader.vue'

export default {
  components: {
    DefaultHeader,
  },
}
</script>

<template>
  <DefaultHeader />
  <main class="max-w-7xl w-5/6 mx-auto xl:w-full pb-14">
    <div class="mt-[150px] flex flex-col gap-6">
      <slot></slot>
    </div>
    <RouterView />
  </main>
</template>
