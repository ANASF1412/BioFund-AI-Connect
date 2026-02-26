import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.read) {
                await notificationService.markAsRead(notification._id);
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }

            if (notification.link) {
                navigate(notification.link);
            }
        } catch (error) {
            console.error('Error handling notification:', error);
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

    const handleDelete = async (e, notificationId) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
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

    const groupNotificationsByDate = (notifs) => {
        const groups = {};
        notifs.forEach((notif) => {
            const date = new Date(notif.createdAt);
            const dateKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(notif);
        });
        return groups;
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

    if (loading) return <Loader />;

    const groupedNotifications = groupNotificationsByDate(notifications);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Bell size={32} className="text-primary-600 dark:text-primary-400" />
                        Notifications
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                        <Check size={18} />
                        Mark All as Read
                    </button>
                )}
            </div>

            {/* Notifications */}
            {notifications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 p-12 text-center"
                >
                    <Bell size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notifications</h2>
                    <p className="text-slate-600 dark:text-slate-400">You're all caught up! Come back later for updates.</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedNotifications).map(([dateKey, notifs]) => (
                        <motion.div
                            key={dateKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ staggerChildren: 0.05 }}
                        >
                            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-4">
                                {dateKey}
                            </h2>
                            <div className="space-y-3">
                                {notifs.map((notification) => (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`rounded-2xl shadow-sm border transition-all cursor-pointer ${!notification.read
                                                ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800/50 hover:shadow-md'
                                                : 'bg-white dark:bg-dark-800 border-slate-100 dark:border-dark-700 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="p-6 flex gap-4">
                                            <span className="text-4xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>

                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-base ${!notification.read
                                                            ? 'font-bold text-slate-900 dark:text-white'
                                                            : 'font-semibold text-slate-700 dark:text-slate-300'
                                                        }`}
                                                >
                                                    {notification.message}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                                                    <Clock size={14} />
                                                    {formatTime(notification.createdAt)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {!notification.read && (
                                                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(e, notification._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
