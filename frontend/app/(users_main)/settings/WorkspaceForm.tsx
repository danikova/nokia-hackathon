'use client';

import Button from '@/app/_components/inputs/Button';
import Textfield from '@/app/_components/inputs/Textfield';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { RepoState, repoRe } from './consts';
import { testGithubRepo } from './action';
import { Workspace } from './page';
import { usePocketBase } from '@/app/_lib/clientPocketbase';

export default function WorkspaceForm({ workspace }: { workspace: Workspace }) {
  const pb = usePocketBase();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: workspace });

  const onSubmit = useCallback(
    async (data: any) => {
      const result = await testGithubRepo(data);
      if (result !== RepoState.SUCCESS) {
        setError('repo_url', { type: 'repoState' });
        return;
      }
      await pb.collection('workspaces').update(workspace.id, {
        repo_url: data.repo_url,
      });
    },
    [setError, pb, workspace]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Textfield
        type="text"
        placeholder="used repo"
        error={errors.repo_url}
        {...register('repo_url', { required: true, pattern: repoRe })}
      />
      {errors.repo_url?.type === 'required' && <p>Repo url is required.</p>}
      {errors.repo_url?.type === 'pattern' && (
        <p>
          Repo url must be a valid github repo url.{' '}
          <p className="text-sm text-primary_text opacity-70">https://github.com/(owner)/(repo)</p>
        </p>
      )}
      {errors.repo_url?.type === 'repoState' && <p>Repo what you submited is not existing or not a public repo.</p>}
      <Button type="submit" className="min-w-full mr-0 mb-0">
        Update
      </Button>
    </form>
  );
}
