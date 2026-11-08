
import { useState } from 'react'

import {
  Wallet,
  Banknote,
  ArrowLeftRight,
  ClipboardList,
  Smartphone,
  Headphones,
  Clock3,
  ShieldCheck,
  Ticket,
  UserRound,
  CheckCircle2,
  RotateCcw
} from 'lucide-react'

import PageHeader from '../../components/common/PageHeader'
import ServiceCard from '../../components/self-service/ServiceCard'
import PrimaryButton from '../../components/common/PrimaryButton'
import TransactionSelection from '../../components/self-service/TransactionSelection'
import serviceRouting from '../../constants/serviceRouting'
import { registerQueue } from '../../services/api'

function SelfServicePage() {
  const [selectedService, setSelectedService] = useState(null)
  const [showTransactions, setShowTransactions] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [routeResult, setRouteResult] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  const services = [
    {
      title: 'Cash Deposit',
      description: 'Deposit money into your account conveniently.',
      icon: Wallet
    },
    {
      title: 'Cash Withdrawal',
      description: 'Access your funds through our banking services.',
      icon: Banknote
    },
    {
      title: 'Funds Transfer',
      description: 'Move money between accounts with ease.',
      icon: ArrowLeftRight
    },
    {
      title: 'Account Services',
      description: 'Get assistance with your account-related requests.',
      icon: ClipboardList
    },
    {
      title: 'Digital Banking',
      description: 'Discover GCB Mobile App and USSD banking services.',
      icon: Smartphone
    },
    {
      title: 'Other Services',
      description: 'Get assistance with other banking enquiries.',
      icon: Headphones
    }
  ]

  const handleServiceSelection = (service) => {
    setSelectedService(service)
  }

  const handleContinue = () => {
    if (!selectedService) return

    setSelectedTransaction(null)
    setSubmissionError('')
    setShowTransactions(true)
  }

  const handleTransactionSelection = (transaction) => {
    setSelectedTransaction(transaction)
    setSubmissionError('')
  }

  const handleBack = () => {
    setShowTransactions(false)
    setSelectedTransaction(null)
    setSubmissionError('')
  }

  // Register customer or direct to digital self-service
  const handleProceed = async () => {
    if (!selectedTransaction || isSubmitting) return

    const route = serviceRouting[selectedTransaction]

    if (!route) {
      setSubmissionError('This service is not currently configured.')
      return
    }

    // Digital services do not require queue registration
    if (route === 'digital') {
      setRouteResult({
        type: 'digital',
        service: selectedService,
        transaction: selectedTransaction
      })

      return
    }

    // Register teller service through the backend
    setIsSubmitting(true)
    setSubmissionError('')

    try {
      const response = await registerQueue({
        service: selectedService,
        transaction: selectedTransaction
      })

      setRouteResult({
        type: 'staff',
        service: selectedService,
        transaction: selectedTransaction,
        ticket: response.data
      })

    } catch (error) {
      console.error('Queue registration failed:', error)

      setSubmissionError(
        error.message || 'Unable to register your queue ticket.'
      )

    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartAgain = () => {
    setSelectedService(null)
    setSelectedTransaction(null)
    setShowTransactions(false)
    setRouteResult(null)
    setSubmissionError('')
  }

  return (
    <div className="min-h-screen bg-gcb-light">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gcb-amber font-extrabold text-gcb-charcoal">
              G
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-gcb-charcoal">
                GCB SmartHall
              </h2>
              <p className="text-xs text-gcb-grey">
                Queue, Learn & Serve
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-gray-50 px-4 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-600">
              Customer Self-Service
            </span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">

        {!routeResult ? (
          <>
            <PageHeader
              title="How can we help you today?"
              subtitle="Welcome to GCB SmartHall. Select the banking service you require to get started."
            />

            {!showTransactions ? (
              <section>
                <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="text-xl font-bold text-gcb-charcoal">
                      Available Services
                    </h2>

                    <p className="mt-1 text-sm text-gcb-grey">
                      Choose a service below to continue.
                    </p>
                  </div>

                  <span className="text-sm font-medium text-gcb-grey">
                    {services.length} services available
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service, index) => (
                    <div
                      key={service.title}
                      className="animate-card-in"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <ServiceCard
                        title={service.title}
                        description={service.description}
                        icon={service.icon}
                        selected={selectedService === service.title}
                        onClick={() => handleServiceSelection(service.title)}
                      />
                    </div>
                  ))}
                </div>

                {selectedService && (
                  <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 animate-fade-in">
                    <p className="text-sm text-gcb-grey">
                      Your selected service
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-gcb-charcoal">
                      {selectedService}
                    </h3>
                  </div>
                )}

                <div className="mt-10 flex justify-end">
                  <PrimaryButton
                    onClick={handleContinue}
                    disabled={!selectedService}
                  >
                    Continue
                  </PrimaryButton>
                </div>
              </section>
            ) : (
              <section>
                <TransactionSelection
                  service={selectedService}
                  onSelect={handleTransactionSelection}
                  onBack={handleBack}
                />

                {selectedTransaction && (
                  <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 animate-fade-in">
                    <p className="text-sm text-gcb-grey">
                      Your selected transaction
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-gcb-charcoal">
                      {selectedTransaction}
                    </h3>

                    <p className="mt-1 text-sm text-gcb-grey">
                      {selectedService}
                    </p>

                    {submissionError && (
                      <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {submissionError}
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap justify-end gap-3">
                      <button
                        onClick={() => {
                          setSelectedTransaction(null)
                          setSubmissionError('')
                        }}
                        disabled={isSubmitting}
                        className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                      >
                        Change selection
                      </button>

                      <PrimaryButton
                        onClick={handleProceed}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Registering...' : 'Proceed'}
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </section>
            )}
          </>
        ) : (
          <section className="mx-auto max-w-2xl animate-fade-in">

            {/* Successful queue registration */}
            {routeResult.type === 'staff' ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                  <CheckCircle2 size={34} />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-wider text-green-700">
                  Queue registration successful
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-gcb-charcoal">
                  Your service request is registered
                </h2>

                <p className="mt-3 text-sm leading-6 text-gcb-grey">
                  Please wait for your assigned teller to attend to you.
                </p>

                <div className="my-8 rounded-2xl bg-gcb-light p-6">
                  <Ticket size={30} className="mx-auto text-amber-700" />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-gcb-grey">
                    Your queue ticket
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-gcb-charcoal sm:text-5xl">
                    {routeResult.ticket.ticketId}
                  </p>

                  <div className="mt-6 border-t border-gray-200 pt-5">
                    <div className="flex items-center justify-center gap-2 text-gcb-charcoal">
                      <UserRound size={20} />

                      <span className="font-bold">
                        Assigned Teller: {routeResult.ticket.assignedTeller || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gcb-grey">
                  {routeResult.transaction} · {routeResult.service}
                </p>

                <p className="mt-4 text-xs text-amber-700">
                  Your ticket has been saved in the SmartHall database.
                </p>

                <div className="mt-8">
                  <PrimaryButton onClick={handleStartAgain}>
                    <span className="flex items-center gap-2">
                      <RotateCcw size={17} />
                      Start again
                    </span>
                  </PrimaryButton>
                </div>
              </div>
            ) : (
              /* Digital self-service */
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Smartphone size={34} />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-wider text-amber-700">
                  Digital self-service
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-gcb-charcoal">
                  Let's get you started
                </h2>

                <p className="mt-3 text-sm leading-6 text-gcb-grey">
                  You selected {routeResult.transaction}.
                  Follow the guidance below to explore GCB digital banking.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="rounded-xl bg-gcb-light p-5">
                    <h3 className="font-bold text-gcb-charcoal">
                      Step 1: Open the GCB Mobile App
                    </h3>

                    <p className="mt-2 text-sm text-gcb-grey">
                      Open the official app on your mobile device.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gcb-light p-5">
                    <h3 className="font-bold text-gcb-charcoal">
                      Step 2: Select your service
                    </h3>

                    <p className="mt-2 text-sm text-gcb-grey">
                      Navigate to the relevant feature and follow the instructions displayed in the app.
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-5">
                    <h3 className="font-bold text-gcb-charcoal">
                      Need assistance?
                    </h3>

                    <p className="mt-2 text-sm text-gcb-grey">
                      A GCB staff member can help you understand the digital service.
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xs text-gcb-grey">
                  This is a demonstration guide. No banking transaction has been performed.
                </p>

                <div className="mt-8">
                  <PrimaryButton onClick={handleStartAgain}>
                    <span className="flex items-center gap-2">
                      <RotateCcw size={17} />
                      Start again
                    </span>
                  </PrimaryButton>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Security information */}
        <div className="mt-14 grid grid-cols-1 gap-4 border-t border-gray-200 pt-8 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
              <ShieldCheck size={21} className="text-amber-700" />
            </div>

            <div>
              <p className="text-sm font-bold text-gcb-charcoal">
                Your security matters
              </p>

              <p className="text-xs text-gcb-grey">
                Protect your personal banking information.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
              <Clock3 size={21} className="text-amber-700" />
            </div>

            <div>
              <p className="text-sm font-bold text-gcb-charcoal">
                Faster branch experience
              </p>

              <p className="text-xs text-gcb-grey">
                Select your service before joining the queue.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white px-6 py-5 text-center">
        <p className="text-xs text-gcb-grey">
          GCB SmartHall · Queue, Learn & Serve
        </p>
      </footer>
    </div>
  )
}

export default SelfServicePage
