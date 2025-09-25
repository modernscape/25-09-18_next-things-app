// app/layout.tsx
import "./globals.css"; // グローバルスタイル
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "One Thing",
  description: "Zustandで管理するThingsアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <div className="flex">
          <Sidebar />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
