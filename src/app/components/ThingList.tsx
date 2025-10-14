// components/ThingList.tsx
"use client";

import { updateThing, addThing, addItem, updateItem, subscribeThings, moveThing } from "../lib/firestore";
import { useThingsStore } from "../store/thingsStore";
import { cva } from "class-variance-authority";
import AutoWidthInput from "./AutoWidthInput";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

const circleBtn = cva(
  "flex items-center justify-center rounded-full leading-none w-8 h-8 text-base bg-blue-500 text-white inline-block ml-2",
  {
    variants: {
      color: {
        blue: "bg-blue-500",
        red: "bg-pink-500",
      },
    },
    defaultVariants: {},
  }
);

export default function ThingList() {
  const things = useThingsStore((state) => state.things);
  const setThings = useThingsStore((state) => state.setThings);

  const view = useThingsStore((state) => state.view);

  const toggleTrash = useThingsStore((state) => state.toggleTrash);

  // []なので初回のみ実行
  useEffect(() => {
    const unsubscribe = subscribeThings(setThings);
    return () => unsubscribe();
  }, [setThings]);

  const [newTitle, setNewTitle] = useState("");

  const filtered = things.filter((t) => (view === "all" ? !t.trashed : t.trashed));

  return (
    <div style={{ padding: "1rem", flex: 1 }}>
      {view === "all" && (
        // （1）Thing追加フォーム
        <div style={{ marginBottom: "1rem" }} className="flex">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="新しいThingタイトル"
            style={{ marginRight: "0.5rem" }}
            className="w-100"
          />
          <button
            className="bg-slate-900 text-white px-6 py-2 rounded hover:opacity-50"
            onClick={() => {
              addThing(newTitle, things.length);
            }}
          >
            追加
          </button>
        </div>
      )}

      {/* （2）Thing一覧 */}
      {filtered.map((t, i) => (
        <div key={t.id} className="border border-[#ddd] p-2 mb-2">
          <div className=" text-3xl font-bold mb-4">
            {/* タイトル変更 */}
            <AutoWidthInput value={t.title} onConfirm={(val) => updateThing(t.id, { title: val })} font="inherit" />
          </div>
          {/* （3）アイテム一覧 */}
          <ul className="flex gap-4 mb-4 text-[20px]">
            {t.items.map((item) => {
              return (
                <li key={item.id}>
                  <AutoWidthInput value={item.text} onConfirm={(val) => updateItem(t.id, item.id, val)} font="inherit" />
                </li>
              );
            })}
            <button onClick={() => addItem(t.id)} className="text-blue-500 rounded-full border px-2 hover:opacity-50 flex items-center">
              ＋
            </button>
          </ul>

          {/* Thing「ゴミ箱（復元）」ボタン */}
          <div className="flex">
            <button className="rounded border p-1" onClick={() => toggleTrash(t.id)}>
              {t.trashed ? (
                "復元"
              ) : (
                <div className=" flex items-center gap-1">
                  <Trash />
                  ゴミ箱
                </div>
              )}
            </button>
            {i > 0 && (
              <button className={circleBtn({ color: "red" })} onClick={() => moveThing(t.id, true)}>
                ↑
              </button>
            )}
            {view === "all" && i < things.length - 1 && (
              <button className={circleBtn({ color: "blue" })} onClick={() => moveThing(t.id, false)}>
                ↓
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
