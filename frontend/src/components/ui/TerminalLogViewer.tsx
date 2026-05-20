import type { LogLine } from '../../types/platform'
import { GlassPanel } from './GlassPanel'

const toneMap: Record<LogLine['level'], string> = {
  INFO: 'text-slate-300',
  WARN: 'text-amber-300',
  ERROR: 'text-rose-300',
  AI: 'text-cyan-300',
}

export function TerminalLogViewer({ lines }: { lines: LogLine[] }) {
  return (
    <GlassPanel className="h-full overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Real-time console</p>
          <p className="text-xs text-slate-400">Streaming execution telemetry and AI actions</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>
      <div className="terminal-grid h-[620px] overflow-auto p-5 font-mono text-sm">
        {lines.length === 0 && (
          <div className="text-sm text-slate-500">
            No live logs available
          </div>
        )}
        {lines.map((line) => (
          <div key={line.id} className="mb-3 grid grid-cols-[auto_1fr] gap-3">
            <span className="text-slate-500">{line.timestamp}</span>
            <p className={toneMap[line.level]}>
              <span className="mr-2 text-slate-500">[{line.level}]</span>
              {line.message}
            </p>
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}