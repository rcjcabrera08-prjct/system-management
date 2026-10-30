interface CrosshairProps {
  className?: string
}

export function Crosshair({ className = '' }: CrosshairProps) {
  return (
    <span aria-hidden className={`pointer-events-none select-none text-slate-300 leading-none ${className}`}>
      +
    </span>
  )
}
