'use client'

import { useAtom } from 'jotai';
import { FaChevronRight } from 'react-icons/fa';
import { globalBreadCrumbAtom } from './navigation/NavBarItem';
import Link from 'next/link';

export default function TitleBar() {
  const [globalBreadCrumb] = useAtom(globalBreadCrumbAtom);

  return (
    <div className="h-[--cm-titlebar-h] w-full bg-secondary-bg/50 px-6 drop-shadow-default backdrop-blur-sm">
      <div className="min-h-full flex items-center text-xl max-md:text-base gap-2">
        {globalBreadCrumb.map((bcItem, i) => {
          const isLast = i === (globalBreadCrumb.length - 1);
          const titleItem = bcItem.rootPath && !isLast ?
            <Link key={bcItem.title} href={bcItem.rootPath}>{bcItem.title}</Link> :
            <div key={bcItem.title}>{bcItem.title}</div>;

          return <>
            {titleItem}
            {!isLast && <FaChevronRight key={`${bcItem.title}-chevron`} />}
          </>
        })}
      </div>
    </div >
  );
}
