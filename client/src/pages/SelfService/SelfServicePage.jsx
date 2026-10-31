
import { useState } from 'react'

import {
  Wallet,
  Banknote,
  ArrowLeftRight,
  ClipboardList,
  Smartphone,
  Headphones,
  Clock3,
  ShieldCheck
} from 'lucide-react'

import PageHeader from '../../components/common/PageHeader'
import ServiceCard from '../../components/self-service/ServiceCard'
import PrimaryButton from '../../components/common/PrimaryButton'
import TransactionSelection from '../../components/self-service/TransactionSelection'

function SelfServicePage() {

  const [selectedService, setSelectedService] = useState(null)
  const [showTransactions, setShowTransactions] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

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
    setShowTransactions(true)
  }

  const handleTransactionSelection = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleBack = () => {
    setShowTransactions(false)
    setSelectedTransaction(null)
  }

  const handleProceed = () => {
    if (!selectedTransaction) return

    console.log('Customer selection:', {
      service: selectedService,
      transaction: selectedTransaction
    })
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">

        <PageHeader
          title="How can we help you today?"
          subtitle="Welcome to GCB SmartHall. Select the banking service you require to get started."
        />

        {!showTransactions ? (

          /* Stage 1: Service Selection */
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

          /* Stage 2: Transaction Selection */
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

                <div className="mt-5 flex flex-wrap justify-end gap-3">

                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                  >
                    Change selection
                  </button>

                  <PrimaryButton
                    onClick={handleProceed}
                  >
                    Proceed
                  </PrimaryButton>

                </div>

              </div>
            )}
          </section>

        )}

        {/* Security Information */}
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

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-5 text-center">
        <p className="text-xs text-gcb-grey">
          GCB SmartHall · Queue, Learn & Serve
        </p>
      </footer>

    </div>
  )
}

export default SelfServicePage
