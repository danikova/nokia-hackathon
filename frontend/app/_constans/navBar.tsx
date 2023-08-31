import { ReactElement } from 'react';
import { FaCodeBranch, FaCircleInfo, FaListUl, FaWrench, FaListOl, FaRankingStar } from 'react-icons/fa6';

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
  // {
  //   icon: <FaCodeBranch className="h-6 w-6" />,
  //   title: 'Code',
  //   rootPath: '/code',
  // },
  {
    icon: <FaCodeBranch className="h-6 w-6" />,
    title: 'Workspace results',
    rootPath: '/results',
  },
  {
    icon: <FaListOl className="h-6 w-6" />,
    title: 'Scoreboard',
    rootPath: '/scoreboard',
  },
  {
    icon: <FaWrench className="h-6 w-6" />,
    title: 'Settings',
    rootPath: '/settings',
  },
] as const;

export const staffNavBarItems: readonly NavBarItem[] = [
  {
    icon: <FaRankingStar className="h-6 w-6" />,
    title: 'Ranking',
    rootPath: '/ranking',
  }
] as const;