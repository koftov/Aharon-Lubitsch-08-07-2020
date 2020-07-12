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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: UserRole, default: UserRole.User },
});

export default model<IUser>("User", UserSchema);
