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

  const websiteLinks =
    contactData.websiteLinks && contactData.websiteLinks.length > 0
      ? contactData.websiteLinks
      : contactData.websites && contactData.websites.length > 0
        ? contactData.websites.map((url, index) => ({
            label: contactData.websites!.length > 1 ? `在线站点 ${index + 1}` : "在线站点",
            url,
          }))
        : contactData.website
          ? [{ label: "在线站点", url: contactData.website }]
          : [];
  const websiteUrls = websiteLinks.map(({ url }) => url);

  const emailSubject = "合作咨询 / 岗位沟通";
  const resumeLinks = websiteUrls
    .map((url) => `在线站点：${url}`)
    .join("\n");
  const emailBody = `你好，我想进一步沟通合作或岗位机会。\n\n${
    resumeLinks ? `${resumeLinks}\n` : ""
  }GitHub: ${contactData.github}\n\n请告知方便沟通的时间，谢谢。`;
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
    ...websiteLinks.map(({ label, url }, index) => ({
      id: `website-${index + 1}`,
      icon: Globe,
      label,
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
      <Section className="theme-grid-section theme-section-balanced relative" data-print="hide">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-6xl"
          >
            <div className="theme-card grid gap-8 rounded-[1.6rem] border-[rgba(148,163,184,0.16)] p-5 shadow-[0_20px_42px_rgba(15,23,42,0.08)] sm:p-6 md:grid-cols-[minmax(0,1fr)_24rem] md:gap-12 md:rounded-[1.85rem] md:p-10 lg:p-14">
              <div className="space-y-7 sm:space-y-8">
                <div
                  className="theme-section-header mb-0 max-w-2xl scroll-mt-28"
                  data-scroll-target="contact"
                >
                  <p className="theme-kicker mb-3">
                    Get in Touch
                  </p>
                  <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
                    建立连接，开启对话
                  </h2>
                  <p className="theme-section-copy">
                    无论是交流岗位机会、探讨 AI 落地路径，还是讨论更深入的技术问题，都欢迎随时联系我。我习惯基于具体场景与明确边界进行高效沟通。
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 border-b border-[color:var(--border-default)] pb-6 pt-1 sm:flex-row sm:flex-wrap sm:gap-4">
                  <a
                    href={mailtoHref}
                    className="btn btn-primary w-auto px-6 py-3.5 text-[14px]"
                  >
                    <Mail size={16} />
                    发邮件沟通
                  </a>
                  <a
                    href="/resume.pdf"
                    className="btn btn-secondary w-auto px-6 py-3.5 text-[14px]"
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
                    className="btn btn-secondary w-auto px-6 py-3.5 text-[14px]"
                  >
                    <Calendar size={16} />
                    预约沟通
                  </button>
                </div>

                <div className="theme-card-muted inline-flex items-center gap-2.5 rounded-full border-[rgba(148,163,184,0.14)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--text-secondary)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
                  </span>
                  {contactData.responseSlaText ?? "通常在 24 小时内回复（工作日更快）"}
                </div>

                {contactData.consultationChecklist &&
                contactData.consultationChecklist.length > 0 ? (
                  <div className="mt-8 border-t border-[color:var(--border-default)] pt-8">
                    <p className="theme-kicker mb-5 text-[11px]">
                      沟通前准备
                    </p>
                    <ul className="theme-copy space-y-3.5 text-[14px] leading-relaxed">
                      {contactData.consultationChecklist.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2.5 h-[1px] w-3 shrink-0 bg-[rgba(37,99,235,0.38)]" />
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
                      className="theme-card-muted group flex items-center justify-between rounded-[1.3rem] border-[rgba(148,163,184,0.14)] p-4 transition-colors hover:border-[rgba(37,99,235,0.22)]"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="theme-icon-box theme-icon-box-sm">
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p className="theme-card-kicker mb-1">
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
                            className="theme-link block truncate text-[14px] font-semibold leading-6 underline-offset-4 hover:underline"
                          >
                            {item.value}
                          </a>
                        </div>
                      </div>

                      <div className="ml-4 flex shrink-0 items-center gap-1.5">
                        {item.canCopy ? (
                          <button
                            type="button"
                            onClick={() => void handleCopy(item.value, item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--text-tertiary)] transition-colors hover:bg-[rgba(239,246,255,0.9)] hover:text-[color:var(--brand-gold)]"
                            aria-label={`复制 ${item.label}`}
                          >
                            {isCopied ? (
                              <Check
                                size={14}
                                className="text-[color:var(--brand-gold)]"
                              />
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
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--text-tertiary)] transition-colors hover:bg-[rgba(239,246,255,0.9)] hover:text-[color:var(--brand-gold)]"
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
                    className="theme-link mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[1.25rem] border border-dashed border-[color:var(--border-default)] bg-transparent px-4 py-3.5 text-[13px] font-semibold hover:border-[rgba(37,99,235,0.22)]"
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
