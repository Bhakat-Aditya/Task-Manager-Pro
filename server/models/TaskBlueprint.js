import mongoose from 'mongoose';

const TaskBlueprintSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  defaultDescription: String,
  color: { type: String, default: '#3b82f6' },
  timeOfDay: { type: String, enum: ['Morning', 'Noon', 'Evening', 'Night', 'Any'], default: 'Any' },
}, { timestamps: true });

export default mongoose.models.TaskBlueprint || mongoose.model('TaskBlueprint', TaskBlueprintSchema);