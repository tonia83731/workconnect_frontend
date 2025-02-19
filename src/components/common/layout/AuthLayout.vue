<script lang="ts">
export default {}
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <main class="max-w-4xl w-4/6 mx-auto lg:w-1/2 flex flex-col gap-8">
      <slot></slot>
      <RouterView />
    </main>
  </div>
</template>
