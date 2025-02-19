<script lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { useChatStore } from '@/stores/chat'
import WorkspaceLayout from '@/components/common/layout/WorkspaceLayout.vue'
import MemberMessage from '@/components/chat-page/MemberMessage.vue'
import SendArrowIcon from '@/components/icons/SendArrowIcon.vue'
import EmojiIcon from '@/components/icons/EmojiIcon.vue'

type EmojiResponseType = {
  i: string
  n: string[]
  r: string
  t: string
  u: string
}

export default {
  components: {
    WorkspaceLayout,
    MemberMessage,
    SendArrowIcon,
    EmojiIcon,
    EmojiPicker,
  },
  data() {
    return {}
  },
  methods: {},
  mounted: {},
  computed: {},
  // setup() {
  //   const { params } = useRoute()
  //   const chatStore = useChatStore()

  //   const emojiToggle = ref(false)
  //   const text = ref('')

  //   const handleMessageSend = async () => {
  //     const inputValue = text.value
  //     if (!inputValue || !inputValue.trim()) return
  //     const res = await chatStore.handleSendMessage(params?.workspaceId as string, {
  //       text: text.value,
  //     })

  //     if (res.success) {
  //       text.value = ''
  //     } else {
  //       toast.error(res.message)
  //     }
  //   }
  //   const handleEmojiToggle = () => {
  //     emojiToggle.value = !emojiToggle.value
  //   }
  //   const handleEmojiSelect = (emoji: EmojiResponseType) => {
  //     text.value += emoji?.i
  //     emojiToggle.value = false
  //   }

  //   onMounted(async () => {
  //     await chatStore.fetchWorkspaceChats(params?.workspaceId as string)
  //   })

  //   return {
  //     text,
  //     messages: chatStore.messagesList,
  //     emojiToggle,
  //     handleEmojiSelect,
  //     handleEmojiToggle,
  //     handleMessageSend,
  //   }
  // },
}
</script>

<template>
  <WorkspaceLayout mainTitle="討論室">
    <template #workspace>
      <div class=""></div>
      <!-- <div class="w-full bg-soft-aqua p-4 flex flex-col gap-8">
        <div
          class="flex flex-col gap-4 py-4 overflow-x-hidden overflow-y-auto h-[60vh] max-h-[500px] scroll"
        >
          <div v-for="message in messages" :key="message._id">
            <MemberMessage
              :id="message._id"
              :isMe="message.isMe"
              :text="message.text"
              :time="message.time"
              :sender="message.senderId.name"
            />
          </div>
        </div>
        <div class="grid grid-cols-[4fr_0.5fr_0.5fr] gap-2">
          <input
            type="text"
            placeholder="請輸入訊息"
            class="placeholder:text-sm text-midnight-forest placeholder:text-muted-gray w-full h-10 px-4 bg-white rounded-sm"
            name="message"
            v-model="text"
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
            class="bg-midnight-forest rounded-sm flex justify-center items-center"
          >
            <SendArrowIcon class="w-6 h-6 text-white" />
          </button>
        </div>
      </div> -->
    </template>
  </WorkspaceLayout>
</template>
<!-- https://socket.io/how-to/use-with-vue -->
