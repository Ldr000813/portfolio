import { list, put } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";

const CONTENT_TAG = "portfolio-content";

export type Metric = { n: string; l: string };
export type Service = { icon: string; title: string; desc: string };
export type WorkStep = { title: string; desc: string; image: string };
export type Feature = { icon: string; label: string };
export type Work = { tag: string; title: string; sub: string; points: string[]; stack: string[]; features: Feature[]; image: string; accent: "blue" | "emerald"; url: string; demoId: string; demoPw: string; steps: WorkStep[] };
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
    eyebrow: "お店・団体のための“ちょうどいい”Web屋",
    title: "「ホームページ、古いまま…」\n「予約の電話対応がしんどい…」\nその“困った”、仕組みで片づけます。",
    sub: "大きな制作会社に頼むと高いし、話も通じにくい。でも自分でやる時間はない。——そんなお店・団体の“ちょっと困った”を、手ごろに・速く・ちゃんと動く形で解決します。ホームページ、予約・申込フォーム、毎日の手作業の自動化まで、まるごとおまかせください。",
    metrics: [
      { n: "本番運用中", l: "実際に地域で使われているアプリを開発" },
      { n: "1人で完結", l: "相談から開発、その後の更新まで" },
      { n: "地域密着", l: "自分も京田辺でコミュニティを運営" },
    ],
  },
  strip: "見た目だけのサイトは作りません。予約・会員・管理画面まで“毎日ちゃんと使える”作りで、公開したあとの更新もラクに。",
  services: [
    { icon: "◧", title: "ホームページ制作", desc: "「スマホで見づらい」「何年も更新できていない」を解消。お店・団体の“顔”になるサイトを、写真や文章を自分で直せる管理画面つきで。多言語にも対応します。" },
    { icon: "▤", title: "予約・申込フォーム", desc: "電話やLINEでバラバラな予約・問い合わせを、ネットで一本化。取りこぼしを防いで、自動のメール通知や一覧管理までセットで。" },
    { icon: "⚙", title: "業務の効率化", desc: "毎月の集計、名簿の転記、同じ内容のLINE送信……「気づけば手作業ばかり」をなくします。面倒な繰り返しは、仕組みに任せましょう。" },
    { icon: "▥", title: "小さな社内ツール", desc: "市販サービスだと高い・多機能すぎて使いこなせない。在庫・名簿・予定など、“うちのやり方”にちょうど合う道具を、必要な分だけ。" },
  ],
  works: [
    {
      tag: "地域周遊 / Webアプリ", title: "スタンプラリー アプリ",
      sub: "地域のお店をめぐってスタンプを集め、特典がもらえる参加型アプリ。「どうすればまた来てもらえるか」を、楽しい仕掛けで解決。企画から本番運用まで一貫して。",
      points: [
        "行列や同時アクセスでも止まらない。不正なスタンプ取得もしっかりブロック",
        "店舗ごとにログインでき、イベントや特典の管理もお店の人が自分で操作",
        "「ちゃんと動く」を自動テストで担保。本番で安心して使える品質に",
      ],
      stack: ["Next.js", "TypeScript", "Supabase", "認証", "自動テスト"],
      features: [
        { icon: "lock", label: "ログイン認証" },
        { icon: "shield", label: "なりすまし対策" },
        { icon: "users", label: "同時接続に強い" },
        { icon: "check", label: "不正取得を防止" },
        { icon: "dashboard", label: "店舗管理画面" },
        { icon: "bolt", label: "即時スタンプ付与" },
      ],
      image: "", accent: "blue",
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
      sub: "留学生と地域の人が集まるコミュニティのサイト。「毎回の更新を人に頼まず、自分たちでできる」ところまで作り込みました。",
      points: [
        "写真もイベントも、専門知識ゼロで運営メンバーが自分で更新できる管理画面",
        "チラシ画像を入れるだけでAIがイベント情報を自動入力。面倒な日程調整も匿名でサクッと",
        "日本語・英語・中国語に対応。「誰も取り残さない」細かな気づかいまで",
      ],
      stack: ["Next.js", "TypeScript", "Gemini API", "Vercel", "多言語"],
      features: [
        { icon: "sparkle", label: "AIで自動入力" },
        { icon: "dashboard", label: "ノーコード更新" },
        { icon: "globe", label: "多言語対応" },
        { icon: "calendar", label: "日程調整ツール" },
        { icon: "image", label: "写真ギャラリー管理" },
        { icon: "users", label: "匿名で参加OK" },
      ],
      image: "", accent: "emerald",
      url: "https://tonarikyoto.vercel.app", demoId: "", demoPw: "",
      steps: [],
    },
  ],
  why: [
    { title: "手ごろで、話が早い", desc: "学生だから、制作会社よりぐっと手の届く価格。間に営業や下請けを挟まないので、相談も連絡もスピーディです。" },
    { title: "見た目だけで終わらせない", desc: "「作ったけど使われない」をなくします。予約・会員・管理画面まで、毎日ちゃんと回る“動くもの”を作れる技術力。" },
    { title: "現場の“困った”が分かる", desc: "自分も京田辺でコミュニティを運営する当事者。地域の団体・お店が本当に困っていることが、肌感覚で分かります。" },
    { title: "最初から最後までひとつの窓口", desc: "「どう頼めばいいか分からない」でも大丈夫。相談から、作って、公開して、その後の更新まで、まるごとおまかせ。" },
  ],
  process: [
    { title: "無料相談", desc: "「こんなこと、できる？」の一言からでOK。困りごとをそのまま聞かせてください。" },
    { title: "お見積り", desc: "やること・費用・期間を、分かりやすく明確に。納得いただいてから着手します。" },
    { title: "制作", desc: "「ここはこうしたい」を聞きながら、一緒に形に。途中経過もこまめに共有します。" },
    { title: "公開・サポート", desc: "公開して終わり、にはしません。その後の「ちょっと直したい」もフォローします。" },
  ],
  pricing: [
    { svc: "1ページのサイト（LP）", amt: "3万円〜", note: "お店・イベントの魅力を、1ページでしっかり伝えたい" },
    { svc: "複数ページのサイト", amt: "6万円〜", note: "メニュー・アクセス・お知らせなど、載せたい情報が多い" },
    { svc: "予約・申込フォーム付き", amt: "+2万円〜", note: "予約や問い合わせを、電話対応から解放してネットで受けたい" },
    { svc: "業務効率化・社内ツール", amt: "要相談", note: "毎回の手作業・集計をなくして、本業に集中したい" },
  ],
  pricingNote: "※ あくまで目安です。地域の団体・個人店向けに、ご予算に合わせて無理なく相談にのります。まずは気軽にお問い合わせください。",
  contact: { title: "まずは、気軽に相談してみませんか？", sub: "「こんなこと、できる？」「いくらかかる？」の一言からで大丈夫です。相談・お見積りは無料。しつこい営業は一切しません。", email: "liderun26@gmail.com", whatsapp: "", line: "", wechat: "" },
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
  // 言語に関係ない項目は常に日本語（原本）を使う。
  out.contact.email = ja.contact.email;
  out.contact.whatsapp = ja.contact.whatsapp;
  out.contact.line = ja.contact.line;
  out.contact.wechat = ja.contact.wechat;
  out.profile.photo = ja.profile.photo;
  out.profile.skills = ja.profile.skills;

  // リスト系は「日本語の件数」を基準にする。未翻訳の項目（新規追加など）は
  // 日本語のまま表示し、翻訳ボタンを押せば訳文に差し替わる。
  const cs = c.services || [];
  out.services = ja.services.map((js, i) => {
    const t = cs[i] || js;
    return { ...t, icon: js.icon };
  });
  const cw = c.works || [];
  out.works = ja.works.map((jw, i) => {
    const t = cw[i] || jw;
    const steps = (jw.steps || []).map((jstep, k) => {
      const ts = (t.steps || [])[k] || jstep;
      return { ...ts, image: jstep.image };
    });
    const features = (jw.features || []).map((jf, k) => {
      const tf = (t.features || [])[k] || jf;
      return { ...tf, icon: jf.icon };
    });
    return { ...t, image: jw.image, url: jw.url, demoId: jw.demoId, demoPw: jw.demoPw, stack: jw.stack, accent: jw.accent, steps, features };
  });
  out.why = ja.why.map((j, i) => (c.why || [])[i] || j);
  out.process = ja.process.map((j, i) => (c.process || [])[i] || j);
  out.pricing = ja.pricing.map((j, i) => (c.pricing || [])[i] || j);
  out.profile.experience = ja.profile.experience.map((j, i) => (c.profile.experience || [])[i] || j);
  out.profile.education = ja.profile.education.map((j, i) => (c.profile.education || [])[i] || j);
  out.profile.languages = ja.profile.languages.map((j, i) => {
    const v = (c.profile.languages || [])[i];
    return v !== undefined ? v : j;
  });
  return out;
}

// Blobからの読み取り（list / fetch）はここだけ。これを unstable_cache で包み、
// revalidate:false にすることで、管理者が保存するまで再取得しない＝Blobリクエストを最小化。
async function loadContent(lang: Lang): Promise<Content> {
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

export async function getContent(lang: Lang = "ja"): Promise<Content> {
  const cached = unstable_cache(
    () => loadContent(lang),
    ["portfolio-content", lang],
    { tags: [CONTENT_TAG], revalidate: false }
  );
  return cached();
}

export async function saveContent(lang: Lang, c: Content): Promise<void> {
  await put(pathFor(lang), JSON.stringify(c), { access: "public", contentType: "application/json", addRandomSuffix: false });
  // 保存したらキャッシュを無効化し、次回アクセス時に一度だけ再取得させる。
  revalidateTag(CONTENT_TAG);
}
