import { atom } from "jotai";
import { pb } from "@/@data/client";
import { UserRecord } from "@/@data/users.type";

export const userAtom = atom<UserRecord | null>(
  pb.authStore.model as UserRecord
);
