import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory + File persistent store for certificates
interface ICertificate {
  _id: string;
  studentName: string;
  class: number;
  schoolName: string;
  udiseCode: string;
  competitionName: string;
  prizePlace: string;
  certificateId: string;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'certificates_data.json');

function loadCertificates(): ICertificate[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading certificates file:', err);
  }
  return [];
}

function saveCertificates(certificates: ICertificate[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(certificates, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing certificates file:', err);
  }
}

let certificatesDb: ICertificate[] = loadCertificates();

// Helper to generate unique certificate ID
function generateCertificateId(): string {
  const year = '2026';
  const prefix = 'NGV';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${randomNum}`;
}

// REST API Endpoints

// GET /api/certificates - Get all certificates
app.get('/api/certificates', (req, res) => {
  const { search, competition, school, classNum } = req.query;
  let filtered = [...certificatesDb];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.studentName.toLowerCase().includes(q) ||
        c.schoolName.toLowerCase().includes(q) ||
        c.udiseCode.toLowerCase().includes(q) ||
        c.certificateId.toLowerCase().includes(q)
    );
  }

  if (competition && typeof competition === 'string') {
    filtered = filtered.filter((c) => c.competitionName === competition);
  }

  if (school && typeof school === 'string') {
    filtered = filtered.filter((c) => c.schoolName === school);
  }

  if (classNum && typeof classNum === 'string') {
    filtered = filtered.filter((c) => c.class === parseInt(classNum, 10));
  }

  // Sort by newest
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, count: filtered.length, data: filtered });
});

// GET /api/certificates/:id - Get certificate by certificateId
app.get('/api/certificates/:id', (req, res) => {
  const cert = certificatesDb.find(
    (c) => c.certificateId === req.params.id || c._id === req.params.id
  );
  if (!cert) {
    return res.status(404).json({ success: false, message: 'Certificate not found' });
  }
  res.json({ success: true, data: cert });
});

// POST /api/certificates - Save form data and generate unique certificateId
app.post('/api/certificates', (req, res) => {
  try {
    const { studentName, class: classNum, schoolName, udiseCode, competitionName, prizePlace } = req.body;

    // Validation
    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ success: false, message: 'மாணவர் பெயர் தேவை (Student name is required)' });
    }

    const classInt = Number(classNum);
    if (!classInt || classInt < 1 || classInt > 8) {
      return res.status(400).json({ success: false, message: 'வகுப்பு 1 முதல் 8 வரை இருக்க வேண்டும் (Class must be 1-8)' });
    }

    if (!schoolName || !schoolName.trim()) {
      return res.status(400).json({ success: false, message: 'பள்ளி பெயர் தேவை (School name is required)' });
    }

    if (!udiseCode || !udiseCode.trim()) {
      return res.status(400).json({ success: false, message: 'UDISE குறியீடு தேவை (UDISE code is required)' });
    }

    const validCompetitions = ['பேச்சுப்போட்டி', 'கட்டுரைப்போட்டி', 'ஓவியப்போட்டி'];
    if (!validCompetitions.includes(competitionName)) {
      return res.status(400).json({ success: false, message: 'செல்லுபடியாகும் போட்டி பெயரைத் தேர்ந்தெடுக்கவும்' });
    }

    const validPrizes = ['முதல்', 'இரண்டாம்', 'மூன்றாம்'];
    if (!validPrizes.includes(prizePlace)) {
      return res.status(400).json({ success: false, message: 'செல்லுபடியாகும் பரிசைத் தேர்ந்தெடுக்கவும்' });
    }

    // Generate Certificate ID
    let certificateId = generateCertificateId();
    while (certificatesDb.some((c) => c.certificateId === certificateId)) {
      certificateId = generateCertificateId();
    }

    const newCert: ICertificate = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      studentName: studentName.trim(),
      class: classInt,
      schoolName: schoolName.trim(),
      udiseCode: udiseCode.trim(),
      competitionName,
      prizePlace,
      certificateId,
      createdAt: new Date().toISOString(),
    };

    certificatesDb.unshift(newCert);
    saveCertificates(certificatesDb);

    return res.status(201).json({
      success: true,
      message: 'சான்றிதழ் வெற்றிகரமாக உருவாக்கப்பட்டது (Certificate created successfully)',
      data: newCert,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// POST /api/certificates/bulk - Bulk generate certificates
app.post('/api/certificates/bulk', (req, res) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'மாணவர் பட்டியல் தேவை (Student array required)' });
    }

    const created: ICertificate[] = [];

    for (const item of students) {
      if (!item.studentName || !item.schoolName || !item.udiseCode) continue;

      let certificateId = generateCertificateId();
      while (certificatesDb.some((c) => c.certificateId === certificateId) || created.some((c) => c.certificateId === certificateId)) {
        certificateId = generateCertificateId();
      }

      const newCert: ICertificate = {
        _id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        studentName: item.studentName.trim(),
        class: Number(item.class) || 1,
        schoolName: item.schoolName.trim(),
        udiseCode: item.udiseCode.trim(),
        competitionName: item.competitionName || 'பேச்சுப்போட்டி',
        prizePlace: item.prizePlace || 'முதல்',
        certificateId,
        createdAt: new Date().toISOString(),
      };

      created.push(newCert);
    }

    certificatesDb = [...created, ...certificatesDb];
    saveCertificates(certificatesDb);

    res.status(201).json({
      success: true,
      count: created.length,
      data: created,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/certificates/:id - Delete a certificate
app.delete('/api/certificates/:id', (req, res) => {
  const index = certificatesDb.findIndex(
    (c) => c.certificateId === req.params.id || c._id === req.params.id
  );
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Certificate not found' });
  }
  const removed = certificatesDb.splice(index, 1);
  saveCertificates(certificatesDb);
  res.json({ success: true, message: 'Deleted successfully', data: removed[0] });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
