// function PageHeader({ title, subtitle }) {
//   return (
//     <header className="mb-8">
//       <h1 className="text-3xl font-bold text-gcb-charcoal">
//         {title}
//       </h1>

//       <p className="mt-2 text-gcb-grey">
//         {subtitle}
//       </p>

//       <div className="mt-4 h-1 w-16 bg-gcb-amber rounded-full" />
//     </header>
//   )
// }

// export default PageHeader

import { ShieldCheck } from 'lucide-react'

function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-12 animate-fade-in">

      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
        <ShieldCheck size={16} className="text-amber-700" />

        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
          GCB Bank PLC
        </span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-gcb-charcoal sm:text-4xl lg:text-5xl">
        {title}
        <span className="text-gcb-amber">.</span>
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-7 text-gcb-grey sm:text-lg">
        {subtitle}
      </p>

      <div className="mt-7 h-1.5 w-20 rounded-full bg-gcb-amber" />

    </header>
  )
}

export default PageHeader