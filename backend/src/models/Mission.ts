import mongoose, { Document, Schema } from 'mongoose';

export interface IMission extends Document {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  points: number;
  estimatedTime: string;
  category: string;
  flag: string;
  fileUrl?: string;
  unlockRequirement?: string;
  hints: {
    text: string;
    pointDeduction: number;
  }[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema = new Schema<IMission>({
  _id: { 
    type: String, 
    required: true 
  },
  title: {
    type: String,
    required: [true, 'Mission title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Mission description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: [true, 'Difficulty level is required']
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000']
  },
  estimatedTime: {
    type: String,
    required: [true, 'Estimated time is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['OSINT', 'Network Analysis', 'Digital Forensics', 'Threat Intelligence', 'Malware Analysis', 'Cryptography']
  },
  flag: {
    type: String,
    required: [true, 'Flag is required'],
    trim: true,
    match: [/^ARLab\{.*\}$/, 'Flag must follow ARLab{} format']
  },
  fileUrl: {
    type: String,
    trim: true
  },
  unlockRequirement: {
    type: String,
    ref: 'Mission',
    default: null
  },
  hints: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Hint cannot exceed 500 characters']
    },
    pointDeduction: {
      type: Number,
      required: true,
      min: [0, 'Point deduction cannot be negative'],
      max: [50, 'Point deduction cannot exceed 50']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: [true, 'Mission order is required'],
    min: [1, 'Order must be at least 1']
  }
}, {
  _id: false, // This allows us to set our own _id
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
MissionSchema.index({ difficulty: 1 });
MissionSchema.index({ category: 1 });
MissionSchema.index({ order: 1 });
MissionSchema.index({ isActive: 1 });
MissionSchema.index({ unlockRequirement: 1 });

// Ensure unique order for active missions
MissionSchema.index({ order: 1, isActive: 1 }, { unique: true });

// Virtual for completion rate
MissionSchema.virtual('completionRate', {
  ref: 'MissionCompletion',
  localField: '_id',
  foreignField: 'missionId',
  count: true
});

export default mongoose.model<IMission>('Mission', MissionSchema);
