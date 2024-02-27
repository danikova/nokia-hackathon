import { useGlobals } from '@/@data/globals';
import Details from './details';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import BreadCrumb from '@/components/navigation/breadCrumb';
import { navBarItems } from '@/components/navigation/navBarItems';
import { useIsWorkspaceBusy } from '@/@data/workspaceEvents';

function Spacer() {
  return <div className="w-1"></div>;
}

export default function FirstSteps() {
  const globals = useGlobals();
  const isLoading = useIsWorkspaceBusy();
  const [showHoverCard, setShowHoverCard] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setShowHoverCard(true);
    }, 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <HoverCard open={showHoverCard}>
      <div className="m-16 max-md:m-8">
        <BreadCrumb items={[navBarItems[1]]} />
        <h2 className="col-span-full pb-8 text-2xl">First steps</h2>
        <ul className="pb-8">
          <li className="flex flex-wrap whitespace-nowrap">
            You need to create a new
            <Spacer />
            <span className="font-bold">public repository</span>
            <Spacer />
            by using this
            <Spacer />
            <Link
              to={globals.primary_project || 'https://github.com'}
              className="text-primary hover:underline"
            >
              repo
            </Link>
            <Spacer />
            as a template
          </li>
          <li className="flex flex-wrap items-center whitespace-nowrap">
            You should create a new repository by clicking this button
            <Spacer />
            <Link to={globals.primary_project || 'https://github.com'}>
              <img
                className="min-w-[150px]"
                src={'/use-this-template-btn.png'}
                width={150}
                height={30}
              />
              <Spacer />
            </Link>
            <Spacer />
            and filling up the necessary details for repository creation
          </li>
          <li className="flex flex-wrap whitespace-nowrap">
            After creating the repository, you should go to
            <Spacer />
            <Link to="/settings" className="text-primary hover:underline">
              /settings
            </Link>
            <Spacer />
            and set your repo in the
            <Spacer />
            <span className="font-semibold">Used repo</span>
            <Spacer />
            section
          </li>
          <li className="flex flex-wrap">
            Then you can use this repo to solve the task in your new repository
          </li>
        </ul>
        <Details />
        <h2 className="col-span-full pb-8 text-2xl">
          {isLoading
            ? 'Please be patient while we are loading your first run results...'
            : 'There are no registered run results, you should commit your first change'}
        </h2>
        <HoverCardTrigger className="fixed bottom-[170px]" />
        <HoverCardContent align="start">
          You can find the Settings navigation menu on the lower left corner of
          the page
        </HoverCardContent>
      </div>
    </HoverCard>
  );
}
