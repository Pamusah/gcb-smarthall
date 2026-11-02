
const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  branchCode: {
    type: String,
    required: true
  },

  dateKey: {
    type: String,
    required: true
  },

  sequence: {
    type: Number,
    default: 0
  }
})

// Each branch gets its own daily sequence
counterSchema.index(
  { branchCode: 1, dateKey: 1 },
  { unique: true }
)

const Counter = mongoose.model('Counter', counterSchema)

module.exports = Counter
