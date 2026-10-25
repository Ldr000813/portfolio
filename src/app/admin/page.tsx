"use client";
import { useEffect, useRef, useState } from "react";
import { Content, Service, Work, Why, Step, Price, Metric, Exp, Edu } from "@/lib/content";
import { prepareImage } from "@/lib/imagePrep";
import { extract, chunk } from "@/lib/translatable";

const PW_KEY = "portfolio_admin_pw";

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="fld"><span>{label}</span>{children}</label>;
}

export default function Admin() {
  type Lang = "ja" | "zh" | "en";
  const LANGNAME: Record<Lang, string> = { ja: "日本語", zh: "中文", en: "English" };
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [lang, setLang] = useState<Lang>("ja");
  const [c, setC] = useState<Content | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load(p = pw, l: Lang = lang) {
    const r = await fetch(`/api/admin/content?lang=${l}`, { headers: { "x-admin-password": p }, cache: "no-store" });
    if (!r.ok) return false;
    setC(await r.json()); return true;
  }
  useEffect(() => {
    const s = typeof window !== "undefined" ? sessionStorage.getItem(PW_KEY) : null;
    if (s) { setPw(s); load(s, "ja").then((ok) => setAuthed(ok)); }
  }, []); // eslint-disable-line

  async function login(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const ok = await load(pw, lang);
    if (ok) { setAuthed(true); try { sessionStorage.setItem(PW_KEY, pw); } catch {} }
    else setMsg("パスワードが違います。");
  }
  async function switchLang(l: Lang) {
    setLang(l); setMsg(""); setC(null);
    await load(pw, l);
  }
  async function save() {
    if (!c) return;
    setBusy(true); setMsg("");
    const r = await fetch(`/api/admin/content?lang=${lang}`, { method: "POST", headers: { "x-admin-password": pw, "Content-Type": "application/json" }, body: JSON.stringify(c) });
    setBusy(false);
    setMsg(r.ok ? `✅ 「${LANGNAME[lang]}」を保存しました` : "保存に失敗しました。");
  }
  // 翻訳ボタンを押したときだけ実行（API課金を抑えるため自動では走らせない）
  async function translateNow() {
    if (!c) return;
    const jHeaders = { "x-admin-password": pw, "Content-Type": "application/json" };
    setBusy(true); setMsg("日本語を保存中…");
    const s = await fetch(`/api/admin/content?lang=ja`, { method: "POST", headers: jHeaders, body: JSON.stringify(c) });
    if (!s.ok) { setBusy(false); setMsg("日本語の保存に失敗しました。"); return; }

    // モデル順（先頭から順に試す＝バージョンダウン）。NEXT_PUBLIC_GEMINI_MODELS で上書き可。
    const envModels = (process.env.NEXT_PUBLIC_GEMINI_MODELS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const MODELS = envModels.length ? envModels : ["gemini-3.8-flash", "gemini-flash-latest"];
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const targets: { code: "zh" | "en"; name: string }[] = [{ code: "zh", name: "中文" }, { code: "en", name: "英語" }];

    async function batchTranslate(target: string, texts: string[]): Promise<{ out?: string[]; errors: string[] }> {
      const errors: string[] = [];
      for (const model of MODELS) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const r = await fetch(`/api/admin/translate-batch?target=${target}&model=${model}`, { method: "POST", headers: jHeaders, body: JSON.stringify({ texts }) });
            const j = await r.json().catch(() => ({}));
            if (r.ok && Array.isArray(j.translations) && j.translations.length === texts.length) return { out: j.translations, errors };
            const is429 = r.status === 429 || String(j.detail || "").includes("429");
            errors.push(`${model}: HTTP ${r.status}${j.error ? ` ${j.error}` : ""}${j.detail ? ` — ${j.detail}` : ""}`);
            if (is429 && attempt === 0) { await sleep(10000); continue; } // レート制限 → 少し待って同モデルで再試行
            break; // 次のモデルへ
          } catch (e: any) {
            errors.push(`${model}: network ${e?.message || "error"}`);
            break;
          }
        }
      }
      return { errors };
    }

    for (let ti = 0; ti < targets.length; ti++) {
      const tg = targets[ti];
      const { texts, apply } = extract(c);
      const batches = chunk(texts, 50);
      const translated: string[] = [];
      for (let i = 0; i < batches.length; i++) {
        setMsg(`${tg.name}に翻訳中…（${i + 1}/${batches.length}）`);
        const res = await batchTranslate(tg.code, batches[i]);
        if (!res.out) {
          setBusy(false);
          console.error("[translate] " + tg.name + " batch " + (i + 1), res.errors);
          const quota = res.errors.some((e) => e.includes("429"));
          setMsg((quota ? "⚠ 無料枠の上限（429）に達している可能性があります。時間をおくか課金設定をご確認ください。 / " : "") + `${tg.name}の翻訳に失敗（バッチ${i + 1}）：` + res.errors.join(" ／ "));
          return;
        }
        translated.push(...res.out);
        await sleep(2500); // レート制限対策で間隔を空ける
      }
      const translatedContent = apply(translated);
      const sv = await fetch(`/api/admin/content?lang=${tg.code}`, { method: "POST", headers: jHeaders, body: JSON.stringify(translatedContent) });
      if (!sv.ok) { setBusy(false); setMsg(`${tg.name}の保存に失敗しました。`); return; }
    }
    setBusy(false);
    setMsg("✅ 中文・英語に翻訳して保存しました");
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
  async function uploadWechatQr(file: File) {
    const f = await prepareImage(file, 800);
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", headers: { "x-admin-password": pw }, body: fd });
    if (r.ok) upContact({ wechat: (await r.json()).url });
    else setMsg("QR画像のアップロードに失敗しました。");
  }

  function editStep(wi: number, si: number, patch: any) {
    setC((p) => { if (!p) return p; const works = [...p.works]; const steps = [...(works[wi].steps || [])]; steps[si] = { ...steps[si], ...patch }; works[wi] = { ...works[wi], steps }; return { ...p, works }; });
  }
  function addStep(wi: number) {
    setC((p) => { if (!p) return p; const works = [...p.works]; works[wi] = { ...works[wi], steps: [...(works[wi].steps || []), { title: "", desc: "", image: "" }] }; return { ...p, works }; });
  }
  function delStep(wi: number, si: number) {
    setC((p) => { if (!p) return p; const works = [...p.works]; works[wi] = { ...works[wi], steps: (works[wi].steps || []).filter((_, k) => k !== si) }; return { ...p, works }; });
  }
  async function uploadStepImg(wi: number, si: number, file: File) {
    const f = await prepareImage(file, 1000);
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", headers: { "x-admin-password": pw }, body: fd });
    if (r.ok) editStep(wi, si, { image: (await r.json()).url });
    else setMsg("画像アップロードに失敗しました。");
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>ポートフォリオ編集</h1>
        <a href="/" target="_blank" rel="noreferrer" className="linkbtn">サイトを開く ↗</a>
      </div>
      <div className="lang" style={{ marginBottom: 6 }}>
        {(["ja", "zh", "en"] as Lang[]).map((l) => (
          <button key={l} onClick={() => switchLang(l)} className={lang === l ? "on" : ""}>{LANGNAME[l]}</button>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "#8893A7", marginBottom: 16 }}>
        編集中の言語：<b style={{ color: "#1E2A3A" }}>{LANGNAME[lang]}</b>。
        {lang === "ja"
          ? "　「保存する」は日本語のみ保存。「🌐 中文・英語に翻訳」を押したときだけ、中文・英語を自動生成します（API課金を抑えるため）。"
          : "　この言語だけを保存します（個別の手直し用）。"}
      </p>

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
            <Fld label="サービスリンク（URL。空欄なら非表示）"><input className="in" placeholder="https://example.com" value={w.url || ""} onChange={(e) => editItem("works", i, { url: e.target.value })} /></Fld>
            <div className="rowbtns">
              <Fld label="デモ用 ユーザーID（任意）"><input className="in" value={w.demoId || ""} onChange={(e) => editItem("works", i, { demoId: e.target.value })} /></Fld>
              <Fld label="デモ用 パスワード（任意）"><input className="in" value={w.demoPw || ""} onChange={(e) => editItem("works", i, { demoPw: e.target.value })} /></Fld>
            </div>
            <p style={{ fontSize: 11, color: "#8893A7", marginTop: -6 }}>※ ID/PWは公開ページにそのまま表示されます。閲覧用のデモアカウントのみ入力してください（本番の認証情報は入れない）。</p>

            <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#51607A", marginBottom: 6 }}>機能の流れ（詳細ページのステップ）</div>
              {(w.steps || []).map((s, si) => (
                <div className="item" key={si}>
                  <div className="rowbtns" style={{ marginBottom: 6 }}>
                    <strong style={{ flex: 1 }}>ステップ {si + 1}</strong>
                    <button className="linkbtn del" onClick={() => delStep(i, si)}>削除</button>
                  </div>
                  <input className="in" placeholder="タイトル（例: ワンタップで参加）" value={s.title} onChange={(e) => editStep(i, si, { title: e.target.value })} />
                  <textarea className="in" rows={2} style={{ marginTop: 6 }} placeholder="説明" value={s.desc} onChange={(e) => editStep(i, si, { desc: e.target.value })} />
                  <div className="rowbtns" style={{ marginTop: 6 }}>
                    {s.image && <img src={s.image} alt="" style={{ width: 80, height: 52, objectFit: "cover", borderRadius: 6, border: "1px solid #E6EAF1" }} />}
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadStepImg(i, si, f); e.currentTarget.value = ""; }} />
                    {s.image && <button className="linkbtn del" onClick={() => editStep(i, si, { image: "" })}>画像を外す</button>}
                  </div>
                </div>
              ))}
              <button className="linkbtn" onClick={() => addStep(i)}>＋ ステップを追加</button>
            </div>
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
        <Fld label="WhatsApp（番号 または リンク。空欄なら非表示）"><input className="in" placeholder="例: 8190xxxxxxx / https://wa.me/8190xxxxxxx" value={c.contact.whatsapp || ""} onChange={(e) => upContact({ whatsapp: e.target.value })} /></Fld>
        <Fld label="LINE（URL。空欄なら非表示）"><input className="in" placeholder="例: https://lin.ee/xxxx / https://line.me/ti/p/xxxx" value={c.contact.line || ""} onChange={(e) => upContact({ line: e.target.value })} /></Fld>
        <div className="fld"><span>WeChat QRコード（画像。空欄なら非表示）</span>
          <div className="rowbtns">
            {c.contact.wechat && <img src={c.contact.wechat} alt="" style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, border: "1px solid #E6EAF1" }} />}
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadWechatQr(f); e.currentTarget.value = ""; }} />
            {c.contact.wechat && <button type="button" className="linkbtn del" onClick={() => upContact({ wechat: "" })}>外す</button>}
          </div>
        </div>
        <p style={{ fontSize: 11, color: "#8893A7", marginTop: -6 }}>※ WeChatはリンク遷移ができないため、QRコード画像をアップロードします（ダイアログで「QR」を押すと表示されスキャンできます）。リンク類は翻訳されず全言語共通です。WhatsAppは番号だけ入れると自動で wa.me リンク化。</p>
      </div>

      <div className="savebar">
        <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? "処理中…" : "保存する"}</button>
        {lang === "ja" && (
          <button className="btn" style={{ background: "#0FB07A", color: "#fff" }} onClick={translateNow} disabled={busy}>🌐 中文・英語に翻訳</button>
        )}
        {msg && <span style={{ fontSize: 13, color: msg.startsWith("✅") ? "#0FB07A" : "#dc2626" }}>{msg}</span>}
      </div>
    </div>
  );
}
