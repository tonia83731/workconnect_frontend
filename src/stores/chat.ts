import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getChatMessages, postMessage } from '@/api/chat'
import dayjs from 'dayjs'
import { useAuthStore } from './auth'
type MessageData = {
  _id: string
  workspaceId: string
  chatId: string
  senderId: {
    _id: string
    name: string
    email: string
  }
  text: string
  createdAt: string
  updatedAt: string
  isMe?: boolean
  time?: string
}

export const useChatStore = defineStore(
  'chat',
  () => {
    const authStore = useAuthStore()
    const chatId = ref('')
    const messagesList = ref<MessageData[]>([])

    const clearChatData = () => {
      messagesList.value = []
    }

    const handleSendMessage = async (
      workspaceId: string,
      body: {
        text: string
      },
    ) => {
      try {
        const payload = {
          chatId: chatId.value,
          senderId: authStore.userId as string,
          text: body.text,
        }
        const data = await postMessage(workspaceId, payload)

        if (data?.success) {
          const message = data.data
          const new_message = {
            ...message,
            isMe: true,
            time: dayjs(message.createdAt).format('h:mm A'),
          }
          const updatedMessage = [...messagesList.value, new_message]
          messagesList.value = updatedMessage

          return {
            success: true,
          }
        } else {
          return {
            success: false,
            message: '傳送訊息失敗',
          }
        }
      } catch (error) {
        return {
          success: false,
          message: `傳送訊息失敗: ${error}`,
        }
      }
    }

    // --------------------- FETCH CHATDATA ---------------------
    const fetchWorkspaceChats = async (workspaceId: string) => {
      try {
        const data = await getChatMessages(workspaceId)
        if (data?.success) {
          const { chat, messages } = data?.data

          const formated_messages = messages.map((message: MessageData) => {
            const now = dayjs()
            const time = dayjs(message.createdAt)
            const isToday = time.isSame(now, 'day')

            return {
              ...message,
              isMe: message.senderId._id === authStore.userId,
              time: isToday ? time.format('h:mm A') : time.format('YYYY-MM-DD h:mm A'),
            }
          })

          chatId.value = chat._id
          messagesList.value = formated_messages
        }
      } catch (error) {
        console.log(error)
      }
    }

    return { messagesList, fetchWorkspaceChats, clearChatData, handleSendMessage }
  },
  {
    persist: true,
  },
)
