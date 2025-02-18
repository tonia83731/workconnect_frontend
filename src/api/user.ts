import { axiosAuthFetch } from './index'

const USER_URL = '/user'

export const getUserProfile = async (userId: string) => {
  try {
    const response = await axiosAuthFetch('GET', `${USER_URL}/${userId}/profile`)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
export const updatedUserProfile = async (
  userId: string,
  payload: { name: string; email: string },
) => {
  try {
    const response = await axiosAuthFetch('PUT', `${USER_URL}/${userId}/updated-profile`, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
export const getUserWorkspaces = async (userId: string) => {
  try {
    const response = await axiosAuthFetch('GET', `${USER_URL}/${userId}/workspace`)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
export const getUserInvitations = async (userId: string) => {
  try {
    const response = await axiosAuthFetch('GET', `${USER_URL}/${userId}/invitations`)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

// --------------------------------------------------------------------------------------------
export const acceptInvitations = async (userId: string, workspaceId: string) => {
  try {
    const response = await axiosAuthFetch(
      'POST',
      `${USER_URL}/${userId}/${workspaceId}/invitations-confirmed`,
    )
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
export const rejectInvitations = async (userId: string, workspaceId: string) => {
  try {
    const response = await axiosAuthFetch(
      'POST',
      `${USER_URL}/${userId}/${workspaceId}/invitations-canceled`,
    )
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
