
const express = require('express')
const router = express.Router()

const Queue = require('../models/Queue')
const Counter = require('../models/Counter')

// Register customer in queue
router.post('/register', async (req, res) => {
  try {
    const { service, transaction } = req.body

    // Validate incoming data
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

    // Generate today's date key
    const dateKey = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')

    // Atomically generate the next ticket number
    const counter = await Counter.findOneAndUpdate(
      { branchCode, dateKey },
      {
        $inc: { sequence: 1 },
        $setOnInsert: { branchCode, dateKey }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    )

    const ticketId =
      `${branchCode}-${dateKey}-${String(counter.sequence).padStart(3, '0')}`

    // Save ticket in MongoDB
    const ticket = await Queue.create({
      ticketId,
      branch,
      service,
      transaction,
      assignedTeller: 'Teller 02',
      status: 'waiting'
    })

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

module.exports = router
