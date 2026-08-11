import React, { useState } from 'react';
import { ICertificate, ICertificateFormData, NANGAVALLI_SCHOOLS, COMPETITIONS, PRIZES } from '../types';
import { Award, School, User, Hash, Trophy, CheckCircle2, AlertTriangle, Sparkles, Building2 } from 'lucide-react';

interface Props {
  onSubmit: (formData: ICertificateFormData) => Promise<ICertificate | null>;
  initialData?: ICertificateFormData;
  isLoading?: boolean;
}

export const CertificateForm: React.FC<Props> = ({ onSubmit, initialData, isLoading = false }) => {
  const [formData, setFormData] = useState<ICertificateFormData>(
    initialData || {
      studentName: '',
      class: 5,
      schoolName: NANGAVALLI_SCHOOLS[0].name,
      udiseCode: NANGAVALLI_SCHOOLS[0].udise,
      competitionName: 'பேச்சுப்போட்டி',
      prizePlace: 'முதல்',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customSchool, setCustomSchool] = useState(false);

  const handleSchoolSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'CUSTOM') {
      setCustomSchool(true);
      setFormData({ ...formData, schoolName: '', udiseCode: '' });
    } else {
      setCustomSchool(false);
      const school = NANGAVALLI_SCHOOLS.find((s) => s.name === val);
      if (school) {
        setFormData({
          ...formData,
          schoolName: school.name,
          udiseCode: school.udise,
        });
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'மாணவர் பெயர் உள்ளிடவும் (Student name is required)';
    }

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'பள்ளி பெயர் உள்ளிடவும் (School name is required)';
    }

    if (!formData.udiseCode.trim()) {
      newErrors.udiseCode = 'UDISE குறியீடு உள்ளிடவும் (UDISE code is required)';
    } else if (!/^\d{11}$/.test(formData.udiseCode.trim())) {
      newErrors.udiseCode = '11 இலக்க UDISE குறியீடு உள்ளிடவும் (Must be 11 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const fillSampleData = (sampleNum: number) => {
    if (sampleNum === 1) {
      setFormData({
        studentName: 'க. கவின்செல்வன்',
        class: 5,
        schoolName: 'ஊராட்சி ஒன்றிய நடுநிலைப் பள்ளி, நங்கவள்ளி',
        udiseCode: '33250800101',
        competitionName: 'பேச்சுப்போட்டி',
        prizePlace: 'முதல்',
      });
    } else if (sampleNum === 2) {
      setFormData({
        studentName: 'பா. தாரணி',
        class: 7,
        schoolName: 'ஊராட்சி ஒன்றிய நடுநிலைப் பள்ளி, வானவாசி',
        udiseCode: '33250800201',
        competitionName: 'கட்டுரைப்போட்டி',
        prizePlace: 'இரண்டாம்',
      });
    } else {
      setFormData({
        studentName: 'மு. அஸ்வின்',
        class: 3,
        schoolName: 'ஊராட்சி ஒன்றிய தொடக்கப் பள்ளி, ஜாலகண்டாபுரம்',
        udiseCode: '33250800401',
        competitionName: 'ஓவியப்போட்டி',
        prizePlace: 'மூன்றாம்',
      });
    }
    setCustomSchool(false);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white p-6 relative">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-amber-200">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              சான்றிதழ் விவரங்கள் உள்ளீடு (Certificate Entry Form)
            </h2>
            <p className="text-orange-100 text-sm mt-0.5 font-medium">
              80-ஆவது சுதந்திர தின விழா - 2026 | நங்கவள்ளி ஒன்றியம் (77 பள்ளிகள்)
            </p>
          </div>
        </div>

        {/* Quick fill buttons */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-red-200 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            மாதிரி தரவு (Sample Preset):
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillSampleData(1)}
              className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-md transition font-medium"
            >
              மாதிரி 1 (1st Prize)
            </button>
            <button
              type="button"
              onClick={() => fillSampleData(2)}
              className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-md transition font-medium"
            >
              மாதிரி 2 (2nd Prize)
            </button>
            <button
              type="button"
              onClick={() => fillSampleData(3)}
              className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-md transition font-medium"
            >
              மாதிரி 3 (3rd Prize)
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Row 1: Student Name & Class */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>மாணவர் பெயர் (Student Name)</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="எ.கா. செல்வன்/செல்வி க. கவின்செல்வன்"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.studentName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-indigo-600'
              } focus:ring-2 focus:ring-indigo-200 outline-none text-slate-900 font-medium transition`}
            />
            {errors.studentName && (
              <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.studentName}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-indigo-600" />
              <span>வகுப்பு (Class)</span>
              <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none text-slate-900 font-semibold transition"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((cls) => (
                <option key={cls} value={cls}>
                  {cls} - ஆம் வகுப்பு (Class {cls})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: School Selection & UDISE Code */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <School className="w-4 h-4 text-indigo-600" />
              <span>நங்கவள்ளி ஒன்றிய பள்ளி (School Name)</span>
              <span className="text-red-500">*</span>
            </label>

            {!customSchool ? (
              <div className="space-y-2">
                <select
                  value={formData.schoolName}
                  onChange={handleSchoolSelect}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none text-slate-900 font-medium transition bg-slate-50/50"
                >
                  {NANGAVALLI_SCHOOLS.map((school) => (
                    <option key={school.udise} value={school.name}>
                      {school.name} (UDISE: {school.udise})
                    </option>
                  ))}
                  <option value="CUSTOM">+ பிற பள்ளி பெயர் உள்ளிடவும் (Other School...)</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="ஊராட்சி ஒன்றிய தொடக்க/நடுநிலைப் பள்ளி பெயர்..."
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.schoolName ? 'border-red-500' : 'border-slate-300'
                  } focus:ring-2 focus:ring-indigo-200 outline-none text-slate-900 font-medium`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomSchool(false);
                    setFormData({
                      ...formData,
                      schoolName: NANGAVALLI_SCHOOLS[0].name,
                      udiseCode: NANGAVALLI_SCHOOLS[0].udise,
                    });
                  }}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  ← பட்டியலில் உள்ள பள்ளியைத் தேர்ந்தெடுக்கவும்
                </button>
              </div>
            )}
            {errors.schoolName && <p className="text-red-600 text-xs">{errors.schoolName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>பள்ளி UDISE குறியீடு (UDISE Code)</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={11}
              placeholder="எ.கா. 33250800101"
              value={formData.udiseCode}
              onChange={(e) => setFormData({ ...formData, udiseCode: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border font-mono ${
                errors.udiseCode ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
              } focus:ring-2 focus:ring-indigo-200 outline-none text-slate-900 font-semibold`}
            />
            {errors.udiseCode && <p className="text-red-600 text-xs">{errors.udiseCode}</p>}
          </div>
        </div>

        {/* Row 3: Competition & Prize */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>போட்டிப் பெயர் (Competition Name)</span>
              <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.competitionName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  competitionName: e.target.value as any,
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none text-slate-900 font-bold bg-amber-50/20"
            >
              {COMPETITIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>பெற்ற பரிசு (Prize Place)</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIZES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      prizePlace: p.id as any,
                    })
                  }
                  className={`py-2 px-3 rounded-xl border text-sm font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                    formData.prizePlace === p.id
                      ? 'bg-red-700 text-white border-red-700 shadow-md ring-2 ring-red-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{p.id}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    {p.id === 'முதல்' ? '1st' : p.id === 'இரண்டாம்' ? '2nd' : '3rd'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-red-700 via-red-800 to-indigo-900 hover:from-red-800 hover:to-indigo-950 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-yellow-300" />
            <span>
              {isLoading ? 'சான்றிதழ் உருவாக்கப்படுகிறது...' : 'சான்றிதழ் உருவாக்கு (Submit & Generate Certificate)'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
