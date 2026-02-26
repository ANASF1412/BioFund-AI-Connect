# BioFund Connect - Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally on port 27017)
- npm

## Installation & Setup (Already Completed ✅)

```bash
# Backend
cd biofund-connect/backend
npm install

# Frontend
cd biofund-connect/frontend
npm install

# Seed Database (One-time)
cd biofund-connect/backend
npm run seed
```

## Running the Application

### Terminal 1 - Backend Server
```bash
cd biofund-connect/backend
npm start
# Server will run on http://localhost:5000
```

### Terminal 2 - Frontend Dev Server
```bash
cd biofund-connect/frontend
npm run dev
# App will run on http://localhost:5173
```

### Production Build
```bash
cd biofund-connect/frontend
npm run build
# Creates optimized build in dist/
```

## Test Credentials

After seeding the database, use these credentials to test:

### Admin Account
- **Email**: admin@test.com
- **Password**: 123456
- **Access**: Admin Dashboard, All management features

### Investor Account
- **Email**: investor@test.com
- **Password**: 123456
- **Access**: Investor Dashboard, Browse projects, Fund projects, ESG Reports

### NGO Account
- **Email**: ngo@test.com
- **Password**: 123456
- **Access**: NGO Dashboard, Create projects, Manage projects

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Projects
- `GET /api/projects` - Get all approved projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (NGO only)
- `PUT /api/projects/:id/status` - Update project status (Admin only)
- `POST /api/projects/:id/update` - Post project update (NGO only)

### Funding
- `POST /api/funding` - Create funding record (Investor)
- `GET /api/funding/my-investments` - Get investor's investments
- `GET /api/funding/project/:projectId` - Get project fundings

### Transactions
- `GET /api/transactions` - Get transactions
- `POST /api/transactions` - Create transaction

### Milestones
- `GET /api/milestones/:projectId` - Get project milestones
- `POST /api/milestones` - Create milestone (NGO only)
- `PUT /api/milestones/:id` - Update milestone (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Reports & ESG
- `GET /api/reports` - Get my reports (Investor)
- `GET /api/reports/preview/:projectId` - Get ESG preview
- `GET /api/reports/project/:projectId` - Download ESG report PDF

### Insights
- `GET /api/insights/project/:projectId` - Get all insights
- `GET /api/insights/impact/:projectId` - Get impact prediction
- `GET /api/insights/funding/:projectId` - Get funding prediction
- `GET /api/insights/trends/:projectId` - Get trends
- `GET /api/insights/recommendation/:projectId` - Get AI recommendation

### Users
- `GET /api/users` - Get all users (Admin only)

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/biofund-connect
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Backend won't start
1. Ensure MongoDB is running: `mongod`
2. Check port 5000 is available
3. Delete `node_modules` and run `npm install` again

### Frontend build errors
1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Clear cache: `npm cache clean --force`

### "Cannot find module" errors
1. Ensure all dependencies are installed: `npm install`
2. Restart the dev server

### MongoDB connection errors
1. Start MongoDB: `mongod`
2. Check connection string in `.env`

### API calls failing in frontend
1. Ensure backend is running on port 5000
2. Check `.env` file has correct API URL
3. Check browser console for errors
4. Verify JWT token is in localStorage

## Project Structure

```
├── backend/
│   ├── controllers/     - API handlers
│   ├── models/         - MongoDB schemas
│   ├── routes/         - API endpoints
│   ├── middleware/     - Auth & error handling
│   ├── services/       - Business logic
│   ├── utils/          - Helper functions
│   ├── seed/           - Database seeding
│   └── app.js, server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/      - Page components
│   │   ├── components/ - Reusable components
│   │   ├── services/   - API clients
│   │   ├── context/    - State management
│   │   └── hooks/      - Custom hooks
│   └── vite.config.js
```

## Performance Tips

1. **Frontend**: Built with Vite for fast development
2. **Backend**: Uses MongoDB indexes for query optimization
3. **API**: Response caching with proper headers
4. **Assets**: CSS and JS minified in production build

## Security Notes

- JWT tokens expire after 30 days
- Passwords are hashed with bcrypt
- Role-based access control enforced
- CORS enabled for frontend
- All API calls require authentication (except public endpoints)

## Common Features

### For Investors
1. Browse approved conservation projects
2. View detailed project information
3. Fund projects with any amount
4. Track investment returns
5. Download ESG impact reports
6. View global impact metrics

### For NGOs
1. Create conservation projects
2. Manage project lifecycle
3. Receive investor notifications
4. Post project updates
5. Set and manage milestones

### For Admins
1. Approve/reject projects
2. Manage all users
3. View system statistics
4. Oversee all transactions

## Next Steps

1. Start backend: `npm start` (in backend/)
2. Start frontend: `npm run dev` (in frontend/)
3. Open http://localhost:5173 in browser
4. Login with test credentials
5. Explore features based on your role

---

**Need help?** Check the DEBUG_FIXES_SUMMARY.md for detailed information about all fixes made to the project.
