import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  nickname: string;
  githubId: string;
  profileImageUrl: string;
}

const userSchema = new Schema({
  name: String,
  nickname: String,
  githubId: String,
  profileImageUrl: String,
});

export default mongoose.model<IUser>("user", userSchema);
