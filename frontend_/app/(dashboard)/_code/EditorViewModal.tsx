'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Workspace } from '@/lib/dataHooks';
import { SyntheticEvent, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WorkspaceDetails } from './WorkspaceDetails';

export default function EditorViewModal({ workspace }: { workspace: Workspace | null }) {
  const router = useRouter();
  const onCancel = useCallback((e: SyntheticEvent) => {
    router.back();
  }, [router]);
  const isRepoUrlSet = useMemo(() => !!workspace?.repo_url, [workspace]);

  return (
    <Dialog open={true}>
      <DialogContent hideCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Editor view</DialogTitle>
          <DialogDescription>
            You can open the workspace in the online editor by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <div className='my-4'>
          <span>Workspace details</span>
          {
            workspace && <div className="text-sm">
              <WorkspaceDetails workspace={workspace} />
            </div>
          }
        </div>
        <DialogFooter>
          <Button onClick={onCancel} variant='secondary'>
            Go back
          </Button>
          <Button disabled={!isRepoUrlSet}>
            {workspace?.repo_url && <Link href={`https://vscode.dev/${workspace?.repo_url}`}>
              Open workspace editor
            </Link>}
            {!workspace?.repo_url && <div>Open workspace editor</div>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

