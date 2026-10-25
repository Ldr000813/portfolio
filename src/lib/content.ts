import { list, put } from "@vercel/blob";

export type Metric = { n: string; l: string };
export type Service = { icon: string; title: string; desc: string };
export type WorkStep = { title: string; desc: string; image: string };
export type Work = { tag: string; title: string; sub: string; points: string[]; stack: string[]; image: string; accent: "blue" | "emerald"; url: string; demoId: string; demoPw: string; steps: WorkStep[] };
export type Why = { title: string; desc: string };
export type Step = { title: string; desc: string };
export type Price = { svc: string; amt: string; note: string };
export type Exp = { role: string; org: string; period: string; points: string[] };
export type Edu = { school: string; detail: string; period: string };
export type Profile = { headline: string; photo: string; summary: string; experience: Exp[]; skills: string[]; education: Edu[]; languages: string[] };

export type Content = {
  name: string;
  tagline: string;
  hero: { eyebrow: string; title: string; sub: string; metrics: Metric[] };
  strip: string;
  services: Service[];
  works: Work[];
  why: Why[];
  process: Step[];
  pricing: Price[];
  pricingNote: string;
  contact: { title: string; sub: string; email: string; whatsapp: string; line: string; wechat: string };
  profile: Profile;
};

export const DEFAULT: Content = {
  name: "李徳潤",
  tagline: "Web & 業務効率化",
  hero: {
    eyebrow: "京田辺の学生エンジニア",
    title: "地域の小さなお店・団体の\n「これ、どうにかできない？」を、\nWebと仕組みで解決します。",
    sub: "制作会社に頼むほどじゃない。でも自分では難しい。——その“すきま”を、手ごろに・速く・ちゃんと動くかたちで埋めます。ホームページ、予約フォーム、日々の作業の自動化まで。",
    metrics: [
      { n: "本番運用中", l: "実際に使われているアプリを開発" },
      { n: "1人完結", l: "設計〜開発〜運用まで対応" },
      { n: "地域密着", l: "多文化コミュニティ「となり」運営" },
    ],
  },
  strip: "Next.js・TypeScript を使った、きちんと作る開発。テスト・認証・管理画面まで“本番品質”で。",
  services: [
    { icon: "◧", title: "ホームページ制作", desc: "お店・団体の“顔”になるサイト。スマホ最適化・多言語・写真や文章を自分で更新できる管理画面つきも。" },
    { icon: "▤", title: "予約・申込フォーム", desc: "イベント予約、問い合わせ、参加申込。メール通知や一覧管理まで、運用しやすい形で。" },
    { icon: "⚙", title: "業務の効率化", desc: "スプレッドシートの自動集計、LINE連携、繰り返し作業の自動化。「毎回の手間」を仕組みで消します。" },
    { icon: "▥", title: "小さな社内ツール", desc: "在庫・名簿・予定の管理画面など、既製サービスで痒いところに手が届かない“ちょうどいい道具”を。" },
  ],
  works: [
    {
      tag: "地域周遊 / Webアプリ", title: "スタンプラリー アプリ",
      sub: "地域のお店をめぐってスタンプを集め、特典がもらえる参加型アプリ。来店促進のための仕組みを、企画から本番運用まで。",
      points: [
        "ログイン・なりすまし対策・同時アクセスでも壊れない整合性を担保",
        "店舗オーナーごとの権限、イベント管理、管理画面まで一式",
        "不正取得を防ぐ設計＋網羅的な自動テストで“本番品質”に",
      ],
      stack: ["Next.js", "TypeScript", "Supabase", "認証", "自動テスト"], image: "", accent: "blue",
      url: "https://stamp-app-two.vercel.app", demoId: "", demoPw: "",
      steps: [
        { title: "ワンタップで参加", desc: "Googleログインまたは匿名で、はじめてでもすぐに参加できます。", image: "" },
        { title: "店舗をめぐってスタンプ", desc: "対象店舗でスタンプを集める。同時アクセスでも破綻しない整合性を担保。", image: "" },
        { title: "特典を受け取る", desc: "規定数に達すると特典を自動付与。不正取得を防ぐ設計。", image: "" },
        { title: "管理画面で運用", desc: "店舗・イベント・オーナー権限を一元管理。現場で使いやすい画面。", image: "" },
      ],
    },
    {
      tag: "コミュニティ / Webサイト", title: "多文化コミュニティ「となり」公式サイト",
      sub: "留学生と地域の人が集まるコミュニティのサイト。運営メンバーが自分で更新できる仕組みまで作り込み。",
      points: [
        "写真・イベントをノーコードで更新できる管理画面（CMS）",
        "チラシ画像からAIがイベント情報を自動入力・匿名の日程調整ツール",
        "日英対応・画像の表示位置調整など、運用目線の細かな作り込み",
      ],
      stack: ["Next.js", "TypeScript", "Gemini API", "Vercel", "多言語"], image: "", accent: "emerald",
      url: "https://tonarikyoto.vercel.app", demoId: "", demoPw: "",
      steps: [],
    },
  ],
  why: [
    { title: "手ごろで、速い", desc: "学生だから、制作会社より手の届く価格。小回りがきいて、連絡のレスポンスも速い。" },
    { title: "“動くもの”を本当に作れる", desc: "デザインだけで終わらせない。認証・DB・テストまで、実際に本番運用まで持っていける技術力。" },
    { title: "地域を分かっている", desc: "自分も京田辺で多文化コミュニティを運営。地域の団体・お店の“現場の困りごと”が肌感覚で分かる。" },
    { title: "まるごと任せられる", desc: "企画の相談から、作って、公開して、その後の更新サポートまで。窓口はひとつで完結。" },
  ],
  process: [
    { title: "無料相談", desc: "やりたいこと・困りごとをお聞きします。まだ曖昧でOK。" },
    { title: "お見積り", desc: "内容・費用・期間を明確に。納得してから着手します。" },
    { title: "制作", desc: "途中経過を共有しながら、一緒に形にしていきます。" },
    { title: "公開・サポート", desc: "公開して終わりじゃなく、その後の更新もフォロー。" },
  ],
  pricing: [
    { svc: "1ページのサイト（LP）", amt: "3万円〜", note: "お店・イベントの紹介を1枚でしっかり見せたい" },
    { svc: "複数ページのサイト", amt: "6万円〜", note: "メニュー・アクセス・お知らせなど、情報が多い" },
    { svc: "予約・申込フォーム付き", amt: "+2万円〜", note: "予約や問い合わせをネットで受けたい" },
    { svc: "業務効率化・社内ツール", amt: "要相談", note: "毎回の手作業を自動化したい" },
  ],
  pricingNote: "※ あくまで目安です。地域の団体・個人店向けに、予算に合わせて柔軟に対応します。",
  contact: { title: "まずは、気軽にご相談ください。", sub: "「こんなこと、できる？」の一言からで大丈夫です。お見積り・ご相談は無料です。", email: "liderun26@gmail.com", whatsapp: "", line: "", wechat: "" },
  profile: {
    headline: "多文化コミュニティ創業者 ／ Webエンジニア（受託開発）",
    photo: "",
    summary:
      "京田辺を拠点に、Web開発と地域コミュニティづくりの両面で活動する学生起業家。ITベンチャーでの実務と受託開発を通じて、企画・設計・開発から本番運用までを一貫して担う。2025年には多文化交流コミュニティ「となり」を創業し、留学生と地域住民が対等に出会う場を運営。『人を起点に、テクノロジーで地域の課題を解く』を信条とする。",
    experience: [
      { role: "創業者・代表", org: "多文化交流コミュニティ「となり」", period: "2025 – 現在", points: [
        "同志社大学の学生を中心に、留学生と地域住民が対等に交流するコミュニティを立ち上げ",
        "公式サイト・SNS・LINEを含む運営基盤をゼロから構築し、イベントを企画・運営",
        "京田辺市南部まちづくりセンターの団体登録を取得し、行政・大学との連携を推進",
      ] },
      { role: "Webエンジニア（フリーランス／受託開発）", org: "個人事業", period: "2024 – 現在", points: [
        "地域の店舗・団体向けに、Webサイト・予約フォーム・業務効率化ツールを設計・開発",
        "Next.js / TypeScript / Supabase を用い、認証・DB・管理画面・自動テストまで本番品質で実装",
        "地域周遊スタンプラリーアプリを企画から本番運用まで一貫して担当",
      ] },
      { role: "プロダクト開発", org: "ITスタートアップ", period: "2023 – 2024", points: [
        "少人数チームで、プロダクト開発・新規事業の立ち上げに関与",
        "要件定義から実装・改善までを高速に回し、事業づくりの実務を経験",
      ] },
      { role: "学生スタッフ", org: "同志社大学 国際学生支援（SIED）", period: "2025 – 現在", points: [
        "留学生のサポートおよび国際交流イベントの企画・運営に従事",
      ] },
      { role: "メンバー", org: "同志社大学 起業部 ／ ビジネスコンテスト", period: "2025", points: [
        "事業プランを立案し、学内外のビジネスコンテストに出場",
      ] },
    ],
    skills: ["Next.js", "TypeScript", "React", "Supabase", "Vercel", "Node.js", "Web制作", "業務効率化", "AI / API連携", "コミュニティ運営", "企画・PM"],
    education: [
      { school: "同志社大学 理工学部 インテリジェント情報工学科", detail: "在学中（京田辺キャンパス）", period: "2023 – 現在" },
      { school: "大阪府立泉北高等学校", detail: "卒業", period: "2019 – 2022" },
    ],
    languages: ["日本語", "English", "中文"],
  },
};

