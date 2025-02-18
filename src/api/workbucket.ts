import { axiosAuthFetch } from './index'
import { defaultURL } from './workspace'

const WORKBUCKET_URL = (workspaceAccount: string) => defaultURL('workbucket', workspaceAccount)

export const getWorkspaceBuckets = async (workspaceAccount: string) => {
  try {
    const url = WORKBUCKET_URL(workspaceAccount) + '/buckets'
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const getWorkspaceBucket = async (workspaceId: string, bucketId: string) => {
  try {
    const url = WORKBUCKET_URL(workspaceId) + `/${bucketId}/bucket-title`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const createdWorkspaceBucket = async (
  workspaceAccount: string,
  payload: { title: string },
) => {
  try {
    const url = WORKBUCKET_URL(workspaceAccount) + '/create-bucket'
    const response = await axiosAuthFetch('POST', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedWorkspaceBucket = async (
  // workspaceId: string,
  bucketId: string,
  payload: {
    title: string
    // isPinned: boolean
  },
) => {
  try {
    const url = `/workbucket/${bucketId}/update-bucket`
    const response = await axiosAuthFetch('PUT', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedPinnedWorkspaceBucket = async (bucketId: string) => {
  try {
    const url = `/workbucket/${bucketId}/update-bucket-pinned`
    const response = await axiosAuthFetch('PUT', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const deleteWorkspaceBucket = async (bucketId: string) => {
  try {
    const url = `/workbucket/${bucketId}/delete-bucket`
    const response = await axiosAuthFetch('DELETE', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
