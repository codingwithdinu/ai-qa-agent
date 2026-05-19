interface LoaderProps {
  label?: string
}

export function Loader({
  label = 'Syncing AI telemetry…',
}: LoaderProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-sm text-slate-400">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-400/25 border-t-cyan-300" />
      <p>{label}</p>
    </div>
  )
}