import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const bellRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fetch notifications on mount and set up polling
    useEffect(() => {
        fetchNotifications();

        // Polling: fetch notifications every 15 seconds
        const interval = setInterval(fetchNotifications, 15000);

        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                bellRef.current &&
                dropdownRef.current &&
                !bellRef.current.contains(e.target) &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read
            if (!notification.read) {
                await notificationService.markAsRead(notification._id);
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }

            // Navigate to the link if available
            if (notification.link) {
                setIsOpen(false);
                navigate(notification.link);
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now - notifDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifDate.toLocaleDateString();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'FUNDING':
                return '💰';
            case 'PROJECT_UPDATE':
                return '📢';
            case 'QA_QUESTION':
                return '❓';
            case 'QA_ANSWER':
                return '✅';
            default:
                return '📬';
        }
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                ref={bellRef}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.div>
                )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-96 bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-slate-100 dark:border-dark-700 z-50 max-h-96 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-slate-50 dark:bg-dark-900 px-6 py-4 border-b border-slate-100 dark:border-dark-700 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                                >
                                    <Check size={14} /> Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="px-6 py-8 text-center">
                                    <Bell size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-dark-700">
                                    {notifications.slice(0, 10).map((notification) => (
                                        <motion.div
                                            key={notification._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`px-6 py-4 cursor-pointer transition-colors ${!notification.read
                                                    ? 'bg-primary-50 dark:bg-primary-900/10 hover:bg-primary-100 dark:hover:bg-primary-900/20'
                                                    : 'hover:bg-slate-50 dark:hover:bg-dark-700'
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <span className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>

                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`text-sm ${!notification.read
                                                                ? 'font-bold text-slate-900 dark:text-white'
                                                                : 'font-medium text-slate-700 dark:text-slate-300'
                                                            } line-clamp-2`}
                                                    >
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>

                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1"></div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="bg-slate-50 dark:bg-dark-900 px-6 py-3 border-t border-slate-100 dark:border-dark-700">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate('/notifications');
                                    }}
                                    className="w-full text-center text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                                >
                                    View All Notifications
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
