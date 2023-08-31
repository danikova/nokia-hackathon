'use client';

import Link from 'next/link';
import { Workspace } from '@/lib/dataHooks';
import { useEffect, useMemo, useRef } from 'react';

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

  return (
    <>
      {isRepoUrlSet && <>

        <p>
          {!shortVersion ? 'Repo url: ' : ''}
          <Link href={url} className='text-primary hover:underline'>{!shortVersion ? url : 'Repo url'}</Link>
        </p>
        <p>
          {!shortVersion ? 'Actions url: ' : ''}
          <Link href={actionsUrl} className='text-primary hover:underline'>{!shortVersion ? actionsUrl : 'Actions url'}</Link>
        </p>
      </>}
      {!isRepoUrlSet && <MissingRepoUrl />}
    </>
  );
}

export function WorkspaceExtraDetails({ workspace }: { workspace: Workspace; }) {
  const windowRef = useRef<any>();
  const isRepoUrlSet = useMemo(() => !!workspace?.repo_url, [workspace]);
  const url = useMemo(() => `https://vscode.dev/${workspace.repo_url}`, [workspace]);

  useEffect(() => {
    return () => { windowRef.current?.close() }
  }, [windowRef]);

  return (
    <>
      {isRepoUrlSet &&
        <>
          <p
            className='text-primary hover:underline cursor-pointer'
            onClick={() => {
              windowRef.current = window.open(
                url,
                'MsgWindow',
                "width=1200,height=800,toolbar=no,menubar=no,resizable=yes"
              )
            }}
          >
            Open editor
          </p>
        </>
      }
      {!isRepoUrlSet && <MissingRepoUrl />}
    </>
  );
}
