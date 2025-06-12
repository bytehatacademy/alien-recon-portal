import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  rank: 'Recon Trainee' | 'Cipher Cadet' | 'Gamma Node' | 'Sigma-51' | 'Command Entity' | 'Delta Agent';
  score: number;
  avatar?: string;
  completedMissions: string[]; // Changed from mongoose.Types.ObjectId[] to string[]
  skills: {
    skillId: mongoose.Types.ObjectId;
    progress: number;
    lastUpdated: Date;
  }[];
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  calculateRank(): 'Recon Trainee' | 'Cipher Cadet' | 'Gamma Node' | 'Sigma-51' | 'Command Entity' | 'Delta Agent';
  totalMissionsCompleted: number;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  rank: {
    type: String,
    enum: ['Recon Trainee', 'Cipher Cadet', 'Gamma Node', 'Sigma-51', 'Command Entity', 'Delta Agent'],
    default: 'Recon Trainee'
  },
  score: {
    type: Number,
    default: 0,
    min: [0, 'Score cannot be negative']
  },
  avatar: {
    type: String,
    trim: true
  },
  completedMissions: [{
    type: String, // Changed from Schema.Types.ObjectId to String
    ref: 'Mission'
  }],
  skills: [{
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100']
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
UserSchema.index({ score: -1 });
UserSchema.index({ rank: 1 });

// Pre-save middleware to hash password
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to calculate rank
UserSchema.pre<IUser>('save', function(next) {
  this.rank = this.calculateRank();
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to calculate rank based on score
UserSchema.methods.calculateRank = function(): string {
  const completedCount = this.completedMissions.length;
  if (completedCount >= 25) return 'Delta Agent';
  if (completedCount >= 20) return 'Command Entity';
  if (completedCount >= 15) return 'Sigma-51';
  if (completedCount >= 10) return 'Gamma Node';
  if (completedCount >= 5) return 'Cipher Cadet';
  return 'Recon Trainee';
};

// Virtual for total missions completed
UserSchema.virtual('totalMissionsCompleted').get(function() {
  return this.completedMissions.length;
});

// Add indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1 });

export default mongoose.model<IUser>('User', UserSchema);
