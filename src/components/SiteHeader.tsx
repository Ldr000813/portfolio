"use client";
import { useState } from "react";
import LanguageSwitch from "./LanguageSwitch";

type Nav = { profile: string; services: string; works: string; price: string; contact: string; consult: string };

export default function SiteHeader({ name, firstChar, tagline, brandCap, nav, lang }: {
  name: string; firstChar: string; tagline: string; brandCap: string; nav: Nav; lang: string;
}) {
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    ["/profile", nav.profile], ["#services", nav.services], ["#works", nav.works], ["#price", nav.price], ["#contact", nav.contact],
  ];
  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="/profile" title={nav.profile}>
          <span className="mk">{firstChar}</span>
          <span className="brand-txt">
            <span className="brand-name">{name} <span className="tg">／ {tagline}</span></span>
            <span className="brand-cap">{brandCap}</span>
          </span>
        </a>
        <nav className="nav-links">
          {links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <div className="nav-right">
          <LanguageSwitch current={lang} />
          <a href="#contact" className="btn btn-primary nav-cta">{nav.consult}</a>
          <button className="burger" aria-label="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? "✕" : "☰"}</button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          {links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>{nav.consult}</a>
        </div>
      )}
    </header>
  );
}
