import { GlassPanel } from './GlassPanel'

interface CodeViewerProps {
  code: string
}

export function CodeViewer({
  code,
}: CodeViewerProps) {

  return (

    <GlassPanel className="h-full overflow-hidden p-0">

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">

        <div>

          <p className="text-sm font-semibold text-white">
            Generated Playwright spec
          </p>

          <p className="text-xs text-slate-400">
            Auto-optimized for stable selectors and enterprise reusability
          </p>

        </div>

        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
          TypeScript
        </span>

      </div>

      <pre className="h-[360px] overflow-auto bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">

        <code>{code}</code>

      </pre>

    </GlassPanel>
  )
}