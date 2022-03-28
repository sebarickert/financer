import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MogooseTypes } from 'mongoose';

export type UserDocument = User & Document<MogooseTypes.ObjectId>;

export enum Role {
  admin = 'admin',
  testUser = 'test-user',
}

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
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
