import React, { useState } from 'react';
import { ICertificate } from '../types';
import { Search, ShieldCheck, AlertCircle, CheckCircle, Award } from 'lucide-react';
import { CertificateViewer } from './CertificateViewer';

export const VerifyCertificate: React.FC = () => {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundCert, setFoundCert] = useState<ICertificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setError(null);
    setFoundCert(null);

    try {
      const res = await fetch(`/api/certificates/${certId.trim()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setFoundCert(json.data);
      } else {
        setError('சான்றிதழ் சரிபார்ப்பு தோல்வி: இந்த சான்றிதழ் ID காணப்படவில்லை (Certificate ID not found)');
      }
    } catch (err) {
      setError('சேவையக பிழை: சரிபார்க்க முடியவில்லை (Server error during verification)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 md:p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            அரசு சான்றிதழ் உண்மைத்தன்மை சரிபார்ப்பு
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            நங்கவள்ளி ஒன்றியம் - சுதந்திர தின விழாப் போட்டிகள் 2026
          </p>
        </div>

        <form onSubmit={handleVerify} className="max-w-md mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="எ.கா. NGV-2026-12345"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !certId.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'தேடுகிறது...' : 'சரிபார் (Verify)'}</span>
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {foundCert && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center justify-between font-semibold text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>அதிகாரப்பூர்வ சான்றிதழ் சரிபார்க்கப்பட்டது (Verified Authentic Certificate)</span>
            </div>
            <span className="font-mono text-xs bg-emerald-200 px-2.5 py-1 rounded-md text-emerald-900 font-bold">
              ID: {foundCert.certificateId}
            </span>
          </div>

          <CertificateViewer certificate={foundCert} readOnly={true} />
        </div>
      )}
    </div>
  );
};
