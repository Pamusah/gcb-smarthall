import { ArrowUpRight, Check } from 'lucide-react'

function ServiceCard({
  title,
  description,
  icon: Icon,
  onClick,
  selected
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative w-full overflow-hidden rounded-2xl border p-7 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gcb-amber focus:ring-offset-2
        ${
          selected
            ? 'border-gcb-amber bg-amber-50 shadow-lg ring-1 ring-gcb-amber'
            : 'border-gray-200/80 bg-white shadow-sm hover:border-gcb-amber'
        }`}
    >
      {/* Decorative accent */}
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gcb-amber/10 transition-all duration-300 group-hover:h-32 group-hover:w-32" />

      <div className="relative z-10">

        {/* Icon */}
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300
          ${
            selected
              ? 'bg-gcb-amber text-gcb-charcoal'
              : 'bg-gcb-amber/15 text-gcb-charcoal group-hover:bg-gcb-amber'
          }`}
        >
          <Icon size={27} strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gcb-charcoal">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-3 min-h-12 text-sm leading-6 text-gcb-grey">
          {description}
        </p>

        {/* Selection indicator */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-gcb-charcoal">
            {selected ? 'Selected' : 'Select service'}
          </span>

          {selected ? (
            <Check size={21} className="text-amber-700" />
          ) : (
            <ArrowUpRight
              size={20}
              className="text-gcb-grey transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          )}
        </div>

      </div>
    </button>
  )
}

export default ServiceCard