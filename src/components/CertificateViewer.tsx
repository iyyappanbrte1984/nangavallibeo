import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, Printer, Check, Copy, Sparkles } from 'lucide-react';
import { ICertificate } from '../types';
import { TNEmblem } from './TNEmblem';
import { CertificateSignatures } from './CertificateSignatures';

interface Props {
  certificate: ICertificate;
  onEdit?: () => void;
  readOnly?: boolean;
}

export const CertificateViewer: React.FC<Props> = ({ certificate, onEdit, readOnly = false }) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null);
  const [copied, setCopied] = useState(false);

  // Clean oklch colors from cloned document styles before html2canvas processes it
  const prepareCloneForHtml2Canvas = (clonedDoc: Document) => {
    const styleTags = clonedDoc.querySelectorAll('style');
    styleTags.forEach((style) => {
      if (style.innerHTML && style.innerHTML.includes('oklch')) {
        style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#1e293b');
      }
    });
  };

  const handleDownloadPNG = async () => {
    if (!certRef.current) return;
    try {
      setDownloading('png');
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: prepareCloneForHtml2Canvas,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Certificate_${certificate.studentName}_${certificate.certificateId}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating PNG:', err);
      alert('சான்றிதழ் படம் பதிவிறக்கம் செய்வதில் பிழை (Error exporting PNG)');
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      setDownloading('pdf');
      const canvas = await html2canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: prepareCloneForHtml2Canvas,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${certificate.studentName}_${certificate.certificateId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('சான்றிதழ் PDF பதிவிறக்கம் செய்வதில் பிழை (Error exporting PDF)');
    } finally {
      setDownloading(null);
    }
  };

  const handlePrint = () => {
    if (!certRef.current) return;
    const printContent = certRef.current.outerHTML;
    const printWindow = window.open('about:blank', 'Certificate_Print', 'left=50,top=50,width=1100,height=800');

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${certificate.studentName}</title>
            <style>
              @page { size: landscape A4; margin: 0; }
              body { margin: 0; padding: 0; background: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: serif; }
              .print-container { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent}
            </div>
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 600);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate.certificateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-6">
      {/* Control Action Toolbar */}
      <div className="w-full bg-white p-4 rounded-2xl border-2 border-orange-200 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-50 text-orange-800 px-3 py-1.5 rounded-xl border border-orange-200 flex items-center space-x-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>சான்றிதழ் குறியீடு (ID):</span>
            <strong className="font-mono text-orange-950">{certificate.certificateId}</strong>
          </div>
          <button
            onClick={handleCopyId}
            className="text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition"
            title="Copy Certificate ID"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'நகலெடுக்கப்பட்டது!' : 'நகலெடு'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {!readOnly && onEdit && (
            <button
              onClick={onEdit}
              className="px-3.5 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold transition"
            >
              தகவலைத் திருத்து
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>அச்சிடுக (Print)</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={downloading === 'png'}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading === 'png' ? 'பதிவிறங்குகிறது...' : 'PNG பதிவிறக்கம்'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading === 'pdf'}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{downloading === 'pdf' ? 'தயாராகிறது...' : 'PDF பதிவிறக்கம்'}</span>
          </button>
        </div>
      </div>

      {/* Certificate Print Area with Pure Inline CSS Colors for html2canvas compatibility */}
      <div className="w-full overflow-x-auto p-3 flex justify-center bg-slate-200/80 rounded-2xl border border-slate-300 shadow-inner">
        <div
          ref={certRef}
          id="certificate-print-area"
          className="relative w-[1000px] h-[707px] select-none shadow-2xl overflow-hidden flex flex-col justify-between font-serif"
          style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            border: '12px solid #FF9933', // Saffron outer border
            boxSizing: 'border-box',
            fontFamily: "'Anek Tamil', 'Mukta Malalar', 'Tiro Tamil', Georgia, serif",
          }}
        >
          {/* Inner Tri-color Ornate Border Line */}
          <div
            className="absolute inset-1.5 pointer-events-none"
            style={{
              border: '3px solid #138808', // Green inner border
              boxSizing: 'border-box',
            }}
          />
          <div
            className="absolute inset-3 pointer-events-none"
            style={{
              border: '1.5px stroke #000080', // Navy Blue fine line
              boxSizing: 'border-box',
            }}
          />

          {/* Top Tri-Color Banner Strip */}
          <div className="w-full h-2.5 flex flex-shrink-0">
            <div className="w-1/3 h-full" style={{ backgroundColor: '#FF9933' }} />
            <div className="w-1/3 h-full" style={{ backgroundColor: '#FFFFFF' }} />
            <div className="w-1/3 h-full" style={{ backgroundColor: '#138808' }} />
          </div>

          {/* Ashoka Chakra Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
            <svg viewBox="0 0 100 100" className="w-80 h-80">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#000080" strokeWidth="2" />
              <circle cx="50" cy="50" r="8" fill="#000080" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="#000080"
                  strokeWidth="1.2"
                />
              ))}
            </svg>
          </div>

          {/* Top Right Decorative Horizontal Tricolor Flag */}
          <div className="absolute top-4 right-5 pointer-events-none z-0">
            <div className="flex flex-col space-y-0.5 opacity-90">
              <div className="w-12 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#FF9933' }} />
              <div className="w-12 h-2 rounded-full border border-slate-300 shadow-sm flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#000080' }} />
              </div>
              <div className="w-12 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#138808' }} />
            </div>
          </div>

          {/* Top Left Decorative Horizontal Tricolor Flag */}
          <div className="absolute top-4 left-5 pointer-events-none z-0">
            <div className="flex flex-col space-y-0.5 opacity-90">
              <div className="w-12 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#FF9933' }} />
              <div className="w-12 h-2 rounded-full border border-slate-300 shadow-sm flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#000080' }} />
              </div>
              <div className="w-12 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#138808' }} />
            </div>
          </div>

          {/* Certificate Main Content */}
          <div className="relative z-10 w-full h-[670px] px-8 py-2 flex flex-col justify-between">
            
            {/* Header Section */}
            <div className="w-full flex flex-col items-center justify-center text-center space-y-0.5 pt-1">
              {/* Top Row - Tamil Nadu Emblem */}
              <div className="flex justify-center mb-1">
                <TNEmblem className="w-16 h-16" />
              </div>

              {/* Title Headers */}
              {/* 1. தமிழ்நாடு அரசு */}
              <h1
                className="text-2xl font-black tracking-wide leading-tight"
                style={{ color: '#000080' }}
              >
                தமிழ்நாடு அரசு
              </h1>

              {/* 2. தொடக்கக் கல்வித் துறை */}
              <h2
                className="text-lg font-extrabold tracking-wide leading-tight"
                style={{ color: '#800020' }}
              >
                தொடக்கக் கல்வித் துறை
              </h2>

              {/* 3. நங்கவள்ளி ஒன்றியம், சேலம் மாவட்டம் */}
              <h3
                className="text-base font-bold tracking-normal leading-tight"
                style={{ color: '#138808' }}
              >
                நங்கவள்ளி ஒன்றியம் , சேலம் மாவட்டம்
              </h3>

              {/* 4. Event Name (80th Independence Day Celebration - 2026) */}
              <div className="pt-0.5 flex flex-col items-center">
                <div
                  className="px-5 py-0.5 rounded-full text-lg font-black shadow-sm"
                  style={{
                    backgroundColor: '#FFF3E0',
                    color: '#D84315',
                    border: '2px solid #FF9933',
                  }}
                >
                  80-ஆவது சுதந்திர தின விழா - 2026
                </div>
                <p
                  className="text-xs font-bold mt-0.5"
                  style={{ color: '#000080' }}
                >
                  ( பள்ளி அளவிலான போட்டிகள் )
                </p>
              </div>
            </div>

            {/* Main Certificate Body Text */}
            <div className="my-auto px-4 py-1 text-center text-slate-900 leading-8 text-lg font-medium">
              
              {/* Line 1 & 2 */}
              <div className="flex flex-wrap items-baseline justify-center gap-x-2">
                <span
                  className="border-b-2 font-extrabold px-3 min-w-[240px] text-center inline-block"
                  style={{ color: '#000080', borderColor: '#000080' }}
                >
                  {certificate.schoolName || '_______________'}
                </span>
                <span className="font-bold text-slate-800">
                  ஊராட்சி ஒன்றிய தொடக்க/
                </span>
              </div>

              <div className="mt-0.5">
                <span className="font-bold text-slate-800">
                  நடுநிலைப் பள்ளி அளவில் நடைபெற்ற
                </span>
              </div>

              {/* Line 3 & 4 */}
              <div className="flex flex-wrap items-baseline justify-center gap-x-2 mt-1">
                <span
                  className="border-b-2 font-extrabold px-3 min-w-[160px] text-center inline-block"
                  style={{ color: '#000080', borderColor: '#000080' }}
                >
                  {certificate.competitionName || '_______________'}
                </span>
                <span className="font-bold text-slate-800">போட்டியில்</span>
                <span
                  className="border-b-2 font-extrabold px-3 text-center inline-block"
                  style={{ color: '#000080', borderColor: '#000080' }}
                >
                  {certificate.class}
                </span>
                <span className="font-bold text-slate-800">
                  வகுப்பைச்
                </span>
              </div>

              <div className="flex flex-wrap items-baseline justify-center gap-x-2 mt-0.5">
                <span className="font-bold text-slate-800">
                  சார்ந்த மாணவர் செல்வன்/செல்வி
                </span>
                <span
                  className="border-b-2 font-extrabold px-5 min-w-[220px] text-center inline-block"
                  style={{ color: '#000080', borderColor: '#000080' }}
                >
                  {certificate.studentName || '____________________'}
                </span>
              </div>

              {/* Line 5 & 6 */}
              <div className="flex flex-wrap items-baseline justify-center gap-x-2 mt-1">
                <span
                  className="border-b-2 font-extrabold px-5 text-center inline-block"
                  style={{ color: '#D84315', borderColor: '#D84315' }}
                >
                  {certificate.prizePlace}
                </span>
                <span className="font-bold text-slate-800">
                  பெற்றதைப் பாராட்டி
                </span>
              </div>

              <div className="mt-0.5 font-bold text-slate-800">
                இச்சான்றிதழ் வழங்கப்படுகிறது.
              </div>

            </div>

            {/* Bottom Signatures & ID */}
            <div className="w-full flex flex-col items-center pb-1">
              <CertificateSignatures />

              <div
                className="text-center pt-1 font-mono text-[11px] font-bold tracking-wider"
                style={{ color: '#475569' }}
              >
                Certificate ID {certificate.certificateId}
              </div>
            </div>

          </div>

          {/* Bottom Tri-Color Banner Strip */}
          <div className="w-full h-2.5 flex flex-shrink-0">
            <div className="w-1/3 h-full" style={{ backgroundColor: '#FF9933' }} />
            <div className="w-1/3 h-full" style={{ backgroundColor: '#FFFFFF' }} />
            <div className="w-1/3 h-full" style={{ backgroundColor: '#138808' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
