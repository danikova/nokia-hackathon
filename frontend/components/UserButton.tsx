'use client';

import { cn } from '@/lib/utils';
import { BiLogOut } from 'react-icons/bi';
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { minidenticon } from 'minidenticons';
import { useCallback, useMemo } from "react";
import { usePocketBase } from "lib/clientPocketbase";
import { User, useUserModel } from '@/lib/dataHooks';
import { logoutFlow } from "app/(authentication)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from './ui/skeleton';

export default function UserButton() {
  const router = useRouter();
  const pb = usePocketBase();
  const model = useUserModel();
  const name = useMemo(() => model?.name || model?.username, [model]);

  const logout = useCallback(() => {
    pb.authStore.clear();
    logoutFlow();
    router.push('/login');
    enqueueSnackbar('Successful logout', { variant: 'success' });
  }, [router, pb]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='h-8 w-8 rounded-full'>
        {model ? <UserAvatar user={model} /> : <Skeleton className='h-8 w-8 rounded-full' />}
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

export function UserAvatar({ user, className }: { user: User, className?: string }) {
  const name = useMemo(() => user?.name || user?.username, [user]);
  const fallback = useMemo(() => {
    if (!name) return null;
    const parts = name.split(' ');
    if (parts.length === 1) {
      return name[0].toUpperCase();
    } else {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
  }, [name]);

  const avatarURI = useMemo(
    () => {
      if (user?.avatarUrl)
        return user?.avatarUrl;
      else
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(name, 100, 50))
    },
    [name, user]
  );

  return (
    <Avatar className={cn('bg-background', className)}>
      <AvatarImage src={avatarURI} alt={name} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}