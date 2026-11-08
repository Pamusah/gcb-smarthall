
const cron = require('node-cron')
const Queue = require('../models/Queue')

const getStartOfGhanaDay = () => {
  const now = new Date()

  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ))
}

// Perform the actual cleanup
const cleanPreviousDayQueues = async (io) => {
  const branch = process.env.BRANCH_NAME
  const branchCode = process.env.BRANCH_CODE

  if (!branch || !branchCode) {
    throw new Error('Branch configuration is missing.')
  }

  const startOfToday = getStartOfGhanaDay()

  const result = await Queue.deleteMany({
    branch,
    createdAt: { $lt: startOfToday }
  })

  console.log(
    `Daily cleanup completed. Deleted ${result.deletedCount} old tickets.`
  )

  if (io && result.deletedCount > 0) {
    io.to(`branch:${branchCode}`).emit('queue:updated', {
      message: 'A new working day has started.',
      branchCode
    })
  }

  return result
}

// Retry failed database operations
const cleanupWithRetry = async (io) => {
  const maxAttempts = 4

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await cleanPreviousDayQueues(io)
    } catch (error) {
      console.error(
        `Cleanup attempt ${attempt}/${maxAttempts} failed:`,
        error.message
      )

      if (attempt === maxAttempts) {
        throw error
      }

      const delay = attempt * 3000

      console.log(`Retrying cleanup in ${delay / 1000} seconds...`)

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Start startup cleanup and midnight scheduler
const startDailyQueueCleanup = async (io) => {
  // Do not start the application until old tickets are cleared
  await cleanupWithRetry(io)

  cron.schedule(
    '0 0 * * *',
    () => {
      cleanupWithRetry(io).catch(error => {
        console.error(
          'Scheduled daily cleanup failed after retries:',
          error.message
        )
      })
    },
    {
      timezone: 'Africa/Accra'
    }
  )

  console.log('Daily queue cleanup scheduler is ready!')
}

module.exports = startDailyQueueCleanup
