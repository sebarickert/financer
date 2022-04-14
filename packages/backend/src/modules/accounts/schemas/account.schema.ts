import { AccountType } from '@local/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MogooseTypes } from 'mongoose';

import { ObjectId } from '../../../types/objectId';
import { User } from '../../users/schemas/user.schema';

export type AccountDocument = Account & Document<MogooseTypes.ObjectId>;

@Schema()
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: AccountType;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true, type: MogooseTypes.ObjectId, ref: User.name })
  owner: ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
