<script lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useWorkspaceStore, type BucketData } from '@/stores/workspace'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import ModalLayout from '@/components/common/layout/ModalLayout.vue'
import PencilEditIcon from '@/components/icons/PencilEditIcon.vue'
import PinIcon from '@/components/icons/PinnedIcon.vue'
import PinOutlineIcon from '@/components/icons/PinnedOutlineIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import SendArrowIcon from '@/components/icons/SendArrowIcon.vue'

export type TodoType = {
  id: number
  title: string
  assign: string[]
  status: 'pending' | 'processing' | 'completed'
  note: string
  checklist: CheckListType[]
  deadline: string
}
export type CheckListType = {
  id: number
  text: string
  isChecked: boolean
}

export default {
  components: {
    WorkspaceLayout,
    ModalLayout,
    PencilEditIcon,
    PinIcon,
    PinOutlineIcon,
    TrashIcon,
    SendArrowIcon,
  },
  setup() {
    const { params } = useRoute()
    const { workspaceId } = params
    const label_class = 'text-purple font-medium'
    const input_class = 'w-full h-12 px-4 rounded-sm bg-gypsum text-gray placeholder:text-gray-50'
    const workspaceStore = useWorkspaceStore()

    const isEditing = ref(false)
    const bucketId = ref('')
    const bucketTitle = ref('')

    const bucketToggle = ref(false)

    const initializedBucketData = () => {
      bucketTitle.value = ''
      bucketToggle.value = false
    }
    const handleBucketToggle = () => {
      if (bucketToggle.value) {
        initializedBucketData()
      } else {
        bucketToggle.value = true
      }
    }

    const handlCreatedBucket = async () => {
      const body = {
        title: bucketTitle.value,
      }

      const res = await workspaceStore.handleCreateBuckets(workspaceId as string, body)

      if (res.success) {
        toast.success(res.message)
        initializedBucketData()
      } else {
        toast.error(res.message)
      }
    }

    const enableEditing = (bucket: BucketData) => {
      isEditing.value = true
      bucketId.value = bucket._id
      bucketTitle.value = bucket.title
    }
    const saveEditingTitle = () => {
      isEditing.value = false
      bucketId.value = ''
      bucketTitle.value = ''
    }

    return {
      workspaceId,
      bucketId,
      label_class,
      input_class,
      isEditing,
      bucketTitle,
      bucketToggle,
      buckets: workspaceStore.buckets,
      handleBucketToggle,
      handlCreatedBucket,
      enableEditing,
      saveEditingTitle,
    }
  },
}
</script>

<template>
  <WorkspaceLayout mainTitle="代辦列表">
    <template #workspace>
      <div class="flex flex-col gap-6">
        <div class="w-1/2 lg:w-1/3">
          <button
            @click="handleBucketToggle"
            class="px-4 py-1 w-full rounded-md border text-purple-30 border-purple-30 border-dashed flex justify-center items-center font-bold hover:border-purple hover:text-purple"
          >
            + 新增資料夾
          </button>
        </div>
        <div class="flex flex-col gap-2">
          <div
            class="flex justify-between items-center px-4 py-1.5 rounded-sm bg-white shadow-md hover:bg-purple-30"
            v-for="bucket in buckets"
            :key="bucket._id"
          >
            <div @dblclick="enableEditing(bucket)">
              <div v-if="isEditing && bucketId === bucket._id" class="flex items-center gap-2">
                <PencilEditIcon class="w-5 h-5 text-purple" />
                <input
                  type="text"
                  v-model="bucketTitle"
                  class="border-b py-1 bg-gypsum"
                  @blur="saveEditingTitle"
                />
              </div>
              <div v-else class="flex items-center gap-3" title="雙點擊修改工作欄標題">
                <div class="flex items-center gap-2">
                  <button>
                    <PinIcon v-if="bucket.isPinned" class="w-4 h-4 text-purple" />
                    <PinOutlineIcon
                      v-else
                      class="w-4 h-4 text-purple opacity-0 hover:opacity-100"
                    />
                  </button>
                  <h5 class="font-bold">{{ bucket.title }}</h5>
                </div>
                <RouterLink
                  :to="`/workspace/${workspaceId}/todo/${bucket._id}`"
                  class="flex items-center gap-0.5 text-sm text-purple-50 hover:text-purple hover:underline hover:underline-offset-2"
                >
                  前往
                  <SendArrowIcon class="w-3 h-3 -rotate-45" />
                </RouterLink>
              </div>
            </div>
            <button>
              <TrashIcon class="w-4 h-4 text-purple opacity-0 hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </WorkspaceLayout>
  <ModalLayout title="新增工作欄" :toggle="bucketToggle" @update:toggle="handleBucketToggle">
    <template #modal>
      <VForm class="flex flex-col gap-8" v-slot="{ errors }" @submit="handlCreatedBucket">
        <div class="flex flex-col gap-0.5">
          <h5 :class="label_class">工作欄名稱</h5>
          <VField
            name="bucketTitle"
            type="string"
            rules="required|min:3|max:20"
            placeholder="TITLE"
            v-model="bucketTitle"
            :class="[input_class, { 'border border-error': errors.bucketTitle }]"
          />
          <ErrorMessage name="title" class="text-error text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="handleBucketToggle"
            type="button"
            class="bg-gray-30 text-white w-full rounded-sm text-center py-1.5"
          >
            取消
          </button>
          <button type="submit" class="bg-purple text-white w-full rounded-sm text-center py-1.5">
            新增
          </button>
        </div>
      </VForm>
    </template>
  </ModalLayout>
</template>
