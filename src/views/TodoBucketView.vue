<script lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todos'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import TodoGroup from '@/components/workspace-page/TodoGroup.vue'

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

    watch(
      bucketId,
      async (newBucketId, oldBucketId) => {
        if (newBucketId && newBucketId !== oldBucketId) {
          await todoStore.fetchFoldersWithTodo(workspaceId, newBucketId as string)
        }
      },
      { immediate: true },
    )

    onMounted(async () => {
      const workbucketId = typeof bucketId.value === 'string' ? bucketId.value : ''
      if (workbucketId) {
        await todoStore.fetchFoldersWithTodo(workspaceId, workbucketId)
      }
    })

    return {
      folders: todoStore.folders,
      gridStyle,
      handleAddedFolder,
      handleUpdatedFolder,
      handleDeleteFolder,
    }
  },
}
</script>

<template>
  <WorkspaceLayout mainTitle="代辦列表" :needLink="true">
    <!-- :pushLink="`/workspace/${workspaceId}/todo`" -->
    <template #workspace>
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
          <!-- @create-todo="handleCreatedTodo" -->
          <button
            @click="handleAddedFolder"
            class="px-4 h-10 w-full rounded-md border text-ocean-teal-60 border-ocean-teal-60 border-dashed flex justify-center items-center font-bold hover:border-ocean-teal hover:text-ocean-teal"
          >
            + 新增群組
          </button>
        </div>
      </div>
    </template>
  </WorkspaceLayout>
</template>
