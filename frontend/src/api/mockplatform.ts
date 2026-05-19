// import {
//   assistantMessages,
//   compatibilityData,
//   dashboardStats,
//   deploymentTimeline,
//   executionLogs,
//   executionTimeline,
//   generatedScript,
//   healingCandidates,
//   healingTrend,
//   heatmapData,
//   liveActivities,
//   notificationItems,
//   passFailData,
//   pipelineItems,
//   plans,
//   projects,
//   recordingSteps,
//   reportInsights,
//   runItems,
//   searchCommands,
//   teamMembers,
//   trendData,
//   workspaces,
// } from '../data/mock'

// const wait = (delay = 250) => new Promise((resolve) => setTimeout(resolve, delay))

// export const platformApi = {
//   async getShellData() {
//     await wait()
//     return { workspaces, projects, notifications: notificationItems, searchCommands }
//   },
//   async getDashboardData() {
//     await wait()
//     return { dashboardStats, trendData, healingTrend, passFailData, executionTimeline, liveActivities }
//   },
//   async getRecordingData() {
//     await wait()
//     return { recordingSteps, generatedScript }
//   },
//   async getExecutionData() {
//     await wait()
//     return { runItems, executionLogs }
//   },
//   async getHealingData() {
//     await wait()
//     return { healingCandidates, healingTrend }
//   },
//   async getReportsData() {
//     await wait()
//     return { reportInsights, compatibilityData, heatmapData }
//   },
//   async getPipelinesData() {
//     await wait()
//     return { pipelineItems, deploymentTimeline }
//   },
//   async getSettingsData() {
//     await wait()
//     return { teamMembers, plans, assistantMessages }
//   },
// }