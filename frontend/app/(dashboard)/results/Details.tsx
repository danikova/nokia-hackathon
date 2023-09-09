
'use client'

import { useUserWorkspace } from "@/lib/dataHooks"
import { WorkspaceDetails, WorkspaceExtraDetails } from "../_code/WorkspaceDetails"
import { Skeleton } from "@/components/ui/skeleton"

export default function Details() {
  const workspace = useUserWorkspace();

  return <div className="mb-8">
    <h2 className='text-2xl col-span-full pb-[31px]'>
      Details
    </h2>
    {workspace ? <>
      <WorkspaceDetails workspace={workspace} />
      <WorkspaceExtraDetails workspace={workspace} />
    </> : <div>
      <Skeleton className='h-[19px] w-[400px] mb-2' />
      <Skeleton className='h-[19px] w-[450px] mb-2' />
      <Skeleton className='h-[19px] w-[150px]' />
    </div>

    }
  </div>

}