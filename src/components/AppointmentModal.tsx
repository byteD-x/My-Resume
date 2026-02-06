'use client';

import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { Calendar, CheckCircle, Mail, MessageSquare, Send, User, X } from 'lucide-react';
import { trackAppointmentSubmit } from '@/lib/analytics';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
    const firstFocusableRef = useRef<HTMLInputElement>(null);
    const modalRef = useFocusTrap<HTMLDivElement>(isOpen, {
        onEscape: onClose,
        initialFocusRef: firstFocusableRef,
        lockBodyScroll: true,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            trackAppointmentSubmit(true);
            setIsSubmitted(true);

            window.setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', message: '' });
                onClose();
            }, 2000);
        },
        [onClose],
    );

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="appointment-modal-title"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800"
                            aria-label="关闭对话框"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 id="appointment-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                                预约面谈
                            </h2>
                            <p className="mt-1 text-slate-600 dark:text-slate-400">
                                留下您的联系方式，我会尽快与您取得联系。
                            </p>
                        </div>

                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        您的姓名
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            ref={firstFocusableRef}
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-slate-900 transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            placeholder="请输入姓名"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="appointment-email"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        您的邮箱地址
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            id="appointment-email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-slate-900 transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        留言（可选）
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute top-3 left-3 h-5 w-5 text-slate-400" />
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-slate-900 transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            placeholder="请简要说明您的需求或想了解的内容..."
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary mt-2 w-full py-3.5 text-base font-bold">
                                    <Send size={18} className="mr-2" />
                                    发送预约请求
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-8 text-center"
                            >
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">预约成功！</h3>
                                <p className="text-slate-600 dark:text-slate-400">感谢您的预约，我会尽快与您联系。</p>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
