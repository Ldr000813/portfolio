import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getContent, normLang } from "@/lib/content";
import { UI } from "@/lib/ui";
import LanguageSwitch from "@/components/LanguageSwitch";

export const dynamic = "force-dynamic";

export default async function WorkDetail({ params }: { params: { i: string } }) {
  const lang = normLang(cookies().get("lang")?.value);
  const c = await getContent(lang);
  const t = UI[lang];
  const idx = Number(params.i);
  const w = c.works[idx];
  if (!w || isNaN(idx)) notFound();

  return (
    <>
      <header><div className="wrap pf-top">
        <a className="brand" href="/"><span className="mk">{c.name.slice(0, 1)}</span> <span className="brand-name">{c.name}</span></a>
        <div className="nav-right">
          <LanguageSwitch current={lang} />
          <a href="/#works" className="linkbtn">{t.backToWorks}</a>
        </div>
      </div></header>

      <section className="wk-top"><div className="wrap">
        <span className="tag">{w.tag}</span>
        <h1 className="wk-title">{w.title}</h1>
        <p className="wk-sub">{w.sub}</p>
      </div></section>

      <section className="section" style={{ paddingTop: 34 }}><div className="wrap">
        <div className="wk-wrap">
          {/* side: link / info */}
          <aside className="wk-side">
            {w.url && <a href={w.url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>{t.viewSite} ↗</a>}
            {(w.demoId || w.demoPw) && (
              <div className="wk-cred">
                <div className="wc-h">{t.demoLogin}</div>
                {w.demoId && <div className="wk-kv">ID <b>{w.demoId}</b></div>}
                {w.demoPw && <div className="wk-kv">PW <b>{w.demoPw}</b></div>}
              </div>
            )}
            {w.stack.length > 0 && <div className="stack" style={{ marginTop: 16 }}>{w.stack.map((s, j) => <span key={j}>{s}</span>)}</div>}
            {w.points.length > 0 && (
              <ul className="wk-points">{w.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
            )}
          </aside>

          {/* main: walkthrough */}
          <div className="wk-main">
            <div className="eyebrow">{t.walkthrough}</div>
            <h2 className="sec" style={{ marginBottom: 26 }}>{w.title}</h2>
            <ol className="wk-steps">
              {(w.steps || []).map((s, j) => (
                <li className="wk-step" key={j}>
                  <div className="wk-num">{j + 1}</div>
                  <div className="wk-body">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    {s.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img className="wk-shot" src={s.image} alt="" loading="lazy" />
                    )}
                  </div>
                </li>
              ))}
              {(!w.steps || w.steps.length === 0) && <p style={{ color: "var(--mute)" }}>（機能の説明は準備中です）</p>}
            </ol>
          </div>
        </div>
      </div></section>

      <footer>© {new Date().getFullYear()} {c.name} ・ {c.tagline} ・ 京田辺</footer>
    </>
  );
}
