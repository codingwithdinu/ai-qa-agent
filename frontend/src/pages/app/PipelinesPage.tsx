import { Github, Gitlab, Rocket, ServerCog, TimerReset, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { DataTable } from '../../components/ui/DataTable'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { Loader } from '../../components/ui/Loader'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusPill } from '../../components/ui/StatusPill'
import { Timeline } from '../../components/ui/Timeline'
import { useToast } from '../../context/ToastContext'
import type { DeploymentEvent, PipelineItem } from '../../types/platform'
import { getPipelines } from '../../services/dashboard.service'
import { socket } from "../../services/socket";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


interface PipelinesDataState {
  pipelineItems: PipelineItem[]
  deploymentTimeline: DeploymentEvent[]
}


const providerIcons:
  Record<string, LucideIcon> = {
  "GitHub Actions": Github, Jenkins: ServerCog, "GitLab CI": Gitlab, "Azure DevOps": Rocket,
}

export function PipelinesPage() {
  const [data, setData] = useState<PipelinesDataState | null>(null)
  const { pushToast } = useToast()

  const downloadPDF = () => {

    const doc = new jsPDF('landscape')

    doc.setFontSize(20)

    doc.text('Pipeline Status Report', 14, 18)

    doc.setFontSize(10)

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      26
    )

    autoTable(doc, {

      startY: 35,

      head: [[
        'Provider',
        'Branch',
        'Environment',
        'Status',
        'QA',
        'Duration',
      ]],

      body: data?.pipelineItems.map((item) => [

        item.provider,
        item.branch,
        item.environment,
        item.status,
        item.qaGate,
        item.duration,
    
      ]),

      theme: 'grid',

      headStyles: {
        fillColor: [20, 30, 60],
        textColor: 255,
        fontSize: 10,
      },

      bodyStyles: {
        fontSize: 9,
      },

      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },

      margin: {
        top: 20,
      },

    })

    doc.save(`pipeline-report-${Date.now()}.pdf`)

  }
  async function loadPipelines() {

    try {

      const pipelineData =
        await getPipelines();

      setData(pipelineData);

    } catch (error) {

      console.error(error);
    }
  }


  useEffect(() => {

    socket.on(
      "pipeline-updated",

      (data) => {

        console.log(
          "🔥 LIVE UPDATE:",
          data
        );

        loadPipelines();
      }
    );

    return () => {

      socket.off(
        "pipeline-updated"
      );
    };

  }, []);

  useEffect(() => {

    const interval =
      setInterval(() => {

        loadPipelines();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  if (!data) {
    return <Loader label="Linking CI/CD providers and deployment signals…" />
  }

  if (
    data &&
    data.pipelineItems.length === 0
  ) {

    return (
      <div className="text-slate-400">
        No pipelines found
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="CI/CD QA monitoring"
        title="Watch pipelines, deployments, and quality gates in real time"
        description="Track GitHub Actions, Jenkins, GitLab CI, and Azure DevOps with release health, pipeline cards, and deployment QA status."
        action={
          <>
            <ActionButton variant="secondary" onClick={() => pushToast({ title: 'Status synced', description: 'Latest pipeline telemetry pulled from providers.', tone: 'info' })}>
              <TimerReset className="mr-2 h-4 w-4" />
              Refresh status
            </ActionButton>
            <ActionButton
              onClick={async () => {

                await loadPipelines();

                pushToast({
                  title: 'Pipelines refreshed',
                  description:
                    'Live CI/CD status synced from backend.',
                  tone: 'success',
                });
              }}
            >              Trigger pipeline
            </ActionButton>
          </>
        }
      />

      <GlassPanel className="h-[720px] overflow-hidden p-5">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h3 className="text-lg font-semibold text-white">
              Active pipelines
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Real-time CI/CD execution monitoring
            </p>
          </div>

          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs text-cyan-200">
            {data.pipelineItems.length} pipelines
          </div>

        </div>

        <div className="grid h-[620px] auto-rows-min gap-4 overflow-y-auto pr-2 md:grid-cols-2 xl:grid-cols-3">

          {data.pipelineItems.map((item) => {

            const Icon =
              providerIcons[item.provider] ||
              ServerCog;

            return (

              <GlassPanel
                key={item.id}
                className="min-h-[190px] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.03]"
              >

                <div className="flex items-center justify-between gap-3">

                  <span className="rounded-2xl bg-white/5 p-3 text-cyan-300">

                    <Icon className="h-5 w-5" />

                  </span>

                  <StatusPill
                    label={item.status}
                    tone={
                      item.status === "Passing"
                        ? "success"
                        : item.status === "Running"
                          ? "info"
                          : item.status === "Queued"
                            ? "warning"
                            : "danger"
                    }
                  />

                </div>

                <div className="mt-6">

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">

                  

                  </div>

                  <p className="text-xl font-semibold text-white">
                    {item.provider}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {item.branch} · {item.environment}
                  </p>

                </div>

                <div className="mt-5 space-y-2 text-sm">

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      QA Gate
                    </span>

                    <span className="text-white">
                      {item.qaGate}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Duration
                    </span>

                    <span className="text-cyan-300">
                      {item.duration}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Status
                    </span>

                    <span className="text-white">
                      {item.status}
                    </span>

                  </div>

                </div>

              </GlassPanel>

            );

          })}

        </div>

      </GlassPanel>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr] items-start">

        {/* LEFT SIDE */}
        <div className="min-w-0">

          <GlassPanel className="overflow-hidden p-0">

            {/* HEADER */}
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Pipeline status board
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Connected providers, deployment environments, and QA gate posture
                </p>
              </div>

              {/* PDF BUTTON */}
              <ActionButton
                onClick={downloadPDF}
                className="
            rounded-2xl
            bg-cyan-400
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-950
            shadow-lg
            shadow-cyan-500/20
            transition-all
            duration-200
            hover:scale-105
            hover:bg-cyan-300
          "
              >
                Download PDF
              </ActionButton>

            </div>

            {/* TABLE */}
            <DataTable
              title=""
              description=""
              rows={data.pipelineItems}
              columns={[

                {
                  key: 'provider',
                  label: 'Provider',

                  render: (row) => (
                    <span className="text-xs whitespace-nowrap">
                      {row.provider}
                    </span>
                  ),
                },

                {
                  key: 'branch',
                  label: 'Branch',

                  render: (row) => (
                    <span className="text-xs whitespace-nowrap">
                      {row.branch}
                    </span>
                  ),
                },

                {
                  key: 'environment',
                  label: 'Environment',

                  render: (row) => (
                    <span className="text-xs whitespace-nowrap">
                      {row.environment}
                    </span>
                  ),
                },

                {
                  key: 'status',
                  label: 'Status',

                  render: (row) => (

                    <StatusPill
                      label={row.status}
                      tone={
                        row.status === 'Passing'
                          ? 'success'
                          : row.status === 'Running'
                            ? 'info'
                            : row.status === 'Queued'
                              ? 'warning'
                              : 'danger'
                      }
                    />

                  ),
                },

                {
                  key: 'qaGate',
                  label: 'QA',

                  render: (row) => (
                    <span className="text-xs whitespace-nowrap">
                      {row.qaGate}
                    </span>
                  ),
                },

                {
                  key: 'duration',
                  label: 'Duration',

                  render: (row) => (
                    <span className="text-xs whitespace-nowrap text-cyan-300">
                      {row.duration}
                    </span>
                  ),
                },

              
              ]}
            />

          </GlassPanel>

        </div>

        {/* RIGHT SIDE */}
        <GlassPanel className="sticky top-6 h-[760px] overflow-hidden p-0">

          <div className="border-b border-white/10 px-5 py-5">

            <h3 className="text-lg font-semibold text-white">
              Deployment timeline
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Real-time deployment lifecycle tracking
            </p>

          </div>

          <div className="h-[680px] overflow-y-auto px-5 py-4">

            <Timeline
              items={data.deploymentTimeline.map(
                (item) => ({
                  ...item,
                  title: item.stage,
                })
              )}
            />

          </div>

        </GlassPanel>

      </div>
    </div>
  )
}