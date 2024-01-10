import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  priority: { type: Number, required: true },
});

export interface Event extends mongoose.Document {
  name: string;
  description: string;
  type: 'crosspromo' | 'liveops' | 'app' | 'ads';
  priority: number;
  countryCode?: string;
}
