"use client";

import { Check, Copy, Eye, EyeOff, Phone } from "lucide-react";
import { useState } from "react";

export function ContactReveal({
  locale,
  phone,
  wechat,
  icp,
}: {
  locale: "zh" | "en";
  phone: string;
  wechat?: string;
  icp?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const label = locale === "zh" ? "展开电话与微信" : "Reveal phone and WeChat";
  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="reboot-private-contact">
      <button type="button" onClick={() => setRevealed((value) => !value)} aria-expanded={revealed} aria-controls="private-contact-details">
        {revealed ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        {revealed ? (locale === "zh" ? "收起联系方式" : "Hide contact options") : label}
      </button>
      {revealed ? (
        <div className="reboot-private-values" id="private-contact-details">
          <div className="reboot-private-value-row">
            <a href={`tel:${phone}`}><Phone size={14} aria-hidden="true" />{phone}</a>
            <button type="button" onClick={() => copyValue("phone", phone)} aria-label={locale === "zh" ? "复制手机号" : "Copy phone number"} title={locale === "zh" ? "复制手机号" : "Copy phone number"}>{copied === "phone" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}</button>
          </div>
          {wechat ? <div className="reboot-private-value-row"><span>{locale === "zh" ? `微信：${wechat}` : `WeChat: ${wechat}`}</span><button type="button" onClick={() => copyValue("wechat", wechat)} aria-label={locale === "zh" ? "复制微信号" : "Copy WeChat ID"} title={locale === "zh" ? "复制微信号" : "Copy WeChat ID"}>{copied === "wechat" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}</button></div> : null}
          {icp ? <small>{icp}</small> : null}
        </div>
      ) : null}
    </div>
  );
}
