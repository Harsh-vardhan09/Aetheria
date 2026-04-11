import mongoose, { Schema, Document } from 'mongoose';

export interface IQuest extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  house: 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff';
  xpReward: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'daily' | 'trial' | 'exam';
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
}

const QuestSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  house: { type: String, required: true, enum: ['gryffindor', 'ravenclaw', 'slytherin', 'hufflepuff'] },
  xpReward: { type: Number, default: 100, min: 10, max: 500 },
  status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] },
  type: { type: String, required: true, enum: ['daily', 'trial', 'exam'] },
  dueDate: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IQuest>('Quest', QuestSchema);