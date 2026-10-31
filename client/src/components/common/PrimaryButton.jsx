function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = "button"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="bg-gcb-amber text-gcb-charcoal font-semibold px-6 py-3 rounded-lg hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

export default PrimaryButton