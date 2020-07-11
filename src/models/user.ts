import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default model('User', UserSchema);
