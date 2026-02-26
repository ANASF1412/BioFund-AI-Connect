# 🌱 BioFund Connect

<div align="center">

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express-000000?logo=express&style=flat-square)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=json-web-tokens&style=flat-square)](https://jwt.io/)

**A powerful MERN-stack platform connecting impact-driven investors with verified environmental & social projects**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-quick-start) • [Usage](#-usage) • [Contributors](#-contributing)

</div>

---

## 📋 Overview

**BioFund Connect** is a revolutionary platform that bridges the gap between conscious investors and environmental/social conservation projects. Built with transparency and impact-first principles, the platform enables:

- ✅ **Verified Projects**: NGOs create and manage conservation projects
- ✅ **Smart Funding**: Investors discover and fund approved projects
- ✅ **Real-time Tracking**: Monitor environmental impact metrics
- ✅ **ESG Reports**: Generate comprehensive sustainability reports
- ✅ **Secure Transactions**: JWT-based authentication & role-based access control

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔐 Role-Based Access
- **Admin**: Project approval & platform oversight
- **Investor**: Discover & fund projects globally
- **NGO**: Create & manage conservation initiatives

</td>
<td width="50%">

### 📊 Analytics & Reporting
- Real-time impact dashboard
- ESG (Environmental, Social, Governance) scoring
- PDF report generation
- Project funding analytics

</td>
</tr>
<tr>
<td width="50%">

### 🌍 Global Impact Tracking
- Live project map visualization
- Impact metrics (trees, water, wildlife)
- Risk assessment system
- Investor leaderboard

</td>
<td width="50%">

### 💰 Smart Investment Tools
- Portfolio management
- Transaction tracking
- Milestone-based fund release
- Impact ROI calculations

</td>
</tr>
<tr>
<td width="50%">

### 🔔 Real-Time Updates
- Instant notifications
- Live dashboard refresh
- Transaction confirmations
- Approval alerts

</td>
<td width="50%">

### 🎨 Modern UI/UX
- Responsive design (mobile-friendly)
- Dark mode support
- Smooth animations
- Intuitive navigation

</td>
</tr>
</table>

---

## 👥 User Roles & Capabilities

### 🛡️ Admin Dashboard
| Feature | Capability |
|---------|-----------|
| Project Approval | Review & approve NGO projects |
| User Management | Approve/reject new user registrations |
| Platform Analytics | Monitor total funds, active projects, user growth |
| Metrics Dashboard | View real-time platform statistics |

### 👨‍💼 Investor Dashboard
| Feature | Capability |
|---------|-----------|
| Discover Projects | Browse 16+ approved environmental projects |
| Fund Projects | Invest in projects matching impact goals |
| Track Portfolio | Monitor investments and returns |
| View Reports | Generate ESG impact reports |
| Impact Tracker | See global environmental metrics |
| Leaderboard | Earn badges and climb the impact rank |

### 🌿 NGO Dashboard
| Feature | Capability |
|---------|-----------|
| Create Projects | Launch conservation campaigns with details |
| Manage Funding | Track capital raised and funding progress |
| Add Milestones | Set proof-of-work checkpoints |
| Generate Reports | Export analytics & investor metrics |
| Monitor Impact | Track project progress in real-time |

---

## 🛠 Tech Stack

<div align="center">

### Frontend
```
React 18 • Vite • Tailwind CSS • Framer Motion
React Router • Axios • Lucide Icons • Leaflet Maps
```

### Backend
```
Node.js • Express.js • MongoDB • Mongoose
JWT Authentication • bcryptjs • PDFKit • ESG Calculator
```

### Infrastructure
```
Git • npm • Nodemon • Environment Variables (.env)
MongoDB local/cloud • RESTful API architecture
```

</div>

---

## 📦 Project Structure

```
BioFund-AI-Connect/
├── backend/
│   ├── config/              # Database & environment config
│   ├── controllers/         # Request handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & error handling
│   ├── services/           # Business logic
│   ├── utils/              # Helpers & calculators
│   ├── seed/               # Test data
│   ├── app.js              # Express setup
│   └── server.js           # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth, App)
│   │   ├── services/       # API calls
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Layout wrappers
│   │   ├── routes/         # Route configuration
│   │   ├── App.jsx         # Main component
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── package.json (root)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ 
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

#### 1️⃣ Clone & Setup
```bash
# Clone repository
git clone https://github.com/ANASF1412/BioFund-AI-Connect.git
cd BioFund-AI-Connect

# Install all dependencies
npm run install-all
```

#### 2️⃣ Environment Configuration

**Backend** - Create `.env` in `/backend`:
```env
MONGO_URI=mongodb://localhost:27017/biofund-connect
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=5000
```

**Frontend** - Create `.env` in `/frontend`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BioFund Connect
```

#### 3️⃣ Start Services

```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Backend
cd backend
npm run dev          # Watches for changes with Nodemon

# Terminal 3 - Start Frontend
cd frontend
npm run dev          # Vite dev server
```

#### 4️⃣ Access Application

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
API:      http://localhost:5000/api
```

### Seed Test Data
```bash
cd backend
node seed/seedData.js

# This creates:
# - 7 Test Users (5 approved, 2 pending)
# - 16 Complete Projects with funding & impact data
# - Global geographic distribution
```

---

## 📖 Usage Guide

### Starting Your Journey

#### 👨‍💼 For Investors
1. **Register** as an Investor
2. **Wait for Admin approval** (instant in demo)
3. **Explore Projects** on Live Impact Map or Discover page
4. **Fund Projects** with desired amount
5. **Track Investments** in your portfolio
6. **Generate Reports** for funded projects
7. **Climb the Leaderboard** by funding more projects

#### 🌿 For NGOs
1. **Register** as an NGO organization
2. **Wait for Admin approval**
3. **Create Conservation Project** with:
   - Project title & detailed description
   - Location (geographic coordinates)
   - Funding goal and timeline
   - Impact metrics (expected trees/water/wildlife)
4. **Add Milestones** for fund release checkpoints
5. **Monitor Funding** progress in real-time
6. **Generate Reports** for investor confidence

#### 🛡️ For Admins
1. **Login** with admin credentials
2. **Review Pending Users** - approve/reject registrations
3. **Approve Projects** - verify legitimacy and impact
4. **View Dashboard** - monitor platform health
5. **Manage Milestones** - release escrowed funds

---

## 🔐 Authentication System

### User Approval Workflow
```
User Registration
      ↓
Status: "Pending"
      ↓
Admin Reviews Registration
      ↓
✅ Approved OR ❌ Rejected
      ↓
User Receives Status Notification
      ↓
✅ Can Login / ❌ Access Denied
```

### JWT Token Flow
- Secure token generation on login
- Token stored in localStorage
- Auto-refresh on page reload
- Automatic logout on token expiry

---

## 📊 Database Schema

### Collections
- **Users**: Investor, NGO, Admin profiles with approval status
- **Projects**: Conservation projects with funding details
- **Fundings**: Investment transactions between investors & projects
- **Milestones**: Project progress checkpoints
- **Notifications**: Real-time user notifications
- **Reports**: Generated ESG reports

---

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
GET    /api/auth/me                # Get current user
```

### Projects
```
GET    /api/projects               # List all projects
POST   /api/projects               # Create project (NGO only)
GET    /api/projects/:id           # Get project details
PUT    /api/projects/:id           # Update project (NGO only)
```

### Funding
```
POST   /api/funding                # Create investment
GET    /api/funding/my-investments # Get investor portfolio
GET    /api/funding/project/:id    # Get project fundings
```

### Reports
```
GET    /api/reports                # Get all reports
GET    /api/reports/project/:id    # Download ESG report PDF
```

### Admin
```
GET    /api/users/pending          # Get pending users
PUT    /api/users/approve/:id      # Approve user
PUT    /api/users/reject/:id       # Reject user
```

---

## 🧪 Testing

### Test Credentials (After Seeding)

#### ✅ Approved Users
```
Admin User:
Email: admin@biofund.com
Password: admin123

Investor User:
Email: investor1@example.com
Password: investor123

NGO User:
Email: ngo1@example.com
Password: ngo123
```

#### ⏳ Pending Users (Require Approval)
```
Email: pending1@example.com
Email: pending2@example.com
Password: pending123
```

---

## 🌟 Features Highlight

### 🗺️ Interactive Impact Map
- Visualize 16+ projects globally
- Filter by impact type & risk level
- Real-time funding progress
- Click markers for detailed info

### 📈 ESG Scoring System
- Environmental metrics calculation
- Social impact assessment
- Governance evaluation
- Benchmark against industry standards

### 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop full-featured
- Dark mode support

### 🔔 Real-Time Notifications
- Funding confirmations
- Approval alerts
- Milestone updates
- System notifications

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

**Project Owner**: ANASF1412  
**GitHub**: [@ANASF1412](https://github.com/ANASF1412)  
**Repository**: [BioFund-AI-Connect](https://github.com/ANASF1412/BioFund-AI-Connect)

### Support Channels
- 🐛 Report bugs in [Issues](https://github.com/ANASF1412/BioFund-AI-Connect/issues)
- 💬 Start discussions for features
- 📧 Contact via GitHub

---

## 🙏 Acknowledgments

- **Tailwind CSS** for beautiful styling
- **Leaflet & OpenStreetMap** for mapping
- **Framer Motion** for smooth animations
- **PDFKit** for report generation
- **MongoDB** for reliable data storage

---

<div align="center">

### ⭐ If you found this helpful, please consider starring the repository!

**Built with ❤️ for Environmental Impact**

</div>

---

## 🌱 Database Seeding

To populate the database with sample users and projects:

```bash
cd backend
npm run seed
