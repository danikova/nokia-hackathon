import { useAtom } from 'jotai';
import { Tooltip, TooltipContent } from '../ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import { Link } from '@tanstack/react-router';
import {
  globalBreadCrumbAtom,
  globelBredCrumbChildrenAtom,
} from '@/atoms/breadcrumbs';

export default function BredCrumbDisplay() {
  const [globalBreadCrumb] = useAtom(globalBreadCrumbAtom);
  const [children] = useAtom(globelBredCrumbChildrenAtom);

  const description =
    globalBreadCrumb[globalBreadCrumb.length - 1]?.description;

  return (
    <div className="h-[--cm-titlebar-h] w-full bg-secondary/50 px-6 drop-shadow-default backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-between text-xl max-md:text-base">
        <div>
          <div className="flex items-center gap-2">
            {globalBreadCrumb.map((bcItem, i) => {
              const isLast = i === globalBreadCrumb.length - 1;
              const titleItem =
                bcItem.rootPath && !isLast ? (
                  <Link key={bcItem.title} href={bcItem.rootPath}>
                    {bcItem.title}
                  </Link>
                ) : (
                  <div key={bcItem.title}>{bcItem.title}</div>
                );

              return [
                titleItem,
                !isLast && <FaChevronRight key={`${bcItem.title}-chevron`} />,
              ];
            })}
            {!!description && (
              <Tooltip>
                <TooltipTrigger>
                  <FaInfoCircle className="opacity-30" />
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" alignOffset={-120}>
                  {description}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
