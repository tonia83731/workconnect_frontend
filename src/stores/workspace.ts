import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createdWorkspaceBucket, getWorkspaceBuckets } from '@/api/workbucket'
import {
  addWorkspaceMembers,
  addWrokspaceAdmin,
  getWorkspaceMembers,
  removeWorkspaceMembers,
  removeWorkspaceAdmin,
} from '@/api/workspace'

export type BucketData = {
  _id: string
  workspaceId: string
  title: string
  isPinned: boolean
  folderCount: number
  createdAt: string
  updatedAt: string
}

type MemberData = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
}

type MemberResponseData = {
  _id: string
  isAdmin: boolean
  userId: {
    _id: string
    name: string
    email: string
  }
}

export const useWorkspaceStore = defineStore(
  'workspace',
  () => {
    // const authStore = useAuthStore()
    const buckets = ref<BucketData[]>([])
    const membersList = ref<MemberData[]>([])
    const invitesList = ref<string[]>([])
    // const messagesList = ref<MessageData[]>([])

    const clearWorkspaceData = () => {
      buckets.value = []
      membersList.value = []
      invitesList.value = []
    }

    const handleCreateBuckets = async (
      workspaceId: string,
      body: {
        title: string
      },
    ) => {
      try {
        const data = await createdWorkspaceBucket(workspaceId, body)

        if (data?.success) {
          const new_data = data?.data
          const updated_buckets = [...buckets.value, new_data]
          buckets.value = updated_buckets
          return {
            success: true,
            message: '新增工作欄成功',
          }
        } else {
          return {
            success: false,
            message: '新增工作欄失敗，請在試一次',
          }
        }
      } catch (error) {
        // console.log(error)
        return {
          success: false,
          message: `新增工作欄失敗，請在試一次: ${error}`,
        }
      }
    }

    const handleAddMember = async (workspaceId: string, body: { email: string }) => {
      try {
        const data = await addWorkspaceMembers(workspaceId, body)

        if (data?.success) {
          const updated_invitesList = [...invitesList.value, body.email]
          invitesList.value = updated_invitesList
          return {
            success: true,
            message: '邀請成員成功',
          }
        } else {
          return {
            success: false,
            message: '邀請成員失敗，請在試一次',
          }
        }
      } catch (error) {
        return {
          success: false,
          message: `邀請成員失敗，請在試一次: ${error}`,
        }
      }
    }
    const handleDeleteMember = async (workspaceId: string, memberId: string) => {
      try {
        const data = await removeWorkspaceMembers(workspaceId, memberId)

        if (data?.success) {
          const updated_members = membersList.value.filter((member) => member._id !== memberId)
          membersList.value = updated_members

          return {
            success: true,
            message: '刪除工作區成員成功',
          }
        } else {
          return {
            success: true,
            message: '刪除工作區成員失敗，請在試一次',
          }
        }
      } catch (error) {
        return {
          success: true,
          message: `刪除工作區成員失敗，請在試一次: ${error}`,
        }
      }
    }

    const handleAddAdmin = async (workspaceId: string, memberId: string) => {
      try {
        const data = await addWrokspaceAdmin(workspaceId, memberId)

        if (data?.success) {
          const updatedMembers = membersList.value.map((member) => {
            return member._id === memberId
              ? {
                  ...member,
                  isAdmin: true,
                }
              : member
          })
          membersList.value = updatedMembers
          return {
            success: true,
            message: data?.message,
          }
        }
        return {
          success: false,
          message: data?.message,
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          message: `使用者: ${memberId} 設為管理員失敗`,
        }
      }
    }
    const handleRemoveAdmin = async (workspaceId: string, memberId: string) => {
      try {
        const data = await removeWrokspaceAdmin(workspaceId, memberId)

        if (data?.success) {
          const updatedMembers = membersList.value.map((member) => {
            return member._id === memberId
              ? {
                  ...member,
                  isAdmin: false,
                }
              : member
          })
          membersList.value = updatedMembers
          return {
            success: true,
            message: data?.message,
          }
        }
        return {
          success: false,
          message: data?.message,
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          message: `使用者: ${memberId} 取消管理員失敗`,
        }
      }
    }

    // -------------------- FETCH WORKSPACEDATA --------------------
    const fetchWorkspaceBuckets = async (workspaceId: string) => {
      try {
        const data = await getWorkspaceBuckets(workspaceId)
        // console.log(data)
        if (data?.success) {
          buckets.value = data?.data
        }
      } catch (error) {
        console.log(error)
      }
    }
    const fetchWorkspaceMembers = async (workspaceId: string) => {
      try {
        const data = await getWorkspaceMembers(workspaceId)
        // console.log(data)
        if (data?.success) {
          const { members, invites } = data?.data
          const membersData = members.map((member: MemberResponseData) => ({
            _id: member.userId._id,
            isAdmin: member.isAdmin,
            name: member.userId.name,
            email: member.userId.email,
          }))
          membersList.value = membersData
          invitesList.value = invites
        }
      } catch (error) {
        console.log(error)
      }
    }

    // const fetchWorkspaceChats = async (workspaceId: string) => {
    //   try {
    //     const data = await getChatMessages(workspaceId)
    //     if (data?.success) {
    //       const { messages } = data?.data

    //       const formated_messages = messages.map((message: MessageData) => {
    //         const now = dayjs()
    //         const time = dayjs(message.createdAt)
    //         const isToday = time.isSame(now, 'day')

    //         return {
    //           ...message,
    //           isMe: message.senderId._id === authStore.userId,
    //           time: isToday ? time.format('h:mm A') : time.format('YYYY-MM-DD h:mm A'),
    //         }
    //       })

    //       messagesList.value = formated_messages
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    return {
      buckets,
      membersList,
      invitesList,
      // messagesList,
      clearWorkspaceData,
      fetchWorkspaceBuckets,
      fetchWorkspaceMembers,
      // fetchWorkspaceChats,
      handleCreateBuckets,
      handleAddMember,
      handleDeleteMember,
      handleAddAdmin,
      handleRemoveAdmin,
    }
  },
  {
    persist: true,
  },
)
