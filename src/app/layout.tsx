import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "李徳潤 ｜ Web制作 & 業務効率化（京田辺）",
  description: "地域の小さなお店・団体のためのホームページ制作・予約フォーム・業務効率化。京田辺の学生エンジニアが、手ごろに・速く・本番品質で。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
