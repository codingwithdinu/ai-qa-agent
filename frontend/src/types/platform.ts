export type ThemeMode = 'dark' | 'light'
export type NavItemId =
  | 'dashboard'
  | 'recordings'
  | 'test-runs'
  | 'healing'
  | 'reports'
  | 'pipelines'
  | 'integrations'
  | 'settings'

export interface Workspace {
  id: string
  name: string
  plan: string
  role: string
}

export interface ProjectSummary {
  id: string
  name: string
  status: string
  environment: string
}



export interface NavItem {
  id: NavItemId
  label: string
  path: string
  description: string
}

export interface MetricCardData {
  label: string
  value: string
  delta: string
  tone: 'cyan' | 'emerald' | 'rose' | 'violet' | 'amber'
  caption: string
}

export interface TrendPoint {
  name: string
  passed: number
  failed: number
  healed: number
  executionTime: number
}

export interface HealingTrendPoint {
  sprint: string
  attempts: number
  healed: number
  learning: number
}

export interface PieDatum {
  name: string
  value: number
  color: string
}

export interface TimelinePoint {
  time: string
  queued: number
  running: number
  completed: number
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  type: 'run' | 'heal' | 'pipeline' | 'recording'
  status: 'success' | 'warning' | 'info'
  actor: string
  time: string
}

export interface RecordingStep {
  id: string
  action: string
  selector: string
  value?: string
  url?: string
  timestamp?: number
  screenshot?: string
  duration: string
  status:
  | 'captured'
  | 'optimized'
  | 'healed'
}

export interface RunItem {
  id: string
  suite: string
  browser: string
  status: 'Passed' | 'Failed' | 'Running' | 'Queued'
  healedSelectors: number
  attempts: number
  duration: string
  owner: string
}

export interface LogLine {
  id: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'AI'
  message: string
  timestamp: string
}



export interface HealingCandidate {
  id: string
  page: string
  originalSelector: string
  healedSelector: string
  confidence: number
  domSimilarity: number
  reasoning: string
  impact: string
  status: string
}

export interface HealingPageData {

  healingCandidates: HealingCandidate[];

  healingTrend: {
    sprint: string;
    healed: number;
    learning: number;
  }[];
}

export interface ReportInsight {
  id: string
  title: string
  description: string
  metric: string
}

export interface CompatibilityDatum {
  browser: string
  chrome: number
  firefox: number
  webkit: number
}

export interface HeatmapDatum {
  module: string
  failures: number
  healed: number
  severity: number
}

export interface PipelineItem {
  id: string
  provider: string
  branch: string
  environment: string
  status: 'Passing' | 'Running' | 'Failed' | 'Queued'
  duration: string
  qaGate: string
}

export interface DeploymentEvent {
  id: string
  stage: string
  status: 'complete' | 'active' | 'next'
  detail: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  region: string
  access: string
  status: 'Online' | 'Idle' | 'Reviewing'
}

export interface PlanCard {
  id: string
  name: string
  price: string
  description: string
  featured?: boolean
  features: string[]
}

export interface SearchCommandItem {
  id: string
  title: string
  subtitle: string
  to: string
  shortcut?: string
}

export interface AssistantMessage {
  id: string
  author: 'AI' | 'You'
  content: string
}

export interface ToastItem {
  id: string
  title: string
  description: string
  tone: 'info' | 'success' | 'warning'
}

export interface SettingsCard {
  id: string
  title: string
  detail: string
  icon: string
}

export interface NavigationItem {
  id: NavItemId
  label: string
  path: string
  description: string
}