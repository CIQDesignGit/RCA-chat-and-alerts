// Shared types used across all alerts components

export type IssueType =
  | "lost-buy-box"
  | "star-rating"
  | "sov-drop"
  | "promo-badge"
  | "keyword-rank-drop";

export type Issue = {
  id: string;
  type: IssueType;
  title: string;
  description: string;
  analyst: string;
  timeAgo: string;
  status: "resolved" | "open";
};

export type AlertItem = {
  id: string;
  skuName: string;
  asin: string;
  accountId: string;
  category: string;
  brand: string;
  gapDollar: number;  // e.g. -46500
  gapUnits: number;   // e.g. -150
  tags: string[];     // e.g. ["Lost Buy Box", "Promo Badge"]
  date: string;       // e.g. "Today, 12 Apr"
  hasUnread?: boolean;
  issues: Issue[];
};
