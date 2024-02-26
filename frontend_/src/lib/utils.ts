import { twMerge } from "tailwind-merge";
import { enqueueSnackbar } from "notistack";
import { type ClassValue, clsx } from "clsx";
import { ClientResponseError } from "pocketbase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEditorUrl(repo_url: string, sha?: string) {
  const url = `https://vscode.dev/${repo_url.replace("https://github.com", "github")}`;
  if (!sha) return url;
  return `${url}${url.endsWith("/") ? "" : "/"}commit/${sha}`;
}

export async function pbSnackbarWrapper<T>(
  pbPromise: T,
  successMessage?: string
): Promise<T> {
  try {
    const result = await pbPromise;
    successMessage && enqueueSnackbar(successMessage, { variant: "success" });
    return result;
  } catch (error) {
    if (error instanceof ClientResponseError) {
      enqueueSnackbar(error.message, {
        variant: "error",
        preventDuplicate: true,
      });
    } else {
      enqueueSnackbar("Some unexpected error occured, sorry :(", {
        variant: "error",
        preventDuplicate: true,
      });
    }
    throw error;
  }
}
