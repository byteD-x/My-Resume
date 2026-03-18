"use client";

import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Mail,
  MessageSquare,
  Send,
  User,
  X,
} from "lucide-react";
import { trackAppointmentSubmit } from "@/lib/analytics";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentModal({
  isOpen,
  onClose,
}: AppointmentModalProps) {
  const firstFocusableRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, {
    onEscape: onClose,
    initialFocusRef: firstFocusableRef,
    lockBodyScroll: true,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const overlayTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

  const modalTransition = shouldReduceMotion
    ? { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const }
    : ({ type: "spring", stiffness: 320, damping: 28, mass: 0.9 } as const);

  const validateForm = useCallback(() => {
    const newErrors = { name: "", email: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "姓名不能为空";
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "姓名过长，最多 50 个字符";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      trackAppointmentSubmit(true);
      setIsSubmitted(true);

      window.setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
        setErrors({ name: "", email: "" });
        onClose();
      }, 2000);
    },
    [onClose, validateForm],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "name" || name === "email") {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [],
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            className="theme-dialog-overlay fixed inset-0 z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-modal-title"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.965, y: 28 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.985, y: 18 }
            }
            transition={modalTransition}
            className="theme-dialog-shell fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] p-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="motion-chip absolute right-4 top-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-[color:var(--text-tertiary)] transition-colors hover:bg-[rgba(var(--surface-muted-rgb),0.78)] hover:text-[color:var(--text-primary)]"
              aria-label="关闭对话框"
            >
              <X size={20} className="motion-icon-float" />
            </button>

            <div className="mb-6">
              <div className="motion-icon-float mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(37,99,235,0.16)] bg-[rgba(239,246,255,0.92)] text-[color:var(--brand-gold)]">
                <Calendar className="h-6 w-6" />
              </div>
              <h2
                id="appointment-modal-title"
                className="theme-title text-xl font-bold"
              >
                预约面谈
              </h2>
              <p className="theme-copy mt-1">
                留下你的联系方式，我会尽快与你取得联系。
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-[color:var(--text-primary)]"
                  >
                    你的姓名
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        errors.name
                          ? "text-rose-400"
                          : "text-[color:var(--text-tertiary)]"
                      }`}
                    />
                    <input
                      ref={firstFocusableRef}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`theme-input-field py-3 pl-10 pr-4 focus:ring-2 ${
                        errors.name
                          ? "border-rose-300 focus:border-rose-300 focus:ring-rose-200"
                          : "focus:ring-[rgba(37,99,235,0.12)]"
                      }`}
                      placeholder="请输入姓名"
                    />
                  </div>
                  {errors.name ? (
                    <p className="animate-in slide-in-from-left-1 mt-1 text-xs font-medium text-rose-500">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="appointment-email"
                    className="mb-1.5 block text-sm font-medium text-[color:var(--text-primary)]"
                  >
                    你的邮箱地址
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        errors.email
                          ? "text-rose-400"
                          : "text-[color:var(--text-tertiary)]"
                      }`}
                    />
                    <input
                      type="email"
                      id="appointment-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`theme-input-field py-3 pl-10 pr-4 focus:ring-2 ${
                        errors.email
                          ? "border-rose-300 focus:border-rose-300 focus:ring-rose-200"
                          : "focus:ring-[rgba(37,99,235,0.12)]"
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email ? (
                    <p className="animate-in slide-in-from-left-1 mt-1 text-xs font-medium text-rose-500">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-[color:var(--text-primary)]"
                  >
                    留言（可选）
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-[color:var(--text-tertiary)]" />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="theme-input-field resize-none py-3 pl-10 pr-4 focus:ring-2 focus:ring-[rgba(37,99,235,0.12)]"
                      placeholder="简要说明你的需求或想了解的内容..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary mt-2 w-full py-3.5 text-base font-bold"
                >
                  <Send size={18} className="mr-2 motion-arrow-shift" />
                  发送预约请求
                </button>
              </form>
            ) : (
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="py-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200/70 bg-emerald-50/80 text-emerald-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="theme-title mb-2 text-lg font-bold">
                  预约成功
                </h3>
                <p className="theme-copy">
                  感谢你的预约，我会尽快与你联系。
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
