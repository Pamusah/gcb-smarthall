
import { useEffect, useState } from 'react'
import socket from '../../services/socket'
import {
  Clock,
  Users,
  Monitor,
  RefreshCw,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  ArrowLeftRight,
  Wallet,
  FileText,
  Lightbulb
} from 'lucide-react'

import { getQueue } from '../../services/api'

const tellers = ['Teller 01', 'Teller 02', 'Teller 03']

const lessons = [
  {
    week: 'WEEK 1',
    category: 'DIGITAL BANKING',
    title: 'Check Your Account Balance',
    description: 'Discover convenient ways to access your account information.',
    points: [
      'Use an approved GCB digital banking channel.',
      'Sign in using your authorised credentials.',
      'Navigate to your account balance.'
    ],
    tip: 'Never share your PIN, password or OTP.',
    icon: Smartphone,
    color: 'bg-blue-600'
  },
  {
    week: 'WEEK 2',
    category: 'FUNDS TRANSFER',
    title: 'Transfer Funds with Ease',
    description: 'Learn how to make digital transfers conveniently and securely.',
    points: [
      'Choose an approved transfer channel.',
      'Enter the beneficiary details carefully.',
      'Review the details before confirmation.'
    ],
    tip: 'Always verify recipient details before confirming a transfer.',
    icon: ArrowLeftRight,
    color: 'bg-indigo-600'
  },
  {
    week: 'WEEK 3',
    category: 'MOBILE MONEY',
    title: 'Bank to Wallet and Wallet to Bank',
    description: 'Explore how banking and mobile money services can work together.',
    points: [
      'Select the appropriate transfer option.',
      'Enter the correct destination details.',
      'Confirm only after reviewing the transaction.'
    ],
    tip: 'Keep your transaction confirmation and report unfamiliar transactions.',
    icon: Wallet,
    color: 'bg-emerald-600'
  },
  {
    week: 'WEEK 4',
    category: 'ACCOUNT SERVICES',
    title: 'Request Your Cheque Book',
    description: 'Understand the cheque book request and collection process.',
    points: [
      'Contact an authorised GCB service channel.',
      'Follow the bank’s verification process.',
      'Collect your cheque book through the approved procedure.'
    ],
    tip: 'Keep your cheque book secure and report lost leaves promptly.',
    icon: FileText,
    color: 'bg-amber-500'
  },
  {
    week: 'BONUS LESSON',
    category: 'BANKING SECURITY',
    title: 'Protect Yourself from Fraud',
    description: 'Simple steps can help protect your money and banking information.',
    points: [
      'Never disclose your PIN or OTP.',
      'Do not give your debit card to strangers.',
      'Report suspicious transactions through official channels.'
    ],
    tip: 'Protect your banking credentials. Never share them with anyone.',
    icon: ShieldCheck,
    color: 'bg-red-600'
  }
]

function QueueDisplayPage() {
  const [waitingTickets, setWaitingTickets] = useState([])
  const [servingTickets, setServingTickets] = useState([])
  const [waitingCount, setWaitingCount] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activeLesson, setActiveLesson] = useState(0)

  // Retrieve queue data
