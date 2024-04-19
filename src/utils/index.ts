// src/utils/index.ts

const formatDate = (date) => {
  if (!date) return "";
  if (date.seconds) {
    return new Date(date.seconds * 1000).toISOString().split("T")[0];
  }
  if (typeof date === "string") {
    return date.split("T")[0];
  }
  return "";
};

export { formatDate };
