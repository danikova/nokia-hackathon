import { ReactElement } from 'react';
import { FaCodeBranch, FaCircleInfo, FaList, FaWrench } from 'react-icons/fa6';

export type NavBarItem = {
  icon: ReactElement;
  title: string;
  rootPath: string;
};

export const navBarItems: readonly NavBarItem[] = [
  {
    icon: <FaCircleInfo className="h-6 w-6" />,
    title: 'Info',
    rootPath: '/info',
  },
  {
    icon: <FaCodeBranch className="h-6 w-6" />,
    title: 'Code',
    rootPath: '/code',
  },
  {
    icon: <FaList className="h-6 w-6" />,
    title: 'Results',
    rootPath: '/results',
  },
  {
    icon: <FaWrench className="h-6 w-6" />,
    title: 'Settings',
    rootPath: '/settings',
  },
] as const;
