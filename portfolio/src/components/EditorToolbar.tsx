'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Edit3,
    Save,
    Download,
    Upload,
    RotateCcw,
    Check,
    X,
    AlertCircle
} from 'lucide-react';

interface EditorToolbarProps {
    isEditing: boolean;
    isDirty: boolean;
    lastSaved: Date | null;
    onToggleEdit: (editing: boolean) => void;
    onSave: () => void;
    onExport: () => string;
    onImport: (json: string) => { success: boolean; errors?: string[] };
    onReset: () => void;
}

export default function EditorToolbar({
    isEditing,
    isDirty,
    lastSaved,
    onToggleEdit,
    onSave,
    onExport,
    onImport,
    onReset,
}: EditorToolbarProps) {
    const [showImportModal, setShowImportModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [importText, setImportText] = useState('');
    const [importErrors, setImportErrors] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleExport = useCallback(() => {
        const json = onExport();

        // 复制到剪贴板
        navigator.clipboard.writeText(json).then(() => {
            showToast('已复制到剪贴板', 'success');
        }).catch(() => {
            showToast('复制失败', 'error');
        });

        // 同时下载文件
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume_content_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [onExport, showToast]);

    const handleImportSubmit = useCallback(() => {
        const result = onImport(importText);
        if (result.success) {
            showToast('导入成功', 'success');
            setShowImportModal(false);
            setImportText('');
            setImportErrors([]);
        } else {
            setImportErrors(result.errors || ['导入失败']);
        }
    }, [importText, onImport, showToast]);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setImportText(content);
        };
        reader.readAsText(file);
    }, []);

    const handleReset = useCallback(() => {
        onReset();
        setShowResetConfirm(false);
        showToast('已重置为默认内容', 'success');
    }, [onReset, showToast]);

    const formatLastSaved = useCallback((date: Date) => {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }, []);

    return (
        <>
            {/* 主工具栏 */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-zinc-200">
                    {/* 编辑模式切换 */}
                    <button
                        onClick={() => onToggleEdit(!isEditing)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isEditing
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                            }`}
                    >
                        <Edit3 size={16} />
                        {isEditing ? '编辑中' : '开启编辑'}
                    </button>

                    {isEditing && (
                        <>
                            <div className="w-px h-6 bg-zinc-200" />

                            {/* 保存状态 */}
                            <div className="flex items-center gap-2 text-sm">
                                {isDirty ? (
                                    <span className="text-amber-600 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                        未保存
                                    </span>
                                ) : lastSaved ? (
                                    <span className="text-green-600 flex items-center gap-1">
                                        <Check size={14} />
                                        已保存 {formatLastSaved(lastSaved)}
                                    </span>
                                ) : null}
                            </div>

                            <button
                                onClick={onSave}
                                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                                title="立即保存"
                            >
                                <Save size={18} />
                            </button>

                            <div className="w-px h-6 bg-zinc-200" />

                            {/* 导出 */}
                            <button
                                onClick={handleExport}
                                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                                title="导出 JSON"
                            >
                                <Download size={18} />
                            </button>

                            {/* 导入 */}
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                                title="导入 JSON"
                            >
                                <Upload size={18} />
                            </button>

                            {/* 重置 */}
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="p-2 rounded-full hover:bg-red-50 text-zinc-600 hover:text-red-600 transition-colors"
                                title="重置为默认"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Toast 通知 */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 ${toast.type === 'success'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 导入模态框 */}
            <AnimatePresence>
                {showImportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setShowImportModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-zinc-900">导入 JSON</h3>
                                <button
                                    onClick={() => setShowImportModal(false)}
                                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".json"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Upload size={16} />
                                    选择文件
                                </button>
                            </div>

                            <textarea
                                value={importText}
                                onChange={(e) => {
                                    setImportText(e.target.value);
                                    setImportErrors([]);
                                }}
                                placeholder="或直接粘贴 JSON 内容..."
                                className="w-full h-64 p-4 border border-zinc-200 rounded-xl resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            />

                            {importErrors.length > 0 && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
                                        <AlertCircle size={16} />
                                        导入失败
                                    </div>
                                    <ul className="text-sm text-red-600 space-y-1">
                                        {importErrors.map((err, i) => (
                                            <li key={i}>• {err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowImportModal(false)}
                                    className="px-6 py-2 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleImportSubmit}
                                    disabled={!importText.trim()}
                                    className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    导入
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 重置确认 */}
            <AnimatePresence>
                {showResetConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setShowResetConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 text-red-600 mb-4">
                                <AlertCircle size={24} />
                                <h3 className="text-xl font-bold">确认重置？</h3>
                            </div>
                            <p className="text-zinc-600 mb-6">
                                这将清除所有已编辑的内容，恢复为默认数据。此操作不可撤销。
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="px-6 py-2 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                                >
                                    确认重置
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