export type Lang = "ja" | "zh" | "en";
const LANGS: Lang[] = ["ja", "zh", "en"];
export function normLang(v: any): Lang { return LANGS.includes(v) ? v : "ja"; }
const pathFor = (lang: Lang) => `portfolio/content-${lang}.json`;

async function readAt(path: string): Promise<any | null> {
  const { blobs } = await list({ prefix: path });
  const b = blobs.find((x) => x.pathname === path);
  if (!b) return null;
  const r = await fetch(b.url, { cache: "no-store" });
  return r.ok ? await r.json() : null;
}

// リンク・画像・ID/PW・技術タグなど、言語に関係ない項目は常に日本語（原本）を使う。
// これで日本語で設定すれば、翻訳し直さなくても全言語に反映される。
function overlayFromJa(c: Content, ja: Content): Content {
  const out: Content = JSON.parse(JSON.stringify(c));
  out.contact.email = ja.contact.email;
  out.contact.whatsapp = ja.contact.whatsapp;
  out.contact.line = ja.contact.line;
  out.contact.wechat = ja.contact.wechat;
  out.profile.photo = ja.profile.photo;
  out.profile.skills = ja.profile.skills;
  out.services.forEach((s, i) => { if (ja.services[i]) s.icon = ja.services[i].icon; });
  out.works.forEach((w, i) => {
    const jw = ja.works[i];
    if (jw) {
      w.image = jw.image; w.url = jw.url; w.demoId = jw.demoId; w.demoPw = jw.demoPw; w.stack = jw.stack; w.accent = jw.accent;
      (w.steps || []).forEach((s, k) => { if (jw.steps?.[k]) s.image = jw.steps[k].image; });
    }
  });
  return out;
}

export async function getContent(lang: Lang = "ja"): Promise<Content> {
  try {
    const jaRaw = (await readAt(pathFor("ja"))) || (await readAt("portfolio/content.json"));
    const ja: Content = jaRaw ? { ...DEFAULT, ...jaRaw } : DEFAULT;
    if (lang === "ja") return ja;
    const saved = await readAt(pathFor(lang));
    const langContent: Content = saved ? { ...DEFAULT, ...saved } : ja;
    return overlayFromJa(langContent, ja);
  } catch {
    return DEFAULT;
  }
}

export async function saveContent(lang: Lang, c: Content): Promise<void> {
  await put(pathFor(lang), JSON.stringify(c), { access: "public", contentType: "application/json", addRandomSuffix: false });
}
