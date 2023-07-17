'use client';

import Image from 'next/image';
import { Menu } from '@headlessui/react';
import { setPBCookie, usePocketBase } from '../_lib/clientPocketbase';
import Dropdown, { MenuItem, DropdownProps } from './inputs/Dropdown';
import { useEffect, useMemo, useState } from 'react';
import { FaUserLarge } from 'react-icons/fa6';
import { BiLogOut } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import type { Record, Admin } from "pocketbase"

type UserAvatarProps = {
  className?: string;
  dropdownProps?: Pick<DropdownProps, 'menuItemsClass'>;
};

export default function UserAvatar({ className, dropdownProps }: UserAvatarProps) {
  const pb = usePocketBase();
  const [model, setModel] = useState<Record | Admin | null>(null);

  useEffect(() => {
    pb.collection('users').authRefresh()
    pb.authStore.onChange((_, model) => {
      setModel(model)
    });
  }, [pb, setModel])

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        key: 'logout',
        component: LogoutButton,
      },
    ],
    []
  );

  const menuButton = useMemo(() => {
    console.log(model)
    if (model?.avatarUrl) {
      return (
        <Menu.Button className="focus:ring-4 focus:outline-none focus:ring-blue-300">
          <Image height={40} width={40} className="w-8 h-8 rounded-full" src={model?.avatarUrl} alt={model?.email} />
        </Menu.Button>
      );
    } else {
      return (
        <Menu.Button className="flex relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 justify-center items-end">
          <FaUserLarge className="w-6 h-6 text-primary_text" />
        </Menu.Button>
      );
    }
  }, [model]);
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Dropdown menuButton={menuButton} menuItems={menuItems} {...dropdownProps} />
    </div>
  );
}

function LogoutButton({ active }: { active: boolean }) {
  const router = useRouter();
  const pb = usePocketBase();

  return (
    <button
      className={`flex min-w-full px-4 py-2 rounded-md ${active ? 'bg-primary-50 text-primary-700' : ''}`}
      onClick={() => {
        pb.authStore.clear();
        setPBCookie(pb);
        router.push('/');
      }}
    >
      <BiLogOut className="w-6 h-6 mr-2" />
      Logout
    </button>
  );
}
