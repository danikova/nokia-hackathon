export enum RepoState {
  SUCCESS,
  FAILURE,
}

export const repoRe = /^https:\/\/github\.com\/(.+?)\/(.+?)\/{0,1}$/;
