<script lang="ts">
import { reactive } from 'vue'
import {
  createdWorkspaceFolder,
  deleteWorkspaceFolder,
  getWorkspaceFolders,
  // getWorkspaceFoldersWithTodos,
  updatedWorkspaceFolderTitle,
} from '@/api/workfolder'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import TodoFolder from '@/components/workspace-page/TodoFolder.vue'
import type { WorkfolderType } from '@/types/folders'

export default {
  components: {
    WorkspaceLayout,
    TodoFolder,
  },
  data() {
    return {
      folders: reactive([] as WorkfolderType[]),
    }
  },
  methods: {
    async fecthWorkfolders(bucketId: string) {
      try {
        const res = await getWorkspaceFolders(bucketId)

        if (res?.success) {
          const data = res?.data
          // console.log(data)
          this.folders = data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleCreatedFolder() {
      try {
        const res = await createdWorkspaceFolder(
          this.workspaceAccount as string,
          this.bucketId as string,
        )
        if (res?.success) {
          const data = res?.data
          this.folders.push(data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleUpdatedFolderTitle(folderId: string, folderTitle: string) {
      try {
        const res = await updatedWorkspaceFolderTitle(folderId, {
          title: folderTitle,
        })

        if (res?.success) {
          const updated_folders = this.folders.map((folder) => {
            return folder._id === folderId ? { ...folder, title: folderTitle } : folder
          })
          this.folders = updated_folders
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleDeletedFolder(folderId: string) {
      try {
        const res = await deleteWorkspaceFolder(folderId)
        if (res?.success) {
          const updated_folders = this.folders.filter((folder) => folder._id !== folderId)
          this.folders = updated_folders
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    if (this.bucketId) {
      this.fecthWorkfolders(this.bucketId as string)
    }
  },
  computed: {
    workspaceAccount() {
      return this.$route.params.account
    },
    bucketId() {
      return this.$route.params.bucketId
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
        this.fecthWorkfolders(newBucketId)
      }
    },
  },
}
</script>

<template>
  <WorkspaceLayout mainTitle="代辦列表">
    <template #workspace>
      <div class="w-full h-full overflow-x-auto scroll-horizonal">
        <div class="grid gap-4 h-full" :style="gridStyle">
          <TodoFolder
            v-for="folder in folders"
            :key="folder._id"
            :id="folder._id"
            :title="folder.title"
            @updated-folder="handleUpdatedFolderTitle"
            @deleted-folder="handleDeletedFolder"
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

<!-- https://www.npmjs.com/package/vue-draggable-next -->
<!-- https://sortablejs.github.io/vue.draggable.next/#/simple -->
