import { Schema, model, Types, Document } from 'mongoose';

export interface ITask extends Document {
  username: string;
  phone: string;
  email: string;
  userId: string;
  createdAt: string;
}

const TaskSchema = new Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  userId: { type: Types.ObjectId },
  createdAt: { type: Date, default: Date.now() },
});

export default model<ITask>('Task', TaskSchema);
