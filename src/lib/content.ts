import { list, put } from "@vercel/blob";

export type Metric = { n: string; l: string };
export type Service = { icon: string; title: string; desc: string };
export type Work = { tag: string; title: string; sub: string; points: string[]; stack: string[]; image: string; accent: "blue" | "emerald" };
export type Why = { title: string; desc: string };
export type Step = { title: string; desc: string };
export type Price = { svc: string; amt: string; note: string };

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
  contact: { title: string; sub: string; email: string };
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
  contact: { title: "まずは、気軽にご相談ください。", sub: "「こんなこと、できる？」の一言からで大丈夫です。お見積り・ご相談は無料です。", email: "liderun26@gmail.com" },
};

const PATH = "portfolio/content.json";

export async function getContent(): Promise<Content> {
  try {
    const { blobs } = await list({ prefix: PATH });
    const b = blobs.find((x) => x.pathname === PATH);
    if (!b) return DEFAULT;
    const r = await fetch(b.url, { cache: "no-store" });
    if (!r.ok) return DEFAULT;
    const saved = await r.json();
    return { ...DEFAULT, ...saved };
  } catch {
    return DEFAULT;
  }
}

export async function saveContent(c: Content): Promise<void> {
  await put(PATH, JSON.stringify(c), { access: "public", contentType: "application/json", addRandomSuffix: false });
}
