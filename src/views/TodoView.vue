<script lang="ts">
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import ModalLayout from '@/components/common/layout/ModalLayout.vue'
import PencilEditIcon from '@/components/icons/PencilEditIcon.vue'
import PinIcon from '@/components/icons/PinnedIcon.vue'
import PinOutlineIcon from '@/components/icons/PinnedOutlineIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import { inputClass, labelClass } from '@/styles/input-style'
import {
  createdWorkspaceBucket,
  deleteWorkspaceBucket,
  updatedPinnedWorkspaceBucket,
  updatedWorkspaceBucket,
} from '@/api/workbucket'
import { useBucketStore } from '@/stores/bucket'

const bucketStore = useBucketStore()

export default {
  components: {
    WorkspaceLayout,
    ModalLayout,
    PencilEditIcon,
    PinIcon,
    PinOutlineIcon,
    TrashIcon,
  },
  data() {
    return {
      label_class: labelClass,
      input_class: inputClass(),
      bucketToggle: false,
      bucketTitle: '',
      editToggle: false,
      bucketEdit: {
        id: '',
        title: '',
      },
      // buckets: bucketStore.buckets,
    }
  },
  methods: {
    handleBucketToggle() {
      this.bucketToggle = !this.bucketToggle
      if (!this.bucketToggle) {
        this.bucketTitle = ''
      }
    },
    async handlCreatedBucket() {
      // const account = this.$route.params.account
      try {
        const res = await createdWorkspaceBucket(this.workspaceAccount as string, {
          title: this.bucketTitle,
        })

        if (res?.success) {
          const data = res?.data
          this.buckets = [...this.buckets, data]
          bucketStore.updatedBuckets([...this.buckets, data])
          this.bucketToggle = false
          this.bucketTitle = ''
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleBucketPinned(bucketId: string) {
      try {
        const res = await updatedPinnedWorkspaceBucket(bucketId)
        if (res?.success) {
          const data = res?.data
          // console.log(data)
          const updated_buckets = this.buckets.map((bucket) => {
            return bucket._id === bucketId ? data : bucket
          })
          this.buckets = updated_buckets
          bucketStore.updatedBuckets(updated_buckets)

          const pinned_buckets = updated_buckets.filter((bucket) => bucket.isPinned)
          bucketStore.updatedPinnedBuckets(pinned_buckets)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleEditToggle(bucketId: string, title: string) {
      this.editToggle = !this.editToggle
      if (this.editToggle) {
        this.bucketEdit = {
          id: bucketId,
          title,
        }
      } else {
        if (this.bucketEdit.title === title) return
        try {
          const res = await updatedWorkspaceBucket(bucketId, { title: this.bucketEdit.title })

          if (res?.success) {
            const data = res?.data
            const updated_buckets = this.buckets.map((bucket) => {
              return bucket._id === bucketId ? data : bucket
            })
            this.buckets = updated_buckets
            bucketStore.updatedBuckets(updated_buckets)
            const pinned_buckets = updated_buckets.filter((bucket) => bucket.isPinned)
            bucketStore.updatedPinnedBuckets(pinned_buckets)
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    async handleBucketDeleted(bucketId: string) {
      try {
        const res = await deleteWorkspaceBucket(bucketId)

        if (res?.success) {
          const updated_buckets = this.buckets.filter((bucket) => bucket._id !== bucketId)
          this.buckets = updated_buckets
          bucketStore.updatedBuckets(updated_buckets)
          const pinned_buckets = updated_buckets.filter((bucket) => bucket.isPinned)
          bucketStore.updatedPinnedBuckets(pinned_buckets)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  computed: {
    buckets() {
      return bucketStore.buckets
    },
    workspaceAccount() {
      return this.$route.params.account
    },
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
            class="px-4 py-1 w-full rounded-md border text-ocean-teal-60 border-ocean-teal-60 border-dashed flex justify-center items-center font-bold hover:border-ocean-teal hover:text-ocean-teal"
          >
            + 新增Bucket
          </button>
        </div>
        <div class="flex flex-col gap-4">
          <div
            class="bg-white text-midnight-forest rounded-sm p-4"
            v-for="bucket in buckets"
            :key="bucket._id"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <button class="" @click="handleBucketPinned(bucket._id)">
                  <PinIcon v-if="bucket.isPinned" class="w-4 h-4" />
                  <PinOutlineIcon v-else class="w-4 h-4 opacity-50 hover:opacity-100" />
                </button>
                <input
                  v-if="editToggle && bucketEdit.id === bucket._id"
                  :class="input_class"
                  class="border-b-2 border-midnight-forest"
                  type="text"
                  v-model="bucketEdit.title"
                />
                <RouterLink
                  v-else
                  :to="`/workspace/${workspaceAccount}/todo/${bucket._id}`"
                  class="text-lg font-bold"
                  >{{ bucket.title }}</RouterLink
                >
              </div>
              <div class="flex items-center gap-2">
                <button
                  :class="editToggle ? 'opacity-100' : 'opacity-50 hover:opacity-100'"
                  @click="handleEditToggle(bucket._id, bucket.title)"
                >
                  <PencilEditIcon class="w-5 h-5" />
                </button>
                <button
                  class="opacity-50 hover:opacity-100"
                  @click="handleBucketDeleted(bucket._id)"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </WorkspaceLayout>
  <ModalLayout title="新增Bucket" :toggle="bucketToggle" @update:toggle="handleBucketToggle">
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
          <ErrorMessage name="bucketTitle" class="text-error text-sm" />
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
