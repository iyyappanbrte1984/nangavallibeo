import React, { useState } from 'react';
import { ICertificate, NANGAVALLI_SCHOOLS, COMPETITIONS, PRIZES } from '../types';
import { Users, Upload, Plus, Trash2, CheckCircle2, Sparkles, FileSpreadsheet } from 'lucide-react';

interface Props {
  onBulkSubmit: (students: any[]) => Promise<ICertificate[]>;
  isLoading?: boolean;
}

export const BulkGenerator: React.FC<Props> = ({ onBulkSubmit, isLoading = false }) => {
  const [selectedSchool, setSelectedSchool] = useState(NANGAVALLI_SCHOOLS[0].name);
  const [selectedUdise, setSelectedUdise] = useState(NANGAVALLI_SCHOOLS[0].udise);

  const [rows, setRows] = useState<Array<{
    studentName: string;
    class: number;
    competitionName: string;
    prizePlace: string;
  }>>([
    { studentName: '', class: 5, competitionName: 'பேச்சுப்போட்டி', prizePlace: 'முதல்' },
    { studentName: '', class: 5, competitionName: 'பேச்சுப்போட்டி', prizePlace: 'இரண்டாம்' },
    { studentName: '', class: 5, competitionName: 'பேச்சுப்போட்டி', prizePlace: 'மூன்றாம்' },
  ]);

  const [pasteText, setPasteText] = useState('');
  const [showPaste, setShowPaste] = useState(false);

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const found = NANGAVALLI_SCHOOLS.find((s) => s.name === val);
    if (found) {
      setSelectedSchool(found.name);
      setSelectedUdise(found.udise);
    }
  };

  const addRow = () => {
    setRows([
      ...rows,
      { studentName: '', class: 5, competitionName: 'பேச்சுப்போட்டி', prizePlace: 'முதல்' },
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: string, value: any) => {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    setRows(next);
  };

  const handleParsePaste = () => {
    if (!pasteText.trim()) return;
    const lines = pasteText.trim().split('\n');
    const parsed: Array<{ studentName: string; class: number; competitionName: string; prizePlace: string }> = [];

    lines.forEach((line) => {
      const parts = line.split(/,|\t/);
      if (parts[0]) {
        parsed.push({
          studentName: parts[0].trim(),
          class: parseInt(parts[1], 10) || 5,
          competitionName: parts[2]?.trim() || 'பேச்சுப்போட்டி',
          prizePlace: parts[3]?.trim() || 'முதல்',
        });
      }
    });

    if (parsed.length > 0) {
      setRows(parsed);
      setShowPaste(false);
      setPasteText('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = rows.filter((r) => r.studentName.trim());
    if (validRows.length === 0) {
      alert('குறைந்தது ஒரு மாணவர் பெயரை உள்ளிடவும் (Please enter at least one student name)');
      return;
    }

    const payload = validRows.map((r) => ({
      studentName: r.studentName.trim(),
      class: r.class,
      schoolName: selectedSchool,
      udiseCode: selectedUdise,
      competitionName: r.competitionName,
      prizePlace: r.prizePlace,
    }));

    await onBulkSubmit(payload);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-yellow-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">மொத்தமாக சான்றிதழ் உருவாக்குதல் (Bulk Generator)</h2>
            <p className="text-indigo-200 text-xs mt-0.5">
              ஒரே நேரத்தில் பல மாணவர்களுக்கு சான்றிதழ்களை விரைவாக உருவாக்குங்கள்.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* School Selection */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            பள்ளித் தேர்வு (Select School for Bulk Creation):
          </label>
          <select
            value={selectedSchool}
            onChange={handleSchoolChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900"
          >
            {NANGAVALLI_SCHOOLS.map((s) => (
              <option key={s.udise} value={s.name}>
                {s.name} (UDISE: {s.udise})
              </option>
            ))}
          </select>
        </div>

        {/* Action toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-slate-800 text-sm">
            மாணவர் பட்டியல் ({rows.length} மாணவர்கள்):
          </h3>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPaste(!showPaste)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV / Text ஒட்டு (Paste)</span>
            </button>

            <button
              type="button"
              onClick={addRow}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>வரிசை சேர் (Add Row)</span>
            </button>
          </div>
        </div>

        {/* Paste Area Toggle */}
        {showPaste && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
            <p className="text-xs text-indigo-900 font-semibold">
              CSV/Excel தகவலை கீழே ஒட்டவும் (வரிசை வடிவம்: பெயர், வகுப்பு, போட்டி, பரிசு):
            </p>
            <textarea
              rows={4}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="க. கவின்செல்வன், 5, பேச்சுப்போட்டி, முதல்&#10;பா. தாரணி, 7, கட்டுரைப்போட்டி, இரண்டாம்"
              className="w-full p-3 bg-white rounded-lg border border-indigo-300 font-mono text-xs text-slate-800"
            />
            <button
              type="button"
              onClick={handleParsePaste}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-lg transition"
            >
              தகவலை இறக்குமதி செய் (Import Rows)
            </button>
          </div>
        )}

        {/* Dynamic Rows */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
            >
              <div className="md:col-span-1 text-xs font-bold text-slate-400 text-center">
                #{idx + 1}
              </div>

              {/* Student Name */}
              <div className="md:col-span-4">
                <input
                  type="text"
                  placeholder="மாணவர் பெயர்..."
                  value={row.studentName}
                  onChange={(e) => updateRow(idx, 'studentName', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>

              {/* Class */}
              <div className="md:col-span-2">
                <select
                  value={row.class}
                  onChange={(e) => updateRow(idx, 'class', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
                    <option key={c} value={c}>
                      {c} - ஆம் வகுப்பு
                    </option>
                  ))}
                </select>
              </div>

              {/* Competition */}
              <div className="md:col-span-2">
                <select
                  value={row.competitionName}
                  onChange={(e) => updateRow(idx, 'competitionName', e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  {COMPETITIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prize */}
              <div className="md:col-span-2">
                <select
                  value={row.prizePlace}
                  onChange={(e) => updateRow(idx, 'prizePlace', e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-amber-900 bg-amber-50"
                >
                  {PRIZES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} பரிசு
                    </option>
                  ))}
                </select>
              </div>

              {/* Remove Action */}
              <div className="md:col-span-1 text-center">
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>
            {isLoading ? 'உருவாக்கப்படுகிறது...' : `மொத்தம் ${rows.filter((r) => r.studentName.trim()).length} சான்றிதழ்களை உருவாக்கு`}
          </span>
        </button>
      </form>
    </div>
  );
};
