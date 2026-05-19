import { motion } from 'framer-motion'
import { BrainCircuit, Diff, GitCompareArrows, Sparkles, TreePine } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ResponsiveContainer, Tooltip, AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ActionButton } from '../../components/ui/ActionButton'
import { ChartCard } from '../../components/ui/ChartCard'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { Loader } from '../../components/ui/Loader'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusPill } from '../../components/ui/StatusPill'
import { useToast } from '../../context/ToastContext'
import { getAnalytics, getHealingData } from '../../services/dashboard.service'
import type { HealingCandidate, HealingPageData } from '../../types/platform'


export function HealingPage() {
  const [data, setData] = useState<HealingPageData | null>(null)
  const { pushToast } = useToast()
  const [healingData, setHealingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    async function loadHealing() {

      try {

        console.log("LOADING ANALYTICS");

        const analytics = await getAnalytics();

        console.log("ANALYTICS:", analytics);

        setData(analytics);

        console.log("LOADING HEALING");

        const healing = await getHealingData();

        console.log("HEALING:", healing);

        setHealingData(healing);

      } catch (err) {

        console.error("HEALING ERROR:", err);

        setError('Failed to load healing analytics');

      } finally {

        console.log("LOADING FINISHED");

        setLoading(false);

      }
    }

    loadHealing();

  }, []);




  const leadCandidate =
    healingData?.latest ||
    healingData?.healingHistory?.[0]
  if (loading) {
    return <Loader label="Loading healing analytics..." />
  }

  if (error) {
    return (
      <div className="text-red-400">
        {error}
      </div>
    )
  }

  if (!data || !leadCandidate) {
    return <Loader label="Analyzing DOM drift and healing candidates…" />
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Hero feature"
        title="AI self-healing that explains every decision"
        description="Review failed selectors, compare original versus healed locators, and trust the confidence model with transparent reasoning and historical learning."
        action={
          <>
            <ActionButton
              onClick={async () => {

                const response =
                  await fetch(
                    "http://localhost:5000/api/healing/export",
                    {
                      headers: {
                        Authorization:
                          `Bearer ${localStorage.getItem("token")}`
                      }
                    }
                  );

                const blob =
                  await response.blob();

                const url =
                  window.URL.createObjectURL(blob);

                const a =
                  document.createElement("a");

                a.href = url;

                a.download =
                  "healing-log.json";

                a.click();
              }}
            >
              Export healing log
            </ActionButton>
            <ActionButton
              onClick={() => {

                localStorage.setItem(
                  "autoHeal",
                  "true"
                );

                alert(
                  "Auto healing enabled"
                );
              }}
            >
              Auto-approve healing
            </ActionButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel overflow-hidden p-0">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">Selector diff view</h3>
                <p className="mt-1 text-sm text-slate-400">Original versus healed selector with confidence and DOM similarity scoring</p>
              </div>
              <StatusPill label={`${leadCandidate.confidence}% confidence`} tone="success" />
            </div>
          </div>
          <div className="grid gap-6 p-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-rose-400/20 bg-rose-500/8 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-rose-300">Original selector</p>
              <p className="mt-4 font-mono text-sm leading-7 text-rose-100">{leadCandidate.originalSelector}</p>
            </div>
            <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-500/8 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Healed selector</p>
              <p className="mt-4 font-mono text-sm leading-7 text-emerald-100">{leadCandidate.healedSelector}</p>
            </div>
          </div>
          <div className="grid gap-4 border-t border-white/10 px-6 py-5 md:grid-cols-3">
            {[
              {
                label: 'Confidence score',
                value: `${leadCandidate.confidence}%`,
                icon: Sparkles,
              },

              {
                label: 'DOM similarity',
                value: `${leadCandidate.domSimilarity}%`,
                icon: Diff,
              },

              {
                label: 'AI healed',
                value: `${healingData?.stats?.totalHealed || 0}`,
                icon: BrainCircuit,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <Icon className="h-4 w-4 text-cyan-300" />
                <p className="mt-4 text-sm text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200"><TreePine className="h-5 w-5" /></span>
            <div>
              <h3 className="text-lg font-semibold text-white">DOM tree preview</h3>
              <p className="text-sm text-slate-400">Annotated AI reasoning over nearby semantic nodes and ancestry</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 font-mono text-sm leading-7 text-slate-300">
            <pre className="text-sm text-slate-300 overflow-auto">
              {
                JSON.stringify(
                  healingData?.latest,
                  null,
                  2
                )
              }
            </pre>
          </div>
          <div className="mt-6 rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">AI reasoning panel</p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{leadCandidate.reasoning}</p>
            <p className="mt-3 text-sm font-medium text-cyan-200">Impact: {leadCandidate.impact}</p>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ChartCard title="Healing history" description="Attempts, successful recoveries, and model learning over time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={healingData?.historyChart || []}>
              <defs>
                <linearGradient id="healedHistory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="sprint" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#020617', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)' }} />
              <Area type="monotone" dataKey="healed" stroke="#22d3ee" fill="url(#healedHistory)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="learning" stroke="#8b5cf6" fill="rgba(139,92,246,0.08)" strokeWidth={2.1} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <GlassPanel className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">AI recommendation cards</h3>
              <p className="text-sm text-slate-400">Prioritized selector fixes with status, confidence, and business impact</p>
            </div>
            <GitCompareArrows className="h-5 w-5 text-cyan-300" />
          </div>
          {(healingData?.healingHistory || []).map((candidate: any) => (
            <div key={candidate.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{candidate.originalSelector}</p>
                  <p className="mt-1 font-mono text-xs text-slate-500">{candidate.healedSelector}</p>
                </div>
                <StatusPill
                  label={"Healed"}
                  tone="success" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Confidence</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{candidate.confidence}%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">DOM similarity</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{candidate.domSimilarity}%</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">AI automatically recovered the failed selector using DOM similarity matching.</p>
            </div>
          ))}
        </GlassPanel>
      </div>
    </div>
  )
}