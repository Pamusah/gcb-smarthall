
import { io } from 'socket.io-client'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Remove /api to obtain the Socket.IO server address
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '')

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,

  auth: {
    branchCode: import.meta.env.VITE_BRANCH_CODE || 'NE'
  }
})

export default socket
