import { BaseRecord } from './base.types';

export interface UserRecord extends BaseRecord {
  avatarUrl: string;
  email: string;
  emailVisibility: boolean;
  name: string;
  role: string;
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
