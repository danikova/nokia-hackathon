import * as z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/ui/clientForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { RepoState, repoRe, testGithubRepo } from "./action";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { WorkspaceRecord } from "@/@data/workspaces.types";
import { useUpdateWorkspace } from "@/@data/workspaces";

const repoCache = new Map<string, RepoState>();
async function testGithubRepoWithCache(repo_url: string) {
  if (repoCache.has(repo_url)) return repoCache.get(repo_url) as RepoState;
  const result = await testGithubRepo(repo_url);
  repoCache.set(repo_url, result);
  return result;
}

const formSchema = z
  .object({
    repo_url: z
      .string({
        required_error: "Repo url is required.",
        invalid_type_error:
          "Repo url must be a valid github repo url. For example: https://github.com/(owner)/(repo)",
      })
      .regex(repoRe, {
        message:
          "Repo url must be a valid github repo url. For example: https://github.com/(owner)/(repo)",
      })
      .refine(
        async (repo_url) => {
          const result = await testGithubRepoWithCache(repo_url);
          return result === RepoState.SUCCESS;
        },
        {
          message:
            "Repo what you try to submit is not exists or not a public repo.",
        }
      ),
  })
  .required();

export default function WorkspaceForm({
  workspace,
}: {
  workspace: WorkspaceRecord | null;
}) {
  const { mutateAsync } = useUpdateWorkspace();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (workspace) form.reset(workspace);
  }, [form, workspace]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      await mutateAsync({
        workspaceId: workspace?.id as string,
        data,
      });
    },
    [workspace, mutateAsync]
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
              <Input
                placeholder="https://github.com/(owner)/(repo)"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This repo will be used to store and collect your run data. It must
              be a public repo.
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
