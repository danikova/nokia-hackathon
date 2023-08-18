'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrevious } from "@uidotdev/usehooks";
import { useIsWorkspaceBusy } from "@/lib/dataHooks";

export function AutoReload() {
  const router = useRouter();
  const isLoading = useIsWorkspaceBusy();
  const prevIsLoading = usePrevious(isLoading);

  useEffect(() => {
    if (prevIsLoading !== undefined && prevIsLoading && !isLoading) {
      router.refresh();
    }
  }, [isLoading, prevIsLoading, router]);

  return null;
}