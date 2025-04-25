import mongoose, { Schema, Document } from 'mongoose';

export interface IEnergyCategory extends Document {
  _id: { type: String, required: true },
  type: string;
  color: string;
  lastUpdate: Date;
  groupId: string;
}

const EnergyCategorySchema: Schema = new Schema({
  _id: { type: String }, 
  type: { type: String, required: true },
  color: { type: String, required: true },
  lastUpdate: { type: Date, required: true },
  groupId: { type: String, ref: 'EnergyGroup', required: true },
}, { 
  _id: false 
});
const EnergyCategory = mongoose.model<IEnergyCategory>('EnergyCategory', EnergyCategorySchema, 'energyCategories');

export default EnergyCategory;
