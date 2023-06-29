'use client';

import { Menu, Transition } from '@headlessui/react';
import { ElementType, Fragment, ReactElement } from 'react';

export type MenuItem = {
  key: string;
  component: ({ active, disabled, close }: { active: boolean; disabled: boolean; close: () => void }) => ReactElement;
  menuItemProps?: {
    as?: ElementType;
    disabled?: boolean;
  };
};

type DropdownProps = {
  menuButton: ReactElement;
  menuItems: MenuItem[];
};

export default function Dropdown({ menuButton, menuItems }: DropdownProps) {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        {menuButton}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white drop-shadow-default focus:outline-none">
            {menuItems.map((item) => (
              <Menu.Item key={item.key} {...item?.menuItemProps}>
                {item.component}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
