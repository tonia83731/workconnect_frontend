<script lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import { useWorkspaceStore, type BucketData } from '@/stores/workspace'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import ModalLayout from '@/components/common/layout/ModalLayout.vue'
import PencilEditIcon from '@/components/icons/PencilEditIcon.vue'
import PinIcon from '@/components/icons/PinnedIcon.vue'
import PinOutlineIcon from '@/components/icons/PinnedOutlineIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import ArrowLongRightIcon from '@/components/icons/ArrowLongRightIcon.vue'
import FolderIcon from '@/components/icons/FolderIcon.vue'
import { input_class, label_class } from '@/data/input-style'

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
    ArrowLongRightIcon,
    FolderIcon,
  },
  setup() {
    const { params } = useRoute()
    const { workspaceId } = params
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

    const formatDate = (date: string) => {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    }

    return {
      workspaceId,
      bucketId,
      label_class,
      input_class: input_class(),
      isEditing,
      bucketTitle,
      bucketToggle,
      buckets: workspaceStore.buckets,
      handleBucketToggle,
      handlCreatedBucket,
      enableEditing,
      saveEditingTitle,
      formatDate,
    }
  },
}
</script>

<template>
  <WorkspaceLayout mainTitle="代辦列表">
    <template #workspace>
      <div class="flex flex-col gap-6">
        <!-- 新增工作方案 -->
        <div class="w-1/2 lg:w-1/3">
          <button
            @click="handleBucketToggle"
            class="px-4 py-1 w-full rounded-md border text-ocean-teal-60 border-ocean-teal-60 border-dashed flex justify-center items-center font-bold hover:border-ocean-teal hover:text-ocean-teal"
          >
            + 新增工作方案
          </button>
        </div>
        <!-- 資料夾列表 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
          <div class="relative" v-for="bucket in buckets" :key="bucket._id">
            <div
              class="w-full p-4 flex flex-col gap-2 justify-between bg-gradient-to-r from-ocean-teal to-transparent text-midnight-forest"
            >
              <div class="flex flex-col gap-1">
                <!-- PIN & TITLE -->
                <div @dblclick="enableEditing(bucket)">
                  <div class="flex items-center gap-2" v-if="isEditing && bucketId === bucket._id">
                    <PencilEditIcon class="w-5 h-5 text-soft-aqua" />
                    <input
                      type="text"
                      v-model="bucketTitle"
                      class="border-b border-soft-aqua py-1 bg-transparent text-soft-aqua font-bold"
                      @blur="saveEditingTitle"
                    />
                  </div>
                  <div class="flex items-center gap-2" title="雙點擊修改工作欄標題" v-else>
                    <button>
                      <PinIcon v-if="bucket.isPinned" class="w-4 h-4 text-white" />
                      <PinOutlineIcon
                        v-else
                        class="w-4 h-4 text-white opacity-0 hover:opacity-100"
                      />
                    </button>
                    <h5 class="font-bold text-white">{{ bucket.title }}</h5>
                  </div>
                </div>
                <!-- CONTENT -->
                <div class="flex flex-col justify-end text-xs text-midnight-forest pb-4">
                  <div class="flex items-center justify-end gap-1">
                    <FolderIcon class="w-4 h-4" />
                    <p class="">{{ bucket.folderCount }}個資料夾</p>
                  </div>
                  <div class="text-end">最後更新時間: {{ formatDate(bucket.updatedAt) }}</div>
                </div>
              </div>
              <button>
                <TrashIcon class="w-5 h-5 text-white" />
              </button>
            </div>
            <RouterLink
              class="absolute -bottom-2 -right-2 group hover:shadow-md flex items-center gap-0.5 bg-golder-amber text-midnight-forest font-medium px-4 py-2 w-fit rounded-tl-2xl rounded-br-2xl"
              :to="`/workspace/${workspaceId}/todo/${bucket._id}`"
            >
              <p class="">前往TODO列表</p>
              <ArrowLongRightIcon class="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </RouterLink>
          </div>
        </div>
      </div>
    </template>
  </WorkspaceLayout>
  <ModalLayout title="新增工作方案" :toggle="bucketToggle" @update:toggle="handleBucketToggle">
    <template #modal>
      <VForm class="flex flex-col gap-8" v-slot="{ errors }" @submit="handlCreatedBucket">
        <div class="flex flex-col gap-0.5">
          <h5 :class="label_class">工作方案名稱</h5>
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
            class="bg-muted-gray text-white w-full rounded-sm text-center py-1.5"
          >
            取消
          </button>
          <button
            type="submit"
            class="bg-midnight-forest text-white w-full rounded-sm text-center py-1.5"
          >
            新增
          </button>
        </div>
      </VForm>
    </template>
  </ModalLayout>
</template>
