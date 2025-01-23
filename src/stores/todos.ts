import { defineStore } from 'pinia'
import { reactive } from 'vue'
import {
  getWorkspaceFoldersWithTodos,
  createdWorkspaceFolder,
  updatedWorkspaceFolderTitle,
  deleteWorkspaceFolder,
} from '@/api/workfolder'
import { createdWorkspaceTodo, updatedWorkspaceTodo, deleteWorkspaceTodo } from '@/api/todo'
import { type TodoFullType } from '@/api/todo'

type FoldersType = {
  _id: string
  workspaceId: string
  workbucketId: string
  title: string
  todos: TodoType[]
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
  order: number
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

export const useTodoStore = defineStore('todo', () => {
  const folders = reactive<FoldersType[]>([])

  const addedTodo = async (
    workspaceId: string,
    folderId: string,
    body: {
      title: string
      deadline?: number
      assignments?: { userId: string }[]
    },
  ) => {
    try {
      const data = await createdWorkspaceTodo(workspaceId, folderId, body)

      if (!data?.success)
        return {
          success: false,
          message: '新增代辦事項失敗，請在試一次',
        }

      const folder = folders.find((f) => f._id === folderId)
      if (folder) {
        folder?.todos.unshift(data?.data)
        return {
          success: true,
          message: '新增代辦事項成功',
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const updatedTodo = async (workspaceId: string, todoId: string, body: TodoFullType) => {
    const folderId = body.workfolderId
    try {
      const data = await updatedWorkspaceTodo(workspaceId, todoId, body)

      if (data?.success) {
        const folder = folders.find((f) => f._id === folderId)
        if (folder) {
          folder.todos = folder.todos.map((todo) => (todo._id === todoId ? data?.data : todo))
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const deletedTodo = async (workspaceId: string, folderId: string, todoId: string) => {
    try {
      const data = await deleteWorkspaceTodo(workspaceId, folderId, todoId)
      if (data?.success) {
        const folder = folders.find((f) => f._id === folderId)
        if (folder) {
          const index = folder.todos.findIndex((t) => t._id === todoId)
          if (index !== -1) {
            folder.todos.splice(index, 1)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // -------------------- ABOUT FOLDER --------------------
  const addedFolder = async (
    workspaceId: string,
    body: {
      workbucketId: string
      title: string
    },
  ) => {
    try {
      const data = await createdWorkspaceFolder(workspaceId, body)
      if (data?.success) {
        folders.push(data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const updatedFolder = async (workspaceId: string, folderId: string, title: string) => {
    try {
      const data = await updatedWorkspaceFolderTitle(workspaceId, folderId, { title })
      if (data?.success) {
        const folder = folders.find((f) => f._id === folderId)
        if (folder) {
          folder.title = title
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const deletedFolder = async (workspaceId: string, folderId: string) => {
    try {
      const data = await deleteWorkspaceFolder(workspaceId, folderId)
      if (data?.success) {
        const index = folders.findIndex((folder) => folder._id === folderId)
        if (index !== -1) {
          folders.splice(index, 1)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // -------------------- FETCH FOLDER/TODO DATA --------------------
  const fetchFoldersWithTodo = async (workspaceId: string, bucketId: string) => {
    try {
      const data = await getWorkspaceFoldersWithTodos(workspaceId, bucketId)

      if (data?.success) {
        folders.splice(0, folders.length, ...data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    folders,
    addedTodo,
    updatedTodo,
    deletedTodo,
    addedFolder,
    updatedFolder,
    deletedFolder,
    fetchFoldersWithTodo,
  }
})
