import '../globals.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { pb } from '@/@data/client';
import { userAtom } from '@/atoms/user';
import { UserRecord } from '@/@data/users.types';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { DevTools } from 'jotai-devtools';
import { jotaiStore } from '@/atoms/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Route = createRootRoute({
  component: () => (
    <>
      <UserUpdater />
      <Outlet />
      <DevtoolHandler />
    </>
  ),
});

function DevtoolHandler() {
  const [selected, setSelect] = useState('');
  return (
    import.meta.env.MODE === 'development' && (
      <div className="opacity-30 hover:opacity-100">
        <Select onValueChange={setSelect}>
          <SelectTrigger className="fixed bottom-24 right-4 w-[180px]">
            <SelectValue placeholder="Selected devtool" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem onClick={() => setSelect(0)} value="router">
              React Router
            </SelectItem>
            <SelectItem value="query">React Query</SelectItem>
            <SelectItem value="jotai">Jotai</SelectItem>
          </SelectContent>
        </Select>
        {selected === 'router' && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
        {selected === 'query' && <ReactQueryDevtools />}
        {selected === 'jotai' && (
          <DevTools store={jotaiStore} position="bottom-right" />
        )}
      </div>
    )
  );
}

function UserUpdater() {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    return pb.authStore.onChange((_, model) => {
      setUser(model as UserRecord);
    });
  }, [setUser]);

  return null;
}
