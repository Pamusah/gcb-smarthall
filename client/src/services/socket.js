import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,

  auth: {
    branchCode: import.meta.env.VITE_BRANCH_CODE
  }
})

export default socket