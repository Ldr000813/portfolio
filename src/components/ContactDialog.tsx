"use client";
import { useState } from "react";

type Contact = { email: string; whatsapp: string; line: string; wechat: string };

function Icon({ name }: { name: string }) {
  if (name === "email") return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
    </svg>
  );
  if (name === "whatsapp") return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0012.04 2zm5.8 14.06c-.24.68-1.42 1.32-1.95 1.36-.5.04-.96.23-3.25-.68-2.76-1.09-4.5-3.92-4.64-4.1-.14-.18-1.1-1.46-1.1-2.78s.69-1.97.94-2.24c.24-.27.53-.34.71-.34l.5.01c.17.01.4-.06.62.48.24.56.8 1.94.87 2.08.07.14.12.3.02.48-.09.18-.14.3-.28.46l-.42.49c-.14.14-.28.29-.12.57.17.27.74 1.22 1.59 1.98 1.1.98 2.02 1.28 2.3 1.42.28.14.44.12.6-.07.17-.19.69-.8.87-1.08.18-.27.37-.23.62-.14.24.09 1.56.74 1.83.87.27.14.45.2.52.32.07.11.07.66-.17 1.33z" /></svg>
  );
  if (name === "line") return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M12 2C6.48 2 2 5.73 2 10.33c0 4.12 3.58 7.57 8.41 8.22.33.07.77.22.88.5.1.26.07.66.03.92l-.14.86c-.04.26-.2 1.01.89.55 1.09-.46 5.86-3.45 8-5.91C21.4 14.03 22 12.26 22 10.33 22 5.73 17.52 2 12 2zM8.3 12.9H6.36c-.28 0-.51-.23-.51-.51V8.5c0-.28.23-.5.51-.5.29 0 .52.22.52.5v3.38H8.3c.29 0 .51.23.51.51s-.22.51-.51.51zm2.02-.51c0 .28-.23.51-.52.51-.28 0-.51-.23-.51-.51V8.5c0-.28.23-.5.51-.5.29 0 .52.22.52.5v3.89zm4.68 0c0 .22-.14.42-.36.49-.05.02-.11.03-.16.03-.16 0-.31-.08-.41-.21l-1.99-2.71v2.4c0 .28-.23.51-.52.51-.28 0-.51-.23-.51-.51V8.5c0-.22.14-.41.35-.48.06-.02.11-.03.17-.03.16 0 .31.08.41.21l1.99 2.71V8.5c0-.28.23-.5.52-.5.28 0 .51.22.51.5v3.89zm3.28-2.46c.28 0 .51.23.51.51s-.23.51-.51.51h-1.42v.92h1.42c.28 0 .51.23.51.51s-.23.51-.51.51h-1.93c-.28 0-.51-.23-.51-.51V8.5c0-.28.23-.5.51-.5h1.93c.28 0 .51.22.51.5s-.23.51-.51.51h-1.42v.92h1.42z" /></svg>
  );
  return ( // wechat
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M8.69 4C4.62 4 1.3 6.77 1.3 10.18c0 1.94 1.07 3.67 2.76 4.84L3.3 17l2.3-1.2c.82.24 1.6.4 2.47.44-.11-.47-.17-.95-.17-1.44 0-3.1 2.97-5.56 6.56-5.56.24 0 .47.02.7.04C14.5 6.08 11.86 4 8.69 4zM6.2 8.56a.93.93 0 11.01-1.86.93.93 0 01-.01 1.86zm4.98 0a.93.93 0 11.01-1.86.93.93 0 01-.01 1.86zM22.7 15.36c0-2.86-2.78-5.19-5.95-5.19s-5.95 2.33-5.95 5.19c0 2.86 2.78 5.18 5.95 5.18.66 0 1.3-.12 1.9-.3L20.5 21l-.5-1.4c1.6-1.03 2.7-2.52 2.7-4.24zm-7.87-.74a.78.78 0 110-1.55.78.78 0 010 1.55zm3.84 0a.78.78 0 110-1.55.78.78 0 010 1.55z" /></svg>
  );
}

const COLOR: Record<string, string> = { email: "#2563EB", whatsapp: "#25D366", line: "#06C755", wechat: "#07C160" };

export default function ContactDialog({ contact, btnLabel, emailLabel, pickLabel }: {
  contact: Contact; btnLabel: string; emailLabel: string; pickLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");

  const asLink = (v: string) => /^https?:\/\/|^mailto:|^weixin:/i.test(v);
  const items: { key: string; label: string; href?: string; copy?: string }[] = [];
  if (contact.email) items.push({ key: "email", label: emailLabel, href: `mailto:${contact.email}` });
  if (contact.whatsapp) items.push({ key: "whatsapp", label: "WhatsApp", href: asLink(contact.whatsapp) ? contact.whatsapp : `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}` });
  if (contact.line) items.push({ key: "line", label: "LINE", href: contact.line });
  if (contact.wechat) items.push(asLink(contact.wechat) ? { key: "wechat", label: "WeChat", href: contact.wechat } : { key: "wechat", label: "WeChat", copy: contact.wechat });

  function onCopy(v: string) { try { navigator.clipboard?.writeText(v); setCopied(v); setTimeout(() => setCopied(""), 1500); } catch {} }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>{btnLabel}</button>

      {open && (
        <div className="cd-overlay" onClick={() => setOpen(false)}>
          <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cd-head">
              <span>{pickLabel}</span>
              <button className="cd-x" aria-label="close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="cd-list">
              {items.map((it) => it.href ? (
                <a key={it.key} className="cd-item" href={it.href} target={it.key === "email" ? undefined : "_blank"} rel="noreferrer">
                  <span className="cd-ic" style={{ background: COLOR[it.key] }}><Icon name={it.key} /></span>
                  <span className="cd-label">{it.label}</span>
                  <span className="cd-arrow">↗</span>
                </a>
              ) : (
                <button key={it.key} className="cd-item" onClick={() => onCopy(it.copy!)}>
                  <span className="cd-ic" style={{ background: COLOR[it.key] }}><Icon name={it.key} /></span>
                  <span className="cd-label">{it.label}<span className="cd-sub">{it.copy}</span></span>
                  <span className="cd-arrow">{copied === it.copy ? "✓ コピー" : "コピー"}</span>
                </button>
              ))}
              {items.length === 0 && <p style={{ color: "#8893A7", fontSize: 14 }}>連絡先が未設定です。</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
