
const mongoose = require('mongoose')

const queueSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true
    },

    branch: {
      type: String,
      required: true
    },

    service: {
      type: String,
      required: true
    },

    transaction: {
      type: String,
      required: true
    },

    assignedTeller: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ['waiting', 'serving', 'completed', 'cancelled'],
      default: 'waiting'
    }
  },
  {
    timestamps: true
  }
)

const Queue = mongoose.model('Queue', queueSchema)

module.exports = Queue
