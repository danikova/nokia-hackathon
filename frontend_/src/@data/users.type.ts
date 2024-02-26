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
