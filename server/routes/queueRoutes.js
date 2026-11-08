
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Queue = require('../models/Queue')
const Counter = require('../models/Counter')

const tellers = [
  'Teller 01',
  'Teller 02',
  'Teller 03'
]

const PAGE_SIZE = 7

// Get the beginning of today in Ghana (UTC+0)
const getStartOfGhanaDay = () => {
  const now = new Date()

  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ))
}

// Broadcast queue updates to connected clients
// Broadcast updates only to the relevant branch
const broadcastQueueUpdate = (req, branchCode) => {
  const io = req.app.get('io')

  if (io && branchCode) {
    io.to(`branch:${branchCode}`).emit('queue:updated', {
      message: 'Queue information has changed.',
      branchCode
    })
  }
}

// Assign the least busy teller
const assignLeastBusyTeller = async (branch) => {
  const tellerWorkloads = await Promise.all(
    tellers.map(async (teller, index) => {
      const workload = await Queue.countDocuments({
  branch,
  assignedTeller: teller,
  status: { $in: ['waiting', 'serving'] },
  createdAt: { $gte: getStartOfGhanaDay() }
})
      return { teller, workload, index }
    })
  )

  tellerWorkloads.sort((a, b) => {
    return a.workload - b.workload || a.index - b.index
  })

  return tellerWorkloads[0].teller
}

// Register customer in queue
router.post('/register', async (req, res) => {
  try {
    const { service, transaction } = req.body

    if (!service || !transaction) {
      return res.status(400).json({
        success: false,
        message: 'Service and transaction are required.'
      })
    }

    const branch = process.env.BRANCH_NAME
    const branchCode = process.env.BRANCH_CODE

    if (!branch || !branchCode) {
      return res.status(500).json({
        success: false,
        message: 'Branch configuration is missing.'
      })
    }

    const dateKey = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')

    const counter = await Counter.findOneAndUpdate(
      { branchCode, dateKey },
      {
        $inc: { sequence: 1 },
        $setOnInsert: { branchCode, dateKey }
      },
     {
  returnDocument: 'after',
  upsert: true,
  runValidators: true
}
    )

    const ticketId =
      `${branchCode}-${dateKey}-${String(counter.sequence).padStart(3, '0')}`

    const assignedTeller = await assignLeastBusyTeller(branch)

    const ticket = await Queue.create({
      ticketId,
      branch,
      service,
      transaction,
      assignedTeller,
      status: 'waiting'
    })

    // Notify connected dashboards
    broadcastQueueUpdate(req, branchCode)

    return res.status(201).json({
      success: true,
      message: 'Queue registration successful.',
      data: ticket
    })

  } catch (error) {
    console.error('Queue registration error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to register queue ticket.'
    })
  }
})

// Call the next waiting customer
router.post('/call-next', async (req, res) => {
  try {
    const branch = process.env.BRANCH_NAME
    const { teller } = req.body

    if (!tellers.includes(teller)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid teller selected.'
      })
    }

    const activeTicket = await Queue.findOne({
  branch,
  assignedTeller: teller,
  status: 'serving',
  createdAt: { $gte: getStartOfGhanaDay() }
})

    if (activeTicket) {
      return res.status(409).json({
        success: false,
        message: 'This teller is already serving a customer.',
        data: activeTicket
      })
    }

    const ticket = await Queue.findOneAndUpdate(
  {
    branch,
    assignedTeller: teller,
    status: 'waiting',
    createdAt: { $gte: getStartOfGhanaDay() }
  },
  {
    $set: { status: 'serving' }
  },
  {
  returnDocument: 'after',
  sort: { createdAt: 1 }
}
)
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `No waiting customers for ${teller}.`
      })
    }

    // Notify connected dashboards
   broadcastQueueUpdate(req, process.env.BRANCH_CODE)

    return res.status(200).json({
      success: true,
      message: 'Customer called successfully.',
      data: ticket
    })

  } catch (error) {
    console.error('Call next error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to call the next customer.'
    })
  }
})

// Complete service and remove ticket from database
router.patch('/:id/complete', async (req, res) => {
  try {
    const branch = process.env.BRANCH_NAME
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID.'
      })
    }

    const ticket = await Queue.findOneAndDelete({
  _id: id,
  branch,
  status: 'serving',
  createdAt: { $gte: getStartOfGhanaDay() }
})

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Serving ticket not found.'
      })
    }

    // Notify connected dashboards
    broadcastQueueUpdate(req, process.env.BRANCH_CODE)

    return res.status(200).json({
      success: true,
      message: 'Service completed. Ticket removed from the database.',
      data: ticket
    })

  } catch (error) {
    console.error('Complete service error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to complete customer service.'
    })
  }
})

// Retrieve serving tickets and paginated waiting queue
router.get('/', async (req, res) => {
  try {
    const branch = process.env.BRANCH_NAME
    const page = Number(req.query.page || 1)

    const todayFilter = {
  branch,
  createdAt: { $gte: getStartOfGhanaDay() }
}
    if (!branch) {
      return res.status(500).json({
        success: false,
        message: 'Branch configuration is missing.'
      })
    }

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page must be a positive integer.'
      })
    }

    const waitingCount = await Queue.countDocuments({
  ...todayFilter,
  status: 'waiting'
})

    const totalPages = Math.max(
      1,
      Math.ceil(waitingCount / PAGE_SIZE)
    )

    const waitingTickets = await Queue.find({
  ...todayFilter,
  status: 'waiting'
})
  .sort({ createdAt: 1 })
  .skip((page - 1) * PAGE_SIZE)
  .limit(PAGE_SIZE)
      .sort({ createdAt: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)

   const servingTickets = await Queue.find({
  ...todayFilter,
  status: 'serving'
}).sort({ createdAt: 1 })

    return res.status(200).json({
      success: true,
      waitingCount,
      page,
      pageSize: PAGE_SIZE,
      totalPages,
      data: waitingTickets,
      serving: servingTickets
    })

  } catch (error) {
    console.error('Queue retrieval error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve queue tickets.'
    })
  }
})

module.exports = router
