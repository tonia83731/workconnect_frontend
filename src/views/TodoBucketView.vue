<script lang="ts">
import { computed, onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todos'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import TodoGroup from '@/components/workspace-page/TodoGroup.vue'
import { getWorkspaceBucket } from '@/api/workbucket'

export default {
  components: {
    WorkspaceLayout,
    TodoGroup,
  },
  setup() {
    const todoStore = useTodoStore()
    const route = useRoute()

    const workspaceId = route.params.workspaceId as string
    const bucketId = computed(() => route.params.bucketId)

    const bucketTitle = reactive({ value: '' })

    // ------------------------ ABOUT FOLDERS ------------------------
    const handleAddedFolder = async () => {
      const body = {
        workbucketId: String(bucketId.value),
        title: '',
      }
      await todoStore.addedFolder(workspaceId, body)
    }

    const handleUpdatedFolder = async (folderId: string, title: string) => {
      await todoStore.updatedFolder(workspaceId, folderId, title)
    }

    const handleDeleteFolder = async (folderId: string) => {
      await todoStore.deletedFolder(workspaceId, folderId)
    }

    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(${todoStore.folders.length + 1}, 280px)`,
    }))

    const fetchWorkBucket = async (bucketId: string) => {
      try {
        const data = await getWorkspaceBucket(workspaceId, bucketId)

        if (data?.success) {
          bucketTitle.value = data?.data
          console.log(data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    watch(
      bucketId,
      async (newBucketId, oldBucketId) => {
        if (newBucketId && newBucketId !== oldBucketId) {
          await todoStore.fetchFoldersWithTodo(workspaceId, newBucketId as string)
          await fetchWorkBucket(newBucketId as string)
        }
      },
      { immediate: true },
    )

    onMounted(async () => {
      const workbucketId = typeof bucketId.value === 'string' ? bucketId.value : ''
      if (workbucketId) {
        await todoStore.fetchFoldersWithTodo(workspaceId, workbucketId)
        await fetchWorkBucket(workbucketId)
      }
    })

    return {
      folders: todoStore.folders,
      bucketTitle,
      gridStyle,
      handleAddedFolder,
      handleUpdatedFolder,
      handleDeleteFolder,
    }
  },
}
</script>

<template>
  <WorkspaceLayout mainTitle="代辦列表" :needLink="true" :pushTitle="bucketTitle.value">
    <!-- <template #workspace>
      <div class="w-full h-full overflow-x-auto scroll-horizonal">
        <div class="grid gap-4 h-full" :style="gridStyle">
          <TodoGroup
            v-for="folder in folders"
            :id="folder._id"
            :title="folder.title"
            :todos="folder.todos"
            :key="folder._id"
            @update-folder="handleUpdatedFolder"
            @delete-folder="handleDeleteFolder"
          />
          <button
            @click="handleAddedFolder"
            class="px-4 h-10 w-full rounded-md border text-ocean-teal-60 border-ocean-teal-60 border-dashed flex justify-center items-center font-bold hover:border-ocean-teal hover:text-ocean-teal"
          >
            + 新增群組
          </button>
        </div>
      </div>
    </template> -->
  </WorkspaceLayout>
</template>

<!-- https://www.npmjs.com/package/vue-draggable-next -->
<!-- https://sortablejs.github.io/vue.draggable.next/#/simple -->
