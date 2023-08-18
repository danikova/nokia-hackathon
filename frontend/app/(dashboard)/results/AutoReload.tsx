'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import { usePocketBase } from "@/lib/clientPocketbase";

const debounceDelay = Math.random() * 1000 + 1000;

function useRunResultsRealtime() {
  const pb = usePocketBase();
  const router = useRouter();
  const [updateCount, setUpdateCount] = useState(0);
  const debouncedUpdateCount = useDebounce(updateCount, debounceDelay);

  useEffect(() => {
    if (debouncedUpdateCount > 0) {
      router.refresh();
      setUpdateCount(0);
    }
  }, [debouncedUpdateCount, router]);

  useEffect(() => {
    let unsub: any;
    async function sub() {
      unsub = await pb.collection('run_results').subscribe('*', () => setUpdateCount(old => old + 1));
    }

    sub();
    return () => {
      unsub && unsub();
    }
  }, [pb]);
}

export function AutoReload() {
  useRunResultsRealtime();
  return null;
}