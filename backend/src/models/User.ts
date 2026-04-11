import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  house: 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff';
  level: number;
  xp: number;
  hp: number;
  streak: number;
  housePoints: number;
  lastActive: Date;
  createdAt: Date;
  shieldActive?: boolean;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  house: { type: String, required: true, enum: ['gryffindor', 'ravenclaw', 'slytherin', 'hufflepuff'] },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  hp: { type: Number, default: 100 },
  streak: { type: Number, default: 0 },
  housePoints: { type: Number, default: 0 },
  lastActive: { type: Date },
  shieldActive: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);