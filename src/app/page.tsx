import { cookies } from "next/headers";
import { getContent, normLang } from "@/lib/content";
import { UI } from "@/lib/ui";
import SiteHeader from "@/components/SiteHeader";
import ContactDialog from "@/components/ContactDialog";

export const dynamic = "force-dynamic";

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
              {w.image ? <img src={w.image} alt="" /> : <div className="mock">{w.points.map((p) => "◎ " + p.replace(/。.*$/, "")).join("\n")}</div>}
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
