
import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  ArrowLeftRight,
  Wallet,
  FileText,
  Lightbulb,
  PlayCircle
} from 'lucide-react'

const lessons = [
  {
    week: 'WEEK 1',
    title: 'Check Your Account Balance',
    category: 'GCB DIGITAL BANKING',
    description:
      'You do not always need to visit a banking hall to access your account information.',
    steps: [
      'Open the approved GCB digital banking channel.',
      'Sign in using your authorised credentials.',
      'Navigate to the account balance section.',
      'Check your available balance securely.'
    ],
    tip: 'Never share your PIN, password or OTP with anyone.',
    icon: Smartphone,
    color: 'bg-blue-600'
  },
  {
    week: 'WEEK 2',
    title: 'Transfer Funds with Ease',
    category: 'DIGITAL TRANSACTIONS',
    description:
      'Explore convenient ways to transfer funds through GCB digital banking channels.',
    steps: [
      'Access an approved GCB digital banking channel.',
      'Select the funds transfer option.',
      'Enter the beneficiary details carefully.',
      'Confirm the details before authorising the transaction.'
    ],
    tip: 'Always verify the recipient details before confirming a transfer.',
    icon: ArrowLeftRight,
    color: 'bg-indigo-600'
  },
  {
    week: 'WEEK 3',
    title: 'Bank to Wallet and Wallet to Bank',
    category: 'MOBILE MONEY',
    description:
      'Discover how bank accounts and mobile money wallets can work together.',
    steps: [
      'Access the approved banking or mobile money channel.',
      'Select the appropriate transfer option.',
      'Enter the correct destination details.',
      'Review the transaction before confirmation.'
    ],
    tip: 'Keep your transaction confirmation and report unfamiliar transactions promptly.',
    icon: Wallet,
    color: 'bg-emerald-600'
  },
  {
    week: 'WEEK 4',
    title: 'Request Your Cheque Book',
    category: 'ACCOUNT SERVICES',
    description:
      'Learn about the cheque book request process and how to follow up on your request.',
    steps: [
      'Contact an authorised GCB service channel.',
      'Request a cheque book for your eligible account.',
      'Follow the bank’s verification and collection process.',
      'Collect your cheque book through the approved procedure.'
    ],
    tip: 'Keep your cheque book secure and report lost or stolen leaves immediately.',
    icon: FileText,
    color: 'bg-amber-500'
  },
  {
    week: 'BONUS LESSON',
    title: 'Protect Yourself from Fraud',
    category: 'BANKING SECURITY',
    description:
      'Your banking security starts with the decisions you make every day.',
    steps: [
      'Never disclose your PIN, password or OTP.',
      'Do not give your debit card to strangers.',
      'Avoid clicking suspicious banking links.',
      'Report suspicious transactions through official GCB channels.'
    ],
    tip: 'GCB staff should never ask you to disclose your secret PIN or OTP.',
    icon: ShieldCheck,
    color: 'bg-red-600'
  }
]

function SmartLearnPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeLesson = lessons[activeIndex]
  const ActiveIcon = activeLesson.icon

  const nextLesson = () => {
    setActiveIndex(current => (current + 1) % lessons.length)
  }

  const previousLesson = () => {
    setActiveIndex(current =>
      (current - 1 + lessons.length) % lessons.length
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(current => (current + 1) % lessons.length)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gcb-charcoal text-white">

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div>
            <p className="font-bold tracking-widest text-gcb-amber">
              GCB BANK PLC
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Smart Learn
            </h1>

            <p className="mt-2 text-sm text-gray-300">
              Learn more. Bank smarter. Stay secure.
            </p>
          </div>

          <div className="hidden rounded-xl bg-gcb-amber p-4 text-gcb-charcoal sm:block">
            <Lightbulb size={36} />
          </div>

        </div>
      </header>

      {/* Lesson content */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-2 md:items-center md:px-12">

        {/* Left content */}
        <div className="animate-fade-in">

          <div className="mb-6 flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-gcb-amber px-4 py-2 text-sm font-bold text-gcb-charcoal">
              {activeLesson.week}
            </span>

            <span className="text-sm font-semibold tracking-widest text-gray-400">
              {activeLesson.category}
            </span>

          </div>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            {activeLesson.title}
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
            {activeLesson.description}
          </p>

          <div className="mt-8 space-y-5">

            <h3 className="text-sm font-bold uppercase tracking-widest text-gcb-amber">
              What you need to know
            </h3>

            {activeLesson.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold text-gcb-amber">
                  {index + 1}
                </span>

                <p className="pt-1 text-gray-200">
                  {step}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* Right visual */}
        <div className="flex flex-col gap-6">

          <div className={`${activeLesson.color} flex min-h-80 items-center justify-center rounded-3xl p-10 shadow-2xl md:min-h-105`}>

            <div className="text-center">

              <div className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-white/20 md:h-48 md:w-48">
                <ActiveIcon size={100} strokeWidth={1.5} />
              </div>

              <p className="text-sm font-bold tracking-[0.25em] text-white/80">
                GCB SMART LEARN
              </p>

              <h3 className="mt-3 text-3xl font-bold md:text-4xl">
                Banking Made Easier
              </h3>

            </div>

          </div>

          {/* Important reminder */}
          <div className="rounded-2xl border border-gcb-amber/30 bg-white/5 p-6">

            <div className="flex items-center gap-3">
              <ShieldCheck className="text-gcb-amber" size={25} />

              <h3 className="font-bold">
                Smart Banking Tip
              </h3>
            </div>

            <p className="mt-3 leading-relaxed text-gray-300">
              {activeLesson.tip}
            </p>

          </div>

        </div>

      </section>

      {/* Navigation */}
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t border-white/10 px-6 py-6 md:px-12">

        <div>
          <p className="text-sm text-gray-400">
            SMART LEARN PROGRAM
          </p>

          <p className="mt-1 font-semibold">
            Lesson {activeIndex + 1} of {lessons.length}
          </p>

          <div className="mt-3 flex gap-2">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.title}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${lesson.title}`}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index
                    ? 'w-10 bg-gcb-amber'
                    : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={previousLesson}
            aria-label="Previous lesson"
            className="rounded-xl border border-white/20 p-3 transition hover:bg-white/10"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={nextLesson}
            className="flex items-center gap-2 rounded-xl bg-gcb-amber px-5 py-3 font-bold text-gcb-charcoal transition hover:brightness-95"
          >
            Next Lesson
            <ChevronRight />
          </button>

        </div>

      </footer>

      <div className="pb-5 text-center text-xs text-gray-500">
        <PlayCircle size={14} className="mr-1 inline" />
        Lessons automatically rotate every 15 seconds.
      </div>

    </main>
  )
}

export default SmartLearnPage
