export interface Message {
  role: "user" | "assistant";
  content: string;

  sources?: {
    source: string;
    page: number;
    content: string;
  }[];
}