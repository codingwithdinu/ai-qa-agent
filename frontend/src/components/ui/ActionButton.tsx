import { cn } from '../../lib/cn'
import type { ButtonHTMLAttributes } from 'react'


interface ActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variants: Record<NonNullable<ActionButtonProps['variant']>, string> = {
  primary:
    'bg-sky-500 text-on-accent shadow-[0_12px_24px_rgba(14,165,233,0.25)] hover:bg-sky-600',
  secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
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