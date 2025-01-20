import { axiosAuthFetch } from './index'
import { defaultURL } from './workspace'

const WORKBUCKET_URL = (workspaceId: string) => defaultURL('workbucket', workspaceId)

export const getWorkspaceBuckets = async (workspaceId: string) => {
  try {
    const url = WORKBUCKET_URL(workspaceId) + '/buckets'
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const createdWorkspaceBucket = async (workspaceId: string, payload: { title: string }) => {
  try {
    const url = WORKBUCKET_URL(workspaceId) + '/create-bucket'
    const response = await axiosAuthFetch('POST', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedWorkspaceBucket = async (
  workspaceId: string,
  bucketId: string,
  payload: {
    title: string
    isPinned: boolean
  },
) => {
  try {
    const url = WORKBUCKET_URL(workspaceId) + `/${bucketId}/update-bucket`
    const response = await axiosAuthFetch('PUT', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const deleteWorkspaceBucket = async (workspaceId: string, bucketId: string) => {
  try {
    const url = WORKBUCKET_URL(workspaceId) + `/${bucketId}/delete-bucket`
    const response = await axiosAuthFetch('DELETE', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
