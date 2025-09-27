import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Thing {
  id: string;
  title: string;
  items: { id: string; text: string }[];
  order: number;
  trashed: boolean;
}

interface ThingsState {
  things: Thing[];
  view: "all" | "trash";
  addThing: (title: string) => void;
  toggleTrash: (id: string) => void;
  setView: (view: "all" | "trash") => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  updateThingTitle: (id: string, newTitle: string) => void;
  addItem: (thingId: string) => void;
  updateItem: (thingId: string, itemId: string, newItem: string) => void;
}

export const useThingsStore = create<ThingsState>()(
  persist(
    (set, get) => ({
      things: [],
      view: "all",
      setView: (view: "all" | "trash") => set({ view }),
      addThing: (title: string) => {
        const newThing = {
          id: new Date().toISOString(),
          title,
          items: [],
          order: get().things.length + 1,
          trashed: false,
        };
        set({ things: [...get().things, newThing] });
      },
      toggleTrash: (id: string) => {
        set({
          things: get().things.map((t) => (t.id === id ? { ...t, trashed: !t.trashed } : t)),
        });
      },
      updateThingTitle: (id: string, newTitle: string) => {
        set((state) => ({
          things: state.things.map((t) => (t.id === id ? { ...t, title: newTitle } : t)),
        }));
      },
      moveUp: (id: string) => {
        const things = [...get().things];
        const index = things.findIndex((t) => t.id === id);
        if (index > 0) {
          [things[index - 1], things[index]] = [things[index], things[index - 1]];
          set({ things });
        }
      },
      moveDown: (id: string) => {
        const things = [...get().things];
        const index = things.findIndex((t) => t.id === id);
        [things[index + 1], things[index]] = [things[index], things[index + 1]];
        set({ things });
      },
      addItem: (thingId) =>
        set((state) => ({
          things: state.things.map((t) =>
            t.id === thingId ? { ...t, items: [...t.items, { id: Date.now().toString(), text: "new item" }] } : t
          ),
        })),
      updateItem: (thingId: string, itemId: string, newItem: string) => {
        set((state) => ({
          things: state.things.map((t) =>
            t.id === thingId
              ? {
                  ...t,
                  items:
                    newItem.trim() === ""
                      ? t.items.filter((item) => item.id !== itemId)
                      : t.items.map((item) => (item.id === itemId ? { ...item, text: newItem } : item)),
                }
              : t
          ),
        }));
      },
    }),
    {
      name: "things-storage", // localStorage に保存されるキー
    }
  )
);
