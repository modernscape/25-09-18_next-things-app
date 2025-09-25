// dummyData.ts
import { Thing } from "./types";

export const dummyThings: Thing[] = [
  { id: Date.now().toString(), title: "Thing 1", items: ["item1", "item2"], order: 1, trashed: false },
  { id: (Date.now() + 1).toString(), title: "Thing 2", items: ["itemA"], order: 2, trashed: false },
  { id: (Date.now() + 2).toString(), title: "Trashed Thing", items: [], order: 3, trashed: true },
];
