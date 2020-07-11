import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

export default model<IUser>('User', UserSchema);
