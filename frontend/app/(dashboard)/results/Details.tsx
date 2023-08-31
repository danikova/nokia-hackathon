
'use client'

import { useUserWorkspace } from "@/lib/dataHooks"
import { WorkspaceDetails, WorkspaceExtraDetails } from "../_code/WorkspaceDetails"

export default function Details() {
  const workspace = useUserWorkspace()

  return <div className="mb-8">
    <h2 className='text-2xl col-span-full pb-8'>
      Details
    </h2>
    {workspace && <>
      <WorkspaceDetails workspace={workspace} />
      <WorkspaceExtraDetails workspace={workspace} />
    </>}
  </div>

}