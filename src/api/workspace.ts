import { axiosAuthFetch } from './index'

export const defaultURL = (
  type: 'chat' | 'workspace' | 'workbucket' | 'workfolder' | 'todo',
  workspaceAccount: string,
) => `/${type}/${workspaceAccount}`

const WORKSPACE_URL = (workspaceId: string) => defaultURL('workspace', workspaceId)

export const createdWorkspace = async (payload: { account: string; title: string }) => {
  try {
    const respnose = await axiosAuthFetch('POST', '/create-workspace', payload)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}

export const checkedWorkspaceAccount = async (payload: { account: string }) => {
  try {
    const respnose = await axiosAuthFetch('POST', '/checked-workspace-account', payload)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}

export const getWorkspaceMembers = async (workspaceAccount: string) => {
  try {
    const url = `/workspace/${workspaceAccount}/members`
    const respnose = await axiosAuthFetch('GET', url)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}

export const addWorkspaceMembers = async (workspaceAccount: string, payload: { email: string }) => {
  try {
    const url = `/workspace/${workspaceAccount}/invite-member`
    const respnose = await axiosAuthFetch('PUT', url, payload)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}
export const cancelledInvitations = async (
  workspaceAccount: string,
  payload: { email: string },
) => {
  try {
    const url = `/workspace/${workspaceAccount}/cancel-invite`
    const respnose = await axiosAuthFetch('PUT', url, payload)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}

export const removeWorkspaceMembers = async (workspaceId: string, userId: string) => {
  try {
    const url = WORKSPACE_URL(workspaceId) + `/${userId}/remove-member`
    const respnose = await axiosAuthFetch('DELETE', url)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}

export const updatedWorkspace = async (workspaceId: string, payload: { title: string }) => {
  try {
    const url = WORKSPACE_URL(workspaceId) + '/update-workspace'
    const respnose = await axiosAuthFetch('PUT', url, payload)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}

export const addWrokspaceAdmin = async (workspaceId: string, memberId: string) => {
  try {
    const url = WORKSPACE_URL(workspaceId) + `/${memberId}/admin/add-admin`
    const respnose = await axiosAuthFetch('POST', url)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}
export const removeWrokspaceAdmin = async (workspaceId: string, memberId: string) => {
  try {
    const url = WORKSPACE_URL(workspaceId) + `/${memberId}/admin/remove-admin`
    const respnose = await axiosAuthFetch('DELETE', url)
    return respnose?.data
  } catch (error) {
    console.log(error)
  }
}
