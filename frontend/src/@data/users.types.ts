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
