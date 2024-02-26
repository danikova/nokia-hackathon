export enum RepoState {
  SUCCESS,
  FAILURE,
}

export const repoRe = /^https:\/\/github\.com\/(.+?)\/(.+?)\/{0,1}$/;

export async function testGithubRepo(repo_url: string): Promise<RepoState> {
  try {
    // prettier-ignore
    const [_, owner, repo] = (repo_url as string).match(repoRe) as [ // eslint-disable-line
      string,
      string,
      string,
    ];
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    return res.status < 300 ? RepoState.SUCCESS : RepoState.FAILURE;
  } catch (e) {
    return RepoState.FAILURE;
  }
}
