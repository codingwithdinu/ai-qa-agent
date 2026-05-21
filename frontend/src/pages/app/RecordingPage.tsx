import { MonitorPlay, PauseCircle, ScanSearch, WandSparkles } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { saveAs } from "file-saver";

import { ActionButton } from '../../components/ui/ActionButton'
import { CodeViewer } from '../../components/ui/CodeViewer'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { Loader } from '../../components/ui/Loader'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusPill } from '../../components/ui/StatusPill'
import { useToast } from '../../context/ToastContext'
import type { RecordingStep } from '../../types/platform'
import { getRecordings } from '../../services/dashboard.service'
import api from '../../api/client'

interface RecordingDataState {
  recordingSteps: RecordingStep[]
  generatedScript: string
}

export function RecordingPage() {
  const [data, setData] = useState<RecordingDataState | null>(null)
  const { pushToast } = useToast()
  const [recording, setRecording] = useState(false)
  const [recordingId, setRecordingId] = useState('')
  const [recordingUrl, setRecordingUrl] = useState('')

  const exportJSON = () => {

    const exportData = {

      generatedAt:
        new Date().toISOString(),

      steps:
        data?.recordingSteps || [],

      generatedScript:
        data?.generatedScript || "",

    };

    const blob = new Blob(
      [
        JSON.stringify(
          exportData,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    saveAs(
      blob,
      "recording-workflow.json"
    );

    pushToast({

      title: "JSON exported",

      description:
        "Workflow exported successfully.",

      tone: "success",

    });

  };

  const loadRecordings = useCallback(
    async () => {
      try {
        const recordingData = await getRecordings();
        setData(recordingData);
      } catch (error) {
        console.error(error);
      }
    },
    []
  )

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    const interval =
      setInterval(() => {
        loadRecordings();
      }, 10000);
    return () =>
      clearInterval(interval);
  }, []);

  if (!data) {
    return <Loader label="Preparing the AI recording studio…" />
  }

  if (
    data &&
    data.recordingSteps.length === 0
  ) {
    return (
      <div className="text-slate-400">
        No recordings found
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="AI recording studio"
        title="Capture flows and generate stable Playwright instantly"
        description="Record browser sessions, inspect selectors, and watch AI optimize every step into reusable test logic."

      />
      {
        recording && (

          <GlassPanel className="border border-rose-500/20 bg-rose-500/10 p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-rose-300">
                  🔴 Recording Active
                </p>

                <h3 className="mt-2 text-lg font-semibold text-white">
                  {recordingUrl}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Recording ID:
                  {recordingId}
                </p>

              </div>

              <ActionButton
                variant="secondary"
                onClick={async () => {

                  try {
                    const stopResponse =
                      await api.post(
                        '/record/stop',
                        {
                          recordingId,
                        }
                      )
                      
                    chrome.storage.local.clear()


                    const stopResult =
                      stopResponse.data
                    /**
                     * AUTO GENERATE
                     */
                    await api.post(
                      `/test/generate/${stopResult.recordingId}`
                    )

                    /**
                     * AUTO EXECUTE
                     */
                    await api.post(
                      `/test/execute/${stopResult.recordingId}`
                    )
                    setRecording(false)

                    await loadRecordings()

                    pushToast({
                      title: 'Recording completed',
                      description:
                        'Test generated successfully.',
                      tone: 'success',
                    })

                  } catch (error) {

                    console.error(error)

                  }

                }}
              >
                <PauseCircle className="mr-2 h-4 w-4" />
                Stop Recording
              </ActionButton>

            </div>

          </GlassPanel>
        )
      }

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassPanel className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Browser session preview</h3>
                <p className="mt-1 text-sm text-slate-400">Interactive visual feed with AI activity overlays</p>
              </div>
              <StatusPill label="Live session" tone="info" />
            </div>
          </div>
          <div className="relative grid h-[420px] place-items-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#020617,#111827)]">
            <div className="absolute inset-6 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_50px_rgba(34,211,238,0.12)]">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3">{data.recordingSteps[0]?.selector || 'No active session'}</span>
              </div>
              <div className="mt-4 grid h-[310px] place-items-center rounded-[1.5rem] border border-dashed border-cyan-400/20 bg-slate-950/60">
                <div className="text-center">
                  <MonitorPlay className="mx-auto h-12 w-12 text-cyan-300" />
                  <p className="mt-4 text-lg font-semibold text-white">{data.recordingSteps.length} recorded steps</p>
                  <p className="mt-2 text-sm text-slate-400">AI-generated selectors and assertions are streaming live from backend recordings.</p>
                </div>
              </div>
            </div>
            <div className="absolute right-10 top-10 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.16)]">
              AI optimized {
                data.recordingSteps.filter(
                  (s) => s.status === 'healed'
                ).length
              } unstable selectors
            </div>
            <div className="absolute bottom-10 left-10 rounded-2xl border border-violet-400/20 bg-violet-400/10 px-4 py-3 text-sm text-violet-200 shadow-[0_0_25px_rgba(168,85,247,0.16)]">
              {
                data.recordingSteps.length
              } intelligent assertions generated
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="h-[760px] overflow-hidden p-0">

          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

            <div>
              <h3 className="text-xl font-semibold text-white">
                Recorded workflow timeline
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Action history with selectors, timings, and AI-enhanced statuses
              </p>
            </div>

            <ActionButton
              variant="secondary"
              onClick={exportJSON}
              className="rounded-2xl"
            >
              Export JSON
            </ActionButton>

          </div>

          {/* SCROLL AREA */}
          <div className="h-[650px] overflow-y-auto p-5 space-y-4">

            {data.recordingSteps.map((step, index) => (


              <div
                key={step.id || index}
                className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/40 p-4"                >

                <div className="flex gap-5">

                  {/* LEFT TIMELINE */}
                  <div className="flex flex-col items-center">

                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400/10 text-sm font-semibold text-cyan-200 shadow-lg shadow-cyan-500/10">
                      {index + 1}                    </div>

                    {index <
                      data.recordingSteps.length - 1 && (
                        <div className="mt-3 h-full w-px bg-gradient-to-b from-cyan-400/30 to-transparent" />
                      )}

                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-start justify-between gap-4">

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-3">

                          <h4 className="text-base font-semibold capitalize text-white">
                            {step.action}
                          </h4>

                          <div className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                            Step
                          </div>

                        </div>

                        <div className="mt-3 rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
                          <p className="break-all font-mono text-xs leading-6 text-cyan-300">
                            {step.selector || "No selector"}
                          </p>

                          {step.value && (

                            <div className="mt-3 rounded-xl bg-cyan-400/5 px-3 py-2">

                              <p className="text-xs text-cyan-200">
                                Value: {step.value}
                              </p>

                            </div>

                          )}

                        </div>

                      </div>

                      <StatusPill
                        label={step.status}
                        tone={
                          step.status === "healed"
                            ? "info"
                            : step.status === "optimized"
                              ? "success"
                              : "warning"
                        }
                      />

                    </div>

                    {/* FOOTER */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-500">

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">

                        {step.timestamp
                          ? new Date(
                            step.timestamp
                          ).toLocaleTimeString()
                          : step.duration}

                      </span>

                      <span>•</span>

                      <span>

                        {step.status === "healed"
                          ? "AI patched"
                          : "Stable capture"}

                      </span>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </GlassPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Selector intelligence</h3>
            <StatusPill label="Auto-learning on" tone="success" />
          </div>
          {[
            {
              icon: ScanSearch,
              title: 'Recorded selectors',
              detail:
                `${data.recordingSteps.length} selectors captured from live recordings.`,
            },

            {
              icon: WandSparkles,
              title: 'AI healed selectors',
              detail:
                `${data.recordingSteps.filter(
                  (s) => s.status === 'healed'
                ).length} unstable selectors repaired automatically.`,
            },

            {
              icon: MonitorPlay,
              title: 'Generated assertions',
              detail:
                `${data.recordingSteps.length} reusable Playwright assertions generated.`,
            },
          ].map(({ icon: Icon, title, detail }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-start gap-3">
                <span className="rounded-2xl bg-white/5 p-2 text-cyan-300">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </GlassPanel>

        <CodeViewer code={data.generatedScript} />
      </div>
    </div>
  )
}