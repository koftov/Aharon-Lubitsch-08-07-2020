import { Schema, model, Document } from "mongoose";

export enum UserRole {
  User = "user",
  Admin = "admin",
}

export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  role: UserRole;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6, trim: true },
  role: { type: UserRole, default: UserRole.User },
});

export default model<IUser>("User", UserSchema);
