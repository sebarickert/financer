import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  nickname: string;

  @Prop({ default: null })
  githubId: string;

  @Prop({ default: null })
  auth0Id: string;

  @Prop({ default: null })
  profileImageUrl: string;

  @Prop([String])
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
