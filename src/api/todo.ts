import { axiosAuthFetch } from './index'
import { defaultURL } from './workspace'

const TODO_URL = (workspaceId: string) => defaultURL('todo', workspaceId)

type TodoBasicType = {
  title: string
  deadline?: number
  assignments?: {
    userId: string
  }[]
}

export type TodoFullType = TodoBasicType & {
  workfolderId?: string
  status: 'pending' | 'processing' | 'completed'
  note?: string
  checklists?: {
    isChecked: boolean
    text: string
  }[]
  order?: number
}

export const getWorkbucketTodos = async (workbucketId: string) => {
  try {
    const url = `/todo/${workbucketId}/bucket-todos`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const getWorkspaceTodo = async (todoId: string) => {
  try {
    const url = `/todo/${todoId}/todo-item`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const createdWorkspaceTodo = async (workfolderId: string, payload: TodoBasicType) => {
  try {
    const url = `/todo/${workfolderId}/create-todo`
    const response = await axiosAuthFetch('POST', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedWorkspaceTodo = async (
  workspaceId: string,
  todoId: string,
  payload: TodoFullType,
) => {
  try {
    const url = TODO_URL(workspaceId) + `/${todoId}/update-todo`
    const response = await axiosAuthFetch('PUT', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedTodoPosition = async (
  workspaceId: string,
  todoId: string,
  payload: {
    workfolderId: string
    updatedOrder: number
  },
) => {
  try {
    const url = TODO_URL(workspaceId) + `/${todoId}/positions`
    const response = await axiosAuthFetch('PUT', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const deleteWorkspaceTodo = async (
  workspaceId: string,
  workfolderId: string,
  todoId: string,
) => {
  try {
    const url = TODO_URL(workspaceId) + `/${workfolderId}/${todoId}/delete-todo`
    const response = await axiosAuthFetch('DELETE', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
