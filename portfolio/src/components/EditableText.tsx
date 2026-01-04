'use client';

import { ENABLE_EDITING } from '@/data';
import { useState, useCallback, useRef, useEffect } from 'react';

interface EditableTextProps {
    id: string;
    value: string;
    onChange: (id: string, value: string) => void;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
    multiline?: boolean;
}

export default function EditableText({
    id,
    value,
    onChange,
    className = '',
    as: Component = 'span',
    multiline = false,
}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleBlur = useCallback(() => {
        setIsEditing(false);
        onChange(id, localValue);
    }, [id, localValue, onChange]);

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
    if (!ENABLE_EDITING) {
        return <Component className={className}>{value}</Component>;
    }

    // 编辑模式：显示可编辑字段
    if (isEditing) {
        const baseClasses = `
      bg-transparent border-none outline-none w-full
      focus:ring-2 focus:ring-blue-500/30 rounded-lg
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
        border border-dashed border-gray-300 hover:border-blue-400
        rounded-lg px-2 py-1 -mx-2 -my-1
        transition-all duration-200
        hover:bg-blue-50/50
      `}
            onClick={() => setIsEditing(true)}
            title="点击编辑"
        >
            {localValue}
        </Component>
    );
}
