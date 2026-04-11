import mongoose, { Schema, Document } from 'mongoose';

export interface IHouseCup extends Document {
  house: 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff';
  totalPoints: number;
  updatedAt: Date;
}

const HouseCupSchema: Schema = new Schema({
  house: { type: String, required: true, unique: true, enum: ['gryffindor', 'ravenclaw', 'slytherin', 'hufflepuff'], index: true },
  totalPoints: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IHouseCup>('HouseCup', HouseCupSchema);