useEffect(() => {
  let isMounted = true

  const fetchQueue = async () => {
    try {
      const result = await getQueue(page)

      if (!isMounted) return

      const pages = result.totalPages || 1

      setWaitingTickets(result.data || [])
      setServingTickets(result.serving || [])
      setWaitingCount(result.waitingCount || 0)
      setTotalPages(pages)
      setError('')
      setLastUpdated(new Date())

      setPage(current => Math.min(current, pages))

    } catch (err) {
      if (isMounted) {
        setError(err.message || 'Unable to load queue.')
      }
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }
  }

  // Initial queue retrieval
  fetchQueue()

  // Listen for real-time queue changes
  socket.on('queue:updated', fetchQueue)

  return () => {
    isMounted = false
    socket.off('queue:updated', fetchQueue)
  }

}, [page])

  // Rotate Smart Learn lessons
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLesson(current => (current + 1) % lessons.length)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const lesson = lessons[activeLesson]
  const LessonIcon = lesson.icon

  const formatTime = (date) => {
    if (!date) return '--:--'

    return new Date(date).toLocaleTimeString('en-GH', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <main className="min-h-screen bg-gcb-light">

      {/* Bank Header */}
      <header className="bg-gcb-charcoal px-6 py-5 text-white md:px-10">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">

          <div>
            <p className="text-sm font-bold tracking-widest text-gcb-amber">
              GCB BANK PLC
            </p>

            <h1 className="mt-1 text-2xl font-bold md:text-4xl">
              SmartHall
            </h1>

            <p className="mt-1 text-sm text-gray-300">
              New Edubiase Branch | Queue, Learn & Serve
            </p>
          </div>

          <div className="text-right">
            <Monitor className="ml-auto text-gcb-amber" size={36} />

            <p className="mt-2 text-xs text-gray-300">
              LIVE QUEUE DISPLAY
            </p>
          </div>

        </div>
      </header>

      <section className="mx-auto max-w-[1600px] space-y-6 px-5 py-6 md:px-10">

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2">

          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="rounded-lg bg-amber-100 p-3">
              <Users size={28} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Customers Waiting
              </p>

              <h2 className="text-3xl font-bold text-gcb-charcoal">
                {waitingCount}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="rounded-lg bg-gray-100 p-3">
              <Clock size={28} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Last Queue Update
              </p>

              <h2 className="text-xl font-bold text-gcb-charcoal">
                {lastUpdated ? formatTime(lastUpdated) : 'Updating...'}
              </h2>
            </div>
          </div>

        </div>

        {/* Teller Panels */}
        <section>

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gcb-charcoal">
              Now Serving
            </h2>

            <p className="text-sm text-gray-500">
              Follow your ticket number and proceed to your assigned teller.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {tellers.map(teller => {
              const activeTicket = servingTickets.find(
                ticket => ticket.assignedTeller === teller
              )

              return (
                <div
                  key={teller}
                  className="rounded-xl bg-gcb-charcoal p-5 text-white shadow-md"
                >

                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gcb-amber">
                      {teller}
                    </p>

                    <UserCheck size={22} />
                  </div>

                  {activeTicket ? (
                    <>
                      <p className="mt-4 text-xs text-gray-300">
                        TICKET NUMBER
                      </p>

                      <h3 className="mt-1 text-3xl font-bold">
                        {activeTicket.ticketId}
                      </h3>

                      <p className="mt-2 text-sm text-gray-300">
                        {activeTicket.transaction}
                      </p>

                      <span className="mt-4 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-bold">
                        SERVING
                      </span>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-4 text-2xl font-bold">
                        Available
                      </h3>

                      <p className="mt-2 text-sm text-gray-300">
                        Waiting for next customer
                      </p>

                      <span className="mt-4 inline-block rounded-full bg-white/15 px-3 py-1 text-xs">
                        READY
                      </span>
                    </>
                  )}

                </div>
              )
            })}

          </div>
        </section>

        {/* Waiting Queue and Smart Learn */}
        <section className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">

          {/* Waiting Queue */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
              <div>
                <h2 className="text-xl font-bold text-gcb-charcoal">
                  Waiting Queue
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Customers awaiting service
                </p>
              </div>

              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold">
                {waitingCount} Waiting
              </span>
            </div>

            {loading ? (
              <p className="p-8 text-center text-gray-500">
                Loading queue...
              </p>
            ) : error ? (
              <p className="p-8 text-center text-red-600">
                {error}
              </p>
            ) : waitingTickets.length === 0 ? (
              <p className="p-8 text-center text-gray-500">
                There are currently no customers waiting.
              </p>
            ) : (
              <div className="divide-y">

                {waitingTickets.map(ticket => (
                  <div
                    key={ticket._id}
                    className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-4"
                  >
                    <div>
                      <p className="text-xs text-gray-500">
                        Ticket
                      </p>

                      <p className="mt-1 font-bold text-gcb-charcoal">
                        {ticket.ticketId}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Transaction
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {ticket.transaction}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Assigned Teller
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {ticket.assignedTeller || 'Pending'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Registered
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {formatTime(ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3 border-t p-4">

              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">

                <button
                  onClick={() => setPage(current => Math.max(1, current - 1))}
                  disabled={page === 1 || loading}
                  className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <button
                  onClick={() => setPage(current => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages || loading}
                  className="flex items-center gap-1 rounded-lg bg-gcb-amber px-3 py-2 text-sm font-semibold text-gcb-charcoal disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>

              </div>
            </div>

          </div>

          {/* Smart Learn Panel */}
          <div className="overflow-hidden rounded-2xl bg-gcb-charcoal text-white shadow-lg">

            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-xs font-bold tracking-widest text-gcb-amber">
                  GCB BANK PLC
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Smart Learn
                </h2>
              </div>

              <Lightbulb className="text-gcb-amber" size={30} />
            </div>

            <div className="p-6">

              <div className={`${lesson.color} mb-5 flex h-28 items-center justify-center rounded-xl`}>
                <LessonIcon size={65} strokeWidth={1.5} />
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gcb-amber px-3 py-1 text-xs font-bold text-gcb-charcoal">
                  {lesson.week}
                </span>

                <span className="text-xs font-semibold text-gray-400">
                  {lesson.category}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                {lesson.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {lesson.description}
              </p>

              <div className="mt-5 space-y-3">
                {lesson.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-gcb-amber">
                      {index + 1}
                    </span>

                    <p className="text-sm text-gray-200">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-gcb-amber/30 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={19} className="text-gcb-amber" />

                  <p className="text-sm font-bold">
                    Smart Banking Tip
                  </p>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  {lesson.tip}
                </p>
              </div>

              {/* Lesson Navigation */}
              <div className="mt-6 flex items-center justify-between">

                <div className="flex gap-2">
                  {lessons.map((item, index) => (
                    <button
                      key={item.title}
                      onClick={() => setActiveLesson(index)}
                      aria-label={`Show ${item.title}`}
                      className={`h-2 rounded-full transition-all ${
                        activeLesson === index
                          ? 'w-7 bg-gcb-amber'
                          : 'w-2 bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveLesson(
                    current => (current + 1) % lessons.length
                  )}
                  className="flex items-center gap-2 text-sm font-semibold text-gcb-amber"
                >
                  Next lesson
                  <ChevronRight size={18} />
                </button>

              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                Educational content rotates every 15 seconds.
              </p>

            </div>
          </div>

        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 py-5 text-xs text-gray-500">
          <p>GCB SmartHall – Queue, Learn & Serve</p>

          <p className="flex items-center gap-2">
            <RefreshCw size={14} />
            Queue refreshes every 5 seconds
          </p>
        </footer>

      </section>
    </main>
  )
}

export default QueueDisplayPage
