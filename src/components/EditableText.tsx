'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// 支持的元素类型
type ValidElement = 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'strong' | 'em' | 'b' | 'i';

interface EditableTextProps {
    id: string;
    value: string;
    onChange: (id: string, value: string) => void;
    className?: string;
    as?: ValidElement;
    multiline?: boolean;
    isEditorActive?: boolean;  // 从父组件传入的编辑状态
}

export default function EditableText({
    id,
    value,
    onChange,
    className = '',
    as,
    multiline = false,
    isEditorActive = false,
    ...restProps
}: EditableTextProps & Omit<React.HTMLAttributes<HTMLElement>, keyof EditableTextProps>) {
    const Component = as || 'span';
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // 检查是否启用编辑器
    const isEditorEnabled = process.env.NEXT_PUBLIC_ENABLE_EDITOR === '1';

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // 选中全部文本
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = useCallback(() => {
        setIsEditing(false);
        if (localValue !== value) {
            onChange(id, localValue);
        }
    }, [id, localValue, onChange, value]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            handleBlur();
        }
        if (e.key === 'Escape') {
            setLocalValue(value);
            setIsEditing(false);
        }
    }, [handleBlur, multiline, value]);

    // 非编辑模式：显示普通文本
    if (!isEditorEnabled || !isEditorActive) {
        return <Component className={className} {...restProps}>{value}</Component>;
    }

    // 编辑模式：显示可编辑字段
    if (isEditing) {
        const baseClasses = `
      bg-white border border-blue-300 outline-none w-full
      focus:ring-2 focus:ring-blue-500/30 rounded-lg px-2 py-1
      text-zinc-900
      ${className}
    `;

        if (multiline) {
            return (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`${baseClasses} resize-none min-h-[100px]`}
                    rows={4}
                />
            );
        }

        return (
            <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={baseClasses}
            />
        );
    }

    // 编辑模式但未激活：显示带虚线边框的可点击文本
    return (
        <Component
            className={`
        ${className}
        cursor-pointer
        border border-dashed border-zinc-300 hover:border-blue-400
        rounded-lg px-2 py-1 -mx-2 -my-1
        transition-all duration-200
        hover:bg-blue-50/50
        inline-block
      `}
            onClick={() => setIsEditing(true)}
            title="点击编辑"
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    setIsEditing(true);
                }
            }}
            {...restProps}
        >
            {localValue}
        </Component>
    );
}
