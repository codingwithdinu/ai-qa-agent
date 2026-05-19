import { BellRing, CreditCard, KeyRound, LockKeyhole, Shield, UserCog } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { ActionButton } from '../../components/ui/ActionButton'
import { DataTable } from '../../components/ui/DataTable'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { Loader } from '../../components/ui/Loader'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusPill } from '../../components/ui/StatusPill'
import { useToast } from '../../context/ToastContext'
import type { PlanCard, TeamMember, SettingsCard } from '../../types/platform'
import { getSettingsData } from '../../services/dashboard.service'

interface SettingsDataState {
  teamMembers: TeamMember[]
  plans: PlanCard[]
  settingsCards: SettingsCard[]
}

export function SettingsPage() {
  const [data, setData] = useState<SettingsDataState | null>(null)
  const { pushToast } = useToast()
  const loadSettings = useCallback(async () => {
    try {
      const response =
        await getSettingsData();
      setData({
        teamMembers:
          response.teamMembers,
        plans:
          response.plans,
        settingsCards:
          response.settingsCards,
      });
    } catch (error) {
      console.error(error);
    }
  },
    []
  )

  useEffect(() => {
    loadSettings();
  }, [loadSettings])

  useEffect(() => {
    const interval =
      setInterval(() => {
        loadSettings();
      }, 10000);
    return () =>
      clearInterval(interval);
  }, [loadSettings])



  if (!data) {
    return <Loader label="Loading workspace governance and billing controls…" />
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Workspace governance"
        title="Manage teams, models, keys, browsers, and billing"
        description="Configure access policies, API keys, AI model preferences, notification rules, environment variables, and subscription plans."
        action={<ActionButton onClick={() => pushToast({ title: 'Changes saved', description: 'Workspace settings updated successfully.', tone: 'success' })}>Save changes</ActionButton>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <DataTable
          title="Team management"
          description="Role-based access and multi-workspace user visibility"
          rows={data.teamMembers}
          columns={[
            { key: 'name', label: 'Member', render: (row) => <div><p className="font-semibold text-white">{row.name}</p><p className="text-xs text-slate-500">{row.role}</p></div> },
            { key: 'region', label: 'Region' },
            { key: 'access', label: 'Access' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => (
                <StatusPill label={row.status} tone={row.status === 'Online' ? 'success' : row.status === 'Reviewing' ? 'warning' : 'neutral'} />
              ),
            },
          ]}
        />

        <GlassPanel className="space-y-4 p-6">
          {data.settingsCards.map((item) => {
            const Icon =
              item.icon === 'key'
                ? KeyRound
                : item.icon === 'shield'
                  ? Shield
                  : item.icon === 'bell'
                    ? BellRing
                    : LockKeyhole
            return (
              <div
                key={item.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="rounded-2xl bg-cyan-400/10 p-2 text-cyan-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

        </GlassPanel>

        <div className="grid gap-6 lg:grid-cols-3">
          {data.plans.map((plan) => (
            <GlassPanel key={plan.id} className={`p-6 ${plan.featured ? 'border-cyan-400/35 shadow-[0_0_60px_rgba(34,211,238,0.16)]' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{plan.name}</p>
                  <p className="mt-3 text-3xl font-semibold text-cyan-200">{plan.price}</p>
                </div>
                {plan.featured ? <StatusPill label="Most popular" tone="info" /> : <CreditCard className="h-5 w-5 text-slate-500" />}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-cyan-300" />
                    {feature}
                  </li>
                ))}
              </ul>
              <ActionButton variant={plan.featured ? 'primary' : 'secondary'} className="mt-6 w-full">
                {plan.featured ? 'Upgrade now' : 'Select plan'}
              </ActionButton>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  )
}