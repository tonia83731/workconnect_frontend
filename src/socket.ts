import { reactive } from 'vue'
import { io } from 'socket.io-client'
export const socket = io(import.meta.env.VITE_API_URL, {
  transports: ['websocket'], // Force WebSocket
  withCredentials: true, // Allow cross-origin requests if needed
})

export const state = reactive({
  connected: false,
  // fooEvents: [],
  // barEvents: [],
})

socket.on('connect', () => {
  console.log('Connected to WebSocket server:', socket.id)
  state.connected = true
})

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server')
  state.connected = false
})
