import React, { useState, useEffect } from 'react';
import { ICertificate, ICertificateFormData } from './types';
import { Navbar } from './components/Navbar';
import { CertificateForm } from './components/CertificateForm';
import { CertificateViewer } from './components/CertificateViewer';
import { CertificateList } from './components/CertificateList';
import { BulkGenerator } from './components/BulkGenerator';
import { VerifyCertificate } from './components/VerifyCertificate';
import { Sparkles, ArrowLeft, CheckCircle2, Trophy, Award, School } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'bulk' | 'verify' | 'preview'>('create');
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [activeCert, setActiveCert] = useState<ICertificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch certificates from REST API
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/certificates');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCertificates(json.data);
        if (!activeCert && json.data.length > 0) {
          setActiveCert(json.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Handle single certificate creation
  const handleCreateCertificate = async (formData: ICertificateFormData): Promise<ICertificate | null> => {
    setLoading(true);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setCertificates((prev) => [json.data, ...prev]);
        setActiveCert(json.data);
        setActiveTab('preview');
        showToast('சான்றிதழ் வெற்றிகரமாக உருவாக்கப்பட்டது! (Certificate Generated Successfully)');
        return json.data;
      } else {
        alert(json.message || 'சான்றிதழ் உருவாக்க முடியவில்லை');
        return null;
      }
    } catch (err: any) {
      alert('சேவையக இணைப்பு பிழை (Server Error): ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk creation
  const handleBulkSubmit = async (students: any[]): Promise<ICertificate[]> => {
    setLoading(true);
    try {
      const res = await fetch('/api/certificates/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students }),
      });

      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setCertificates((prev) => [...json.data, ...prev]);
        if (json.data.length > 0) {
          setActiveCert(json.data[0]);
        }
        setActiveTab('list');
        showToast(`${json.count} சான்றிதழ்கள் வெற்றிகரமாக உருவாக்கப்பட்டன!`);
        return json.data;
      } else {
        alert(json.message || 'சான்றிதழ்களை உருவாக்க முடியவில்லை');
        return [];
      }
    } catch (err: any) {
      alert('பிழை: ' + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion
  const handleDeleteCertificate = async (id: string) => {
    try {
      const res = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setCertificates((prev) => prev.filter((c) => c.certificateId !== id && c._id !== id));
        if (activeCert && (activeCert.certificateId === id || activeCert._id === id)) {
          setActiveCert(null);
        }
        showToast('சான்றிதழ் நீக்கப்பட்டது (Certificate Deleted)');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/30 text-slate-900 font-sans flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Main Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        certCount={certificates.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Tri-Color Hero Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-white to-emerald-700 p-1 rounded-3xl shadow-xl">
          <div className="bg-slate-900 text-white rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Background Tri-Color Wave */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2 text-center md:text-left z-10">
              <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-300 px-3.5 py-1 rounded-full text-xs font-extrabold border border-orange-400/40">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>இந்திய 80-ஆவது சுதந்திர தின விழா (1947 - 2026)</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                80-ஆவது சுதந்திர தின விழா - 2026 சான்றிதழ் தயாரிப்பு தளம்
              </h2>
              <p className="text-slate-300 text-sm max-w-xl">
                நங்கவள்ளி ஒன்றியத்தில் உள்ள 77 அரசுத் தொடக்க/நடுநிலைப் பள்ளி மாணவர்களுக்கான பேச்சுப்போட்டி, கட்டுரைப்போட்டி மற்றும் ஓவியப்போட்டி சான்றிதழ்களை உடனடியாக உருவாக்கி பதிவிறக்கம் செய்யலாம்.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 z-10">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-orange-400">{certificates.length}</p>
                <p className="text-[11px] text-slate-300 font-medium">உருவாக்கப்பட்டவை</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-emerald-400">77</p>
                <p className="text-[11px] text-slate-300 font-medium">நங்கவள்ளி பள்ளிகள்</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Router */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            <CertificateForm onSubmit={handleCreateCertificate} isLoading={loading} />

            {/* Live Preview if active certificate exists */}
            {activeCert && (
              <div className="pt-8 border-t border-orange-200 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-600" />
                    <span>கடைசியாக உருவாக்கப்பட்ட சான்றிதழ் நேரடிப் பார்வை (Live Certificate Preview)</span>
                  </h3>
                </div>
                <CertificateViewer certificate={activeCert} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'preview' && activeCert && (
          <div className="space-y-4">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-orange-50 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-orange-600" />
                <span>புதிய சான்றிதழ் உருவாக்க படிவம் திரும்புக</span>
              </button>

              <span className="text-xs font-semibold text-slate-600">
                உருவாக்கப்பட்ட நாள்: {new Date(activeCert.createdAt).toLocaleDateString('ta-IN')}
              </span>
            </div>

            <CertificateViewer
              certificate={activeCert}
              onEdit={() => setActiveTab('create')}
            />
          </div>
        )}

        {activeTab === 'list' && (
          <CertificateList
            certificates={certificates}
            onSelect={(cert) => {
              setActiveCert(cert);
              setActiveTab('preview');
            }}
            onDelete={handleDeleteCertificate}
            onRefresh={fetchCertificates}
            isLoading={loading}
          />
        )}

        {activeTab === 'bulk' && (
          <BulkGenerator onBulkSubmit={handleBulkSubmit} isLoading={loading} />
        )}

        {activeTab === 'verify' && <VerifyCertificate />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t-4 border-orange-500 mt-auto text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          {/* Technical Support Credit */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 max-w-2xl mx-auto mb-3 shadow-md">
            <p className="text-amber-400 font-extrabold text-xs tracking-wider mb-0.5">
              தொழில்நுட்ப உதவி (Technical Supported By)
            </p>
            <p className="text-slate-100 font-bold text-xs sm:text-sm">
              கி. ஐய்யப்பன், <span className="font-medium text-slate-300">ஆசிரியர் பயிற்றுநர், வட்டார வள மையம், காடையாம்பட்டி, சேலம்.</span>
            </p>
          </div>

          <p className="font-semibold text-slate-200">
            தமிழ்நாடு அரசு - தொடக்கக் கல்வித் துறை | நங்கவள்ளி ஒன்றியம், சேலம் மாவட்டம்
          </p>
          <p className="text-slate-400">
            80-ஆவது சுதந்திர தின விழா - 2026 போட்டிகள் சான்றிதழ் உருவாக்கும் அதிகாரப்பூர்வ தளம்
          </p>
        </div>
      </footer>
    </div>
  );
}
