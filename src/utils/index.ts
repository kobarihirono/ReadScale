// src/utils/index.ts

import { Book } from "@/types/index";

// 日付のフォーマットを変換する関数
const formatDate = (date: { seconds: number } | string): string => {
  if (!date) return "";
  if (typeof date === "object" && "seconds" in date) {
    return new Date(date.seconds * 1000).toISOString().split("T")[0];
  }
  if (typeof date === "string") {
    return date.split("T")[0];
  }
  return "";
};

export { formatDate };
