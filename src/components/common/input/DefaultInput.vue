<script lang="ts">
export default {
  props: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: null,
    },
    onInputChange: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const handleInputChange = (e: Event) => {
      const { name, value } = e.target as HTMLInputElement
      emit('update:modelValue', value)
      props.onInputChange(name, value)
    }
    return {
      handleInputChange,
      ...props,
    }
  },
}
</script>

<template>
  <div :class="label !== '' && 'flex flex-col gap-2'">
    <label :for="id" v-if="label !== ''" class="text-purple font-medium">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      class="w-full h-12 px-4 rounded-sm bg-gypsum text-gray placeholder:text-gray-50"
      @input="handleInputChange"
    />
  </div>
</template>
