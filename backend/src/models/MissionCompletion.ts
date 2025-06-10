
import mongoose, { Document, Schema } from 'mongoose';

export interface IMissionCompletion extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  missionId: mongoose.Types.ObjectId;
  completedAt: Date;
  attempts: number;
  hintsUsed: number;
  pointsEarned: number;
  timeSpent: number; // in minutes
  flagSubmitted: string;
  ipAddress?: string;
  userAgent?: string;
}

const MissionCompletionSchema = new Schema<IMissionCompletion>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  missionId: {
    type: Schema.Types.ObjectId,
    ref: 'Mission',
    required: [true, 'Mission ID is required']
  },
  completedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  attempts: {
    type: Number,
    default: 1,
    min: [1, 'Attempts must be at least 1']
  },
  hintsUsed: {
    type: Number,
    default: 0,
    min: [0, 'Hints used cannot be negative']
  },
  pointsEarned: {
    type: Number,
    required: [true, 'Points earned is required'],
    min: [0, 'Points earned cannot be negative']
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: [0, 'Time spent cannot be negative']
  },
  flagSubmitted: {
    type: String,
    required: [true, 'Submitted flag is required'],
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one completion per user per mission
MissionCompletionSchema.index({ userId: 1, missionId: 1 }, { unique: true });

// Indexes for analytics and performance
MissionCompletionSchema.index({ completedAt: -1 });
MissionCompletionSchema.index({ missionId: 1, completedAt: -1 });
MissionCompletionSchema.index({ userId: 1, completedAt: -1 });
MissionCompletionSchema.index({ pointsEarned: -1 });

export default mongoose.model<IMissionCompletion>('MissionCompletion', MissionCompletionSchema);
