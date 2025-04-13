// src/services/query/companyQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanyData } from "../api/apiService";
import { Languages } from "../../utils/statics/constants";

/**
 * Query keys for company-related data
 */
export const companyKeys = {
  all: ["company"],
  data: (lang) => [...companyKeys.all, "data", lang],
};

/**
 * Hook to fetch company data
 * @param {string} lang - Language code (default: "aze")
 * @returns {Object} Query result with company data
 */
export function useCompanyData(lang = Languages.aze) {
  return useQuery({
    queryKey: companyKeys.data(lang),
    queryFn: async () => {
      try {
        const response = await getCompanyData(lang);
        return response.data;
      } catch (error) {
        console.error("Error fetching company data:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Hook to initialize company data in the query cache
 * @returns {Object} Functions to initialize and update company data
 */
export function useInitCompanyData() {
  const queryClient = useQueryClient();

  const initMutation = useMutation({
    mutationFn: async (lang = Languages.aze) => {
      const response = await getCompanyData(lang);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update query cache with the fetched data
      queryClient.setQueryData(companyKeys.data(variables), data);
    },
  });

  return {
    initCompanyData: (lang = Languages.aze) => initMutation.mutate(lang),
    isLoading: initMutation.isLoading,
    error: initMutation.error,
  };
}
