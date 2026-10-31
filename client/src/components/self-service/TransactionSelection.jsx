import {
  Wallet,
  Banknote,
  ArrowLeftRight,
  FileText,
  Smartphone,
  Headphones
} from 'lucide-react'

const transactionOptions = {
  'Cash Deposit': [
    { title: 'Individual Deposit', description: 'Make a deposit into an individual account.', icon: Wallet },
    { title: 'Business Deposit', description: 'Make a deposit into a business account.', icon: FileText }
  ],

  'Cash Withdrawal': [
    { title: 'Personal Withdrawal', description: 'Request a personal cash withdrawal.', icon: Banknote }
  ],

  'Funds Transfer': [
    { title: 'Transfer Assistance', description: 'Get assistance with a funds transfer.', icon: ArrowLeftRight }
  ],

  'Account Services': [
    { title: 'Cheque Book Request', description: 'Request or enquire about a cheque book.', icon: FileText },
    { title: 'Account Enquiry', description: 'Get assistance with account-related enquiries.', icon: Wallet }
  ],

  'Digital Banking': [
    { title: 'GCB Mobile App', description: 'Get help with the GCB Mobile App.', icon: Smartphone },
    { title: 'USSD Banking', description: 'Get help using GCB USSD services.', icon: Smartphone }
  ],

  'Other Services': [
    { title: 'General Enquiry', description: 'Speak to a customer service representative.', icon: Headphones }
  ]
}

function TransactionSelection({ service, onSelect, onBack }) {
  const options = transactionOptions[service] || []

  return (
    <div className="mt-8 animate-fade-in">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gcb-charcoal">
            {service}
          </h2>
          <p className="mt-2 text-sm text-gcb-grey">
            Select the specific service you require.
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-sm font-semibold text-gcb-charcoal hover:text-amber-700"
        >
          ← Change service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {options.map((option) => {
          const Icon = option.icon

          return (
            <button
              key={option.title}
              onClick={() => onSelect(option.title)}
              className="group flex items-center gap-5 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gcb-amber hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gcb-amber/15 group-hover:bg-gcb-amber">
                <Icon size={24} />
              </div>

              <div>
                <h3 className="font-bold text-gcb-charcoal">
                  {option.title}
                </h3>

                <p className="mt-1 text-sm text-gcb-grey">
                  {option.description}
                </p>
              </div>
            </button>
          )
        })}

      </div>

    </div>
  )
}

export default TransactionSelection