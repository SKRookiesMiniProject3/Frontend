import { create } from 'zustand';
import { fetchErrorReportById } from "../api/errorReports";

const errorReportStore = create((set, get) => ({
  reports: [],
  selectedReport: null,
  totalCount: 0,          //전체 에러 리포트 수
  weeklyCount: 0,         //주간 에러 리포트 수
  unprocessedCount: 0,    //미처리 리포트 수
  completedCount: 0,      //완료된 리포트 수

  setReports: (reportList) => set({ reports: reportList }),
  setSelectedReport: (report) => set({ selectedReport: report }),
  
  setTotalCount: (count) => set({ totalCount: count }),
  setWeeklyCount: (count) => set({ weeklyCount: count }),
  setUnprocessedCount: (count) => set({ unprocessedCount: count }),
  setCompletedCount: (count) => set({ completedCount: count }),

  updateReportById: (id, updates) => {
    set({
      reports: get().reports.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    });
  },

  //상세 리포트 조회 후 상태 저장
  fetchAndSetSelectedReport: async (id, token) => {
    const result = await fetchErrorReportById(id, token);
    if (result?.success && result.data) {
      set({ selectedReport: result.data });
    } else {
      set({ selectedReport: null });
    }
  },
}));

export default errorReportStore;
