
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Pterodactyl specific environment detection
const isPterodactyl = process.env.PTERODACTYL_ENVIRONMENT === 'true' || fs.existsSync('/etc/pterodactyl');
console.log(`Running in Pterodactyl environment: ${isPterodactyl ? 'Yes' : 'No'}`);

// Set upload directory based on environment
const uploadDir = isPterodactyl 
  ? path.join(process.env.UPLOAD_PATH || '/home/container/uploads') 
  : path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadDir}`);
}

// Security middleware with Pterodactyl-friendly settings
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false, // More compatible with various resources
}));

// Compress responses
app.use(compression());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Parse JSON bodies
app.use(express.json());

// Upload file size limit for Pterodactyl environment
const fileSizeLimit = isPterodactyl ? '50mb' : '10mb';
app.use(express.json({ limit: fileSizeLimit }));
app.use(express.urlencoded({ extended: true, limit: fileSizeLimit }));

// Simple API endpoint to handle file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: isPterodactyl ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB for Pterodactyl, 10MB default
  }
});

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

// Simple health check endpoint for Pterodactyl
app.get('/health', (req, res) => {
  res.status(200).send({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: isPterodactyl ? 'pterodactyl' : 'standard'
  });
});

// Send index.html for all other routes to enable client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => { // Listen on all network interfaces for Pterodactyl
  console.log(`Server is running on port: ${port}`);
  console.log(`Application URL: http://localhost:${port}`);
});

console.log(`
----------------------------------------
  Fotky 9.C Application Server
----------------------------------------
  ✅ Running in ${isPterodactyl ? 'Pterodactyl' : 'Standard'} environment
  ✅ Ukrainian & Czech language support
  ✅ YouTube & Spotify integration
  ✅ Song voting system
  ✅ File upload functionality
  ✅ Configured for Creepercloud deployment
----------------------------------------
`);
