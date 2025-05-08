
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Compress responses
app.use(compression());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Send index.html for all routes to enable client-side routing
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
----------------------------------------
`);
