export interface ICertificate {
  _id?: string;
  studentName: string;
  class: number;
  schoolName: string;
  udiseCode: string;
  competitionName: 'பேச்சுப்போட்டி' | 'கட்டுரைப்போட்டி' | 'ஓவியப்போட்டி' | string;
  prizePlace: 'முதல்' | 'இரண்டாம்' | 'மூன்றாம்' | string;
  certificateId: string;
  createdAt: string;
}

export interface ICertificateFormData {
  studentName: string;
  class: number;
  schoolName: string;
  udiseCode: string;
  competitionName: 'பேச்சுப்போட்டி' | 'கட்டுரைப்போட்டி' | 'ஓவியப்போட்டி';
  prizePlace: 'முதல்' | 'இரண்டாம்' | 'மூன்றாம்';
}

import { NANGAVALLI_SCHOOLS } from './data/schools';
export { NANGAVALLI_SCHOOLS };

export const COMPETITIONS = [
  { id: 'பேச்சுப்போட்டி', name: 'பேச்சுப்போட்டி (Elocution)' },
  { id: 'கட்டுரைப்போட்டி', name: 'கட்டுரைப்போட்டி (Essay Writing)' },
  { id: 'ஓவியப்போட்டி', name: 'ஓவியப்போட்டி (Drawing)' },
];

export const PRIZES = [
  { id: 'முதல்', label: 'முதல் பரிசு (1st Prize)', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'இரண்டாம்', label: 'இரண்டாம் பரிசு (2nd Prize)', badge: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'மூன்றாம்', label: 'மூன்றாம் பரிசு (3rd Prize)', badge: 'bg-orange-100 text-orange-800 border-orange-300' },
];
