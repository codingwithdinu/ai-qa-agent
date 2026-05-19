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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.pipelineItems.map((item) => {
          const Icon = providerIcons[item.provider] || ServerCog
          return (
            <GlassPanel key={item.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-2xl bg-white/5 p-3 text-cyan-300"><Icon className="h-5 w-5" /></span>
                <StatusPill
                  label={item.status}
                  tone={
                    item.status === 'Passing'
                      ? 'success'
                      : item.status === 'Running'
                        ? 'info'
                        : item.status === 'Queued'
                          ? 'warning'
                          : 'danger'
                  } />
              </div>
              <p className="mt-5 text-lg font-semibold text-white">{item.provider}</p>
              <p className="mt-1 text-sm text-slate-400">{item.branch} · {item.environment}</p>
              <p className="mt-5 text-sm text-slate-500">QA gate · <span className="text-slate-300">{item.qaGate}</span></p>
              <p className="mt-2 text-sm text-slate-500">Duration · <span className="text-slate-300">{item.duration}</span></p>
            </GlassPanel>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <DataTable
          title="Pipeline status board"
          description="Connected providers, deployment environments, and QA gate posture"
          rows={data.pipelineItems}
          columns={[
            { key: 'provider', label: 'Provider' },
            { key: 'branch', label: 'Branch' },
            { key: 'environment', label: 'Environment' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => (
                <StatusPill
                  label={row.status}
                  tone={row.status === 'Passing' ? 'success' : row.status === 'Running' ? 'info' : row.status === 'Queued' ? 'warning' : 'danger'}
                />
              ),
            },
            { key: 'qaGate', label: 'QA gate' },
            { key: 'duration', label: 'Duration' },
          ]}
        />
        <GlassPanel className="p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-white">Deployment timeline</h3>
            <p className="mt-1 text-sm text-slate-400">Real-time status indicators from commit to production gate</p>
          </div>
          <Timeline items={data.deploymentTimeline.map((item) => ({ ...item, title: item.stage }))} />
        </GlassPanel>
      </div>
    </div>
  )
}