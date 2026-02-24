# BioFund Connect

BioFund Connect is a full-stack MERN application that connects investors with environmental and social projects created by NGOs.

## Features
- **Role-based Authentication:** separate experiences for Investors, NGOs, and Admins.
- **Investor Dashboard:** explore approved projects, fund projects, and view transaction history.
- **NGO Dashboard:** create, list, and manage projects. View funding progress.
- **Admin Dashboard:** view platform metrics and approve/reject new projects.
- **Modern UI:** Built with React, Tailwind CSS, Lucide Icons, following responsive and aesthetic layout principles.

## Getting Started

### Prerequisites
- Node.js
- MongoDB (running locally or a connection string)

### Database Seeding
To initialize the application with dummy data (including Admin, NGO, Investor users, and some sample projects):

```bash
cd backend
npm run seed
```

**Seed Credentials:**
- Admin: admin@test.com / 123456
- Investor: investor@test.com / 123456
- NGO: ngo@test.com / 123456

### Starting the Backend
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### Starting the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will start on `http://localhost:5173`.
