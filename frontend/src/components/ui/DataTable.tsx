import type { ReactNode }
  from 'react'

import { GlassPanel }
  from './GlassPanel'

interface DataTableProps<T> {
  title: string
  description: string
  columns: Array<{ key: keyof T | string; label: string; render?: (row: T) => ReactNode }>
  rows: T[]
}

export function DataTable<T extends { id: string }>({ title, description, columns, rows }: DataTableProps<T>) {
  return (
    <GlassPanel className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.24em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.label} className="px-5 py-4 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No records available
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-white/5">
                {columns.map((column) => (
                  <td key={column.label} className="px-5 py-4 align-top">
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  )
}