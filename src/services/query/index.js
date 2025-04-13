// src/services/query/index.js
// Re-export all query hooks from a single file for easier imports

// Import from exam queries
export {
  useTopTopics,
  useExams,
  useExamDetail,
  useExamQuestions,
  useSubmitExamAnswers,
  useExamTypes,
} from "./examQueries";

// Import from statistics queries
export {
  useStatisticsOverview,
  useTopicStatistics,
  usePerformanceData,
  useUserActivity,
} from "./statisticsQueries";

// Import from company queries
export { useCompanyData, useInitCompanyData } from "./companyQueries";

// Import from auth queries
export {
  useUser,
  useLogin,
  useLogout,
  useRegisterUser,
  useCheckEmail,
  useCheckUsername,
} from "./authQueries";

// Export the query client
export { default as queryClient } from "./queryClient";

// Export query keys for manual cache manipulation
export { examKeys } from "./examQueries";
export { statisticsKeys } from "./statisticsQueries";
export { companyKeys } from "./companyQueries";
export { authKeys } from "./authQueries";
