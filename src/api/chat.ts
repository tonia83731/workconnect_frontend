import { axiosAuthFetch } from './index'
import { defaultURL } from './workspace'

const CHAT_URL = (workspaceId: string) => defaultURL('chat', workspaceId)

export const getChatMessages = async (workspaceId: string) => {
  try {
    const url = `/chat/${workspaceId}/messages`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const getChatMembers = async (workspaceId: string) => {
  try {
    const url = `/chat/${workspaceId}/members`
    const response = await axiosAuthFetch('GET', url)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const postMessage = async (
  workspaceId: string,
  payload: {
    chatId: string
    senderId: string
    text: string
  },
) => {
  try {
    const url = CHAT_URL(workspaceId) + '/send-message'
    const response = await axiosAuthFetch('POST', url, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
