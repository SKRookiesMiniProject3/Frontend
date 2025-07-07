import { create } from 'zustand';

const errorReportStore = create((set) => ({
  reports: [],
  totalCount: 0,          //전체 에러 리포트 수
  weeklyCount: 0,         //주간 에러 리포트 수
  unprocessedCount: 0,    //미처리 리포트 수

  setReports: (reportList) => set({ reports: reportList }),
  setTotalCount: (count) => set({ totalCount: count }),
  setWeeklyCount: (count) => set({ weeklyCount: count }),
  setUnprocessedCount: (count) => set({ unprocessedCount: count }),
}));

export default errorReportStore;
