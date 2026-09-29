import { signal } from "@preact/signals";

// Kept in JavaScript memory for the current page only. Never write this key to storage.
export const sessionApiKey = signal("");
export const pendingDirectPrompt = signal("");
