import { Camera, Cpu, PlayCircle, RefreshCw, Rows3, Video } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ActionButton } from '../../components/ui/ActionButton'
import { DataTable } from '../../components/ui/DataTable'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { Loader } from '../../components/ui/Loader'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusPill } from '../../components/ui/StatusPill'
import { TerminalLogViewer } from '../../components/ui/TerminalLogViewer'
import { useToast } from '../../context/ToastContext'
import type { LogLine, RunItem } from '../../types/platform'

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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          title="Execution queue"
          description="Browser selection, status, healing attempts, retries, and ownership"
          rows={data.runItems}
          columns={[
            { key: 'suite', label: 'Suite', render: (row) => <div><p className="font-semibold text-white">{row.suite}</p><p className="text-xs text-slate-500">Owner · {row.owner}</p></div> },
            { key: 'browser', label: 'Browsers' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => (
                <StatusPill
                  label={row.status}
                  tone={row.status === 'Passed' ? 'success' : row.status === 'Failed' ? 'danger' : row.status === 'Running' ? 'info' : 'warning'}
                />
              ),
            },
            { key: 'healedSelectors', label: 'AI heals' },
            { key: 'attempts', label: 'Retries' },
            { key: 'duration', label: 'Duration' },
          ]}
        />
        <TerminalLogViewer lines={data.executionLogs} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><Camera className="h-5 w-5" /></span>
            <div>
              <h3 className="text-lg font-semibold text-white">Screenshots</h3>
              <p className="text-sm text-slate-400">Visual artifacts captured per retry and healed action</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {results.map((item) => (

              <img
                src={item.screenshot}
                alt="execution"
                className="h-28 w-full object-cover cursor-pointer hover:scale-105 transition"
                onClick={() => setSelectedImage(item.screenshot)}
              />
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Video playback</h3>
              <p className="text-sm text-slate-400">Session recordings attached to the latest critical failures</p>
            </div>
          </div>
          <div className="mt-6 h-[220px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70">

            {selectedResult?.video ? (

              <video
                controls
                autoPlay
                className="h-full w-full object-cover"
                src={selectedResult.video}
              />

            ) : (

              <div className="grid h-full place-items-center text-sm text-slate-500">
                No video available
              </div>

            )}

          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200"><Cpu className="h-5 w-5" /></span>
            <div>
              <h3 className="text-lg font-semibold text-white">Recovery controls</h3>
              <p className="text-sm text-slate-400">Inspect healed selectors, error details, and retry actions</p>
            </div>
          </div>
          {data.executionLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300"
            >
              {log.message}
            </div>
          ))}
          <ActionButton variant="secondary" className="w-full" onClick={retryFailedRun}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry failed run
          </ActionButton>
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