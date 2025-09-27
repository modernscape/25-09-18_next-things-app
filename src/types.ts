export interface Thing {
  id: string;
  title: string;
  items: { id: string; text: string }[];
  order: number;
  trashed: boolean;
  createdAt: Date;
}
