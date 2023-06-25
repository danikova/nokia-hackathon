import { IconType } from 'react-icons';
import { FaCodeBranch, FaCircleInfo, FaList, FaWrench } from 'react-icons/fa6';

export const navBarItems: {
  icon: IconType;
  title: string;
}[] = [
  {
    icon: FaCircleInfo,
    title: 'Info',
  },
  {
    icon: FaCodeBranch,
    title: 'Code',
  },
  {
    icon: FaList,
    title: 'Result',
  },
  {
    icon: FaWrench,
    title: 'Settings',
  },
];
