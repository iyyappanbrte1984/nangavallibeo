import React, { useState } from 'react';

export const CertificateSignatures: React.FC = () => {
  const [supErr, setSupErr] = useState(false);
  const [beo2Err, setBeo2Err] = useState(false);
  const [beo1Err, setBeo1Err] = useState(false);

  return (
    <div className="w-full flex justify-between items-end px-8 pt-1 pb-0">
      {/* 1. Supervisor / மேற்பார்வையாளர் */}
      <div className="flex flex-col items-center text-center w-1/3">
        <div className="h-10 flex items-end justify-center mb-0.5">
          {!supErr ? (
            <img
              src="/assets/signature_supervisor.png"
              alt="Supervisor Signature"
              className="h-10 max-w-[140px] object-contain"
              onError={() => setSupErr(true)}
            />
          ) : (
            <img
              src="/assets/signature_supervisor.svg"
              alt="Supervisor Signature"
              className="h-10 max-w-[140px] object-contain"
            />
          )}
        </div>
        <div className="text-[#C62828] font-bold leading-tight text-xs tracking-wide">
          <p>மேற்பார்வையாளர்</p>
          <p>நங்கவள்ளி</p>
        </div>
      </div>

      {/* 2. BEO 2 / வட்டாரக் கல்வி அலுவலர் 2 */}
      <div className="flex flex-col items-center text-center w-1/3">
        <div className="h-10 flex items-end justify-center mb-0.5">
          {!beo2Err ? (
            <img
              src="/assets/signature_beo2.png"
              alt="BEO 2 Signature"
              className="h-10 max-w-[140px] object-contain"
              onError={() => setBeo2Err(true)}
            />
          ) : (
            <img
              src="/assets/signature_beo2.svg"
              alt="BEO 2 Signature"
              className="h-10 max-w-[140px] object-contain"
            />
          )}
        </div>
        <div className="text-[#C62828] font-bold leading-tight text-xs tracking-wide">
          <p>வட்டாரக் கல்வி அலுவலர் 2</p>
          <p>நங்கவள்ளி</p>
        </div>
      </div>

      {/* 3. BEO 1 / வட்டாரக் கல்வி அலுவலர் 1 */}
      <div className="flex flex-col items-center text-center w-1/3">
        <div className="h-10 flex items-end justify-center mb-0.5">
          {!beo1Err ? (
            <img
              src="/assets/signature_beo1.png"
              alt="BEO 1 Signature"
              className="h-10 max-w-[140px] object-contain"
              onError={() => setBeo1Err(true)}
            />
          ) : (
            <img
              src="/assets/signature_beo1.svg"
              alt="BEO 1 Signature"
              className="h-10 max-w-[140px] object-contain"
            />
          )}
        </div>
        <div className="text-[#C62828] font-bold leading-tight text-xs tracking-wide">
          <p>வட்டாரக் கல்வி அலுவலர் 1</p>
          <p>நங்கவள்ளி</p>
        </div>
      </div>
    </div>
  );
};
