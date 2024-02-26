export interface UserRecord {
  avatarUrl: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  role: string;
  updated: string;
  username: string;
  verified: boolean;
}

export interface AuthResponse {
  record: UserRecord;
  token: string;
}

export interface AuthProvider {
  name: string;
  state: string;
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  authUrl: string;
}

export interface AuthMethodsResponse {
  usernamePassword: boolean;
  emailPassword: boolean;
  authProviders: AuthProvider[];
}
