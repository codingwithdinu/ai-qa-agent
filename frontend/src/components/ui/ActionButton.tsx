import { cn } from '../../lib/cn'
import type { ButtonHTMLAttributes } from 'react'


interface ActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variants: Record<NonNullable<ActionButtonProps['variant']>, string> = {
  primary:
    'bg-cyan-400 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.35)] hover:bg-cyan-300',
  secondary: 'bg-white/10 text-white ring-1 ring-inset ring-white/10 hover:bg-white/15',
  ghost: 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
}

export function ActionButton({ className, variant = 'primary', ...props }: ActionButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}