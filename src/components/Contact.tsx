"use client";

import React, { useCallback, useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import {
  Mail,
  Globe,
  Phone,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Eye,
  Calendar,
} from "lucide-react";
import { ContactData } from "@/types";
import { ToastTrigger } from "./Toast";
import { AppointmentModal } from "./AppointmentModal";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import {
  trackAppointmentModalOpen,
  trackContactReveal,
  trackExternalLink,
} from "@/lib/analytics";

const GithubIcon = ({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ContactProps {
  contactData: ContactData;
}

interface ContactItem {
  id: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  href: string;
  canCopy?: boolean;
  external?: boolean;
}

export default function Contact({ contactData }: ContactProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [showPrivateChannels, setShowPrivateChannels] = useState(
    contactData.visibility?.defaultExpanded ?? false,
  );

  const handleCopy = useCallback(async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Keep silent for clipboard permission failures.
    }
  }, []);

  const websiteUrls =
    contactData.websites && contactData.websites.length > 0
      ? contactData.websites
      : contactData.website
        ? [contactData.website]
        : [];

  const getWebsiteLabel = (url: string, index: number): string => {
    if (url.includes("vercel.app")) return "在线简历（Vercel）";
    if (url.includes("github.io")) return "在线简历（GitHub Pages）";
    return websiteUrls.length > 1 ? `在线简历 ${index + 1}` : "在线简历";
  };

  const emailSubject = "合作咨询 / 岗位沟通 - 杜旭嘉";
  const resumeLinks = websiteUrls.map((url) => `在线简历: ${url}`).join("\n");
  const emailBody = `你好，我希望进一步沟通合作/岗位机会。\n\n${resumeLinks ? `${resumeLinks}\n` : ""}GitHub: https://github.com/icefunicu\n\n请告知可沟通时间，谢谢。`;
  const mailtoHref = `mailto:${contactData.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const showPhone =
    showPrivateChannels || Boolean(contactData.visibility?.showPhoneByDefault);
  const showWechat =
    showPrivateChannels || Boolean(contactData.visibility?.showWechatByDefault);
  const hasHiddenPrivateChannels = Boolean(
    (!showPhone && contactData.phone) || (!showWechat && contactData.wechat),
  );

  const baseItems: ContactItem[] = [
    {
      id: "email",
      icon: Mail,
      label: "邮箱",
      value: contactData.email,
      href: mailtoHref,
      canCopy: true,
    },
    {
      id: "github",
      icon: GithubIcon,
      label: "GitHub",
      value: "icefunicu",
      href: contactData.github,
      external: true,
    },
    ...websiteUrls.map((url, index) => ({
      id: `website-${index + 1}`,
      icon: Globe,
      label: getWebsiteLabel(url, index),
      value: url.replace(/^https?:\/\//, ""),
      href: url,
      external: true,
    })),
  ];

  const privateItems: ContactItem[] = useMemo(() => {
    const items: ContactItem[] = [];
    if (showPhone && contactData.phone) {
      items.push({
        id: "phone",
        icon: Phone,
        label: "电话",
        value: contactData.phone,
        href: `tel:${contactData.phone.replace(/\s+/g, "")}`,
        canCopy: true,
      });
    }
    if (showWechat && contactData.wechat) {
      items.push({
        id: "wechat",
        icon: MessageSquare,
        label: "微信",
        value: contactData.wechat,
        href: "#",
        canCopy: true,
      });
    }
    return items;
  }, [contactData.phone, contactData.wechat, showPhone, showWechat]);

  const contactItems = [...baseItems, ...privateItems];

  return (
    <>
      <Section className="bg-white" data-print="hide">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl"
          >
            <div className="group relative overflow-hidden rounded-3xl p-8 shadow-2xl shadow-blue-900/5 glass-light dark:glass-dark md:p-12 dark:shadow-black/50">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  maskImage:
                    "linear-gradient(to bottom, transparent, black, transparent)",
                }}
              />

              <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10" />

              <div className="relative z-10 flex flex-col items-center gap-12 md:flex-row">
                <div className="flex-1 space-y-8 text-center md:text-left">
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 -left-6 hidden w-1 bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-50 md:block" />
                    <h2 className="mb-4 text-3xl leading-tight font-bold text-zinc-900 font-heading md:text-4xl dark:text-white">
                      准备好一起
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                        {" "}
                        创造价值
                      </span>
                      了吗
                    </h2>
                    <p className="mx-auto max-w-lg text-base leading-relaxed text-zinc-600 md:mx-0 md:text-lg dark:text-zinc-300">
                      无论是项目合作、全职机会还是技术交流，都欢迎直接沟通。
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap md:justify-start">
                    <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row">
                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0 dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        <Mail size={18} className="shrink-0 text-white" />
                        <span>发送邮件</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          trackAppointmentModalOpen();
                          setIsAppointmentOpen(true);
                        }}
                        className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-blue-200 bg-blue-50 px-6 py-3.5 text-base font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 active:translate-y-0 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:border-blue-700 dark:hover:bg-blue-900/50"
                        aria-label="预约沟通"
                      >
                        <Calendar size={18} className="shrink-0" />
                        <span>预约沟通</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-2 font-mono text-sm whitespace-nowrap text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                      {contactData.responseSlaText || "通常在 24 小时内回复"}
                    </div>
                  </div>

                  {contactData.consultationChecklist &&
                    contactData.consultationChecklist.length > 0 && (
                      <div className="rounded-xl border border-zinc-200/70 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
                        <div className="mb-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                          咨询前建议准备
                        </div>
                        <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
                          {contactData.consultationChecklist.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                <div className="flex w-full min-w-[320px] flex-col gap-3 md:w-auto">
                  {contactItems.map((item) => {
                    const Icon = item.icon;
                    const isCopied = copiedField === item.id;

                    return (
                      <div
                        key={item.id}
                        className="group/item relative flex items-center gap-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/95 p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-white hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:border-blue-500/50 dark:hover:bg-zinc-800"
                      >
                        <div className="absolute top-0 bottom-0 left-0 w-1 -translate-x-full transform bg-blue-500 transition-transform duration-300 group-hover/item:translate-x-0" />

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-100 bg-white text-zinc-400 transition-colors group-hover/item:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:group-hover/item:text-blue-400">
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                            {item.label}
                          </div>
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={
                              item.external ? "noopener noreferrer" : undefined
                            }
                            onClick={(e) => {
                              if (item.href === "#") {
                                e.preventDefault();
                                handleCopy(item.value, item.id);
                                return;
                              }
                              if (item.external) {
                                trackExternalLink(item.href, item.label);
                              }
                            }}
                            className={`block truncate font-sans text-base font-semibold text-zinc-900 transition-colors dark:text-zinc-100 ${
                              item.href === "#"
                                ? "cursor-pointer hover:text-green-600 dark:hover:text-green-500"
                                : "hover:text-blue-600 dark:hover:text-blue-400"
                            }`}
                            title={item.href === "#" ? "点击复制" : ""}
                          >
                            {item.value}
                          </a>
                        </div>

                        <div className="flex gap-2 opacity-0 transition-opacity group-hover/item:opacity-100 focus-within:opacity-100">
                          {item.canCopy && (
                            <button
                              onClick={() => handleCopy(item.value, item.id)}
                              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-700 dark:hover:text-blue-400"
                              title="复制"
                              aria-label={`复制 ${item.label}`}
                            >
                              {isCopied ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          )}
                          {item.external && (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() =>
                                trackExternalLink(
                                  item.href,
                                  `${item.label}_icon`,
                                )
                              }
                              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-700 dark:hover:text-blue-400"
                              title="打开"
                              aria-label={`打开 ${item.label}`}
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {hasHiddenPrivateChannels && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrivateChannels(true);
                        trackContactReveal("all");
                      }}
                      className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                      aria-label="展开更多联系方式"
                    >
                      <Eye size={16} />
                      展开更多联系方式
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      <ToastTrigger
        show={copiedField !== null}
        message="已复制到剪贴板！"
        type="success"
        onHide={() => setCopiedField(null)}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </>
  );
}
