import { BiLogOut } from 'react-icons/bi';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/user';
import { useLogout } from '@/lib/hooks';
import { UserAvatar } from './userAvatar';

export default function UserButton() {
  const logoutFlow = useLogout();
  const model = useAtomValue(userAtom);
  const name = useMemo(() => model?.name || model?.username, [model]);

  const logout = useCallback(() => {
    logoutFlow();
    enqueueSnackbar('Successful logout', { variant: 'success' });
  }, [logoutFlow]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 rounded-full">
        {model ? (
          <UserAvatar user={model} />
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 w-[300px]">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p>{name}</p>
            <p className="-mt-1 text-[13px] opacity-75">{model?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <BiLogOut className="mr-2 h-5 w-5" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
