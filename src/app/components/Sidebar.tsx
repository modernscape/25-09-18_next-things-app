// components/Sidebar.tsx
"use client";
import { useThingsStore } from "../store/thingsStore";
import { Trash } from "lucide-react";

export default function Sidebar() {
  const view = useThingsStore((state) => state.view);
  const setView = useThingsStore((state) => state.setView);
  const style_1 = "text-3xl flex items-center justify-center";

  return (
    <div className="flex flex-col text-left w-[200px] border-r border-gray-300 flex-none h-screen pt-4">
      <button onClick={() => setView("all")} style={{ fontWeight: view === "all" ? "bold" : "normal" }} className="text-3xl mb-4">
        One Thing
      </button>
      <button onClick={() => setView("trash")} style={{ fontWeight: view === "trash" ? "bold" : "normal" }} className={style_1}>
        <Trash />
        ゴミ箱
      </button>
    </div>
  );
}
