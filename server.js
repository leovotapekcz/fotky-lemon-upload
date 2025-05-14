
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Compress responses
app.use(compression());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse JSON bodies
app.use(express.json());

// Simple API endpoint to handle file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded');
  }
  
  // Return the file paths
  const filePaths = req.files.map(file => ({
    filename: file.filename,
    path: `/uploads/${file.filename}`
  }));
  
  console.log('Files uploaded successfully:', filePaths);
  res.json({ files: filePaths });
});

// Send index.html for all other routes to enable client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log(`Application URL: http://localhost:${port}`);
});

console.log(`
----------------------------------------
  Fotky 9.C Application Server
----------------------------------------
  ✅ Running in Pterodactyl environment
  ✅ Ukrainian & Czech language support
  ✅ YouTube & Spotify integration
  ✅ Song voting system
  ✅ File upload functionality
----------------------------------------
`);
