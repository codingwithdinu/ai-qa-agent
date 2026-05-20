import type { ReactNode } from 'react'
import { GlassPanel } from './GlassPanel'

interface DataTableProps<T> {
  title: string
  description: string
  columns: Array<{
    key: keyof T | string
    label: string
    render?: (row: T) => ReactNode
  }>
  rows: T[]
}

export function DataTable<T extends { id: string }>({
  title,
  description,
  columns,
  rows,
}: DataTableProps<T>) {

  return (

    <GlassPanel className="overflow-hidden p-0">

      {/* HEADER */}
      <div className="border-b border-white/10 px-6 py-5">

        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {description}
        </p>

      </div>

      {/* TABLE CONTAINER */}
      <div className="max-h-[680px] overflow-auto">

        <table className="min-w-[1100px] w-full border-collapse">

          {/* TABLE HEADER */}
          <thead className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-xl">

            <tr className="border-b border-white/10">

              {columns.map((column) => (

                <th
                  key={column.label}
                  className="
                    px-6
                    py-4
                    text-left
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.24em]
                    text-slate-500
                    whitespace-nowrap
                  "
                >
                  {column.label}
                </th>

              ))}

            </tr>

          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-white/5 text-sm text-slate-300">

            {rows.length === 0 && (

              <tr>

                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center text-sm text-slate-500"
                >
                  No records available
                </td>

              </tr>

            )}

            {rows.map((row, rowIndex) => (

              <tr
                key={row.id}
                className="
                  transition-all
                  duration-200
                  hover:bg-cyan-400/5
                  hover:backdrop-blur-xl
                "
              >

                {columns.map((column) => (

                  <td
                    key={`${row.id}-${column.label}`}
                    className="
                      px-6
                      py-5
                      align-top
                      whitespace-nowrap
                    "
                  >

                    <div className="text-sm text-slate-200">

                      {column.render
                        ? column.render(row)
                        : String(row[column.key as keyof T] ?? '—')}

                    </div>

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