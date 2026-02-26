# 🚀 Quick Setup Guide for New PC

This guide will help you get BioFund Connect running on a new machine in less than 10 minutes.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have these installed:

- ✅ **Node.js** v16+ → [Download](https://nodejs.org/)
- ✅ **MongoDB** (local or Atlas) → [Download](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas)
- ✅ **npm** (comes with Node.js)
- ✅ **Git** → [Download](https://git-scm.com/)

### Verify Installation
```bash
node --version     # Should be v16+
npm --version      # Should be v7+
mongod --version   # Should show version info
git --version      # Should show version info
```

---

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/ANASF1412/BioFund-AI-Connect.git
cd BioFund-AI-Connect
```

### Step 2: Install Dependencies
```bash
# This command installs dependencies for root, backend, and frontend
npm run install-all

# Or manually:
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 3: Configure Environment Variables

#### Backend Configuration
Create `.env` file in `/backend` directory:
```bash
# For Windows PowerShell
echo "" > backend\.env
```

Add the following content to `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/biofund-connect
JWT_SECRET=supersecretkey123!@#$%BioFundConnectSecure
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

**Note**: If using MongoDB Atlas instead of local:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/biofund-connect
```

#### Frontend Configuration
Create `.env` file in `/frontend` directory:
```bash
# For Windows PowerShell
echo "" > frontend\.env
```

Add the following content to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

#### Option A: Local MongoDB
```bash
# Windows (requires MongoDB installed)
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
- No action needed, already configured in MONGO_URI

### Step 5: Seed Test Data (Optional but Recommended)
```bash
cd backend
node seed/seedData.js
cd ..
```

This creates:
- 7 test users (5 approved, 2 pending)
- 16 complete projects with funding data
- Test data for all features

### Step 6: Start the Application

#### Option A: Run Both Servers Together
```bash
npm run dev
```
This will start both backend (port 5000) and frontend (port 5173).

#### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run server
```
Expected output:
```
[nodemon] starting `node backend/server.js`
Server running on port 5000
Connected to MongoDB
```

**Terminal 2 - Frontend:**
```bash
npm run client
```
Expected output:
```
VITE v7.3.1  ready in 221 ms
➜  Local:   http://localhost:5173/
```

### Step 7: Access the Application
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
```

---

## 🧪 Test the Setup

### Login with Test Accounts

#### Approved Users (Can login immediately)
```
Admin:
Email: admin@biofund.com
Password: admin123

Investor:
Email: investor1@example.com
Password: investor123

NGO:
Email: ngo1@example.com
Password: ngo123
```

#### Pending Users (Require admin approval)
```
Email: pending1@example.com
Password: pending123
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 5000/5173
lsof -i :5000          # Mac/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess  # Windows

# Kill the process
kill -9 <PID>          # Mac/Linux
Stop-Process -Id <PID> # Windows
```

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB
```bash
mongod
```

### Dependencies Not Installed
```bash
npm run install-all

# Or clean reinstall:
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

### Port 5173 Already in Use (Frontend)
```bash
# Vite will automatically try the next port (5174, 5175, etc.)
# Check the terminal output for the actual URL
```

### .env File Issues
- Ensure `.env` files are in the correct directories:
  - `backend/.env` (not in root)
  - `frontend/.env` (not in root)
- Don't include quotes around values
- Use correct MONGO_URI based on your setup

### API Calls Failing
1. Check backend is running: http://localhost:5000
2. Check MONGO_URI is correct in backend/.env
3. Check VITE_API_URL is correct in frontend/.env
4. Check browser console for CORS errors

---

## 📊 Typical Startup Output

### Backend ✅
```
[nodemon] 3.1.14
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Server running on port 5000
🌍 MongoDB connected: biofund-connect
```

### Frontend ✅
```
VITE v7.3.1  ready in 221 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🎯 What to Do Next

After successful setup:

1. **Explore Features**
   - Login as Investor → Browse projects
   - Login as NGO → Create a project
   - Login as Admin → Approve users/projects

2. **Try Key Features**
   - Fund a project (Investor)
   - Generate an ESG report (Investor/NGO)
   - Add a milestone (NGO)
   - Approve users (Admin)

3. **Run Tests**
   ```bash
   # Unit tests (if configured)
   npm test
   ```

4. **Development**
   - Code changes auto-reload with Nodemon (backend) and Vite (frontend)
   - Check browser console for errors
   - Check terminal for backend logs

---

## 📞 Getting Help

If something doesn't work:

1. Check this guide's troubleshooting section
2. Review the main [README.md](../README.md)
3. Check logs in terminal windows
4. Review [Issues](https://github.com/ANASF1412/BioFund-AI-Connect/issues)
5. Check browser's Developer Console (F12)

---

## ✅ Quick Verification Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB running or Atlas configured
- [ ] npm dependencies installed
- [ ] `.env` files configured correctly
- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can login with test credentials
- [ ] Database seeded with test data
- [ ] No errors in console/terminal

---

## 🎉 Success!

If you can see the BioFund Connect login page at `http://localhost:5173`, your setup is complete!

**Happy coding!** 🚀
