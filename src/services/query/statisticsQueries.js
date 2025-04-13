// src/services/query/statisticsQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "../api/apiService";
import { EDU_URL } from "../api/constants";

/**
 * Query keys for statistics-related queries
 */
export const statisticsKeys = {
  all: ["statistics"],
  overview: () => [...statisticsKeys.all, "overview"],
  userStats: () => [...statisticsKeys.all, "user"],
  userDetail: (userId) => [...statisticsKeys.userStats(), userId],
  topics: () => [...statisticsKeys.all, "topics"],
  performance: () => [...statisticsKeys.all, "performance"],
  performancePeriod: (period) => [...statisticsKeys.performance(), period],
};

/**
 * Hook to fetch user statistics overview
 * @returns {Object} Query result with statistics data
 */
export function useStatisticsOverview() {
  return useQuery({
    queryKey: statisticsKeys.overview(),
    queryFn: async () => {
      try {
        // This would be a real API call in production
        // const response = await api.get('/statistics/overview');
        // return response.data;

        // For now, we'll return mock data that matches the expected structure
        return {
          answered: 24,
          missed: 1,
          correct: 24,
          ranking: 35,
          averageScore: 73,
        };
      } catch (error) {
        // Prevent automatic logout for 401 errors
        if (error.response?.status === 401) {
          throw new Error(
            "Authentication required for statistics. Please login and try again."
          );
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch topic performance statistics
 * @returns {Object} Query result with topic statistics
 */
export function useTopicStatistics() {
  return useQuery({
    queryKey: statisticsKeys.topics(),
    queryFn: async () => {
      try {
        // This would be a real API call in production
        // const response = await api.get('/statistics/topics');
        // return response.data;

        // For now, we'll return mock data that matches the expected structure
        return [
          { topic: "Problemi həll etmə və düzgün qərar verilməsi", level: 70 },
          { topic: "Mövzular arası əlaqələrin qurulması", level: 40 },
          { topic: "Qavrama və kontekst", level: 60 },
          { topic: "Təxmin etmə və fikir yürütmə", level: 20 },
          { topic: "Araşdırma və cavablar arasında körpü yaratmaq", level: 90 },
        ];
      } catch (error) {
        // Prevent automatic logout for 401 errors
        if (error.response?.status === 401) {
          throw new Error(
            "Authentication required for topic statistics. Please login and try again."
          );
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch performance data over time
 * @param {string} period - Time period for data (day, week, month, year)
 * @returns {Object} Query result with performance data
 */
export function usePerformanceData(period = "month") {
  return useQuery({
    queryKey: statisticsKeys.performancePeriod(period),
    queryFn: async () => {
      try {
        // This would be a real API call in production
        // const response = await api.get(`/statistics/performance/${period}`);
        // return response.data;

        // For now, we'll return mock data that matches the expected structure
        // Simulate different data based on period
        if (period === "month") {
          // Return data for each day of the month
          const data = [];
          const daysInMonth = 30;

          // Start with zero
          data.push({ date: "June 1", value: 0 });

          // Generate data with an upward trend
          for (let i = 2; i <= daysInMonth; i++) {
            let lastValue = data[i - 2].value;
            let newValue;

            if (i <= 10) {
              // Sharp increase in first third
              newValue = Math.min(
                lastValue + Math.floor(Math.random() * 10) + 5,
                100
              );
            } else if (i <= 20) {
              // Plateau in middle third
              newValue = lastValue + (Math.random() > 0.8 ? 5 : 0);
            } else {
              // Slight increase in final third
              newValue = Math.min(
                lastValue + (Math.random() > 0.7 ? 5 : 0),
                100
              );
            }

            data.push({ date: `June ${i}`, value: newValue });
          }

          return data;
        } else {
          // Default response for other periods
          return [
            { date: "Week 1", value: 20 },
            { date: "Week 2", value: 35 },
            { date: "Week 3", value: 60 },
            { date: "Week 4", value: 85 },
          ];
        }
      } catch (error) {
        // Prevent automatic logout for 401 errors
        if (error.response?.status === 401) {
          throw new Error(
            "Authentication required for performance data. Please login and try again."
          );
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch user activity statistics
 * @returns {Object} Query result with user activity data
 */
export function useUserActivity() {
  return useQuery({
    queryKey: statisticsKeys.userStats(),
    queryFn: async () => {
      try {
        // This would be a real API call in production
        // const response = await api.get('/statistics/user-activity');
        // return response.data;

        // For now, we'll return mock data that matches the expected structure
        return {
          completedTests: 3,
          incompleteTests: 1,
          dailyScore: 14,
          monthlyScore: 25,
          yearlyScore: 60,
          ranking: 3,
          totalScore: 256,
        };
      } catch (error) {
        // Prevent automatic logout for 401 errors
        if (error.response?.status === 401) {
          throw new Error(
            "Authentication required for user activity. Please login and try again."
          );
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
