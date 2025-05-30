import { axiosAuthFetch } from './index'

type TodoBasicType = {
  title: string
  deadline?: number | null
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

export type TodoEditType = TodoBasicType & {
  workfolderId?: string
  status: string
  note?: string
  checklists?: {
    isChecked: boolean
    text: string
  }[]
}

export const getWorkfolderTodos = async (workfolderId: string) => {
  try {
    const url = `/todo/${workfolderId}/folder-todos`
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

export const updatedWorkspaceTodo = async (todoId: string, payload: TodoEditType) => {
  try {
    const url = `/todo/${todoId}/update-todo`
    const response = await axiosAuthFetch('PUT', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedTodoPosition = async (
  folderId: string,
  payload: {
    todos: string[]
  }
) => {
  try {
    const url = `/todo/${folderId}/updated-position`
    const response = await axiosAuthFetch('PATCH', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedFolderTodoPosition = async (todoId: string, payload: {
  fromFolderId: string
  toFolderId: string
  newIdx: number
}) => {
  try {
  const url = `/todo/${todoId}/relocate-todo`
  const response = await axiosAuthFetch('PATCH', url, payload)
  return response?.data
  } catch(error) {
    console.log(error)
  }
}


export const deleteWorkspaceTodo = async (workfolderId: string, todoId: string) => {
  try {
    const url = `/todo/${workfolderId}/${todoId}/delete-todo`
    const response = await axiosAuthFetch('DELETE', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
