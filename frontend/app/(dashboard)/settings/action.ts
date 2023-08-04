'use server';

import { RepoState, repoRe } from './consts';

export async function testGithubRepo(repo_url: string): Promise<RepoState> {
  try {
    const [_, owner, repo] = (repo_url as string).match(repoRe) as [string, string, string];
    const headers: any = process.env.GITHUB_TOKEN
      ? {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }
      : { Accept: 'application/vnd.github+json' };
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      cache: 'no-store',
    });
    return res.status < 300 ? RepoState.SUCCESS : RepoState.FAILURE;
  } catch (e) {
    return RepoState.FAILURE;
  }
}
