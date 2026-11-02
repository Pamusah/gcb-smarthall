
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')
const queueRoutes = require('./routes/queueRoutes')

const app = express()

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GCB SmartHall API is running successfully.'
  })
})

app.use('/api/queue', queueRoutes)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`SmartHall server running on port ${PORT}`)
  })
}

startServer()
