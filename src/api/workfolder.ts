import { axiosAuthFetch } from './index'
import { defaultURL } from './workspace'

const WORKFOLDER_URL = (workspaceId: string) => defaultURL('workfolder', workspaceId)

export const getWorkspaceFolders = async (workbucektId: string) => {
  try {
    const url = `/workfolder/${workbucektId}/folders`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const getWorkspaceFoldersWithTodos = async (workbucektId: string) => {
  try {
    const url = `/workfolder/${workbucektId}/folders-and-todos`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const createdWorkspaceFolder = async (workspaceAccount: string, worksbucketId: string) => {
  try {
    const url = `/workfolder/${workspaceAccount}/${worksbucketId}/create-folder`
    const response = await axiosAuthFetch('POST', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedWorkspaceFolderTitle = async (
  folderId: string,
  payload: {
    title: string
  },
) => {
  try {
    const url = `/workfolder/${folderId}/updated-folder-title`
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

export const deleteWorkspaceFolder = async (folderId: string) => {
  try {
    const url = `/workfolder/${folderId}/delete-folder`
    const response = await axiosAuthFetch('DELETE', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
