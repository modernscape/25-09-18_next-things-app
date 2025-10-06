// components/ThingList.tsx
"use client";

import { useState } from "react";
import { useThingsStore } from "../store/thingsStore_new";
import { cva } from "class-variance-authority";
import AutoWidthInput from "./AutoWidthInput";
import { Trash } from "lucide-react";

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
  const view = useThingsStore((state) => state.view);
  const addThing = useThingsStore((state) => state.addThing);
  const toggleTrash = useThingsStore((state) => state.toggleTrash);
  const moveUp = useThingsStore((state) => state.moveUp);
  const moveDown = useThingsStore((state) => state.moveDown);
  const updateThingTitle = useThingsStore((state) => state.updateThingTitle);
  const [newTitle, setNewTitle] = useState("");
  const addItem = useThingsStore((state) => state.addItem);
  const updateItem = useThingsStore((state) => state.updateItem);

  const filtered = things.filter((t) => (view === "all" ? !t.trashed : t.trashed));

  return (
    <div style={{ padding: "1rem", flex: 1 }}>
      {view === "all" && (
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
              if (newTitle.trim()) {
                addThing(newTitle.trim());
                setNewTitle("");
              }
            }}
          >
            追加
          </button>
        </div>
      )}

      {filtered.map((t, i) => (
        <div key={t.id} className="border border-[#ddd] p-2 mb-2">
          <div className=" text-3xl font-bold mb-4">
            <AutoWidthInput value={t.title} onConfirm={(val) => updateThingTitle(t.id, val)} font="inherit" />
          </div>
          {/* <input
            className="text-2xl font-bold"
            type="text"
            defaultValue={t.title}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = e.target as HTMLInputElement;
                updateThingTitle(t.id, target.value);
                target.blur();
              }
            }}
          /> */}
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
              <button className={circleBtn({ color: "red" })} onClick={() => moveUp(t.id)}>
                ↑
              </button>
            )}
            {view === "all" && i < things.length - 1 && (
              <button className={circleBtn({ color: "blue" })} onClick={() => moveDown(t.id)}>
                ↓
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
