import { Download, FileJson, FileSpreadsheet, GalleryVerticalEnd, PlaySquare } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts'
import { ActionButton } from '../../components/ui/ActionButton'
import { ChartCard } from '../../components/ui/ChartCard'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { Loader } from '../../components/ui/Loader'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { useToast } from '../../context/ToastContext'
import type { CompatibilityDatum, HeatmapDatum, ReportInsight } from '../../types/platform'
import { getReportsData } from '../../services/dashboard.service'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";






interface ReportsDataState {
  reportInsights: ReportInsight[]
  compatibilityData: CompatibilityDatum[]
  heatmapData: HeatmapDatum[]
  executions: any[]
}

export function ReportsPage() {
  const [data, setData] = useState<ReportsDataState | null>(null)
  const [artifacts, setArtifacts] = useState<any[]>([])
  const { pushToast } = useToast()
  const loadReports = useCallback(async () => {
    try {
      const reports =
        await getReportsData();
      setData(reports);
    } catch (error) {
      console.error(error);
    }
  },
    []
  )
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const exportCSV = () => {

    if (!data) return;

    const headers = [

      "Execution ID",
      "Status",
      "Duration",
      "Healed Count",
      "Created Date",
      "Created Time",

    ];

    const rows =
      data.executions.map((e, index) => [

        e.id || `Execution-${index + 1}`,

        e.status,

        `${e.duration}s`,

        e.healedCount,

        e.createdAt
          ? new Date(e.createdAt)
            .toLocaleDateString()
          : "--",

        e.createdAt
          ? new Date(e.createdAt)
            .toLocaleTimeString()
          : "--",

      ]);

    const csvContent = [

      headers.join(","),

      ...rows.map((r) =>
        r.join(",")
      ),

    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(
      blob,
      "ai-qa-full-report.csv"
    );

    pushToast({

      title: "CSV downloaded",

      description:
        "Full execution analytics exported.",

      tone: "success",

    });

  };

  const downloadPDF = () => {

    if (!data) return;

    const doc =
      new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "AI QA Report",
      14,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Total Executions: ${data.executions.length}`,
      14,
      35
    );

    doc.text(
      `Heatmaps: ${data.heatmapData.length}`,
      14,
      45
    );

    doc.text(
      `Compatibility Reports: ${data.compatibilityData.length}`,
      14,
      55
    );

    autoTable(doc, {

      startY: 70,

      head: [[

        "Execution ID",
        "Status",
        "Duration",
        "Healed",
        "Date",
        "Time"

      ]],

      body:
        data.executions.map((e, index) => [

          e.id || `Execution-${index + 1}`,

          e.status,

          `${e.duration}s`,

          e.healedCount,

          e.createdAt
            ? new Date(e.createdAt)
              .toLocaleDateString()
            : "--",

          e.createdAt
            ? new Date(e.createdAt)
              .toLocaleTimeString()
            : "--",

        ]),

    });

    doc.save(
      "ai-qa-report.pdf"
    );

    pushToast({

      title: "PDF downloaded",

      description:
        "Executive report generated successfully.",

      tone: "success",

    });

  };

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {

    const loadArtifacts =
      async () => {

        try {

          const token =
            localStorage.getItem("token");

          const response =
            await fetch(

              `${import.meta.env.VITE_API_URL}/test-results`,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );
          const result =
            await response.json();

          setArtifacts(result);

        } catch (error) {

          console.error(
            "Failed loading artifacts",
            error
          );

        }

      };

    loadArtifacts();

  }, []);

  useEffect(() => {
    const interval =
      setInterval(() => {
        loadReports();
      }, 10000);
    return () =>
      clearInterval(interval);
  }, []);


  if (!data) {
    return <Loader label="Compiling analytics, exports, and report evidence…" />
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Reporting intelligence"
        title="Download executive-ready QA reports and analytics"
        description="Generate PDF summaries, CSV/JSON exports, compatibility matrices, historical trends, and media evidence for every release."
        action={
          <>
            <ActionButton
              variant="secondary"
              onClick={exportCSV}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </ActionButton>

            <ActionButton
              onClick={downloadPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </ActionButton>
          </>
        }
      />

      <div className="max-h-[820px] overflow-y-auto pr-2">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.reportInsights.map((insight) => (

            <GlassPanel
              key={insight.id}
              className="
      rounded-[28px]
      border
      border-white/10
      bg-gradient-to-br
      from-slate-900/90
      to-slate-950/40
      p-5
      transition-all
      duration-300
      hover:border-cyan-400/20
      hover:shadow-lg
      hover:shadow-cyan-500/5
    "
            >

              {/* TITLE */}
              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="text-sm font-semibold text-white">
                    {insight.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {insight.description}
                  </p>

                </div>

                <span
                  className={`
          rounded-full
          px-3
          py-1
          text-[10px]
          uppercase
          tracking-[0.18em]
          border
          ${insight.description
                      .toLowerCase()
                      .includes("failed")
                      ? "border-red-400/20 bg-red-500/10 text-red-300"
                      : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                    }
        `}
                >

                  {
                    insight.description
                      .toLowerCase()
                      .includes("failed")
                      ? "Failed"
                      : "Passed"
                  }

                </span>

              </div>

              {/* FOOTER */}
              <div className="mt-5 flex items-center justify-between">

                {/* DURATION */}
                <p className="text-lg font-semibold text-cyan-300">
                  {insight.metric}
                </p>

               

              </div>

            </GlassPanel>

          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartCard title="Browser compatibility matrix" description="Cross-browser quality score by module">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.compatibilityData}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="browser" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#020617', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)' }} />
              <Bar dataKey="chrome" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              <Bar dataKey="firefox" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="webkit" fill="#34d399" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Failure heatmap"
          description="Module-level failure clustering and healing effectiveness"
        >
          <div className="max-h-[620px] overflow-y-auto pr-2">
            <div
              className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-4
    "
            >
              {data.heatmapData.map((item) => (
                <div
                  key={item.module}
                  className="
          rounded-[1.5rem]
          border
          border-white/10
          p-4
          min-h-[220px]
          flex
          flex-col
          justify-between
        "
                  style={{
                    background: `linear-gradient(
            180deg,
            rgba(34,211,238,${Math.min(item.healed / 25, 0.6)}),
            rgba(15,23,42,0.92)
          )`,
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.module}
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Failures
                    </p>

                    <p className="mt-1 text-3xl font-semibold text-white">
                      {item.failures}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-[1px] uppercase tracking-[0.2em] text-slate-500">
                      Healed
                    </p>

                    <p className="mt-1 text-xl font-semibold text-cyan-200">
                      {item.healed}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><FileJson className="h-5 w-5" /></span>
            <div>
              <h3 className="text-lg font-semibold text-white">Execution summaries</h3>
              <p className="text-sm text-slate-400">JSON, CSV, and PDF outputs ready for stakeholder distribution</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              `${data.executions.length || 0} execution insights generated`,
              `${data.heatmapData.length || 0} module heatmaps analyzed`,
              `${data.compatibilityData.length || 0} browser reports exported`
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-violet-400/10 p-3 text-violet-200"><GalleryVerticalEnd className="h-5 w-5" /></span>
            <div>
              <h3 className="text-lg font-semibold text-white">Screenshots gallery</h3>
              <p className="text-sm text-slate-400">Curated evidence across failure states and recovered journeys</p>
            </div>
          </div>
          <div className="mt-6 max-h-[720px] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-3">
              {artifacts.map((item) => (

                <div
                  key={item.id}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70"
                >

                  {item.screenshot ? (

                    <img
                      src={item.screenshot}
                      alt="execution"
                      className="h-28 w-full object-cover cursor-pointer hover:scale-105 transition"
                      onClick={() => setSelectedImage(item.screenshot)}
                    />

                  ) : (

                    <div className="grid h-28 place-items-center text-sm text-slate-500">
                      No screenshot
                    </div>

                  )}

                </div>

              ))}
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200"><PlaySquare className="h-5 w-5" /></span>
            <div>
              <h3 className="text-lg font-semibold text-white">Video recordings</h3>
              <p className="text-sm text-slate-400">Latest evidence captured with playback-ready traces</p>
            </div>
          </div>
          <div className="mt-6 max-h-[720px] overflow-y-auto space-y-3 pr-2">
            {artifacts.map((item) => (
              item.video && (
                <video
                  key={item.id}
                  controls
                  className="w-full rounded-2xl border border-white/10"
                >
                  <source
                    src={item.video}
                    type="video/webm"
                  />
                </video>

              )
            ))}
          </div>
        </GlassPanel>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl border border-white/10 shadow-2xl"
          />
        </div>
      )}
    </div>
  )
}