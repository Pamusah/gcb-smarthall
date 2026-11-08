
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

require('dotenv').config()

const connectDB = require('./config/db')
const queueRoutes = require('./routes/queueRoutes')
const startDailyQueueCleanup = require('./utils/dailyQueueCleanup')

const app = express()
const server = http.createServer(app)

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Origin not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PATCH']
}

app.use(cors(corsOptions))
app.use(express.json())

const io = new Server(server, {
  cors: corsOptions
})

app.set('io', io)

// Branch-specific Socket.IO connection
io.on('connection', (socket) => {
  const branchCode = process.env.BRANCH_CODE

  if (!branchCode) {
    console.error('Socket connection rejected: branch code is missing.')
    socket.disconnect(true)
    return
  }

  const roomName = `branch:${branchCode}`

  socket.join(roomName)

  console.log(`Client connected: ${socket.id}`)
  console.log(`Joined Socket.IO room: ${roomName}`)

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GCB SmartHall API is running successfully.'
  })
})

// Queue routes
app.use('/api/queue', queueRoutes)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()

    // Clean previous-day tickets and activate scheduler
    await startDailyQueueCleanup(io)

    server.listen(PORT, () => {
      console.log(`SmartHall server running on port ${PORT}`)
      console.log('Socket.IO server is ready!')
    })

  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
