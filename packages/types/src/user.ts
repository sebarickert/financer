export enum Role {
  admin = 'admin',
  testUser = 'test-user',
}

export type IUser = {
  _id: any;
  name: any;
  nickname: string;
  githubId?: string;
  auth0Id?: string;
  profileImageUrl: string;
  roles: Role[];
};
