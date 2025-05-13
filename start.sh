
#!/bin/bash
echo "==================================="
echo "Starting Fotky 9.C Application"
echo "==================================="

# Install missing dependencies if needed
echo "Checking and installing dependencies..."
npm i multer --no-save

# Build the React app first
echo "Building React application..."
npm run build

# Create uploads directory if it doesn't exist
echo "Setting up upload directory..."
mkdir -p uploads
chmod 777 uploads

# Start the Node.js server
echo "Starting Node.js server..."
node server.js
