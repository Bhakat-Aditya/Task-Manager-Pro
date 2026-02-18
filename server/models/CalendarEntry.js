import mongoose from 'mongoose';

const CalendarEntrySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  blueprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskBlueprint' }, // Links back to library
  date: { type: Date, required: true, index: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  customDescription: String,
  order: { type: Number, default: 0 },
  timeOfDay: { type: String, enum: ['Morning', 'Noon', 'Evening', 'Night', 'Any'], default: 'Any' },
});

export default mongoose.models.CalendarEntry || mongoose.model('CalendarEntry', CalendarEntrySchema);