<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import { getWorkspaceFoldersWithTodos } from '@/api/workfolder'

type FoldersType = {
  _id: string
  workspaceId: string
  workbucketId: string
  title: string
  innerFile: TodoType[]
  order: number
  createdAt: string
  updatedAt: string
}
export type TodoType = {
  _id: string
  title: string
  status: 'pending' | 'processing' | 'completed'
  deadline: number
  note: string
  assignments: AssignmentType[]
  checklists: CheckListType[]
}
export type CheckListType = {
  _id: string
  text: string
  isChecked: boolean
}
export type AssignmentType = {
  _id: string
  userId: {
    _id: string
    name: string
  }
}

export default {
  components: {
    WorkspaceLayout,
    // TodoGroup,
  },
  setup() {
    const router = useRouter()
    const { params } = useRoute()
    const { workspaceId, bucketId } = params
    const label_class = 'text-purple font-medium'
    const input_class = 'w-full h-12 px-4 rounded-sm bg-gypsum text-gray placeholder:text-gray-50'

    const folders = ref<FoldersType[]>([])
    const toggleType = ref<'create' | 'edit'>('create')
    // const folderToggle = ref(false)
    const title = ref('')
    // const todoToggle = ref(false)
    // const todoData = ref<TodoType>({
    //   id: 0,
    //   title: '',
    //   assign: [],
    //   status: 'pending',
    //   note: '',
    //   checklist: [],
    //   deadline: '',
    // })

    // const handleFolderToggle = (type: 'create' | 'edit', id?: number) => {
    //   toggleType.value = type

    //   if (!folderToggle.value && type === 'edit') {
    //     const item = folders.value.find((item) => item.id === id)
    //     if (item) title.value = item.title
    //   } else if (folderToggle.value) {
    //     title.value = ''
    //     toggleType.value = 'create'
    //   }

    //   folderToggle.value = !folderToggle.value
    // }

    // const handleFolderCreated = () => {
    //   const body = {
    //     id: Date.now(),
    //     title: title.value,
    //     createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
    //   }

    //   folders.value = [...folders.value, body]
    //   title.value = ''
    //   folderToggle.value = false
    // }

    // const handleFolderDelete = (id: number) => {
    //   // console.log(id)
    //   const updated_folders = folders.value.filter((item) => item.id !== id)
    //   folders.value = updated_folders
    // }

    const handleFolderOpen = (id: number) => {
      // console.log(id)
      // router.push({
      //   path: `/workspace/${params.account}/todo`,
      //   query: { folder_id: id.toString() },
      // })
      // todos.value = [
      //   {
      //     id: 1,
      //     title: 'Todo 1',
      //     innerFile: [
      //       {
      //         id: 1,
      //         title: 'Task 1',
      //         assign: ['Member1', 'Member2'], // Members assigned to the task
      //         status: 'pending', // Options: pending, processing, complete
      //         note: 'This is a note for task 1',
      //         checklist: [
      //           { id: 1, text: 'Check item 1', isChecked: false },
      //           { id: 2, text: 'Check item 2', isChecked: true },
      //         ],
      //         deadline: '2025-01-10', // Example deadline
      //       },
      //       {
      //         id: 2,
      //         title: 'Task 2',
      //         assign: ['Member3'],
      //         status: 'processing',
      //         note: 'This is a note for task 2',
      //         checklist: [
      //           { id: 1, text: 'Check item A', isChecked: true },
      //           { id: 2, text: 'Check item B', isChecked: false },
      //         ],
      //         deadline: '2025-01-15',
      //       },
      //     ],
      //   },
      //   {
      //     id: 2,
      //     title: 'Todo 2',
      //     innerFile: [
      //       {
      //         id: 1,
      //         title: 'Task A',
      //         assign: ['Member4'],
      //         status: 'completed',
      //         note: 'This is a note for task A',
      //         checklist: [
      //           { id: 1, text: 'Check item X', isChecked: true },
      //           { id: 2, text: 'Check item Y', isChecked: true },
      //         ],
      //         deadline: '2025-02-01',
      //       },
      //     ],
      //   },
      // ]
    }

    const handleGroupDelete = (id: number) => {
      // const updated_todos = todos.value.filter((item) => item.id !== id)
      // todos.value = updated_todos
    }
    const handleGroupAdded = () => {
      // const body = {
      //   id: Date.now(),
      //   title: '',
      //   innerFile: [],
      // }
      // todos.value = [...todos.value, body]
    }

    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(${todos.value.length + 1}, 250px)`,
    }))

    // -------------------- FETCH FOLDER/TODO DATA --------------------
    const fetchFoldersWithTodo = async () => {
      try {
        const data = await getWorkspaceFoldersWithTodos(workspaceId as string, bucketId as string)

        if (data?.success) {
          folders.value = data.data
        }
      } catch (error) {
        console.log(error)
      }
    }

    onMounted(() => {
      fetchFoldersWithTodo()
    })

    return {
      folders,
      // folderToggle,
      // todoToggle,
      // todoData,
      toggleType,
      title,
      label_class,
      input_class,
      workspaceId,
      bucketId,
      // handleFolderToggle,
      // handleFolderCreated,
      // handleFolderDelete,
      handleFolderOpen,
      handleGroupDelete,
      handleGroupAdded,
      gridStyle,
    }
  },
}
</script>

<template>
  <WorkspaceLayout
    mainTitle="代辦列表"
    :needLink="true"
    :pushLink="`/workspace/${workspaceId}/todo`"
  >
    <template #workspace>
      <div class="w-full h-full overflow-x-auto scroll">
        <div class="grid gap-4 h-full" :style="gridStyle">
          <!-- <TodoGroup
            v-for="group in folders"
            :key="group._id"
            :id="group._id"
            :title="group.title"
            :innerFile="group.innerFile"
            @delete-group="handleGroupDelete"
          /> -->
          <button
            @click="handleGroupAdded"
            class="w-full h-10 px-2 border border-dashed border-gypsum text-gypsum rounded-sm hover:border-purple hover:text-purple"
          >
            + 新增代辦事項群組
          </button>
        </div>
      </div>
    </template>
  </WorkspaceLayout>
</template>
