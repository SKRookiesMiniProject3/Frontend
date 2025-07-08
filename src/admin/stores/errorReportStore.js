import { create } from 'zustand';

const errorReportStore = create((set, get) => ({
  reports: [],
  selectedReport: null,
  totalCount: 0,          //전체 에러 리포트 수
  weeklyCount: 0,         //주간 에러 리포트 수
  unprocessedCount: 0,    //미처리 리포트 수

  setReports: (reportList) => set({ reports: reportList }),
  setSelectedReport: (report) => set({ selectedReport: report }),
  
  setTotalCount: (count) => set({ totalCount: count }),
  setWeeklyCount: (count) => set({ weeklyCount: count }),
  setUnprocessedCount: (count) => set({ unprocessedCount: count }),

  updateReportById: (id, updates) => {
    set({
      reports: get().reports.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    });
  },
}));

export default errorReportStore;
