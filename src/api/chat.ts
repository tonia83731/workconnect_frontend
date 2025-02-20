import { axiosAuthFetch } from './index'

export const getChatMessages = async (workspaceAccount: string) => {
  try {
    const url = `/chat/${workspaceAccount}/messages`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const getChatMembers = async (workspaceAccount: string) => {
  try {
    const url = `/chat/${workspaceAccount}/members`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const postMessage = async (
  workspaceAccount: string,
  payload: {
    chatId: string
    senderId: string
    text: string
  },
) => {
  try {
    const url = `/chat/${workspaceAccount}/send-message`
    const response = await axiosAuthFetch('POST', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
