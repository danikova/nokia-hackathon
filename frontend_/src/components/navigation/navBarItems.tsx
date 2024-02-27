import {
  FaCodeBranch,
  FaInfo,
  FaWrench,
  FaListOl,
  FaRankingStar,
} from 'react-icons/fa6';
import { NavBarItem } from './types';

export const navBarItems: readonly NavBarItem[] = [
  {
    icon: <FaInfo className="h-6 w-6" />,
    title: 'Info',
    rootPath: '/info',
    description:
      ' The Info page serves as a starting point and provides essential information about the competition for users to learn more.',
    shortDescription: 'Essential competition information.',
  },
  {
    icon: <FaCodeBranch className="h-6 w-6" />,
    title: 'Workspace results',
    rootPath: '/results',
    description:
      'The Workspace Result page is where users can view the outcomes and results of their workspaces. It may display statistics or data generated by user actions.',
    shortDescription: 'View workspace outcomes & stats.',
  },
  {
    icon: <FaListOl className="h-6 w-6" />,
    title: 'Scoreboard',
    rootPath: '/scoreboard',
    description:
      'The Scoreboard page is where users can access an anonym leaderboard and it allows users to see how they or others are performing in comparison to competitors.',
    shortDescription: 'Check the anonym leaderboard.',
  },
  {
    icon: <FaWrench className="h-6 w-6" />,
    title: 'Settings',
    rootPath: '/settings',
    description:
      'The Settings page is where users can configure some application related settings according to their preferences.',
  },
] as const;

export const staffNavBarItems: readonly NavBarItem[] = [
  {
    icon: <FaRankingStar className="h-6 w-6" />,
    title: 'Ranking',
    rootPath: '/ranking',
    description:
      'The Ranking page is a section dedicated to staff members. It provides insights into user rankings, performance metrics, or statistics related to the registered workspaces.',
    shortDescription: 'Staff-only workspace insights.',
  },
] as const;
