import React from "react";

// 現場が欲しがる"機能"を表すラインアイコン集。キーを content に保存し、言語に依存しない。
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const FEATURE_ICONS: Record<string, React.ReactNode> = {
  lock: <svg viewBox="0 0 24 24" {...S}><rect x="4.5" y="10.5" width="15" height="9.5" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></svg>,
  shield: <svg viewBox="0 0 24 24" {...S}><path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>,
  users: <svg viewBox="0 0 24 24" {...S}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" /><path d="M16.5 5.2a3.2 3.2 0 0 1 0 6.1" /><path d="M18 14.3c2 .7 3.4 2.3 3.4 4.7" /></svg>,
  bolt: <svg viewBox="0 0 24 24" {...S}><path d="M13 3L5 13.5h6L10 21l8.5-10.5H12L13 3Z" /></svg>,
  check: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.3 2.3L15.5 9.7" /></svg>,
  globe: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.8 2.8 2.8 15.2 0 18M12 3c-2.8 2.8-2.8 15.2 0 18" /></svg>,
  bell: <svg viewBox="0 0 24 24" {...S}><path d="M18 16.5V11a6 6 0 1 0-12 0v5.5L4 18.5h16L18 16.5Z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></svg>,
  dashboard: <svg viewBox="0 0 24 24" {...S}><rect x="4" y="4" width="7" height="7" rx="1.3" /><rect x="13" y="4" width="7" height="4.5" rx="1.3" /><rect x="13" y="11" width="7" height="9" rx="1.3" /><rect x="4" y="13.5" width="7" height="6.5" rx="1.3" /></svg>,
  card: <svg viewBox="0 0 24 24" {...S}><rect x="3" y="5" width="18" height="14" rx="2.2" /><path d="M3 10h18" /><path d="M7 15h4" /></svg>,
  map: <svg viewBox="0 0 24 24" {...S}><path d="M9 4L3 6.2v14L9 18l6 2 6-2.2V3.8L15 6 9 4Z" /><path d="M9 4v14M15 6v14" /></svg>,
  sparkle: <svg viewBox="0 0 24 24" {...S}><path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.9L12 3Z" /><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" /></svg>,
  calendar: <svg viewBox="0 0 24 24" {...S}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></svg>,
  image: <svg viewBox="0 0 24 24" {...S}><rect x="3" y="4.5" width="18" height="15" rx="2" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M20.5 15.5l-5-5L5 19.5" /></svg>,
  gauge: <svg viewBox="0 0 24 24" {...S}><path d="M4 19a8 8 0 1 1 16 0" /><path d="M12 19v-.5M12 19l3.5-5" /></svg>,
  database: <svg viewBox="0 0 24 24" {...S}><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" /><path d="M4.5 5.5v13c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8v-13" /><path d="M4.5 12c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8" /></svg>,
  rocket: <svg viewBox="0 0 24 24" {...S}><path d="M5 14c-1 1.5-1.2 4.5-1.2 4.5s3-.2 4.5-1.2" /><path d="M14.5 4.5c3 1 4 2 4.5 4.5-.5 3-4 6.5-7.5 8L8 14l.5-3.5c1.5-3.5 5-6 6-6Z" /><circle cx="14.5" cy="9.5" r="1.4" /></svg>,
};

export const FEATURE_ICON_KEYS = Object.keys(FEATURE_ICONS);
