import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/Home';

// Investor Pages
import InvestorDashboard from '../pages/investor/Dashboard';
import ExploreProjects from '../pages/investor/ExploreProjects';
import MyInvestments from '../pages/investor/MyInvestments';
import ImpactTracker from '../pages/investor/ImpactTracker';

// NGO Pages
import NgoDashboard from '../pages/ngo/Dashboard';
import MyProjects from '../pages/ngo/MyProjects';
import CreateProject from '../pages/ngo/CreateProject';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageProjects from '../pages/admin/ManageProjects';
import ManageUsers from '../pages/admin/ManageUsers';

const RoleBasedRedirect = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case 'Investor': return <Navigate to="/investor" replace />;
        case 'NGO': return <Navigate to="/ngo" replace />;
        case 'Admin': return <Navigate to="/admin" replace />;
        default: return <Navigate to="/login" replace />;
    }
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<ExploreProjects />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/dashboard" element={<RoleBasedRedirect />} />

            {/* Investor Routes */}
            <Route path="/investor" element={<ProtectedRoute roles={['Investor']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<InvestorDashboard />} />
                <Route path="explore" element={<ExploreProjects />} />
                <Route path="investments" element={<MyInvestments />} />
                <Route path="tracker" element={<ImpactTracker />} />
            </Route>

            {/* NGO Routes */}
            <Route path="/ngo" element={<ProtectedRoute roles={['NGO']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<NgoDashboard />} />
                <Route path="projects" element={<MyProjects />} />
                <Route path="create-project" element={<CreateProject />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute roles={['Admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="users" element={<ManageUsers />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
