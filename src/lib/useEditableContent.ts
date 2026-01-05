'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PortfolioData } from '@/types';
import { defaultPortfolioData } from '@/data';
import { validatePortfolioData } from './content-schema';

const STORAGE_KEY = 'resume_site_v1';
const DEBOUNCE_MS = 1000;

export interface UseEditableContentReturn {
    data: PortfolioData;
    isEditorEnabled: boolean;
    isEditing: boolean;
    isDirty: boolean;
    lastSaved: Date | null;

    // Demo Mode
    isDemoMode: boolean;
    toggleDemoMode: () => void;

    // Editor controls
    setIsEditing: (editing: boolean) => void;
    updateData: (newData: PortfolioData) => void;
    updateField: <K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) => void;

    // Persistence
    saveNow: () => void;
    exportJSON: () => string;
    importJSON: (jsonString: string) => { success: boolean; errors?: string[] };
    resetToDefault: () => void;
}

/**
 * 可编辑内容管理 Hook
 * - 从 localStorage 加载内容
 * - 自动保存（debounced）
 * - 导入/导出/重置功能
 */
export function useEditableContent(): UseEditableContentReturn {
    // 允许通过环境变量启用，OR 通过 Demo 模式启用
    const [isDemoMode, setIsDemoMode] = useState(false);
    const isEditorEnabled = process.env.NEXT_PUBLIC_ENABLE_EDITOR === '1' || isDemoMode;

    const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
    const [isEditing, setIsEditing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 切换演示模式
    const toggleDemoMode = useCallback(() => {
        setIsDemoMode(prev => !prev);
        // 如果关闭演示模式，也同时关闭编辑状态
        if (isDemoMode) {
            setIsEditing(false);
        }
    }, [isDemoMode]);

    // 从 localStorage 加载
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const result = validatePortfolioData(parsed);
                if (result.success) {
                    // Use requestAnimationFrame to defer state update
                    requestAnimationFrame(() => {
                        setData(result.data);
                    });
                } else {
                    console.warn('存储的数据格式不正确，使用默认内容', result.errors);
                }
            }
        } catch {
            console.warn('加载存储内容失败，使用默认内容');
        }

        // Use requestAnimationFrame to defer hydration state update
        requestAnimationFrame(() => {
            setIsHydrated(true);
        });
    }, []);

    // 自动保存
    const saveToStorage = useCallback((dataToSave: PortfolioData) => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            setLastSaved(new Date());
            setIsDirty(false);
        } catch (e) {
            console.error('保存失败', e);
        }
    }, []);

    // Debounced 保存
    const debouncedSave = useCallback((dataToSave: PortfolioData) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveToStorage(dataToSave);
        }, DEBOUNCE_MS);
    }, [saveToStorage]);

    // 更新完整数据
    const updateData = useCallback((newData: PortfolioData) => {
        setData(newData);
        setIsDirty(true);
        if (isEditorEnabled && isEditing) {
            debouncedSave(newData);
        }
    }, [isEditorEnabled, isEditing, debouncedSave]);

    // 更新单个字段
    const updateField = useCallback(<K extends keyof PortfolioData>(
        key: K,
        value: PortfolioData[K]
    ) => {
        setData(prev => {
            const newData = { ...prev, [key]: value };
            setIsDirty(true);
            if (isEditorEnabled && isEditing) {
                debouncedSave(newData);
            }
            return newData;
        });
    }, [isEditorEnabled, isEditing, debouncedSave]);

    // 立即保存
    const saveNow = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveToStorage(data);
    }, [data, saveToStorage]);

    // 导出 JSON
    const exportJSON = useCallback(() => {
        return JSON.stringify(data, null, 2);
    }, [data]);

    // 导入 JSON
    const importJSON = useCallback((jsonString: string): { success: boolean; errors?: string[] } => {
        try {
            const parsed = JSON.parse(jsonString);
            const result = validatePortfolioData(parsed);

            if (result.success) {
                setData(result.data);
                saveToStorage(result.data);
                return { success: true };
            } else {
                return { success: false, errors: result.errors };
            }
        } catch {
            return { success: false, errors: ['JSON 解析失败，请检查格式是否正确'] };
        }
    }, [saveToStorage]);

    // 重置为默认
    const resetToDefault = useCallback(() => {
        setData(defaultPortfolioData);
        saveToStorage(defaultPortfolioData);
    }, [saveToStorage]);

    // 清理 timeout
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return {
        data: isHydrated ? data : defaultPortfolioData,
        isEditorEnabled,
        isDemoMode,
        toggleDemoMode,
        isEditing,
        isDirty,
        lastSaved,
        setIsEditing,
        updateData,
        updateField,
        saveNow,
        exportJSON,
        importJSON,
        resetToDefault,
    };
}
