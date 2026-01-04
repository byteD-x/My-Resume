'use client';

import { useState } from 'react';
import { ENABLE_EDITING } from '@/data';
import { PortfolioData } from '@/types';
import { Download, Check, X } from 'lucide-react';

interface ExportButtonProps {
    getData: () => PortfolioData;
}

export default function ExportButton({ getData }: ExportButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!ENABLE_EDITING) return null;

    const handleExport = () => {
        setShowModal(true);
    };

    const handleCopy = async () => {
        const data = getData();
        const jsonString = JSON.stringify(data, null, 2);

        try {
            await navigator.clipboard.writeText(jsonString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getExportCode = () => {
        const data = getData();
        return `import { PortfolioData } from './types';

export const ENABLE_EDITING = false;

export const portfolioData: PortfolioData = ${JSON.stringify(data, null, 2)};`;
    };

    return (
        <>
            {/* 浮动按钮 */}
            <button
                onClick={handleExport}
                className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105"
            >
                <Download className="w-5 h-5" />
                <span>Export Config</span>
            </button>

            {/* 编辑模式提示 */}
            <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-amber-100 border border-amber-300 text-amber-800 text-sm font-medium rounded-full">
                ✏️ 编辑模式已启用
            </div>

            {/* 导出模态框 */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">导出配置</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-4">
                            复制以下代码，替换您的 <code className="px-2 py-1 bg-gray-100 rounded text-sm">src/data.ts</code> 文件内容：
                        </p>

                        <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-2xl overflow-auto max-h-[50vh] text-sm">
                                <code>{getExportCode()}</code>
                            </pre>

                            <button
                                onClick={handleCopy}
                                className={`absolute top-3 right-3 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${copied
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        已复制
                                    </>
                                ) : (
                                    '复制代码'
                                )}
                            </button>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-2xl">
                            <p className="text-sm text-blue-800">
                                <strong>提示：</strong> 导出的代码已自动将 <code className="px-1 bg-blue-100 rounded">ENABLE_EDITING</code> 设置为 <code className="px-1 bg-blue-100 rounded">false</code>，
                                部署后将显示为静态页面。
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
