export interface CheckItem {
  id: string;
  priority: number;
  description: string;
  result?: "yes" | "no" | any;
  disabled?: boolean;
}
