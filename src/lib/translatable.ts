import type { Content } from "./content";

// 翻訳対象の文字列だけを順番に取り出し、翻訳結果で組み立て直す。
// email / URL / stack / skills / icon / accent / image / photo / name は対象外。
export function extract(src: Content) {
  const clone: Content = JSON.parse(JSON.stringify(src));
  const texts: string[] = [];
  const setters: ((v: string) => void)[] = [];
  const add = (val: string, set: (v: string) => void) => { texts.push(val ?? ""); setters.push(set); };

  add(clone.tagline, (v) => (clone.tagline = v));
  add(clone.hero.eyebrow, (v) => (clone.hero.eyebrow = v));
  add(clone.hero.title, (v) => (clone.hero.title = v));
  add(clone.hero.sub, (v) => (clone.hero.sub = v));
  clone.hero.metrics.forEach((m) => { add(m.n, (v) => (m.n = v)); add(m.l, (v) => (m.l = v)); });
  add(clone.strip, (v) => (clone.strip = v));
  clone.services.forEach((s) => { add(s.title, (v) => (s.title = v)); add(s.desc, (v) => (s.desc = v)); });
  clone.works.forEach((w) => {
    add(w.tag, (v) => (w.tag = v)); add(w.title, (v) => (w.title = v)); add(w.sub, (v) => (w.sub = v));
    w.points.forEach((p, i) => add(p, (v) => (w.points[i] = v)));
    (w.steps || []).forEach((s) => { add(s.title, (v) => (s.title = v)); add(s.desc, (v) => (s.desc = v)); });
  });
  clone.why.forEach((x) => { add(x.title, (v) => (x.title = v)); add(x.desc, (v) => (x.desc = v)); });
  clone.process.forEach((x) => { add(x.title, (v) => (x.title = v)); add(x.desc, (v) => (x.desc = v)); });
  clone.pricing.forEach((x) => { add(x.svc, (v) => (x.svc = v)); add(x.amt, (v) => (x.amt = v)); add(x.note, (v) => (x.note = v)); });
  add(clone.pricingNote, (v) => (clone.pricingNote = v));
  add(clone.contact.title, (v) => (clone.contact.title = v));
  add(clone.contact.sub, (v) => (clone.contact.sub = v));
  const pf = clone.profile;
  add(pf.headline, (v) => (pf.headline = v));
  add(pf.summary, (v) => (pf.summary = v));
  pf.experience.forEach((e) => { add(e.role, (v) => (e.role = v)); add(e.org, (v) => (e.org = v)); add(e.period, (v) => (e.period = v)); e.points.forEach((p, i) => add(p, (v) => (e.points[i] = v))); });
  pf.education.forEach((e) => { add(e.school, (v) => (e.school = v)); add(e.detail, (v) => (e.detail = v)); add(e.period, (v) => (e.period = v)); });
  (pf.languages || []).forEach((l, i) => add(l, (v) => (pf.languages[i] = v)));

  return {
    texts,
    apply: (translated: string[]): Content => {
      translated.forEach((v, i) => { if (i < setters.length) setters[i](v ?? texts[i]); });
      return clone;
    },
  };
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
