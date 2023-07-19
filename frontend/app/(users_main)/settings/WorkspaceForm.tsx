'use client';

import Button from '@/app/_components/inputs/Button';
import Textfield from '@/app/_components/inputs/Textfield';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RepoState, repoRe } from './consts';
import { testGithubRepo } from './action';
import { usePocketBase } from '@/app/_lib/clientPocketbase';

export type Workspace = {
  id: string;
  user: string;
  repo_url: string;
  [k: string]: any;
};

function useUserWorkspace() {
  const pb = usePocketBase();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const _ = async () => {
      const records = await pb.collection('workspaces').getFullList();
      setWorkspace(records.length !== 0 ? records[0] as never as Workspace : null);
    }
    _();
  }, [pb]);

  return workspace;
}

export default function WorkspaceForm() {
  const pb = usePocketBase();
  const workspace = useUserWorkspace();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (workspace) reset(workspace);
  }, [reset, workspace]);

  const onSubmit = useCallback(
    async (data: any) => {
      const result = await testGithubRepo(data);
      if (result !== RepoState.SUCCESS) {
        setError('repo_url', { type: 'repoState' });
        return;
      }
      await pb.collection('workspaces').update(workspace?.id as string, {
        repo_url: data.repo_url,
      });
    },
    [setError, pb, workspace]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Textfield
        type="text"
        label="Used repo"
        placeholder="https://github.com/(owner)/(repo)"
        error={errors.repo_url}
        {...register('repo_url', { required: true, pattern: repoRe })}
      />
      <div className='text-red-400'>
        {errors.repo_url?.type === 'required' && <p>Repo url is required.</p>}
        {errors.repo_url?.type === 'pattern' && (
          <p>
            Repo url must be a valid github repo url.{' '}
            <p className="text-sm text-primary_text opacity-70">https://github.com/(owner)/(repo)</p>
          </p>
        )}
        {errors.repo_url?.type === 'repoState' && <p>Repo what you submited is not existing or not a public repo.</p>}
      </div>
      <Button type="submit" className="min-w-full">
        Update
      </Button>
    </form>
  );
}
