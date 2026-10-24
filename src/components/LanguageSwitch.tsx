"use client";

const LABELS: Record<string, string> = { ja: "日本語", zh: "中文", en: "EN" };

export default function LanguageSwitch({ current }: { current: string }) {
  function set(l: string) {
    document.cookie = `lang=${l};path=/;max-age=31536000`;
    location.reload();
  }
  return (
    <div className="lang" role="group" aria-label="Language">
      {(["ja", "zh", "en"] as const).map((l) => (
        <button key={l} type="button" onClick={() => set(l)} aria-pressed={current === l}
          className={current === l ? "on" : ""}>{LABELS[l]}</button>
      ))}
    </div>
  );
}
