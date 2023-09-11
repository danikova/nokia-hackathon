'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Workspace } from '@/lib/dataHooks';
import WindowLink from '@/components/FloatingWindowService';

function MissingRepoUrl() {
  return (
    <div className='text-sm'>
      Currently there are no repo url set in this workspace, please go to the <Link href='/settings' className='text-primary hover:underline'>/settings</Link> and set it correctly.
    </div>
  );
}

export function WorkspaceDetails({ workspace, shortVersion = false }: { workspace: Workspace; shortVersion?: boolean }) {
  const isRepoUrlSet = useMemo(() => !!workspace?.repo_url, [workspace]);
  const url = workspace?.repo_url || '';
  const actionsUrl = url + (url.endsWith('/') ? 'actions' : '/actions');
  const editorUrl = useMemo(() => `https://vscode.dev/${workspace.repo_url.replace('https://github.com', 'github')}`, [workspace]);

  return (
    <>
      {
        isRepoUrlSet ?
          <>
            <p>
              {!shortVersion ? 'Repo url: ' : ''}
              <Link href={url} className='text-primary hover:underline'>{!shortVersion ? url : 'Repo url'}</Link>
            </p>
            <p>
              {!shortVersion ? 'Actions url: ' : ''}
              <Link href={actionsUrl} className='text-primary hover:underline'>{!shortVersion ? actionsUrl : 'Actions url'}</Link>
            </p>
            <p className='flex gap-1'>
              {!shortVersion ? 'Open editor: ' : ''}
              <Link href={editorUrl} className='flex gap-1 text-primary hover:underline'>
                {!shortVersion ? editorUrl : 'Open editor'}
                <WindowLink url={editorUrl} side='right' />
              </Link>
            </p>
          </> :
          <MissingRepoUrl />
      }
    </>
  );
}
