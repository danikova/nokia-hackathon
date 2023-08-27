'use client';

import { useAtom } from "jotai";
import { useEffect } from "react";
import { usePocketBase, userModelAtom } from "../../lib/clientPocketbase";

export default function UserUpdater() {
  const pb = usePocketBase();
  const [_, setModel] = useAtom(userModelAtom);

  useEffect(() => {
    try {
      setModel(pb?.authStore?.model || null);
    } catch { }
  }, [setModel, pb]);

  useEffect(() => {
    const cancelKey = "authrefresh"
    pb.collection('users').authRefresh({ $cancelKey: cancelKey }).catch(() => { })
    pb.authStore.onChange((_, model) => {
      setModel(model);
    });
    return () => {
      pb.cancelRequest(cancelKey);
    }
  }, [setModel, pb]);

  return null;
}