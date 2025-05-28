import {
  createdWorkspaceTodo,
  deleteWorkspaceTodo,
  updatedFolderTodoPosition,
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
    async onEditTodo(folderId: string, todoId: string, payload: any): Promise<boolean> {
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
              const updated_todos = folder.todos.map((existingTodo: TodoFormatedType) => {
                if (existingTodo._id === todoId) {
                  return {
                    ...existingTodo,
                    ...todo,
                    assignments: updatedAssignments
                  }
                }
                return existingTodo
              })
              folder.todos = updated_todos
            }
            return folder
          })
          return true
        } else return false
      } catch (error) {
        console.log(error)
        return false
      }
    },
    onDragDataSet(folderId: string, todo: TodoFormatedType, idx: number) {
      this.sourceFolderId = folderId
      this.draggedTodo = todo
      this.draggedIdx = idx
    },

    async onTodoPositionUpdate(folderId: string, todos: string[]) {
      try {
        const res = await updatedTodoPosition(folderId, { todos })
        if (res?.success) {
          console.log('drag drop success (same folder)')
          // Update the local state to reflect the new order
          const folder = this.folders.find(f => f._id === folderId)
          if (folder) {
            // Reorder todos based on the new order
            const reorderedTodos = todos.map(id =>
              folder.todos.find((todo: TodoFormatedType) => todo._id === id)
            ).filter(Boolean) as TodoFormatedType[]

            // Update the folder with reordered todos
            this.folders = this.folders.map(f => {
              if (f._id === folderId) {
                return {
                  ...f,
                  todos: reorderedTodos
                }
              }
              return f
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onTodoFolderUpdate(sourceFolderId: string, targetFolderId: string, todoId: string, newIndex: number) {
      try {
        const res = await updatedFolderTodoPosition(todoId, {
          fromFolderId: sourceFolderId,
          toFolderId: targetFolderId,
          newIdx: newIndex
        })

        console.log(res)

        if (res?.success) {
          console.log('drag drop success (different folder)')
        }
      } catch (error) {
        console.log(error)
      }
    },
    onRemoveTodo(folderId: string, oldIndex: number) {
      // This is just a helper method to handle the UI update when a todo is removed
      const folder = this.folders.find((f) => f._id === folderId)
      if (!folder) return

      folder.todos.splice(oldIndex, 1)
      folder.todos.forEach((todo: TodoFormatedType, index: number) => {
        todo.order = index
      })
    }
  },
})
