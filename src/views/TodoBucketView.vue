<script lang="ts">
import { getWorkspaceBucket } from '@/api/workbucket'
import { getWorkspaceFoldersWithTodos } from '@/api/workfolder'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import TodoFolder from '@/components/workspace-page/TodoFolder.vue'
import { useFolderStore } from '@/stores/folders'
import type { WorkfolderType } from '@/types/folders'
import type { AssignmentType } from '@/types/todos'
// import draggable from 'vuedraggable'

const folderStore = useFolderStore()

export default {
  components: {
    WorkspaceLayout,
    TodoFolder,
  },
  data() {
    return {
      bucketName: '',
    }
  },
  methods: {
    // 取得當前Bucket名稱
    async fetchBucketTitle(bucketId: string) {
      try {
        const res = await getWorkspaceBucket(bucketId)
        if (res?.success) {
          this.bucketName = res?.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 取得當前Bucket的Folders資料
    async fetchWorkfoldersWithTodos(bucketId: string) {
      try {
        const res = await getWorkspaceFoldersWithTodos(bucketId)

        if (res?.success) {
          const data = res?.data

          const formated_folders = data.map((folder: WorkfolderType) => {
            const todos = folder.todos.map((todo) => {
              const assignments = todo.assignments.map((a: AssignmentType) => ({
                userId: a.userId._id,
                name: a.userId.name,
                bgColor: a.userId.bgColor,
                textColor: a.userId.textColor,
              }))
              return {
                ...todo,
                assignments,
              }
            })
            return {
              ...folder,
              todos,
            }
          })
          folderStore.initializedFolders(formated_folders)
        }
      } catch (error) {
        console.log(error)
      }
    },

    // --------------------------------------------------------------------------------
    // 新增Folder
    handleCreatedFolder() {
      folderStore.onCreatedFolder(this.workspaceAccount as string, this.bucketId as string)
    },
  },
  mounted() {
    if (this.bucketId) {
      this.fetchBucketTitle(this.bucketId as string)
      this.fetchWorkfoldersWithTodos(this.bucketId as string)
    }
  },
  computed: {
    workspaceAccount() {
      return this.$route.params.account
    },
    bucketId() {
      return this.$route.params.bucketId
    },
    folders() {
      return folderStore.folders
    },
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.folders.length + 1}, 280px)`,
      }
    },
  },
  watch: {
    bucketId(newBucketId, currBucketId) {
      if (newBucketId && newBucketId !== currBucketId) {
        this.fetchBucketTitle(newBucketId)
        this.fetchWorkfoldersWithTodos(newBucketId)
      }
    },
  },
}
</script>

<template>
  <WorkspaceLayout :mainTitle="`代辦列表: ${bucketName}`">
    <template #workspace>
      <div class="w-full h-full overflow-x-auto scroll-horizonal">
        <div class="grid gap-4 h-full" @dragover.prevent :style="gridStyle">
          <TodoFolder
            v-for="folder in folders"
            :key="folder._id"
            :id="folder._id"
            :title="folder.title"
            :todos="folder.todos || []"
          />
          <button
            @click="handleCreatedFolder"
            class="px-4 h-10 rounded-md border text-ocean-teal-60 border-ocean-teal-60 border-dashed flex justify-center items-center font-bold hover:border-ocean-teal hover:text-ocean-teal"
          >
            + 新增群組
          </button>
        </div>
      </div>
    </template>
  </WorkspaceLayout>
</template>
