import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { Check, X, AlertCircle } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectReason, setRejectReason] = useState({});
    const [showRejectModal, setShowRejectModal] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data.data);
            setError('');
        } catch (error) {
            console.error('Failed to fetch users', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            setActionLoading(userId);
            await api.put(`/users/approve/${userId}`);
            setUsers(users.map(u => u._id === userId ? { ...u, status: 'approved' } : u));
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to approve user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId) => {
        try {
            setActionLoading(userId);
            const reason = rejectReason[userId] || '';
            await api.put(`/users/reject/${userId}`, { reason });
            setUsers(users.map(u => u._id === userId ? { ...u, status: 'rejected' } : u));
            setShowRejectModal(null);
            setRejectReason({});
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reject user');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(user => {
        if (statusFilter === 'all') return true;
        return user.status === statusFilter;
    }).sort((a, b) => {
        // Sort by status: pending first, then approved, then rejected
        const statusOrder = { pending: 0, approved: 1, rejected: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    const statusCounts = {
        all: users.length,
        pending: users.filter(u => u.status === 'pending').length,
        approved: users.filter(u => u.status === 'approved').length,
        rejected: users.filter(u => u.status === 'rejected').length
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">⏳ Pending</span>;
            case 'approved':
                return <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">✅ Approved</span>;
            case 'rejected':
                return <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">❌ Rejected</span>;
            default:
                return <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">Unknown</span>;
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
                <div className="text-sm text-slate-600">Total: <span className="font-bold">{users.length}</span></div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
            )}

            {/* Status Tabs */}
            <div className="flex gap-3 border-b border-slate-200">
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 font-medium text-sm transition-colors ${
                            statusFilter === status
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                    </button>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200 text-sm">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        No {statusFilter !== 'all' ? statusFilter : ''} users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                                                user.role === 'Admin' ? 'bg-indigo-100 text-indigo-800' :
                                                user.role === 'NGO' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(user._id)}
                                                        disabled={actionLoading === user._id}
                                                        className="flex items-center gap-1 px-3 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 text-xs font-medium"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setShowRejectModal(user._id)}
                                                        disabled={actionLoading === user._id}
                                                        className="flex items-center gap-1 px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 text-xs font-medium"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {user.status === 'approved' && (
                                                <span className="text-xs text-green-600">✓ Verified</span>
                                            )}
                                            {user.status === 'rejected' && (
                                                <span className="text-xs">
                                                    <details className="cursor-pointer">
                                                        <summary className="text-red-600">Reason</summary>
                                                        <p className="text-xs text-slate-600 mt-1">{user.approvalReason}</p>
                                                    </details>
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Reject User Application</h2>
                        <textarea
                            value={rejectReason[showRejectModal] || ''}
                            onChange={(e) => setRejectReason({ ...rejectReason, [showRejectModal]: e.target.value })}
                            placeholder="Enter rejection reason (optional)"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            rows="4"
                        />
                        <div className="flex gap-3 mt-6 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(null);
                                    setRejectReason({});
                                }}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(showRejectModal)}
                                disabled={actionLoading === showRejectModal}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 font-medium"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
