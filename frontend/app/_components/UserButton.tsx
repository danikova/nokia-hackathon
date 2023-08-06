'use client';

import { BiLogOut } from 'react-icons/bi';
import { Admin, Record } from "pocketbase";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { logoutFlow } from "../(authentication)/actions";
import { usePocketBase } from "../_lib/clientPocketbase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UserButton() {
  const router = useRouter();
  const pb = usePocketBase();
  const [model, setModel] = useState<Record | Admin | null>(null);
  const name = useMemo(() => model?.name || model?.username, [model]);
  const fallback = useMemo(() => {
    if (!name) return null;
    const parts = name.split(' ');
    if (parts.length === 1) {
      return name[0].toUpperCase() + name[1].toUpperCase();
    } else {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
  }, [name]);

  useEffect(() => {
    pb.authStore.onChange((_, model) => {
      setModel(model)
    });
  }, [pb, setModel]);

  const logout = useCallback(() => {
    pb.authStore.clear();
    logoutFlow();
    router.push('/login');
    enqueueSnackbar('Successful logout', { variant: 'success' });
  }, [router, pb]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='h-8 w-8 rounded-full'>
        <Avatar>
          <AvatarImage src={model?.avatarUrl} alt={model?.email} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-4'>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p>{name}</p>
            <p className='text-[13px] -mt-1 opacity-75'>{model?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <BiLogOut className="w-5 h-5 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}