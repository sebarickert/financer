interface IUser {
  _id: any;
  name: any;
  nickname: string;
  githubId?: string;
  auth0Id?: string;
  profileImageUrl: string;
  roles: string[];
}
