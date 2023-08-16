'use client';

import { useEffect } from "react";
import { usePocketBase } from "../../lib/clientPocketbase";

export default function UserUpdater() {
  const pb = usePocketBase();

  useEffect(() => {
    const cancelKey = "authrefresh"
    pb.collection('users').authRefresh({ $cancelKey: cancelKey }).catch(() => { })
    return () => {
      pb.cancelRequest(cancelKey);
    }
  }, [pb]);

  return null;
}