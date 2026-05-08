import axios from "axios";
import type { ApiErrorResponse } from "@/api/types/api.types";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error ?? "Erro ao comunicar com o servidor.";
  }

  return "Erro inesperado.";
}

export function getApiErrorStatus(error: unknown): number | null {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.status ?? null;
  }

  return null;
}