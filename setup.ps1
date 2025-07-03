# Setup script for Battle of Plans

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path frontend
New-Item -ItemType Directory -Force -Path backend

# Setup frontend
Set-Location frontend
npm init -y
npm install react react-dom react-scripts typescript @types/react @types/react-dom @types/node
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material date-fns axios

# Setup backend
Set-Location ../backend
npm init -y
npm install express typescript ts-node @types/node @types/express cors @types/cors mongoose @types/mongoose dotenv
npm install --save-dev ts-node-dev

# Return to root
Set-Location .. 