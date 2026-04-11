import mongoose, { Schema, Document } from 'mongoose';

export interface ISpell extends Document {
  userId: mongoose.Types.ObjectId;
  spellType: 'focus_charm' | 'grind_spell' | 'shield_spell' | 'wingardium';
  activatedAt: Date;
  durationMinutes: number;
  isActive: boolean;
  endsAt: Date;
}

const SpellSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  spellType: { type: String, required: true, enum: ['focus_charm', 'grind_spell', 'shield_spell', 'wingardium'] },
  activatedAt: { type: Date, default: Date.now },
  durationMinutes: { type: Number, required: true, min: 1, max: 180 },
  isActive: { type: Boolean, default: true },
  endsAt: { type: Date, required: true },
});

export default mongoose.model<ISpell>('Spell', SpellSchema);