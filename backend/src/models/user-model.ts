import mongoose, { Schema, Document } from "mongoose";

export interface IUserModel extends Document, IUser {}

const userSchema = new Schema({
  name: String,
  nickname: String,
  githubId: String,
  profileImageUrl: String,
});

export default mongoose.model<IUserModel>("user", userSchema);
