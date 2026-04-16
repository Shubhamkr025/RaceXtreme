import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, Flag, X, Bell } from 'lucide-react';
import './ToastSystem.css';

// Toast Context for global access
const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        // Return a no-op if used outside provider
        return { addToast: () => {}, notifications: [] };
    }
    return context;
};

const iconMap = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
    race: <Flag size={18} />
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const addToast = useCallback((title, message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const toast = { id, title, message, type, duration, createdAt: new Date() };
        
        setToasts(prev => [...prev, toast]);
        setNotifications(prev => [toast, ...prev].slice(0, 20)); // Keep last 20

        // Auto remove
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, notifications, clearNotifications }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="toast-item"
                    >
                        <div className={`toast-icon ${toast.type}`}>
                            {iconMap[toast.type] || iconMap.info}
                        </div>
                        <div className="toast-content">
                            <div className="toast-title">{toast.title}</div>
                            <div className="toast-message">{toast.message}</div>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <X size={14} />
                        </button>
                        <div 
                            className={`toast-progress ${toast.type}`}
                            style={{ '--toast-duration': `${toast.duration}ms` }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Notification Bell Component for Navbar
export const NotificationBell = () => {
    const { notifications, clearNotifications } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [lastSeenCount, setLastSeenCount] = useState(0);
    const unreadCount = notifications.length - lastSeenCount;

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setLastSeenCount(notifications.length);
        }
    };

    // Close drawer on escape
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') setIsOpen(false); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const formatTime = (date) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div style={{ position: 'relative' }}>
            <button className="notification-bell" onClick={handleToggle}>
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="notification-drawer"
                    >
                        <div className="drawer-header">
                            <h4>Notifications</h4>
                            {notifications.length > 0 && (
                                <button className="drawer-clear" onClick={() => { clearNotifications(); setLastSeenCount(0); }}>
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="drawer-body">
                            {notifications.length === 0 ? (
                                <div className="drawer-empty">
                                    <Bell size={32} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((n, i) => (
                                    <motion.div
                                        key={n.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="drawer-item"
                                    >
                                        <div className={`drawer-item-icon toast-icon ${n.type}`}>
                                            {iconMap[n.type] || iconMap.info}
                                        </div>
                                        <div className="drawer-item-content">
                                            <h5>{n.title}</h5>
                                            <p>{n.message} · {formatTime(n.createdAt)}</p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ToastProvider;
