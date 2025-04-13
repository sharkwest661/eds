// src/services/api/queries/examQueries.js
import apiService from "../apiService";

/**
 * This file contains query key factories and service methods
 * that are ready for migration to Tanstack Query.
 *
 * Currently, they use the standard apiService, but can be easily
 * converted to Tanstack Query hooks once you add the library.
 */

/**
 * Query keys for exam-related queries
 * Using standard patterns from Tanstack Query documentation
 */
export const examKeys = {
  all: () => ["exams"],
  lists: () => [...examKeys.all(), "list"],
  list: (filters) => [...examKeys.lists(), filters],
  details: () => [...examKeys.all(), "detail"],
  detail: (id) => [...examKeys.details(), id],
  questions: () => [...examKeys.all(), "questions"],
  question: (id) => [...examKeys.questions(), id],
};

/**
 * Example implementation showing how the functions would be used
 * with standard promises and later with Tanstack Query
 */

/**
 * Get all exam types
 * @returns {Promise} Promise with exam types data
 */
export const getExamTypes = async () => {
  return apiService.exams.getExamTypes();
};

/**
 * Get exams based on filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Promise with exams data
 */
export const getExams = async (filters = {}) => {
  return apiService.exams.getExams(filters);
};

/**
 * Get exam details
 * @param {string|number} id - Exam ID
 * @returns {Promise} Promise with exam details
 */
export const getExamDetail = async (id) => {
  if (!id) throw new Error("Exam ID is required");
  return apiService.exams.getExamDetail(id);
};

/**
 * Get exam questions
 * @param {string|number} id - Exam ID
 * @returns {Promise} Promise with exam questions
 */
export const getExamQuestions = async (id) => {
  if (!id) throw new Error("Exam ID is required");
  return apiService.exams.getExamQuestions(id);
};

// COMMENT: When migrating to Tanstack Query, conversion would look like this:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useExamTypes() {
  return useQuery({
    queryKey: examKeys.lists(),
    queryFn: getExamTypes,
  });
}

export function useExams(filters = {}) {
  return useQuery({
    queryKey: examKeys.list(filters),
    queryFn: () => getExams(filters),
    keepPreviousData: true, // Keep old data while fetching new data
  });
}

export function useExamDetail(id) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: () => getExamDetail(id),
    enabled: !!id, // Only run the query if id exists
  });
}

export function useExamQuestions(id) {
  return useQuery({
    queryKey: examKeys.question(id),
    queryFn: () => getExamQuestions(id),
    enabled: !!id, // Only run the query if id exists
  });
}
*/
