"use client";

import React, { useCallback, useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import {
  Calendar,
  Check,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Globe,
  type LucideProps,
  Mail,
  MessageSquare,
  Phone,
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
  strokeWidth = 2,
}: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
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
  icon: React.ComponentType<LucideProps>;
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
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch {
      // Ignore clipboard permission failures.
    }
  }, []);

  const websiteUrls =
    contactData.websites && contactData.websites.length > 0
      ? contactData.websites
      : contactData.website
        ? [contactData.website]
        : [];

  const emailSubject = "合作咨询 / 岗位沟通";
  const resumeLinks = websiteUrls.map((url) => `在线站点：${url}`).join("\n");
  const emailBody = `你好，我想进一步沟通合作或岗位机会。\n\n${resumeLinks ? `${resumeLinks}\n` : ""}GitHub: ${contactData.github}\n\n请告知方便沟通的时间，谢谢。`;
  const mailtoHref = `mailto:${contactData.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

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
      value: "byteD-x",
      href: contactData.github,
      external: true,
    },
    ...websiteUrls.map((url, index) => ({
      id: `website-${index + 1}`,
      icon: Globe,
      label: websiteUrls.length > 1 ? `在线站点 ${index + 1}` : "在线站点",
      value: url.replace(/^https?:\/\//, ""),
      href: url,
      external: true,
    })),
  ];

  const privateItems: ContactItem[] = useMemo(() => {
    const items: ContactItem[] = [];
    const showPhone =
      showPrivateChannels ||
      Boolean(contactData.visibility?.showPhoneByDefault);
    const showWechat =
      showPrivateChannels ||
      Boolean(contactData.visibility?.showWechatByDefault);

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
  }, [
    contactData.phone,
    contactData.visibility?.showPhoneByDefault,
    contactData.visibility?.showWechatByDefault,
    contactData.wechat,
    showPrivateChannels,
  ]);

  const hasHiddenPrivateChannels = Boolean(
    (!showPrivateChannels && contactData.phone) ||
      (!showPrivateChannels && contactData.wechat),
  );

  const contactItems = [...baseItems, ...privateItems];

  return (
    <>
      <Section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950" data-print="hide">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-6xl"
          >
            <div className="grid gap-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 md:grid-cols-[minmax(0,1fr)_24rem] md:p-12 lg:p-14">
              <div className="space-y-8">
                <div
                  className="max-w-2xl scroll-mt-28"
                  data-scroll-target="contact"
                >
                  <p className="text-[11px] font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-3">
                    Get in Touch
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl mb-5">
                    建立连接，开启对话
                  </h2>
                  <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    无论是交流岗位机会、探讨 AI 落地路径、还是讨论深度的技术问题，都欢迎随时联系我。我习惯基于具体场景与明确的边界进行高效沟通。
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap pt-2">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 dark:bg-zinc-100 px-6 py-3.5 text-[14px] font-medium text-white dark:text-zinc-900 transition-transform hover:-translate-y-0.5"
                  >
                    <Mail size={16} />
                    发邮件沟通
                  </a>
                  <a
                    href="/resume.pdf"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-6 py-3.5 text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <Download size={16} />
                    {contactData.resumeButtonText ?? "下载简历 PDF"}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      trackAppointmentModalOpen();
                      setIsAppointmentOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-6 py-3.5 text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <Calendar size={16} />
                    预约沟通
                  </button>
                </div>

                <div className="inline-flex items-center gap-2.5 rounded border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 px-3 py-1.5 text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-600 dark:bg-zinc-400"></span>
                  </span>
                  {contactData.responseSlaText ?? "通常在 24 小时内回复"}
                </div>

                {contactData.consultationChecklist &&
                contactData.consultationChecklist.length > 0 ? (
                  <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[11px] font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-5">
                      沟通前准备
                    </p>
                    <ul className="space-y-3.5 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {contactData.consultationChecklist.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2.5 h-[1px] w-3 shrink-0 bg-zinc-400 dark:bg-zinc-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const isCopied = copiedField === item.id;

                  return (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-0.5">
                            {item.label}
                          </p>
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            onClick={(event) => {
                              if (item.href === "#") {
                                event.preventDefault();
                                void handleCopy(item.value, item.id);
                                return;
                              }
                              if (item.external) {
                                trackExternalLink(item.href, item.label);
                              }
                            }}
                            className="block truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
                          >
                            {item.value}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0 ml-4">
                        {item.canCopy ? (
                          <button
                            type="button"
                            onClick={() => void handleCopy(item.value, item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                            aria-label={`复制 ${item.label}`}
                          >
                            {isCopied ? (
                              <Check size={14} className="text-zinc-900 dark:text-zinc-100" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        ) : null}
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              trackExternalLink(item.href, `${item.label}_icon`)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                            aria-label={`打开 ${item.label}`}
                          >
                            <ExternalLink size={14} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                {hasHiddenPrivateChannels ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPrivateChannels(true);
                      trackContactReveal("all");
                    }}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3.5 text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                  >
                    <Eye size={16} />
                    展开更多联系方式
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      <ToastTrigger
        show={copiedField !== null}
        message="已复制到剪贴板"
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
