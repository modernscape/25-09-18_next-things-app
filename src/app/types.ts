// types.ts
export interface Thing {
  id: string; // Date.now().toString() で簡易ID
  title: string;
  items: string[];
  order: number;
  trashed: boolean;
}
