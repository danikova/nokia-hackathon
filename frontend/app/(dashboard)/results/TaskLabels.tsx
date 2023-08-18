'use client'

import Spinner from "@/app/_components/Spinner";
import { useIsWorkspaceBusy } from "@/lib/dataHooks";

export function TaskLabels({ taskKeys }: { taskKeys: string[] }) {
  const isLoading = useIsWorkspaceBusy();

  return <>
    {taskKeys.map((key) => <div key={key} className='text-lg flex justify-between'>
      <div>{key}</div>
      {isLoading && <div className="h-5 w-5"><Spinner /></div>}
    </div>)}
  </>
}