
#!/bin/bash
echo "==================================="
echo "Starting Fotky 9.C Application"
echo "==================================="

# Detect if running in Pterodactyl environment
if [ -f "/etc/pterodactyl" ]; then
  echo "Detected Pterodactyl environment on Creepercloud"
  export PTERODACTYL_ENVIRONMENT=true
  
  # Create uploads directory in Pterodactyl container home
  UPLOAD_DIR=${UPLOAD_PATH:-"/home/container/uploads"}
  echo "Setting up upload directory at: $UPLOAD_DIR"
  mkdir -p $UPLOAD_DIR
  chmod 777 $UPLOAD_DIR
  export UPLOAD_PATH=$UPLOAD_DIR
else
  echo "Running in standard environment"
  # Standard environment setup
  mkdir -p uploads
  chmod 777 uploads
fi

# Install missing dependencies if needed
echo "Checking and installing dependencies..."
npm i multer express compression helmet --no-save

# Build the React app first
echo "Building React application..."
npm run build

# Start the Node.js server
echo "Starting Node.js server..."
node server.js
