// src/services/noteService.ts
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import type { Note, NoteTag } from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN as string;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Додаємо токен у кожен запит
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!token) {
      return config;
    }

    // Створюємо headers правильного типу
    const headers = new AxiosHeaders(config.headers);
    headers.set("Authorization", `Bearer ${token}`);

    config.headers = headers;

    return config;
  }
);

// ------------------ Типи ------------------

export interface FetchNotesParams {
  page?: number;       // номер сторінки
  perPage?: number;    // кількість нот на сторінці
  search?: string;     // пошук по title/content
  tag?: NoteTag;       // фільтр по тегу (опціонально)
  sortBy?: "created" | "updated"; // сортування (за потреби)
}

// Відповідь GET /notes
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Тіло запиту для створення нотатки
export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

// Відповідь POST /notes – бекенд повертає нотатку напряму
export type CreateNoteResponse = Note;

// Відповідь DELETE /notes/{id} – теж повертає нотатку
export type DeleteNoteResponse = Note;

// ------------------ HTTP-функції ------------------

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params,
  });
  return response.data;
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<CreateNoteResponse> => {
  const response: AxiosResponse<CreateNoteResponse> = await api.post(
    "/notes",
    payload
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> = await api.delete(
    `/notes/${id}`
  );
  return response.data;
};