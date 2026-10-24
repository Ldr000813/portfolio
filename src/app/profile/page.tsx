import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const c = await getContent();
  const p = c.profile;
  return (
    <>
      <header><div className="wrap pf-top">
        <a className="brand" href="/"><span className="mk">{c.name.slice(0, 1)}</span> {c.name}</a>
        <a href="/" className="linkbtn">← トップに戻る</a>
      </div></header>

      <section className="pf-hero"><div className="wrap">
        {p.photo
          ? <img className="pf-photo" src={p.photo} alt="" />
          : <div className="pf-photo">{c.name.slice(0, 1)}</div>}
        <div>
          <div className="pf-hname">{c.name}</div>
          <div className="pf-head">{p.headline}</div>
          <p className="pf-sum">{p.summary}</p>
        </div>
      </div></section>

      <section className="pf-sec"><div className="wrap" style={{ maxWidth: 820 }}>
        <div className="pf-h">職歴 / Experience</div>
        {p.experience.map((e, i) => (
          <div className="exp" key={i}>
            <div>
              <div className="when">{e.period}</div>
              <div className="org">{e.org}</div>
            </div>
            <div>
              <div className="role">{e.role}</div>
              <ul>{e.points.map((pt, j) => <li key={j}>{pt}</li>)}</ul>
            </div>
          </div>
        ))}
      </div></section>

      <section className="pf-sec" style={{ background: "var(--bg)", paddingTop: 44 }}><div className="wrap" style={{ maxWidth: 820 }}>
        <div className="pf-h">スキル / Skills</div>
        <div className="sk">{p.skills.map((s, i) => <span key={i}>{s}</span>)}</div>

        {p.languages && p.languages.length > 0 && (
          <p style={{ marginTop: 18, color: "var(--slate)", fontSize: 14 }}>
            <b style={{ color: "var(--ink)" }}>言語 / Languages：</b>{p.languages.join("・")}
          </p>
        )}

        {p.education.length > 0 && <>
          <div className="pf-h" style={{ marginTop: 44 }}>学歴 / Education</div>
          {p.education.map((e, i) => (
            <div className="edu" key={i}>
              <div className="s">{e.school}</div>
              <div className="d">{e.detail}{e.period ? ` ・ ${e.period}` : ""}</div>
            </div>
          ))}
        </>}
      </div></section>

      <section className="contact"><div className="wrap">
        <h2>お気軽にご連絡ください。</h2>
        <p>お仕事のご相談・ご依頼はこちらまで。</p>
        <div className="mailbox">✉ {c.contact.email}</div>
        <div><a href={`mailto:${c.contact.email}`} className="btn btn-primary">メールする</a></div>
      </div></section>

      <footer>© {new Date().getFullYear()} {c.name} ・ {c.tagline} ・ 京田辺</footer>
    </>
  );
}
