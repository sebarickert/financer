import mongoose, { Schema, Document } from "mongoose";

export const USER_MODEL_NAME = "user";
export interface IUserModel extends Document, IUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
}

const userSchema = new Schema({
  name: String,
  nickname: String,
  githubId: String,
  auth0Id: String,
  profileImageUrl: String,
  role: [{ type: String }],
});

export default mongoose.model<IUserModel>(USER_MODEL_NAME, userSchema);
