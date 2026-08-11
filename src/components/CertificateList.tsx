import React, { useState } from 'react';
import { ICertificate, COMPETITIONS, PRIZES } from '../types';
import { Search, Filter, Eye, Download, Trash2, Award, School, Calendar, RefreshCw } from 'lucide-react';

interface Props {
  certificates: ICertificate[];
  onSelect: (certificate: ICertificate) => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const CertificateList: React.FC<Props> = ({
  certificates,
  onSelect,
  onDelete,
  onRefresh,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState('');
  const [prizeFilter, setPrizeFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.studentName.toLowerCase().includes(q) ||
      c.schoolName.toLowerCase().includes(q) ||
      c.udiseCode.toLowerCase().includes(q) ||
      c.certificateId.toLowerCase().includes(q);

    const matchesComp = !competitionFilter || c.competitionName === competitionFilter;
    const matchesPrize = !prizeFilter || c.prizePlace === prizeFilter;

    return matchesSearch && matchesComp && matchesPrize;
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`நிச்சயமாக ${name} அவர்களின் சான்றிதழை நீக்க வேண்டுமா?`)) {
      setDeletingId(id);
      await onDelete(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto">
      {/* List Header */}
      <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            <span>உருவாக்கப்பட்ட சான்றிதழ்கள் (Certificate Directory)</span>
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            நங்கவள்ளி ஒன்றியம் - மொத்தம் {certificates.length} சான்றிதழ்கள்
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>புதுப்பி (Refresh)</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="மாணவர் பெயர், பள்ளி, ID கொண்டு தேடுக..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Competition Filter */}
        <div>
          <select
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
            className="w-full py-2 px-3 bg-white rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
          >
            <option value="">அனைத்துப் போட்டிகள் (All Competitions)</option>
            {COMPETITIONS.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.id}
              </option>
            ))}
          </select>
        </div>

        {/* Prize Filter */}
        <div>
          <select
            value={prizeFilter}
            onChange={(e) => setPrizeFilter(e.target.value)}
            className="w-full py-2 px-3 bg-white rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
          >
            <option value="">அனைத்துப் பரிசுகள் (All Prizes)</option>
            {PRIZES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} பரிசு
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Certificate Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4">
            <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold text-base">சான்றிதழ்கள் எதுவும் காணப்படவில்லை</p>
            <p className="text-slate-400 text-xs mt-1">
              புதிய சான்றிதழை உருவாக்க 'புதிய சான்றிதழ்' படிவத்தைப் பயன்படுத்தவும்.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">மாணவர் பெயர்</th>
                <th className="py-3.5 px-4">வகுப்பு</th>
                <th className="py-3.5 px-4">பள்ளி விவரம்</th>
                <th className="py-3.5 px-4">போட்டி</th>
                <th className="py-3.5 px-4">பரிசு</th>
                <th className="py-3.5 px-4 text-center">செயல்கள்</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm font-medium">
              {filtered.map((cert) => (
                <tr key={cert.certificateId || cert._id} className="hover:bg-indigo-50/40 transition">
                  {/* ID */}
                  <td className="py-3 px-4 font-mono text-xs text-indigo-700 font-bold whitespace-nowrap">
                    {cert.certificateId}
                  </td>

                  {/* Student Name */}
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {cert.studentName}
                  </td>

                  {/* Class */}
                  <td className="py-3 px-4 text-center">
                    <span className="bg-slate-100 text-slate-800 font-extrabold px-2.5 py-1 rounded-md text-xs border border-slate-200">
                      வகுப்பு {cert.class}
                    </span>
                  </td>

                  {/* School */}
                  <td className="py-3 px-4 max-w-xs">
                    <p className="truncate font-semibold text-slate-800 text-xs">{cert.schoolName}</p>
                    <p className="text-[11px] font-mono text-slate-500">UDISE: {cert.udiseCode}</p>
                  </td>

                  {/* Competition */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-lg font-bold">
                      {cert.competitionName}
                    </span>
                  </td>

                  {/* Prize */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg font-extrabold border ${
                        cert.prizePlace === 'முதல்'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : cert.prizePlace === 'இரண்டாம்'
                          ? 'bg-slate-200 text-slate-900 border-slate-300'
                          : 'bg-orange-100 text-orange-900 border-orange-300'
                      }`}
                    >
                      {cert.prizePlace} பரிசு
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center whitespace-nowrap space-x-1">
                    <button
                      onClick={() => onSelect(cert)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
                      title="சான்றிதழைப் பார் (View Certificate)"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(cert.certificateId, cert.studentName)}
                      disabled={deletingId === cert.certificateId}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="நீக்கு (Delete)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
