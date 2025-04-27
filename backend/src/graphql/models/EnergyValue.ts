import mongoose, { Schema, Document } from 'mongoose';

export interface IEnergyValue extends Document {
  categoryId: string;
  datetime: Date;
  value: Schema.Types.Double;
  percentage?: Schema.Types.Double;
}

const EnergyValueSchema: Schema = new Schema({
  categoryId: { type: Schema.Types.String, ref: 'EnergyCategory', required: true },
  datetime: { type: Date, required: true },
  value: { type: Schema.Types.Double, required: true }, 
  percentage: { type: Schema.Types.Double }, 
});

const EnergyValue = mongoose.model<IEnergyValue>('EnergyValue', EnergyValueSchema, 'energyValues');

export default EnergyValue;
