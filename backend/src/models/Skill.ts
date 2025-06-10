
import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  maxLevel: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Skill description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    trim: true,
    enum: ['Technical', 'Analytical', 'Intelligence', 'Forensics', 'Security']
  },
  icon: {
    type: String,
    required: [true, 'Skill icon is required'],
    trim: true
  },
  color: {
    type: String,
    required: [true, 'Skill color is required'],
    trim: true,
    match: [/^text-\w+-\d+$/, 'Color must be in Tailwind format (e.g., text-green-400)']
  },
  maxLevel: {
    type: Number,
    default: 100,
    min: [1, 'Max level must be at least 1'],
    max: [100, 'Max level cannot exceed 100']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for performance
SkillSchema.index({ category: 1 });
SkillSchema.index({ isActive: 1 });
SkillSchema.index({ name: 1 });

export default mongoose.model<ISkill>('Skill', SkillSchema);
