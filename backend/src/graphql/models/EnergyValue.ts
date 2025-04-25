import mongoose, { Schema, Document } from 'mongoose';

export interface IEnergyValue extends Document {
  categoryId: string;
  datetime: Date;
  value: number;
  percentage?: number;
}

const EnergyValueSchema: Schema = new Schema({
  categoryId: { type: Schema.Types.String, ref: 'EnergyCategory', required: true },
  datetime: { type: Date, required: true },
  value: { type: Number, required: true },
  percentage: { type: Number },
});

const EnergyValue = mongoose.model<IEnergyValue>('EnergyValue', EnergyValueSchema, 'energyValues');

export default EnergyValue;
