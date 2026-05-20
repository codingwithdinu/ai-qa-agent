import { Camera, Cpu, PlayCircle, RefreshCw, Rows3 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ActionButton } from '../../components/ui/ActionButton'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { Loader } from '../../components/ui/Loader'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusPill } from '../../components/ui/StatusPill'
import { TerminalLogViewer } from '../../components/ui/TerminalLogViewer'
import { useToast } from '../../context/ToastContext'
import type { LogLine, RunItem } from '../../types/platform'
import { Play } from "lucide-react";

import {
  getExecutions,
  executeTest,
  generateTest,
  getRecordings,
  getTestResults,
} from "../../services/dashboard.service";

interface ExecutionStats {
  parallelLanes: number
  healingAttempts: number
  artifacts: number
}

interface ExecutionDataState {
  runItems: RunItem[]
  executionLogs: LogLine[]
  stats: ExecutionStats
}

export function TestExecutionPage() {
  const [data, setData] = useState<ExecutionDataState | null>(null)
  const [results, setResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const { pushToast } = useToast()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  useEffect(() => {
    loadExecutions();
  }, []);

  async function loadExecutions() {
    try {
      const executions = await getExecutions();

      const testResults =
        await getTestResults();

      setResults(testResults);

      if (testResults.length > 0) {
        setSelectedResult(testResults[0]);
      }

      const runItems = executions.map((item: any) => ({
        id: item.id,
        suite: item.recordingId,
        browser: "Chrome",
        status: item.status === "PASSED"
          ? "Passed"
          : "Failed",
        healedSelectors: item.healedCount,
        attempts: 1,
        duration: `${item.duration}s`,
        owner: "AI Agent",
      }));


      const executionLogs = executions.map((item: any) => ({
        id: item.id,
        level:
          item.status === "PASSED"
            ? "INFO"
            : "ERROR",
        timestamp: new Date(
          item.createdAt
        ).toLocaleTimeString(),
        message: item.logs.slice(0, 120),
      }));

      setData({
        runItems,
        executionLogs,

        stats: {
          parallelLanes: executions.length,
          healingAttempts: executions.reduce(
            (sum: number, item: any) =>
              sum + (item.healedCount || 0),
            0
          ),

          artifacts: executions.length * 3,
        },
      });

    } catch (error) {
      console.error(error);
    }
  }


  async function handleRunTest() {

    try {

      const recordingsResponse =
        await getRecordings();

      const recordings =
        recordingsResponse.recordingSteps || [];

      if (!recordings || recordings.length === 0) {

        pushToast({

          title: "No recordings",

          description:
            "Create a recording first.",

          tone: "warning",

        });

        return;

      }

      const latestRecording =
        recordings[0];

      if (!latestRecording) {

        pushToast({
          title: "No recordings",
          description: "Create a recording first.",
          tone: "warning",
        });

        return;
      }

      const recordingId =
        latestRecording.id
          .split("-")
          .slice(0, 5)
          .join("-");

      await generateTest(recordingId);

      await executeTest(recordingId);

      await loadExecutions();

      pushToast({

        title: "Test executed",

        description:
          "Latest recording executed successfully.",

        tone: "success",

      });

    } catch (error: any) {

      console.error(error);

      pushToast({

        title: "Execution failed",

        description:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to execute test.",

        tone: "warning",

      });

    }

  }

  async function retryFailedRun() {

    try {

      const failedRun =
        data?.runItems.find(
          (r) => r.status === "Failed"
        );

      if (!failedRun) {

        pushToast({

          title: "No failed runs",

          description:
            "Everything passed successfully.",

          tone: "info",

        });

        return;

      }

      await generateTest(
        failedRun.suite
      );

      const result =
        await executeTest(
          failedRun.suite
        );

      await loadExecutions();

      pushToast({

        title:
          result.success
            ? "Retry Passed"
            : "Retry Failed",

        description:
          result.success
            ? "Failed execution retried successfully."
            : result.message || "Retry execution failed.",

        tone:
          result.success
            ? "success"
            : "warning",

      });
    } catch (error) {

      console.error(error);

      pushToast({

        title: "Retry failed",

        description:
          "Unable to retry execution.",

        tone: "warning",

      });

    }

  }

  if (!data) {
    return <Loader label="Provisioning execution grid and real-time logs…" />
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Execution command center"
        title="Run tests at scale with live healing telemetry"
        description="Launch browser matrices, inspect the execution queue, and audit screenshots, retries, and AI interventions in one place."
        action={
          <>
            <ActionButton variant="secondary" onClick={() => pushToast({ title: 'Queue reordered', description: 'Parallel execution priorities updated.', tone: 'info' })}>
              <Rows3 className="mr-2 h-4 w-4" />
              Parallel execution
            </ActionButton>
            <ActionButton
              onClick={handleRunTest}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Run test
            </ActionButton>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: 'Parallel lanes',
            value: data.stats.parallelLanes,
            caption: 'Dynamic scaling across cloud browsers',
          },

          {
            label: 'Healing attempts',
            value: data.stats.healingAttempts,
            caption: 'Autonomous recovery active',
          },

          {
            label: 'Artifacts',
            value: data.stats.artifacts,
            caption: 'Screenshots and logs captured',
          },
        ].map((card) => (
          <GlassPanel key={card.label} className="p-5">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
            <p className="mt-2 text-sm text-slate-500">{card.caption}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2 items-start">
        <GlassPanel className="h-[700px] overflow-hidden p-0">

          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

            <div>
              <p className="text-lg font-semibold text-white">
                Execution Queue
              </p>

              <p className="text-sm text-slate-400">
                Browser selection, healing attempts, retries and ownership
              </p>
            </div>

            <div className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
              {data.runItems.length} Runs
            </div>

          </div>

          <div className="h-[620px] overflow-y-auto p-5 space-y-4">

            {data.runItems.map((row) => (

              <div
                key={row.id || row.suite}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.05]"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-base font-semibold text-white break-all">
                      {row.suite}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Owner · {row.owner}
                    </p>

                  </div>

                  <StatusPill
                    label={row.status}
                    tone={
                      row.status === 'Passed'
                        ? 'success'
                        : row.status === 'Failed'
                          ? 'danger'
                          : row.status === 'Running'
                            ? 'info'
                            : 'warning'
                    }
                  />

                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div className="rounded-2xl bg-slate-900/60 p-3">
                    <p className="text-xs text-slate-500">
                      Browser
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {row.browser}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900/60 p-3">
                    <p className="text-xs text-slate-500">
                      AI Heals
                    </p>

                    <p className="mt-1 text-sm font-medium text-cyan-300">
                      {row.healedSelectors}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900/60 p-3">
                    <p className="text-xs text-slate-500">
                      Retries
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {row.attempts}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900/60 p-3">
                    <p className="text-xs text-slate-500">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-medium text-emerald-300">
                      {row.duration}
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </GlassPanel>
        <TerminalLogViewer lines={data.executionLogs} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

  {/* SCREENSHOTS */}

  <GlassPanel className="h-[700px] overflow-hidden p-6">

    <div className="mb-6 flex items-center gap-3">

      <span className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
        <Camera className="h-5 w-5" />
      </span>

      <div>
        <h3 className="text-lg font-semibold text-white">
          Screenshots
        </h3>

        <p className="text-sm text-slate-400">
          Execution screenshots
        </p>
      </div>

    </div>

    <div className="h-[580px] space-y-4 overflow-y-auto pr-2">

      {results?.map((item: any, index: number) => (

        <img
          key={index}
          src={item.screenshot}
          alt="execution"
          className="w-full rounded-2xl border border-white/10 cursor-pointer transition hover:scale-[1.02]"
          onClick={() =>
            setSelectedImage(item.screenshot)
          }
        />

      ))}

    </div>

  </GlassPanel>

  {/* VIDEO */}

  <GlassPanel className="h-[700px] p-6">

    <div className="mb-6 flex items-center gap-3">

      <span className="rounded-2xl bg-violet-400/10 p-3 text-violet-200">
        <Play className="h-5 w-5" />
      </span>

      <div>

        <h3 className="text-lg font-semibold text-white">
          Video Playback
        </h3>

        <p className="text-sm text-slate-400">
          Latest execution recording
        </p>

      </div>

    </div>

    <div className="overflow-hidden rounded-3xl border border-white/10">

      {selectedResult?.video ? (

        <video
          controls
          autoPlay
          className="h-[580px] w-full object-cover"
          src={selectedResult.video}
        />

      ) : (

        <div className="grid h-[580px] place-items-center text-slate-500">
          No video available
        </div>

      )}

    </div>

  </GlassPanel>

  {/* RECOVERY */}

  <GlassPanel className="h-[700px] overflow-hidden p-6">

    <div className="mb-6 flex items-center gap-3">

      <span className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
        <Cpu className="h-5 w-5" />
      </span>

      <div>

        <h3 className="text-lg font-semibold text-white">
          Recovery Controls
        </h3>

        <p className="text-sm text-slate-400">
          AI healing logs
        </p>

      </div>

    </div>

    <div className="h-[500px] space-y-4 overflow-y-auto pr-2">

      {data?.executionLogs?.map((log: any) => (

        <div
          key={log.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
        >

          {log.message}

        </div>

      ))}

    </div>

    <ActionButton
      variant="secondary"
      className="mt-5 w-full"
      onClick={retryFailedRun}
    >

      <RefreshCw className="mr-2 h-4 w-4" />

      Retry Failed Run

    </ActionButton>

  </GlassPanel>

</div>

{/* IMAGE MODAL */}

{selectedImage && (

  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
    onClick={() => setSelectedImage(null)}
  >

    <img
      src={selectedImage}
      alt="preview"
      className="max-h-[90vh] max-w-[90vw] rounded-3xl"
    />

  </div>

)}
    </div>
  )
}