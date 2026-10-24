"use client";
import { useEffect, useRef, useState } from "react";
import { Content, Service, Work, Why, Step, Price, Metric, Exp, Edu } from "@/lib/content";
import { prepareImage } from "@/lib/imagePrep";

const PW_KEY = "portfolio_admin_pw";

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="fld"><span>{label}</span>{children}</label>;
}

export default function Admin() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [c, setC] = useState<Content | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load(p = pw) {
    const r = await fetch("/api/admin/content", { headers: { "x-admin-password": p }, cache: "no-store" });
    if (!r.ok) return false;
    setC(await r.json()); return true;
  }
  useEffect(() => {
    const s = typeof window !== "undefined" ? sessionStorage.getItem(PW_KEY) : null;
    if (s) { setPw(s); load(s).then((ok) => setAuthed(ok)); }
  }, []); // eslint-disable-line

  async function login(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const ok = await load(pw);
    if (ok) { setAuthed(true); try { sessionStorage.setItem(PW_KEY, pw); } catch {} }
    else setMsg("パスワードが違います。");
  }
  async function save() {
    if (!c) return;
    setBusy(true); setMsg("");
    const r = await fetch("/api/admin/content", { method: "POST", headers: { "x-admin-password": pw, "Content-Type": "application/json" }, body: JSON.stringify(c) });
    setBusy(false);
    setMsg(r.ok ? "✅ 保存しました（サイトに反映されます）" : "保存に失敗しました。");
  }

  // helpers
  const up = (patch: Partial<Content>) => setC((p) => (p ? { ...p, ...patch } : p));
  const upHero = (patch: Partial<Content["hero"]>) => setC((p) => (p ? { ...p, hero: { ...p.hero, ...patch } } : p));
  const upContact = (patch: Partial<Content["contact"]>) => setC((p) => (p ? { ...p, contact: { ...p.contact, ...patch } } : p));
  function editItem<K extends keyof Content>(key: K, i: number, patch: any) {
    setC((p) => { if (!p) return p; const arr = [...(p[key] as any[])]; arr[i] = { ...arr[i], ...patch }; return { ...p, [key]: arr }; });
  }
  const addItem = (key: keyof Content, item: any) => setC((p) => (p ? { ...p, [key]: [...(p[key] as any[]), item] } : p));
  const delItem = (key: keyof Content, i: number) => setC((p) => (p ? { ...p, [key]: (p[key] as any[]).filter((_, j) => j !== i) } : p));
  // metrics (nested in hero)
  const editMetric = (i: number, patch: Partial<Metric>) => upHero({ metrics: c!.hero.metrics.map((m, j) => (j === i ? { ...m, ...patch } : m)) });
  const addMetric = () => upHero({ metrics: [...c!.hero.metrics, { n: "", l: "" }] });
  const delMetric = (i: number) => upHero({ metrics: c!.hero.metrics.filter((_, j) => j !== i) });

  // profile helpers
  const upProfile = (patch: Partial<Content["profile"]>) => setC((p) => (p ? { ...p, profile: { ...p.profile, ...patch } } : p));
  const editExp = (i: number, patch: Partial<Exp>) => upProfile({ experience: c!.profile.experience.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
  const addExp = () => upProfile({ experience: [...c!.profile.experience, { role: "", org: "", period: "", points: [] }] });
  const delExp = (i: number) => upProfile({ experience: c!.profile.experience.filter((_, j) => j !== i) });
  const editEdu = (i: number, patch: Partial<Edu>) => upProfile({ education: c!.profile.education.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
  const addEdu = () => upProfile({ education: [...c!.profile.education, { school: "", detail: "", period: "" }] });
  const delEdu = (i: number) => upProfile({ education: c!.profile.education.filter((_, j) => j !== i) });
  async function uploadPhoto(file: File) {
    const f = await prepareImage(file, 600);
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", headers: { "x-admin-password": pw }, body: fd });
    if (r.ok) upProfile({ photo: (await r.json()).url });
    else setMsg("写真のアップロードに失敗しました。");
  }

  async function uploadWorkImg(i: number, file: File) {
    const f = await prepareImage(file);
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", headers: { "x-admin-password": pw }, body: fd });
    if (r.ok) editItem("works", i, { image: (await r.json()).url });
    else setMsg("画像アップロードに失敗しました。");
  }

  if (!authed) {
    return (
      <div className="adminwrap" style={{ maxWidth: 360 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", marginBottom: 16 }}>管理ログイン</h1>
        <form onSubmit={login}>
          <input className="in" type="password" placeholder="パスワード" value={pw} onChange={(e) => setPw(e.target.value)} style={{ marginBottom: 10 }} />
          <button className="btn btn-primary" style={{ width: "100%" }}>ログイン</button>
        </form>
        {msg && <p style={{ color: "#dc2626", fontSize: 13, textAlign: "center", marginTop: 10 }}>{msg}</p>}
      </div>
    );
  }
  if (!c) return <div className="adminwrap">読み込み中…</div>;

  return (
    <div className="adminwrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>ポートフォリオ編集</h1>
        <a href="/" target="_blank" rel="noreferrer" className="linkbtn">サイトを開く ↗</a>
      </div>

      <div className="block">
        <h3>基本</h3>
        <Fld label="名前"><input className="in" value={c.name} onChange={(e) => up({ name: e.target.value })} /></Fld>
        <Fld label="肩書き（名前の横）"><input className="in" value={c.tagline} onChange={(e) => up({ tagline: e.target.value })} /></Fld>
      </div>

      <div className="block">
        <h3>プロフィール（ロゴをクリックで開くページ）</h3>
        <Fld label="肩書き（ヘッドライン）"><input className="in" value={c.profile.headline} onChange={(e) => upProfile({ headline: e.target.value })} /></Fld>
        <div className="fld"><span>顔写真（任意）</span>
          <div className="rowbtns">
            {c.profile.photo && <img src={c.profile.photo} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10, border: "1px solid #E6EAF1" }} />}
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); e.currentTarget.value = ""; }} />
            {c.profile.photo && <button className="linkbtn del" onClick={() => upProfile({ photo: "" })}>外す</button>}
          </div>
        </div>
        <Fld label="自己紹介（サマリー）"><textarea className="in" rows={4} value={c.profile.summary} onChange={(e) => upProfile({ summary: e.target.value })} /></Fld>

        <div style={{ fontSize: 12, fontWeight: 700, color: "#51607A", margin: "8px 0 6px" }}>職歴</div>
        {c.profile.experience.map((ex, i) => (
          <div className="item" key={i}>
            <div className="rowbtns" style={{ marginBottom: 6 }}>
              <strong style={{ flex: 1 }}>職歴 {i + 1}</strong>
              <button className="linkbtn del" onClick={() => delExp(i)}>削除</button>
            </div>
            <div className="rowbtns">
              <input className="in" style={{ flex: 2 }} placeholder="役職（例: 創業者・代表）" value={ex.role} onChange={(e) => editExp(i, { role: e.target.value })} />
              <input className="in" style={{ width: 150 }} placeholder="期間（例: 2025 – 現在）" value={ex.period} onChange={(e) => editExp(i, { period: e.target.value })} />
            </div>
            <input className="in" style={{ marginTop: 6 }} placeholder="組織・会社（例: となり / 個人事業）" value={ex.org} onChange={(e) => editExp(i, { org: e.target.value })} />
            <textarea className="in" rows={3} style={{ marginTop: 6 }} placeholder="実績・内容（1行に1つ）" value={ex.points.join("\n")} onChange={(e) => editExp(i, { points: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          </div>
        ))}
        <button className="linkbtn" onClick={addExp}>＋ 職歴を追加</button>

        <Fld label="スキル（カンマ区切り）"><input className="in" value={c.profile.skills.join(", ")} onChange={(e) => upProfile({ skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></Fld>
        <Fld label="言語（カンマ区切り）"><input className="in" value={(c.profile.languages || []).join(", ")} onChange={(e) => upProfile({ languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></Fld>

        <div style={{ fontSize: 12, fontWeight: 700, color: "#51607A", margin: "8px 0 6px" }}>学歴</div>
        {c.profile.education.map((ed, i) => (
          <div className="item" key={i}>
            <div className="rowbtns">
              <input className="in" style={{ flex: 1 }} placeholder="学校名" value={ed.school} onChange={(e) => editEdu(i, { school: e.target.value })} />
              <button className="linkbtn del" onClick={() => delEdu(i)}>削除</button>
            </div>
            <div className="rowbtns" style={{ marginTop: 6 }}>
              <input className="in" style={{ flex: 2 }} placeholder="詳細（例: 在学中）" value={ed.detail} onChange={(e) => editEdu(i, { detail: e.target.value })} />
              <input className="in" style={{ width: 150 }} placeholder="期間（任意）" value={ed.period} onChange={(e) => editEdu(i, { period: e.target.value })} />
            </div>
          </div>
        ))}
        <button className="linkbtn" onClick={addEdu}>＋ 学歴を追加</button>
      </div>

      <div className="block">
        <h3>ヒーロー（最上部）</h3>
        <Fld label="小見出し"><input className="in" value={c.hero.eyebrow} onChange={(e) => upHero({ eyebrow: e.target.value })} /></Fld>
        <Fld label="キャッチコピー（改行で折り返し）"><textarea className="in" rows={3} value={c.hero.title} onChange={(e) => upHero({ title: e.target.value })} /></Fld>
        <Fld label="説明文"><textarea className="in" rows={3} value={c.hero.sub} onChange={(e) => upHero({ sub: e.target.value })} /></Fld>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#51607A", margin: "4px 0 6px" }}>数値アピール（3つ程度）</div>
        {c.hero.metrics.map((m, i) => (
          <div className="item" key={i}>
            <div className="rowbtns">
              <input className="in" style={{ flex: 1 }} placeholder="見出し（例: 本番運用中）" value={m.n} onChange={(e) => editMetric(i, { n: e.target.value })} />
              <button className="linkbtn del" onClick={() => delMetric(i)}>削除</button>
            </div>
            <input className="in" style={{ marginTop: 6 }} placeholder="説明" value={m.l} onChange={(e) => editMetric(i, { l: e.target.value })} />
          </div>
        ))}
        <button className="linkbtn" onClick={addMetric}>＋ 数値を追加</button>
      </div>

      <div className="block">
        <h3>帯の一文</h3>
        <Fld label="ストリップ文"><textarea className="in" rows={2} value={c.strip} onChange={(e) => up({ strip: e.target.value })} /></Fld>
      </div>

      <div className="block">
        <h3>できること（サービス）</h3>
        {c.services.map((s: Service, i) => (
          <div className="item" key={i}>
            <div className="rowbtns">
              <input className="in" style={{ width: 70 }} placeholder="記号" value={s.icon} onChange={(e) => editItem("services", i, { icon: e.target.value })} />
              <input className="in" style={{ flex: 1 }} placeholder="タイトル" value={s.title} onChange={(e) => editItem("services", i, { title: e.target.value })} />
              <button className="linkbtn del" onClick={() => delItem("services", i)}>削除</button>
            </div>
            <textarea className="in" rows={2} style={{ marginTop: 6 }} placeholder="説明" value={s.desc} onChange={(e) => editItem("services", i, { desc: e.target.value })} />
          </div>
        ))}
        <button className="linkbtn" onClick={() => addItem("services", { icon: "◆", title: "", desc: "" })}>＋ サービスを追加</button>
      </div>

      <div className="block">
        <h3>制作実績</h3>
        {c.works.map((w: Work, i) => (
          <div className="item" key={i}>
            <div className="rowbtns" style={{ marginBottom: 6 }}>
              <strong style={{ flex: 1 }}>実績 {i + 1}</strong>
              <select className="in" style={{ width: 130 }} value={w.accent} onChange={(e) => editItem("works", i, { accent: e.target.value })}>
                <option value="blue">青</option><option value="emerald">緑</option>
              </select>
              <button className="linkbtn del" onClick={() => delItem("works", i)}>削除</button>
            </div>
            <Fld label="タグ"><input className="in" value={w.tag} onChange={(e) => editItem("works", i, { tag: e.target.value })} /></Fld>
            <Fld label="タイトル"><input className="in" value={w.title} onChange={(e) => editItem("works", i, { title: e.target.value })} /></Fld>
            <Fld label="説明"><textarea className="in" rows={2} value={w.sub} onChange={(e) => editItem("works", i, { sub: e.target.value })} /></Fld>
            <Fld label="ポイント（1行に1つ）"><textarea className="in" rows={3} value={w.points.join("\n")} onChange={(e) => editItem("works", i, { points: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} /></Fld>
            <Fld label="技術スタック（カンマ区切り）"><input className="in" value={w.stack.join(", ")} onChange={(e) => editItem("works", i, { stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></Fld>
            <div className="fld"><span>画像（任意。未設定ならポイントを表示）</span>
              <div className="rowbtns">
                {w.image && <img src={w.image} alt="" style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #E6EAF1" }} />}
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadWorkImg(i, f); e.currentTarget.value = ""; }} />
                {w.image && <button className="linkbtn del" onClick={() => editItem("works", i, { image: "" })}>画像を外す</button>}
              </div>
            </div>
          </div>
        ))}
        <button className="linkbtn" onClick={() => addItem("works", { tag: "", title: "", sub: "", points: [], stack: [], image: "", accent: "blue" })}>＋ 実績を追加</button>
      </div>

      <div className="block">
        <h3>選ばれる理由</h3>
        {c.why.map((w: Why, i) => (
          <div className="item" key={i}>
            <div className="rowbtns">
              <input className="in" style={{ flex: 1 }} placeholder="見出し" value={w.title} onChange={(e) => editItem("why", i, { title: e.target.value })} />
              <button className="linkbtn del" onClick={() => delItem("why", i)}>削除</button>
            </div>
            <textarea className="in" rows={2} style={{ marginTop: 6 }} value={w.desc} onChange={(e) => editItem("why", i, { desc: e.target.value })} />
          </div>
        ))}
        <button className="linkbtn" onClick={() => addItem("why", { title: "", desc: "" })}>＋ 追加</button>
      </div>

      <div className="block">
        <h3>流れ（Process）</h3>
        {c.process.map((s: Step, i) => (
          <div className="item" key={i}>
            <div className="rowbtns">
              <input className="in" style={{ flex: 1 }} placeholder="見出し" value={s.title} onChange={(e) => editItem("process", i, { title: e.target.value })} />
              <button className="linkbtn del" onClick={() => delItem("process", i)}>削除</button>
            </div>
            <textarea className="in" rows={2} style={{ marginTop: 6 }} value={s.desc} onChange={(e) => editItem("process", i, { desc: e.target.value })} />
          </div>
        ))}
        <button className="linkbtn" onClick={() => addItem("process", { title: "", desc: "" })}>＋ 追加</button>
      </div>

      <div className="block">
        <h3>料金</h3>
        {c.pricing.map((p: Price, i) => (
          <div className="item" key={i}>
            <div className="rowbtns">
              <input className="in" style={{ flex: 1 }} placeholder="内容" value={p.svc} onChange={(e) => editItem("pricing", i, { svc: e.target.value })} />
              <input className="in" style={{ width: 120 }} placeholder="目安" value={p.amt} onChange={(e) => editItem("pricing", i, { amt: e.target.value })} />
              <button className="linkbtn del" onClick={() => delItem("pricing", i)}>削除</button>
            </div>
            <input className="in" style={{ marginTop: 6 }} placeholder="こんな方に" value={p.note} onChange={(e) => editItem("pricing", i, { note: e.target.value })} />
          </div>
        ))}
        <button className="linkbtn" onClick={() => addItem("pricing", { svc: "", amt: "", note: "" })}>＋ 行を追加</button>
        <Fld label="注釈"><input className="in" value={c.pricingNote} onChange={(e) => up({ pricingNote: e.target.value })} /></Fld>
      </div>

      <div className="block">
        <h3>お問い合わせ</h3>
        <Fld label="見出し"><input className="in" value={c.contact.title} onChange={(e) => upContact({ title: e.target.value })} /></Fld>
        <Fld label="説明"><textarea className="in" rows={2} value={c.contact.sub} onChange={(e) => upContact({ sub: e.target.value })} /></Fld>
        <Fld label="メールアドレス"><input className="in" value={c.contact.email} onChange={(e) => upContact({ email: e.target.value })} /></Fld>
      </div>

      <div className="savebar">
        <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? "保存中…" : "保存する"}</button>
        {msg && <span style={{ fontSize: 13, color: msg.startsWith("✅") ? "#0FB07A" : "#dc2626" }}>{msg}</span>}
      </div>
    </div>
  );
}
