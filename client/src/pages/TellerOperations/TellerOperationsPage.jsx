
import { useEffect, useState } from 'react'
import {
  UserRound,
  Monitor,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react'

import {
  callNextCustomer,
  completeService,
  getQueue
} from '../../services/api'

import socket from '../../services/socket'

const tellers = [
  'Teller 01',
  'Teller 02',
  'Teller 03'
]

export default function TellerOperationsPage() {
  const [selectedTeller, setSelectedTeller] = useState('Teller 01')
  const [activeTicket, setActiveTicket] = useState(null)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Retrieve the ticket currently being served by this teller
  const fetchCurrentTicket = async () => {
    try {
      const result = await getQueue(1)

      const currentTicket = result.serving.find(
        (ticket) => ticket.assignedTeller === selectedTeller
      )

      setActiveTicket(currentTicket || null)
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to retrieve teller information.')
    } finally {
      setLoading(false)
    }
  }

  // Load ticket and listen for real-time queue updates
  useEffect(() => {
    setLoading(true)
    setError('')
    setSuccess('')

    fetchCurrentTicket()

    socket.on('queue:updated', fetchCurrentTicket)

    return () => {
      socket.off('queue:updated', fetchCurrentTicket)
    }
  }, [selectedTeller])

  // Call the next waiting customer
  const handleCallNext = async () => {
    try {
      setActionLoading(true)
      setError('')
      setSuccess('')

      const result = await callNextCustomer(selectedTeller)

      setActiveTicket(result.data)
      setSuccess(`${result.data.ticketId} is now being served.`)

    } catch (err) {
      setError(err.message || 'Unable to call the next customer.')
    } finally {
      setActionLoading(false)
    }
  }

  // Complete the current customer's service
  const handleCompleteService = async () => {
    if (!activeTicket) return

    try {
      setActionLoading(true)
      setError('')
      setSuccess('')

      const result = await completeService(activeTicket._id)

      setActiveTicket(null)
      setSuccess(`${result.data.ticketId} has been completed successfully.`)

    } catch (err) {
      setError(err.message || 'Unable to complete the service.')
    } finally {
      setActionLoading(false)
    }
  }

  const isServing = Boolean(activeTicket)

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            GCB SmartHall
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-800">
            Teller Operations
          </h1>

          <p className="mt-2 text-gray-500">
            Manage customer queues and teller services.
          </p>
        </div>

        {/* Teller Selection */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <UserRound className="text-amber-500" size={24} />

            <h2 className="text-lg font-semibold text-gray-800">
              Select Your Teller
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {tellers.map((teller) => (
              <button
                key={teller}
                onClick={() => setSelectedTeller(teller)}
                className={`rounded-lg border p-4 font-semibold transition ${
                  selectedTeller === teller
                    ? 'border-amber-500 bg-amber-50 text-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-amber-400'
                }`}
              >
                {teller}
              </button>
            ))}
          </div>
        </section>

        {/* Current Teller */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Monitor className="text-amber-500" size={24} />

            <div>
              <p className="text-sm text-gray-500">
                Currently selected
              </p>

              <h2 className="text-2xl font-bold text-gray-800">
                {selectedTeller}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            {/* Active Ticket */}
            <div className="rounded-lg bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <Clock size={18} />
                <span className="text-sm">Currently serving</span>
              </div>

              {loading ? (
                <p className="text-gray-500">Loading ticket...</p>
              ) : activeTicket ? (
                <>
                  <p className="text-3xl font-bold text-gray-800">
                    {activeTicket.ticketId}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {activeTicket.service} — {activeTicket.transaction}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-gray-800">
                  No active ticket
                </p>
              )}
            </div>

            {/* Teller Status */}
            <div className="rounded-lg bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <CheckCircle size={18} />

                <span className="text-sm">Teller status</span>
              </div>

              <p className={`text-2xl font-bold ${
                isServing ? 'text-amber-600' : 'text-green-600'
              }`}>
                {loading ? 'Checking...' : isServing ? 'Serving' : 'Available'}
              </p>
            </div>

          </div>
        </section>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Teller Actions */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            Customer Management
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">

            <button
              onClick={handleCallNext}
              disabled={loading || actionLoading || isServing}
              className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-4 font-bold text-gray-900 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : null}

              CALL NEXT CUSTOMER
            </button>

            <button
              onClick={handleCompleteService}
              disabled={loading || actionLoading || !isServing}
              className="rounded-lg border border-gray-300 px-6 py-4 font-bold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              COMPLETE SERVICE
            </button>

          </div>

          <p className="mt-4 text-sm text-gray-400">
            Queue operations are synchronized with the branch display.
          </p>
        </section>

      </div>
    </main>
  )
}
