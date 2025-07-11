import { LayoutGrid, FilePlus, FileText, FileCheck2, FileBarChart, FileSignature, FileCode2 } from "lucide-react";

export const mainMenuIcons = {
  열람: <LayoutGrid size={18} />,
  등록: <FilePlus size={18} />,
};

export const categoryIcons = {
  전체: <FileText size={18} />,
  사업계획서: <FileCheck2 size={18} />,
  "R&D 계획서": <FileCode2 size={18} />,
  실적보고서: <FileBarChart size={18} />,
  재무계획서: <FileSignature size={18} />,
  제품소개서: <FileText size={18} />,
};
