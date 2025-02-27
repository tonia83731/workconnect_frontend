import {
  createdWorkspaceTodo,
  deleteWorkspaceTodo,
  updatedTodoPosition,
  updatedWorkspaceTodo,
} from '@/api/todo'
import {
  createdWorkspaceFolder,
  deleteWorkspaceFolder,
  updatedWorkspaceFolderTitle,
} from '@/api/workfolder'
import type { WorkfolderType } from '@/types/folders'
import type { MemberType } from '@/types/members'
import type { TodoCreateType, TodoFormatedType } from '@/types/todos'
import { defineStore } from 'pinia'

export const useFolderStore = defineStore('folders', {
  state: () => ({
    folders: [] as WorkfolderType[],
    members: [] as MemberType[],
    sourceFolderId: null as string | null,
    draggedTodo: null as TodoFormatedType | null,
    draggedIdx: null as number | null,
  }),
  persist: true,
  actions: {
    initializedFolders(folders: WorkfolderType[]) {
      this.folders = folders
    },
    initializedMembers(members: MemberType[]) {
      this.members = members
    },

    async onCreatedFolder(workspaceAccount: string, bucketId: string) {
      try {
        const res = await createdWorkspaceFolder(workspaceAccount as string, bucketId as string)
        if (res?.success) {
          const data = res?.data
          this.folders.push(data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onUpdatedFolder(folderId: string, folderTitle: string) {
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
    async onDeletedFolder(folderId: string) {
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
    async onCreatedTodo(folderId: string, payload: TodoCreateType): Promise<boolean> {
      try {
        const res = await createdWorkspaceTodo(folderId, payload)
        if (res?.success) {
          const todo = res?.data

          const updatedAssignments = todo.assignments.map((assign: any) => {
            const member = this.members.find((member) => member._id === assign.userId)
            return member
              ? {
                  userId: member._id,
                  name: member.name,
                  bgColor: member.bgColor,
                  textColor: member.textColor,
                }
              : assign
          })
          todo.assignments = updatedAssignments

          const updated_folders = this.folders.map((folder) => {
            return folder._id === folderId ? { ...folder, todos: [...folder.todos, todo] } : folder
          })
          this.folders = updated_folders
          return true
        }
        return false
      } catch (error) {
        console.log(error)
        return false
      }
    },
    async onDeletedTodo(folderId: string, todoId: string): Promise<boolean> {
      try {
        const res = await deleteWorkspaceTodo(folderId, todoId)
        if (res?.success) {
          this.folders = this.folders.map((folder) => {
            if (folder._id === folderId) {
              folder.todos = folder.todos.filter((todo: TodoFormatedType) => todo._id !== todoId)
            }
            return folder
          })
          return true
        }
        return false
      } catch (error) {
        console.log(error)
        return false
      }
    },
    async onEditTodo(folderId: string, todoId: string, payload: any) {
      try {
        const res = await updatedWorkspaceTodo(todoId as string, payload)
        if (res?.success) {
          const todo = res?.data

          const updatedAssignments = todo.assignments.map((assign: any) => {
            const member = this.members.find((member) => member._id === assign.userId)
            return member
              ? {
                  userId: member._id,
                  name: member.name,
                  bgColor: member.bgColor,
                  textColor: member.textColor,
                }
              : assign
          })
          todo.assignments = updatedAssignments

          this.folders = this.folders.map((folder) => {
            if (folder._id === folderId) {
              const updated_todos = folder.todos.map((todo: TodoFormatedType) => {
                return todo._id === todoId ? todo : todo
              })
              folder.todos = updated_todos
            }
            return folder
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    onDragDataSet(folderId: string, todo: TodoFormatedType, idx: number) {
      this.sourceFolderId = folderId
      this.draggedTodo = todo
      this.draggedIdx = idx
    },
    async onMovedTodo(targetFolderId: string, targetIdx: number) {
      const currFolder = this.folders.find((f) => f._id === this.sourceFolderId)
      const targetFolder = this.folders.find((f) => f._id === targetFolderId)

      if (!currFolder || !targetFolder) return
      console.log('trigger')

      const isSameFolder = this.sourceFolderId === targetFolderId

      if (!isSameFolder) {
        this.draggedTodo = this.draggedTodo && {
          ...this.draggedTodo,
          workfolderId: targetFolderId,
        }

        currFolder.todos.splice(this.draggedIdx, 1)
        targetFolder.todos.splice(targetIdx, 0, this.draggedTodo)

        currFolder.todos.forEach((todo: TodoFormatedType, index: number) => {
          todo.order = index
        })

        targetFolder.todos.forEach((todo: TodoFormatedType, index: number) => {
          todo.order = index
        })

        // passed data to backend: folderId, [todoId, order]
        const curr_todo_arr = currFolder.todos.map((todo: TodoFormatedType) => ({
          _id: todo._id,
          order: todo.order,
        }))
        const target_todo_arr = targetFolder.todos.map((todo: TodoFormatedType) => ({
          _id: todo._id,
          order: todo.order,
        }))

        const todo_arr = [...curr_todo_arr, ...target_todo_arr]

        try {
          const res = await updatedTodoPosition(
            this.sourceFolderId as string,
            targetFolderId,
            this.draggedTodo?._id as string,
            { todos: todo_arr },
          )
          if (res?.success) {
            this.folders = this.folders.map((folder) => {
              if (folder._id === this.sourceFolderId) {
                return { ...folder, todos: [...currFolder.todos] }
              }
              if (folder._id === targetFolderId) {
                return { ...folder, todos: [...targetFolder.todos] }
              }
              return folder
            })
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        currFolder.todos.splice(this.draggedIdx, 1)
        currFolder.todos.splice(targetIdx, 0, this.draggedTodo)

        currFolder.todos.forEach((todo: TodoFormatedType, index: number) => {
          todo.order = index
        })

        // passed data to backend: folderId, [todoId, order]
        const todo_arr = currFolder.todos.map((todo: TodoFormatedType) => ({
          _id: todo._id,
          order: todo.order,
        }))

        try {
          const res = await updatedTodoPosition(
            this.sourceFolderId as string,
            targetFolderId,
            this.draggedTodo?._id as string,
            { todos: todo_arr },
          )
          if (res?.success) {
            this.folders = this.folders.map((folder) => {
              if (folder._id === this.sourceFolderId) {
                return { ...folder, todos: [...currFolder.todos] }
              }
              return folder
            })
          }
        } catch (error) {
          console.log(error)
        }
      }

      this.sourceFolderId = null
      this.draggedTodo = null
      this.draggedIdx = null
    },
  },
})
