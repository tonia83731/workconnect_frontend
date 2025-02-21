<script lang="ts">
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import { getChatMembers, getChatMessages, postMessage } from '@/api/chat'
import SendArrowIcon from '@/components/icons/SendArrowIcon.vue'
import EmojiIcon from '@/components/icons/EmojiIcon.vue'
import { useAuthStore } from '@/stores/auth'
import type { ChatMemberType, ChatMessageType } from '@/types/chat'
import { socket, state } from '@/socket'

type EmojiResponseType = {
  i: string
  n: string[]
  r: string
  t: string
  u: string
}

const authStore = useAuthStore()

export default {
  components: {
    WorkspaceLayout,
    // MemberMessage,
    SendArrowIcon,
    EmojiIcon,
    EmojiPicker,
  },
  data() {
    return {
      chatId: '',
      messages: [] as ChatMessageType[],
      members: [] as ChatMemberType[],
      message: '',
      emojiToggle: false,
    }
  },
  methods: {
    async fetchChatWithMessages(workspaceAccount: string) {
      try {
        const res = await getChatMessages(workspaceAccount)
        if (res?.success) {
          const data = res?.data

          const { chat, messages } = data
          this.chatId = chat._id
          this.messages = messages
        }
      } catch (error) {
        console.log(error)
      }
    },
    async fetchChatMembers(workspaceAccount: string) {
      try {
        const res = await getChatMembers(workspaceAccount)
        if (res?.success) {
          const data = res?.data
          const formated_members = data.map((member: ChatMemberType) => ({
            ...member,
            letter: member.name[0],
            isOnline: false,
          }))
          this.members = formated_members
        }
      } catch (error) {
        console.log(error)
      }
    },

    handleEmojiToggle() {
      this.emojiToggle = !this.emojiToggle
    },
    handleEmojiSelect(emoji: EmojiResponseType) {
      this.message = this.message + emoji?.i
      this.emojiToggle = false
    },
    async handleMessageSend() {
      const body = {
        chatId: this.chatId,
        senderId: this.userId as string,
        text: this.message,
      }
      try {
        const res = await postMessage(this.workspaceAccount as string, body)

        if (res?.success) {
          const data = res?.data
          console.log(data)
          const { message } = data
          this.messages.push(message)
          this.message = ''
          socket.emit('send_message', message)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    // console.log(this.userId)
    if (this.workspaceAccount) {
      this.fetchChatMembers(this.workspaceAccount as string)
      this.fetchChatWithMessages(this.workspaceAccount as string)
    }
    socket.emit('join_chat', { chatId: this.chatId, userId: this.userId, name: this.userName })

    socket.on('updated_online_users', (onlineUsers: string[]) => {
      // console.log('Online Users:', onlineUsers)
      // console.log('Before Update:', this.members)
      this.members = this.members.map((member) => ({
        ...member,
        isOnline: onlineUsers.includes(member.id),
      }))
      // console.log('After Update:', this.members)
    })

    socket.on('receive_message', (message: ChatMessageType) => {
      console.log('New message received:', message)
      this.messages.push(message)
    })
  },
  computed: {
    userId() {
      return authStore.userId
    },
    userName() {
      return authStore.user?.name
    },
    workspaceAccount() {
      return this.$route.params.account
    },
    chatConnected() {
      return state.connected
    },
  },
}
</script>

<template>
  <WorkspaceLayout mainTitle="討論室">
    <template #workspace>
      <div class="w-full h-full flex flex-col md:grid md:grid-cols-[1fr_2fr] gap-8">
        <div
          class="w-full h-[45px] md:h-full pb-2 md:pb-0 overflow-x-auto scroll-horizonal overflow-y-hidden flex md:flex-col md:overflow-x-hidden md:overflow-y-auto gap-2"
        >
          <div
            v-for="member in members"
            class="relative grid grid-cols-[28px_1fr] items-center gap-4 px-2 h-[40px] leading-[40px] bg-white shadow-lg rounded-sm w-full"
            :key="member.id"
          >
            <div
              class="w-7 h-7 font-bold flex justify-center items-center rounded-full shadow-sm"
              :style="{ backgroundColor: member.bgColor, color: member.textColor }"
            >
              {{ member.letter }}
            </div>
            <div class="font-medium whitespace-nowrap">{{ member.name }}</div>
            <p
              class="w-2 h-2 rounded-full bg-sky-blue absolute top-1.5 left-1.5"
              v-if="member.isOnline"
            ></p>
          </div>
        </div>
        <div class="w-full h-full bg-soft-aqua p-4 relative">
          <div
            class="my-4 px-4 flex flex-col gap-4 h-full max-h-[380px] md:max-h-[420px] overflow-y-auto scroll"
          >
            <div class="" v-for="msg in messages" :key="msg._id">
              <div class="w-full flex justify-end" v-if="msg.senderId === userId">
                <div class="grid grid-cols-[1fr_28px] gap-4">
                  <div class="bg-white px-4 py-1 rounded-full text-sm text-midnight-forest w-fit">
                    {{ msg.text }}
                  </div>
                  <div
                    class="w-7 h-7 text-white font-bold flex justify-center items-center rounded-full shadow-sm"
                    :style="{ backgroundColor: msg.bgColor, color: msg.textColor }"
                    :title="msg.name"
                  >
                    {{ msg.name[0] }}
                  </div>
                </div>
              </div>

              <div class="w-full flex justify-start" v-else>
                <div class="grid grid-cols-[28px_1fr] gap-4">
                  <div
                    class="w-7 h-7 text-white font-bold flex justify-center items-center rounded-full shadow-sm"
                    :style="{ backgroundColor: msg.bgColor, color: msg.textColor }"
                    :title="msg.name"
                  >
                    {{ msg.name[0] }}
                  </div>
                  <div class="bg-white px-4 py-1 rounded-full text-sm text-midnight-forest w-fit">
                    {{ msg.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- message input -->
          <div
            class="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] grid grid-cols-[4fr_0.5fr_0.5fr] gap-2"
          >
            <input
              type="text"
              placeholder="請輸入訊息"
              class="placeholder:text-sm text-midnight-forest placeholder:text-muted-gray w-full h-10 px-4 bg-white rounded-sm"
              name="message"
              v-model="message"
            />
            <div class="w-full h-10 flex justify-center items-center">
              <div class="relative">
                <button @click="handleEmojiToggle" class="text-midnight-forest">
                  <EmojiIcon class="w-6 h-6" />
                </button>
                <EmojiPicker
                  :native="true"
                  v-if="emojiToggle"
                  @select="handleEmojiSelect"
                  class="absolute bottom-12 right-0"
                />
              </div>
            </div>
            <button
              @click="handleMessageSend"
              class="bg-midnight-forest rounded-sm flex justify-center items-center px-2"
            >
              <SendArrowIcon class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </WorkspaceLayout>
</template>
<!-- https://socket.io/how-to/use-with-vue -->
