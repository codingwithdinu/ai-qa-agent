import { getExecutions, executeTest, getAnalytics } from "../../services/dashboard.service";
import { motion } from 'framer-motion'
import { ActivitySquare, ArrowUpRight, Bot, Clock4, Download, GitBranchPlus, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts'
import { ActionButton } from '../../components/ui/ActionButton'
import { ChartCard } from '../../components/ui/ChartCard'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatCard } from '../../components/ui/StatCard'
import { StatusPill } from '../../components/ui/StatusPill'
import { useAppContext } from '../../context/AppContext'
import type { ActivityItem, HealingTrendPoint, MetricCardData, PieDatum, TimelinePoint, TrendPoint } from '../../types/platform'
import { RecordingModal } from "../../components/modals/RecordingModal";
import { useToast } from '../../context/ToastContext'
import api from "../../api/client";
import { socket } from "../../services/socket";
import { sendRecorderMessage } from "../../utils/extensionRecorder";




interface DashboardDataState {
    dashboardStats: MetricCardData[]
    trendData: TrendPoint[]
    healingTrend: HealingTrendPoint[]
    passFailData: PieDatum[]
    executionTimeline: TimelinePoint[]
    liveActivities: ActivityItem[]

}




export function DashboardPage() {

    const [openRecordingModal, setOpenRecordingModal] =
        useState(false);


    const [recording, setRecording] = useState(false);

    const [recordingId, setRecordingId] = useState("");

    const [recordingUrl, setRecordingUrl] = useState("");

    const { activities, selectedWorkspace, selectedProject } = useAppContext()

    const { pushToast } = useToast()
    const recorderMode =
        import.meta.env.VITE_RECORDER_MODE ||
        "client";
    const clientRecorderEnabled =
        recorderMode !== "server";
    const apiBaseUrl =
        (import.meta.env.VITE_API_URL ||
            window.location.origin).replace(
                /\/$/,
                ""
            );
    const [data, setData] =
        useState<DashboardDataState>({
            dashboardStats: [],
            trendData: [],
            healingTrend: [],
            passFailData: [],
            executionTimeline: [],
            liveActivities: [],
        })
    const [executions, setExecutions] =
        useState<any[]>([]);

    const totalTests = executions.length;

    const passedTests = executions.filter(
        (e) => e.status === "PASSED"
    ).length;

    const failedTests = executions.filter(
        (e) => e.status === "FAILED"
    ).length;

    const aiHeals = executions.reduce(
        (sum, e) => sum + e.healedCount,
        0
    );

    const [analytics, setAnalytics] =
        useState<any>(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    async function loadAnalytics() {
        const data =
            await getAnalytics();

        setAnalytics(data);
    }

    const quickInsights = [

        {
            icon: ShieldCheck,
            label: 'Release confidence',
            value: `${passedTests}`,
            tone: 'success' as const
        },

        {
            icon: Bot,
            label: 'AI actions today',
            value: `${aiHeals}`,
            tone: 'info' as const
        },

        {
            icon: Clock4,
            label: 'Mean repair time',
            value: `${executions.length * 4} sec`,
            tone: 'warning' as const
        },

        {
            icon: GitBranchPlus,
            label: 'Pipeline coverage',
            value: `${totalTests} active`,
            tone: 'success' as const
        },

    ]



    useEffect(() => {
        loadExecutions();
        socket.on(
            "dashboard-updated",
            () => {
                console.log(
                    "📊 Dashboard updated"
                );

                loadExecutions();
            }
        );
        return () => {
            socket.off(
                "dashboard-updated"
            );
        };
    }, []);



    async function loadExecutions() {

        try {

            const executionData =
                await getExecutions()

            setExecutions(executionData)
            const analytics =
                await getAnalytics();

            setData({
                dashboardStats:
                    analytics.dashboardStats,

                trendData:
                    analytics.trendData,

                healingTrend:
                    analytics.healingTrend,

                passFailData:
                    analytics.passFailData,

                executionTimeline:
                    analytics.executionTimeline,

                liveActivities:
                    analytics.liveActivities,
            });

        } catch (error) {

            console.error(error)

        }
    }

    async function copyRecorderBookmarklet() {
        if (!recordingId) return;

        const bookmarklet =
            `javascript:(()=>{var s=document.createElement('script');s.src='${apiBaseUrl}/api/record/injector.js?recordingId=${recordingId}';document.head.appendChild(s);})();`;
        try {
            await navigator.clipboard.writeText(bookmarklet);
            pushToast({
                title: "Recorder copied",
                description:
                    "Open the target site and click the bookmarklet to start capture.",
                tone: "success",
            });
        } catch {
            pushToast({
                title: "Copy failed",
                description:
                    "Clipboard blocked. Please copy manually.",
                tone: "warning",
            });
        }
    }

    function openRecordingTarget() {
        if (!recordingUrl) return;
        window.open(
            recordingUrl,
            "_blank",
            "noopener,noreferrer"
        );
    }

    function downloadExtensionZip() {
        window.open(
            `${apiBaseUrl}/api/extension/download`,
            "_blank",
            "noopener,noreferrer"
        );
    }





    return (
        <>
            <div className="space-y-8">
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
                                    {clientRecorderEnabled && (
                                        <p className="mt-2 text-sm text-slate-400">
                                            Open the target site and click the recorder bookmarklet to capture actions.
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {clientRecorderEnabled && (
                                        <>
                                            <ActionButton
                                                variant="secondary"
                                                onClick={openRecordingTarget}
                                            >
                                                Open Site
                                            </ActionButton>
                                            <ActionButton
                                                variant="secondary"
                                                onClick={copyRecorderBookmarklet}
                                            >
                                                Copy Recorder
                                            </ActionButton>
                                        </>
                                    )}
                                    <ActionButton
                                        variant="secondary"
                                        onClick={async () => {
                                            try {
                                                await api.post(
                                                    "/record/stop",
                                                    {
                                                        recordingId,
                                                    }
                                                );
                                                if (clientRecorderEnabled) {
                                                    await sendRecorderMessage({
                                                        type: "STOP_RECORDING",
                                                    });
                                                }

                                                setRecording(false)

                                                pushToast({
                                                    title: 'Recording completed',

                                                    description:
                                                        'AI test generated successfully.',

                                                    tone: 'success',
                                                })

                                            } catch (error) {

                                                console.error(error)

                                            }

                                        }}
                                    >
                                        Stop Recording
                                    </ActionButton>
                                </div>

                            </div>
                        </GlassPanel>
                    )
                }
                <SectionHeader
                    eyebrow="Executive command center"
                    title="AI-powered QA operations at a glance"
                    description={`Monitor ${selectedWorkspace?.name ?? 'your workspace'} across ${selectedProject?.name ?? 'critical projects'} with real-time execution telemetry, healing performance, and release readiness.`}
                    action={
                        <>
                            <ActionButton variant="secondary">Share board</ActionButton>
                            <ActionButton
                                variant="secondary"
                                onClick={downloadExtensionZip}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download extension
                            </ActionButton>
                            <ActionButton
                                onClick={() =>
                                    setOpenRecordingModal(true)
                                }
                            >
                                Launch run
                            </ActionButton>
                        </>
                    }
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {quickInsights.map(({ icon: Icon, label, value, tone }, index) => (
                        <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                            <GlassPanel className="flex items-center justify-between p-5">
                                <div>
                                    <p className="text-sm text-slate-400">{label}</p>
                                    <p className="mt-2 text-2xl font-semibold text-white">

                                        {
                                            label === "Release confidence"
                                                ? `${passedTests}`

                                                : label === "AI actions today"
                                                    ? `${aiHeals}`

                                                    : label === "Mean repair time"
                                                        ? `${executions.length * 4} sec`

                                                        : `${totalTests} active`
                                        }

                                    </p>                            </div>
                                <div className="rounded-2xl bg-white/5 p-3 text-cyan-300">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="absolute right-5 top-5">
                                    <StatusPill label={tone === 'success' ? 'Healthy' : tone === 'info' ? 'Live' : 'Optimized'} tone={tone} />
                                </div>
                            </GlassPanel>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
                    {data.dashboardStats.map((item, index) => (
                        <div key={item.label} className="xl:col-span-2 2xl:col-span-1">
                            <StatCard item={item} index={index} />
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <ChartCard title="Test trend graph" description="Passed, failed, and healed runs over the last 7 days">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data.trendData}>
                                <defs>
                                    <linearGradient id="passedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="healedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ background: '#020617', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)' }} />
                                <Area type="monotone" dataKey="passed" stroke="#22d3ee" fill="url(#passedGradient)" strokeWidth={2.6} />
                                <Area type="monotone" dataKey="healed" stroke="#8b5cf6" fill="url(#healedGradient)" strokeWidth={2.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Pass / fail mix" description="Distribution across active monitored suites">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={data.passFailData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={106} paddingAngle={4}>
                                    {data.passFailData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#020617', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <ChartCard title="Healing analytics" description="Autonomous recovery and model learning across sprints">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.healingTrend}>
                                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                                <XAxis dataKey="sprint" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ background: '#020617', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)' }} />
                                <Bar dataKey="attempts" fill="#1e293b" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="healed" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="learning" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Execution timeline" description="Queue, running, and completed workload through the day">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data.executionTimeline}>
                                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                                <XAxis dataKey="time" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ background: '#020617', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)' }} />
                                <Area type="monotone" dataKey="queued" stroke="#f59e0b" fill="rgba(245,158,11,0.16)" strokeWidth={2} />
                                <Area type="monotone" dataKey="running" stroke="#22d3ee" fill="rgba(34,211,238,0.15)" strokeWidth={2} />
                                <Area type="monotone" dataKey="completed" stroke="#34d399" fill="rgba(52,211,153,0.13)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

                    {/* LEFT SIDE */}
                    <GlassPanel className="h-[760px] overflow-hidden p-0">

                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                            <div>
                                <h3 className="text-xl font-semibold text-white">
                                    Live activity feed
                                </h3>

                                <p className="mt-1 text-sm text-slate-400">
                                    Streaming logs, execution telemetry, healing actions, and CI updates
                                </p>
                            </div>

                            <StatusPill
                                label="WebSocket Live"
                                tone="info"
                            />

                        </div>

                        <div className="h-[680px] overflow-y-auto p-5 space-y-5">

                            {[...data.liveActivities]
                                .reverse()
                                .map((activity) => (

                                    <div
                                        key={activity.id}
                                        className="rounded-[30px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/40 p-5 transition hover:border-cyan-400/30 hover:bg-slate-900/90"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex items-start gap-4">

                                                <div className="mt-1 rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                                                    <ActivitySquare className="h-5 w-5" />
                                                </div>

                                                <div>

                                                    <h4 className="text-base font-semibold text-white">
                                                        {activity.title}
                                                    </h4>

                                                    <p className="mt-2 text-sm leading-7 text-slate-400 break-all">
                                                        {activity.detail}
                                                    </p>

                                                </div>

                                            </div>

                                            <StatusPill
                                                label={
                                                    activity.status === 'success'
                                                        ? 'Stable'
                                                        : activity.status === 'warning'
                                                            ? 'Needs attention'
                                                            : 'Observed'
                                                }

                                                tone={
                                                    activity.status === 'success'
                                                        ? 'success'
                                                        : activity.status === 'warning'
                                                            ? 'warning'
                                                            : 'info'
                                                }
                                            />

                                        </div>

                                        <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-500">

                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                {activity.actor}
                                            </span>

                                            <span>•</span>

                                            <span>
                                                {activity.time}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                        </div>

                    </GlassPanel>

                    {/* RIGHT SIDE */}
                    <GlassPanel className="h-[760px] overflow-hidden p-0">

                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                            <div>
                                <h3 className="text-xl font-semibold text-white">
                                    Quality board highlights
                                </h3>

                                <p className="mt-1 text-sm text-slate-400">
                                    High-signal updates for leadership and release teams
                                </p>
                            </div>

                            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>

                        </div>

                        <div className="h-[680px] overflow-y-auto p-5 space-y-4">

                            {data.liveActivities.map((item, index) => (

                                <div
                                    key={item.id || index}
                                    className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/50 p-5 transition hover:border-cyan-400/30"
                                >

                                    <div className="flex items-start gap-4">

                                        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                                            <ActivitySquare className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-center justify-between gap-3">

                                                <p className="text-sm font-semibold text-white">
                                                    Build Artifact
                                                </p>

                                                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                                                    Synced
                                                </span>

                                            </div>

                                            <p className="mt-3 break-all text-sm leading-7 text-slate-400">
                                                {item.id}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </GlassPanel>

                </div>
            </div>

            <RecordingModal
                open={openRecordingModal}
                onClose={() =>
                    setOpenRecordingModal(false)
                }
                onRecordingStarted={(
                    id,
                    url
                ) => {
                    setRecording(true);
                    setRecordingId(id);
                    setRecordingUrl(url);
                    setOpenRecordingModal(false);


                }}
            />
        </>
    )
}