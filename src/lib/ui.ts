import { Lang } from "./content";

type Dict = {
  nav: { profile: string; services: string; works: string; price: string; contact: string; consult: string };
  brandCap: string;
  heroCtaConsult: string; heroCtaWorks: string;
  servicesTitle: string; servicesLead: string;
  worksTitle: string; worksLead: string;
  whyTitle: string; whyLead: string;
  processTitle: string;
  pricingTitle: string; pricingLead: string; colContent: string; colAmt: string; colFor: string;
  mailBtn: string;
  // profile
  back: string; expH: string; skillsH: string; langH: string; eduH: string;
  pfContactTitle: string; pfContactSub: string;
};

export const UI: Record<Lang, Dict> = {
  ja: {
    nav: { profile: "プロフィール", services: "できること", works: "実績", price: "料金", contact: "お問い合わせ", consult: "無料で相談する" },
    brandCap: "ごあいさつ・経歴はこちら →",
    heroCtaConsult: "まずは無料で相談", heroCtaWorks: "制作実績を見る →",
    servicesTitle: "できること", servicesLead: "「集客したい」「予約を受けたい」「この作業、毎回しんどい」。目的ベースで、必要なものだけ作ります。",
    worksTitle: "制作実績", worksLead: "“作れます”ではなく、“実際に本番で動いています”。",
    whyTitle: "選ばれる理由", whyLead: "大きな制作会社と、何もしないの“あいだ”にちょうどいい選択肢。",
    processTitle: "ご相談から公開まで",
    pricingTitle: "料金の目安", pricingLead: "内容によって変わります。まずは無料でご相談を。お見積りは無料です。", colContent: "内容", colAmt: "目安", colFor: "こんな方に",
    mailBtn: "メールで相談する",
    back: "← トップに戻る", expH: "職歴 / Experience", skillsH: "スキル / Skills", langH: "言語 / Languages", eduH: "学歴 / Education",
    pfContactTitle: "お気軽にご連絡ください。", pfContactSub: "お仕事のご相談・ご依頼はこちらまで。",
  },
  en: {
    nav: { profile: "Profile", services: "Services", works: "Work", price: "Pricing", contact: "Contact", consult: "Free consultation" },
    brandCap: "About me & resume →",
    heroCtaConsult: "Get a free consultation", heroCtaWorks: "See my work →",
    servicesTitle: "What I do", servicesLead: "“Attract customers”, “take bookings”, “this task is painful every time”. I build only what you need, around your goal.",
    worksTitle: "Selected work", worksLead: "Not just “I can build it” — it's actually live in production.",
    whyTitle: "Why me", whyLead: "The right middle ground between a big agency and doing nothing.",
    processTitle: "How we work",
    pricingTitle: "Pricing guide", pricingLead: "It depends on the scope. Let's talk first — quotes are free.", colContent: "What", colAmt: "From", colFor: "For whom",
    mailBtn: "Email me",
    back: "← Back to top", expH: "Experience", skillsH: "Skills", langH: "Languages", eduH: "Education",
    pfContactTitle: "Feel free to reach out.", pfContactSub: "For work inquiries, please contact me here.",
  },
  zh: {
    nav: { profile: "个人简介", services: "服务内容", works: "案例", price: "价格", contact: "联系", consult: "免费咨询" },
    brandCap: "个人简介・经历 →",
    heroCtaConsult: "先免费咨询", heroCtaWorks: "查看案例 →",
    servicesTitle: "服务内容", servicesLead: "“想吸引客流”“想接受预约”“这个工作每次都好累”。以目标为出发点，只做你真正需要的。",
    worksTitle: "案例", worksLead: "不只是“我会做”，而是“已经在正式运行”。",
    whyTitle: "为什么选择我", whyLead: "介于大型制作公司与什么都不做之间，刚刚好的选择。",
    processTitle: "从咨询到上线",
    pricingTitle: "价格参考", pricingLead: "依内容而定。欢迎先免费咨询，报价免费。", colContent: "内容", colAmt: "参考", colFor: "适合",
    mailBtn: "发邮件咨询",
    back: "← 返回首页", expH: "工作经历 / Experience", skillsH: "技能 / Skills", langH: "语言 / Languages", eduH: "教育经历 / Education",
    pfContactTitle: "欢迎随时联系。", pfContactSub: "工作咨询与委托请联系这里。",
  },
};
