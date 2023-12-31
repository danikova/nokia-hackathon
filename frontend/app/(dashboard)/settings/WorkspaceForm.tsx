'use client';

import * as z from "zod"
import { testGithubRepo } from './action';
import { useForm } from 'react-hook-form';
import { RepoState, repoRe } from './consts';
import { Input } from "@/components/ui/input";
import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Workspace } from "@/lib/dataHooks";
import ClientForm from '@/components/ui/clientForm';
import { zodResolver } from "@hookform/resolvers/zod";
import { snackbarWrapper, usePocketBase } from '@/lib/clientPocketbase';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// test github repo with cache
const repoCache = new Map<string, RepoState>();
export async function testGithubRepoWithCache(repo_url: string) {
  if (repoCache.has(repo_url)) return repoCache.get(repo_url) as RepoState;
  const result = await testGithubRepo(repo_url);
  repoCache.set(repo_url, result);
  return result;
}

const formSchema = z.object({
  repo_url: z.string({
    required_error: 'Repo url is required.',
    invalid_type_error: 'Repo url must be a valid github repo url. For example: https://github.com/(owner)/(repo)',
  }).regex(repoRe, {
    message: 'Repo url must be a valid github repo url. For example: https://github.com/(owner)/(repo)',
  }).refine(async (repo_url) => {
    const result = await testGithubRepoWithCache(repo_url);
    return result === RepoState.SUCCESS;
  }, {
    message: 'Repo what you try to submit is not exists or not a public repo.',
  })
}).required();

export default function WorkspaceForm({ workspace }: { workspace: Workspace | null }) {
  const pb = usePocketBase();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (workspace) form.reset(workspace);
  }, [form, workspace]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      await snackbarWrapper(pb.collection('workspaces').update(workspace?.id as string, {
        repo_url: data.repo_url,
      }), 'Workspace updated');
    },
    [pb, workspace]
  );

  return (
    <ClientForm form={form} onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="repo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Used repo</FormLabel>
            <FormControl>
              <Input placeholder="https://github.com/(owner)/(repo)" {...field} />
            </FormControl>
            <FormDescription>
              This repo will be used to store and collect your run data. It must be a public repo.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="min-w-full">
        Update
      </Button>
    </ClientForm>
  );
}
