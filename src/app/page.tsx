import { cookies } from "next/headers";
import { getContent, normLang } from "@/lib/content";
import { UI } from "@/lib/ui";
import SiteHeader from "@/components/SiteHeader";
import ContactDialog from "@/components/ContactDialog";

export const dynamic = "force-dynamic";

const FEAT_ICONS = [
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>,
  <svg key="dash" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.3" /><rect x="13" y="4" width="7" height="4.5" rx="1.3" /><rect x="13" y="11" width="7" height="9" rx="1.3" /><rect x="4" y="13.5" width="7" height="6.5" rx="1.3" /></svg>,
  <svg key="bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M13 3L5 13.5h6L10 21l8.5-10.5H12L13 3Z" /></svg>,
  <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.8 2.8 2.8 15.2 0 18M12 3c-2.8 2.8-2.8 15.2 0 18" /></svg>,
];

export default async function Home() {
  const lang = normLang(cookies().get("lang")?.value);
  const c = await getContent(lang);
  const t = UI[lang];
  return (
    <>
      <SiteHeader name={c.name} firstChar={c.name.slice(0, 1)} tagline={c.tagline} brandCap={t.brandCap} nav={t.nav} lang={lang} />

      <section className="hero"><div className="wrap">
        <div className="eyebrow">{c.hero.eyebrow}</div>
        <h1>{c.hero.title}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="cta">
          <a href="#contact" className="btn btn-primary">{t.heroCtaConsult}</a>
          <a href="#works" className="btn btn-ghost">{t.heroCtaWorks}</a>
        </div>
        <div className="meta">
          {c.hero.metrics.map((m, i) => (<div key={i}><div className="n">{m.n}</div><div className="l">{m.l}</div></div>))}
        </div>
      </div></section>

      <div className="strip"><div className="wrap"><span>{c.strip}</span></div></div>

      <section id="services"><div className="wrap">
        <div className="eyebrow">Services</div>
        <h2 className="sec">{t.servicesTitle}</h2>
        <p className="sec-lead">{t.servicesLead}</p>
        <div className="grid">
          {c.services.map((s, i) => (<div className="card" key={i}><div className="ic">{s.icon}</div><h3>{s.title}</h3><p>{s.desc}</p></div>))}
        </div>
      </div></section>

      <section id="works" style={{ background: "var(--bg)" }}><div className="wrap">
        <div className="eyebrow">Works</div>
        <h2 className="sec">{t.worksTitle}</h2>
        <p className="sec-lead">{t.worksLead}</p>
        {c.works.map((w, i) => (
          <div className={"case " + w.accent} key={i}>
            <div className="thumb">
              {w.image ? <img src={w.image} alt="" /> : (
                <div className="feat-grid">
                  {w.stack.slice(0, 4).map((s, j) => (
                    <div className="feat-tile" key={j}>
                      <span className="feat-ic">{FEAT_ICONS[j % FEAT_ICONS.length]}</span>
                      <span className="feat-cap">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="body">
              <span className="tag">{w.tag}</span>
              <h3>{w.title}</h3>
              <p className="sub">{w.sub}</p>
              <ul>{w.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
              <div className="stack">{w.stack.map((s, j) => <span key={j}>{s}</span>)}</div>
              {(w.url || w.demoId || w.demoPw || (w.steps && w.steps.length > 0)) && (
                <div className="work-access">
                  {(w.steps?.length > 0 || w.url) && <a href={`/works/${i}`} className="work-link">{t.caseDetail} →</a>}
                  {w.url && <a href={w.url} target="_blank" rel="noreferrer" className="work-link ghost">{t.viewSite} ↗</a>}
                  {(w.demoId || w.demoPw) && (
                    <div className="work-cred">
                      <span className="wc-h">{t.demoLogin}</span>
                      {w.demoId && <span className="wc-kv">ID <b>{w.demoId}</b></span>}
                      {w.demoPw && <span className="wc-kv">PW <b>{w.demoPw}</b></span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div></section>

      <section className="why"><div className="wrap">
        <div className="eyebrow" style={{ color: "#9DC0FF" }}>Why me</div>
        <h2 className="sec">{t.whyTitle}</h2>
        <p className="sec-lead">{t.whyLead}</p>
        <div className="whygrid">
          {c.why.map((w, i) => (<div className="wc" key={i}><h4>{w.title}</h4><p>{w.desc}</p></div>))}
        </div>
      </div></section>

      <section><div className="wrap">
        <div className="eyebrow">Process</div>
        <h2 className="sec">{t.processTitle}</h2>
        <div className="steps">
          {c.process.map((s, i) => (<div className="step" key={i}><div className="no">{i + 1}</div><h4>{s.title}</h4><p>{s.desc}</p></div>))}
        </div>
      </div></section>

      <section id="price" className="price"><div className="wrap">
        <div className="eyebrow">Pricing</div>
        <h2 className="sec">{t.pricingTitle}</h2>
        <p className="sec-lead">{t.pricingLead}</p>
        <div className="ptable">
          <div className="prow"><div>{t.colContent}</div><div>{t.colAmt}</div><div>{t.colFor}</div></div>
          {c.pricing.map((p, i) => (<div className="prow" key={i}><div className="svc">{p.svc}</div><div className="amt">{p.amt}</div><div className="note">{p.note}</div></div>))}
        </div>
        <p className="pfoot">{c.pricingNote}</p>
      </div></section>

      <section id="contact" className="contact"><div className="wrap">
        <h2>{c.contact.title}</h2>
        <p>{c.contact.sub}</p>
        <div style={{ marginTop: 24 }}>
          <ContactDialog contact={c.contact} btnLabel={t.contactBtn} emailLabel={t.emailLabel} pickLabel={t.contactPick} />
        </div>
      </div></section>

      <footer>
        © {new Date().getFullYear()} {c.name} ・ {c.tagline} ・ 京田辺
        <div style={{ marginTop: 10 }}>
          <a href="/admin" style={{ color: "#c3cada", fontSize: 12, textDecoration: "underline", textUnderlineOffset: 2 }}>管理者ログイン</a>
        </div>
      </footer>
    </>
  );
}
