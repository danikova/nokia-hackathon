'use client';

import { useEffect } from "react";
import { logoutFlow } from "../actions";

export default function EnforceLogout() {
  useEffect(() => {
    logoutFlow();
  }, []);

  return null;
}