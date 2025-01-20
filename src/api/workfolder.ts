import { axiosAuthFetch } from './index'
import { defaultURL } from './workspace'

const WORKFOLDER_URL = (workspaceId: string) => defaultURL('workfolder', workspaceId)

export const getWorkspaceFolders = async (workspaceId: string, workbucektId: string) => {
  try {
    const url = WORKFOLDER_URL(workspaceId) + `/${workbucektId}/folders`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const getWorkspaceFoldersWithTodos = async (workspaceId: string, workbucektId: string) => {
  try {
    const url = WORKFOLDER_URL(workspaceId) + `/${workbucektId}/folders-and-todos`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const createdWorkspaceFolder = async (
  workspaceId: string,
  payload: {
    workbucketId: string
    title: string
  },
) => {
  try {
    const url = WORKFOLDER_URL(workspaceId) + '/create-folder'
    const response = await axiosAuthFetch('POST', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedWorkspaceFolderTitle = async (
  workspaceId: string,
  folderId: string,
  payload: {
    title: string
  },
) => {
  try {
    const url = WORKFOLDER_URL(workspaceId) + `/${folderId}/updated-folder-title`
    const response = await axiosAuthFetch('PUT', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedWorkspaceFolderPosition = async (
  workspaceId: string,
  folderId: string,
  payload: {
    workbucketId: string
    updatedOrder: number
  },
) => {
  try {
    const url = WORKFOLDER_URL(workspaceId) + `/${folderId}/updated-folder-title`
    const response = await axiosAuthFetch('PUT', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const deleteWorkspaceFolder = async (workspaceId: string, folderId: string) => {
  try {
    const url = WORKFOLDER_URL(workspaceId) + `/${folderId}/delete-folder`
    const response = await axiosAuthFetch('DELETE', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
