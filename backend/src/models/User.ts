
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  rank: 'Rookie' | 'Agent' | 'Analyst' | 'Expert' | 'Elite';
  score: number;
  avatar?: string;
  completedMissions: mongoose.Types.ObjectId[];
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
  calculateRank(): 'Rookie' | 'Agent' | 'Analyst' | 'Expert' | 'Elite';
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  rank: {
    type: String,
    enum: ['Rookie', 'Agent', 'Analyst', 'Expert', 'Elite'],
    default: 'Rookie'
  },
  score: {
    type: Number,
    default: 0,
    min: [0, 'Score cannot be negative']
  },
  avatar: {
    type: String,
    default: null
  },
  completedMissions: [{
    type: Schema.Types.ObjectId,
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
      min: 0,
      max: 100,
      default: 0
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
UserSchema.index({ email: 1 });
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
UserSchema.methods.calculateRank = function(): 'Rookie' | 'Agent' | 'Analyst' | 'Expert' | 'Elite' {
  if (this.score >= 2000) return 'Elite';
  if (this.score >= 1500) return 'Expert';
  if (this.score >= 1000) return 'Analyst';
  if (this.score >= 500) return 'Agent';
  return 'Rookie';
};

// Virtual for total missions completed
UserSchema.virtual('totalMissionsCompleted').get(function() {
  return this.completedMissions.length;
});

export default mongoose.model<IUser>('User', UserSchema);
