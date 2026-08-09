// hooks/useShare.ts
"use client";

import { useCallback } from "react";

interface ShareInput {
  title: string;
  text?: string;
  url?: string;
}

interface ShareOptions {
  onCopied?: () => void;
  onError?: (error: unknown) => void;
}

export function useShare(opts: ShareOptions = {}) {
  const { onCopied, onError } = opts;

  return useCallback(
    async (input: ShareInput) => {
      const shareUrl =
        input.url || (typeof window !== "undefined" ? window.location.href : "");
      const shareData = {
        title: input.title,
        text: input.text,
        url: shareUrl,
      };

      if (typeof navigator !== "undefined" && "share" in navigator) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          if ((error as { name?: string })?.name === "AbortError") return;
          // Fall through to clipboard
        }
      }

      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
          onCopied?.();
        }
      } catch (error) {
        onError?.(error);
      }
    },
    [onCopied, onError],
  );
}

export default useShare;