import { reactive } from 'vue'
import { io } from 'socket.io-client'
export const socket = io(import.meta.env.VITE_API_URL)

export const state = reactive({
  connected: false,
  // fooEvents: [],
  // barEvents: [],
})

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})
