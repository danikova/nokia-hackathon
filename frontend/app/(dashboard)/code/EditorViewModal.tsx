'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Workspace } from '@/lib/dataHooks';
import { SyntheticEvent, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function EditorViewModal({ workspace }: { workspace: Workspace | null }) {
  const router = useRouter();
  const onCancel = useCallback((e: SyntheticEvent) => {
    router.back();
  }, [router]);
  const isRepoUrlSet = useMemo(() => !!workspace?.repo_url, [workspace]);

  const url = workspace?.repo_url || '';
  const actionsUrl = url + (url.endsWith('/') ? 'actions' : '/actions')

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
          {isRepoUrlSet && <>
            <span>Workspace details</span>
            <div className="text-sm">
              <p>
                Repo url: <Link href={url} className='text-primary hover:underline'>{url}</Link>
              </p>
              <p>
                Actions url: <Link href={actionsUrl} className='text-primary hover:underline'>{actionsUrl}</Link>
              </p>
            </div>
          </>}
          {!isRepoUrlSet && <p className="text-sm">
            Currently there are no repo url set in this workspace, please go to the <Link href='/settings' className='text-primary hover:underline'>/settings</Link> and set it correctly.
          </p>}
        </div>
        <DialogFooter>
          <Button onClick={onCancel} variant='secondary'>
            Cancel
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
