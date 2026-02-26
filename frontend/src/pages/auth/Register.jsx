import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Investor',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await register(formData);
            
            // Check if registration was successful but user is pending approval
            if (result.success && result.data.status === 'pending') {
                setSuccess('✅ Account created! Your account is waiting for admin approval. You will be able to login once approved.');
                // Clear form
                setFormData({ name: '', email: '', password: '', role: 'Investor' });
                // Show success message for 5 seconds, then redirect to login
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else if (result.success) {
                // User was approved (shouldn't happen but handle it)
                if (result.data.role === 'Investor') navigate('/investor');
                else if (result.data.role === 'NGO') navigate('/ngo');
                else if (result.data.role === 'Admin') navigate('/admin');
            }
        } catch (err) {
            setError(err.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="px-8 pt-8 pb-6 bg-slate-50 border-b border-slate-100">
                    <h2 className="text-center text-3xl font-extrabold text-slate-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Join BioFund Connect to make a difference
                    </p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-md bg-red-50 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 shrink-0" />
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200 flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-green-800">{success}</p>
                                <p className="text-xs text-green-700 mt-1">Redirecting to login...</p>
                            </div>
                        </div>
                    )}

                    {!success && (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        minLength="6"
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    I am a(n)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        name="role"
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="Investor">Investor</option>
                                        <option value="NGO">NGO Organization</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
