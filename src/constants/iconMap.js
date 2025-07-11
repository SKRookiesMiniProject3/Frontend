// src/constants/iconMap.js
import {
  LayoutGrid,
  FilePlus,
  FileText,
  FileCheck2,
  FileBarChart,
  FileSignature,
  FileCode2,
} from "lucide-react";


// DB에서 넘어오는 name → 프론트에서 사용하는 카테고리명으로 변환
export const categoryNameMap = {
  'Error Report': '실적보고서',
  'Proposal': '사업계획서',
  'Improvement': '재무계획서',
  A: 'R&D 계획서',
  B: '제품소개서',
  C: '전체',
  D: '전체',
  E: '전체',
  F: '전체',
};


// 아이콘 컴포넌트를 직접 매핑 
export const mainMenuIcons = {
  열람: LayoutGrid,
  등록: FilePlus,
};

export const categoryIcons = {
  전체: FileText,
  사업계획서: FileCheck2,
  "R&D 계획서": FileCode2,
  실적보고서: FileBarChart,
  재무계획서: FileSignature,
  제품소개서: FileText,
};
