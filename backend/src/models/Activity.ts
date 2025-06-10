
import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'mission_completed' | 'rank_promoted' | 'hint_used' | 'login' | 'skill_improved';
  title: string;
  description: string;
  points?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['mission_completed', 'rank_promoted', 'hint_used', 'login', 'skill_improved'],
    required: [true, 'Activity type is required']
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  points: {
    type: Number,
    min: [0, 'Points cannot be negative']
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for performance
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ type: 1, createdAt: -1 });
ActivitySchema.index({ createdAt: -1 });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
