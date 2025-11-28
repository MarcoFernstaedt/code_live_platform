import type { AxiosError } from "axios";

export const getDifficultyBadgeClass = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

/**
 * Safely extracts a human-readable error message
 * from Axios, Fetch, or unknown thrown values.
 */
export const getErrorMessage = (err: unknown): string => {
  // Axios error
  if (typeof err === "object" && err !== null && "isAxiosError" in err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    return (
      axiosErr.response?.data?.message ||
      axiosErr.message ||
      "An unexpected network error occurred."
    );
  }

  // Generic JS Error
  if (err instanceof Error) {
    return err.message || "An unknown error occurred.";
  }

  // Thrown string or unexpected type
  return typeof err === "string" ? err : "Unknown error.";
};