import { create } from "zustand";
import { Languages } from "../utils/statics/constants";
import { getCompanyData } from "../services/api/apiService";

export const useCompanyStore = create((set, get) => ({
  companyData: {},
  setCompanyData: (data) => set({ companyData: data }),
  language: Languages["aze"],
  setLanguage: (lang) =>
    set((state) => {
      if (Object.values(Languages).includes(lang)) {
        return { language: lang };
      }
    }),
  initCompanyDataLoading: true,
  initCompanyData: async () => {
    set({ initCompanyDataLoading: true });
    try {
      const { data } = await getCompanyData();
      if (data) {
        set({ companyData: data, initCompanyDataLoading: false });
      }
    } catch (error) {
      console.error("getCompanyData error: ", error);
      set({ initCompanyDataLoading: false });
    }
  },
}));
