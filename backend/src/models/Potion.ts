import mongoose, { Schema, Document } from 'mongoose';

export interface IPotion extends Document {
  userId: mongoose.Types.ObjectId;
  potionType: string;
  xpMultiplier: number;
  usedAt?: Date;
  craftedAt: Date;
}

const PotionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  potionType: { type: String, required: true },
  xpMultiplier: { type: Number, default: 2.0 },
  usedAt: { type: Date },
  craftedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPotion>('Potion', PotionSchema);