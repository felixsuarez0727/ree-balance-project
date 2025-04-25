import mongoose, { Schema, Document } from 'mongoose';

export interface IEnergyGroup extends Document {
  type: string;
  lastUpdate: Date;
}

const EnergyGroupSchema: Schema = new Schema({
  _id: { type: String }, 
  type: { type: String, required: true },
  lastUpdate: { type: Date, required: true }
}, { 
  _id: false 
});

const EnergyGroup = mongoose.model<IEnergyGroup>('EnergyGroup', EnergyGroupSchema, 'energyGroups');

export default EnergyGroup;