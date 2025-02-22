import {
  createdWorkspaceTodo,
  deleteWorkspaceTodo,
  updatedTodoHorizonalPosition,
  updatedTodoVerticalPosition,
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
            return folder._id === folderId ? { ...folder, todos: [todo, ...folder.todos] } : folder
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
    async onSameFolderDragged(folderId: string, todoId: string, oldIdx: number, newIdx: number) {
      // const todos = folder?.todos
      // const todo = folder?.todos.find((t: any) => t._id === todoId)
      // todos.splice(oldIdx, 1)
      // todos.splice(newIdx, 0, todo)

      try {
        const res = await updatedTodoVerticalPosition(folderId, todoId, {
          newOrder: newIdx,
          oldOrder: oldIdx,
        })

        if (res?.success) {
          const data = res?.data
          const folder = this.folders.find((f) => f._id === folderId)
          if (folder) {
            const updated_todos = folder.todos.map((todo: any) => {
              const t = data.find((d: any) => d._id === todo._id)
              if (t) todo.order = t.order
              return todo
            })
            folder.todos = updated_todos.sort((a: any, b: any) => a.order - b.order)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onDiffFolderDragged(
      newFolderId: string,
      oldFolderId: string,
      todoId: string,
      payload: {
        oldFolderId: string
        newFolderId: string
        newOrder: number
        oldOrder: number
      },
    ) {
      try {
        const res = await updatedTodoHorizonalPosition(todoId, payload)

        if (res?.success) {
          const data = res?.data
          const { originalTodos, targetTodos } = data

          const reverseOriginalTodos = originalTodos.sort((a: any, b: any) => a.order - b.order)
          const reverseTargetTodos = targetTodos.sort((a: any, b: any) => a.order - b.order)

          const oldFolder = this.folders.find((folder) => folder._id === oldFolderId)
          const newFolder = this.folders.find((folder) => folder._id === newFolderId)
          if (oldFolder && newFolder) {
            oldFolder.todos = reverseOriginalTodos
            newFolder.todos = reverseTargetTodos
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
})
