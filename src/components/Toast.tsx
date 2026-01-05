'use client';

import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';

// Toast types
type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

// Context for toast management
interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Individual Toast component
function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <Check size={16} />,
        error: <X size={16} />,
        info: <Info size={16} />,
    };

    const styles = {
        success: {
            bg: 'var(--color-success)',
            icon: 'rgba(255,255,255,0.9)',
        },
        error: {
            bg: '#DC2626',
            icon: 'rgba(255,255,255,0.9)',
        },
        info: {
            bg: 'var(--color-primary)',
            icon: 'rgba(255,255,255,0.9)',
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg"
            style={{
                backgroundColor: styles[type].bg,
                color: 'white',
            }}
            role="alert"
            aria-live="polite"
        >
            <span style={{ color: styles[type].icon }}>{icons[type]}</span>
            <span className="text-sm font-medium">{message}</span>
        </motion.div>
    );
}

// Toast Provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none"
                aria-label="通知"
            >
                <AnimatePresence mode="sync">
                    {toasts.map((toast) => (
                        <div key={toast.id} className="pointer-events-auto">
                            <Toast
                                message={toast.message}
                                type={toast.type}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

// Standalone toast trigger (for use without provider)
export function ToastTrigger({
    message,
    type = 'success',
    show,
    onHide
}: {
    message: string;
    type?: ToastType;
    show: boolean;
    onHide: () => void;
}) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onHide, 2000);
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
                    <Toast message={message} type={type} onClose={onHide} />
                </div>
            )}
        </AnimatePresence>
    );
}

export default ToastProvider;
